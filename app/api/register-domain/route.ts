import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import client from "@sendgrid/client";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { domain, workspaceId } = await req.json();
    const { data: registeredDomains } = await supabaseClient
      .from("workspace")
      .select("domains")
      .eq("id", workspaceId);

    // @ts-ignore
    const domainsColumn = registeredDomains
      ? registeredDomains[0].domains
      : null;

    const domainNames = domainsColumn?.map((domain) => domain.name);

    const isDomainRegistered = domainNames?.includes(domain);

    if (isDomainRegistered) {
      return NextResponse.json({
        data: null,
        message: "Domain already exists",
        error: null,
      });
    }

    client.setApiKey(process.env.SENDGRID_API_KEY as string);

    const data = {
      domain,
    };

    const request = {
      url: `/v3/whitelabel/domains`,
      method: "POST",
      body: data,
    };

    //   @ts-ignore
    const [response, body] = await client.request(request);
    console.log("Body: ", body);
    console.log("response", response);
    const dns_data = {
      cname: {
        data: body.dns.mail_cname.data,
        host: body.dns.mail_cname.host,
        valid: body.dns.mail_cname.valid
      },
      dkim1: {
        data: body.dns.dkim1.data,
        host: body.dns.dkim1.host,
        valid: body.dns.dkim1.valid
      },
      dkim2: {
        data: body.dns.dkim2.data,
        host: body.dns.dkim2.host,
        valid: body.dns.dkim2.valid
      },
    };

    const dbPayload = domainsColumn
      ? [
          {
            id: body.id,
            name: domain,
            dns_data,
            valid: body.valid,
          },
          ...(domainsColumn as any[]),
        ]
      : [
          {
            id: body.id,
            name: domain,
            dns_data,
            valid: body.valid,
          },
        ];

    const { data: workspace, error: workspaceError } = await supabaseClient
      .from("workspace")
      .update({ domains: dbPayload })
      .eq("id", workspaceId);

    console.log('domain id: ', body.id);
    
    if (response.statusCode === 201 && !workspaceError) {
      return NextResponse.json(
        {
          data: body.id,
          message: "success",
          error: null,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          data: null,
          message: "something went wrong",
          error: null,
        },
        {
          status: 401,
        }
      );
    }
  } catch (e: any) {
    console.log("error: ", e);
    return NextResponse.json(
      {
        data: null,
        message: "internal server error",
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
};

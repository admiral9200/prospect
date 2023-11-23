import { NextRequest, NextResponse } from "next/server";
import client from "@sendgrid/client";
import supabaseClient from "@/utils/supabase-client";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { workspaceId, domainId: passedDomain } = await req.json();
  client.setApiKey(process.env.SENDGRID_API_KEY as string);

  try {
    const { data: registeredDomains } = await supabaseClient
      .from("workspace")
      .select("domains")
      .eq("id", workspaceId);

    // @ts-ignore
    const domainsColumn = registeredDomains
      ? registeredDomains[0].domains
      : null;

    if (!domainsColumn) {
      return NextResponse.json(
        {
          message: "There are no domains registered for this account.",
          data: null,
          error: null,
        },
        {
          status: 200,
        }
      );
    }

    const keyDomainData = domainsColumn.map((domain) => ({
      id: domain.id,
      name: domain.name,
    }));

    const keyDomain = keyDomainData.find(
      (domain) => (domain.id = passedDomain)
    );

    if (!keyDomain) {
      return NextResponse.json({
        message:
          "This domain has not been registered for authentication. Please register before you verify.",
        error: null,
        data: null,
      });
    }

    const id = keyDomain.id;

    client.setApiKey(process.env.SENDGRID_API_KEY as string);
    const request = {
      url: `/v3/whitelabel/domains/${id}/validate`,
      method: "POST",
    };

    //   @ts-ignore
    const [response, body] = await client.request(request);

    console.log("Validation body : ", body);
    console.log("Validation response : ", response);

    // check if the domain is valid and update db accordingly
      const newData = domainsColumn.map((domain) => {
        if (domain.id === passedDomain) {
          return {
            ...domain,
            valid: body.valid,
            dns_data: {
              cname: {
                data: domain.dns_data.cname.data,
                host: domain.dns_data.cname.host,
                valid: body.validation_results.mail_cname.valid,
              },
              dkim1: {
                data: domain.dns_data.dkim1.data,
                host: domain.dns_data.dkim1.host,
                valid: body.validation_results.dkim1.valid
              },
              dkim2: {
                data: domain.dns_data.dkim2.data,
                host: domain.dns_data.dkim2.host,
                valid: body.validation_results.dkim2.valid
              }
            }
          };
        }
        return domain;
      });

      const { data: workspace, error: workspaceError } = await supabaseClient
        .from("workspace")
        .update({ domains: newData })
        .eq("id", workspaceId);

    if (response.statusCode === 200) {
      return NextResponse.json(
        {
          message: "success",
          data: body,
          error: null,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message:
            "something went wrong - either there is a problem with the db or sendgrid",
          data: null,
          error: null,
        },
        {
          status: 200,
        }
      );
    }
  } catch (e) {
    console.log("internal server error: ", e);
    return NextResponse.json(
      {
        message: "Internal server error",
        data: null,
        error: e,
      },
      {
        status: 500,
      }
    );
  }
};

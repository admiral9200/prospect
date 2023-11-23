import supabaseClient from "@/utils/supabase-client";
import { NextRequest, NextResponse } from "next/server";
import client from "@sendgrid/client";

const sendgridApiKey = process.env.SENDGRID_API_KEY as string;
console.log(sendgridApiKey)
client.setApiKey(sendgridApiKey);

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    // Step 1: We need to create a subuser. See docs here for details of payload: https://docs.sendgrid.com/api-reference/subusers-api/create-subuser
    // store their payload to db as well
    //   Please note that the password field must contain 1 number and 1 character at the very least.
    //   This is the payload for this endpoint

    const {username, email, password, workspaceId, domainName, userId} = await req.json();
    console.log('username: ', username)
    console.log('email: ', email)
    console.log('workspaceId: ', workspaceId)
    console.log('domain: ', domainName)
    console.log('userId: ', userId)

    //   First check if this subuser already exists on this domain
    const request = {
      url: `/v3/subusers?username=${username}`,
      method: "GET",
    };

    //   @ts-ignore
    const [checkResponse, checkBody] = await client.request(request);
    console.log(checkBody);
    const subuserId = checkBody.length ? checkBody[0].id : null;

    if (subuserId) {
      return NextResponse.json(
        {
          data: null,
          message: "exist",
          error: null,
        },
        {
          status: 200,
        }
      );
    }

    const subuserPayload = {
      username,
      email,
      password,
    };

    const createSubuserPayload = {
      url: `/v3/subusers`,
      method: "POST",
      body: subuserPayload,
    };
    console.log("creating subuser... ");
    // @ts-ignore
    const [createResponse, createBody] = await client.request(
      //  @ts-ignore
      createSubuserPayload
    );
    console.log("response from subuser creation: ", createBody);
    const id = createBody.user_id;

    if (id) {
      // we need to associate this newly created subuser to an authenticated domain and then save subuser to db.
      // This domain id will be stored when a user authenticates a domain. We must fetch this from the db.

      const request = {
        url: `/v3/whitelabel/domains`,
        method: "GET",
      };

      //   @ts-ignore
      const [domainIdResponse, domainIdBody] = await client.request(request);

      const result = domainIdBody.find(
        (obj) => obj.domain === domainName && obj.valid === true
      );

      if (result) {
        // Found a matching object
        const domainId = result.id;

        const data = {
          username,
        };

        const request = {
          url: `/v3/whitelabel/domains/${domainId}/subuser`,
          method: "POST",
          body: data,
        };

        console.log("Attaching subuser to domain...");
        //   @ts-ignore
        const [attachmentResponse, attachmentBody] = await client.request(
          // @ts-ignore
          request
        );

        console.log(
          "subuser was associated with domain: ",
          attachmentBody,
          attachmentResponse
        );
      }
    }

    //   ==================================== DB UPDATE STARTS HERE ===================================

    console.log("updating db...");
    const { data, error } = await supabaseClient.from('workspace').select('*').eq('id', workspaceId);

    console.log('fetched domains: ', data);

    if (error) {
      console.error("Supabase error: ", error); // Changed from console.log to console.error
      throw new Error("Error fetching user data from Supabase.");
    }

    const newSubuser = {
      id,
      email,
      username,
      password,
    };

    const currentDomains = data[0]?.domains || [];

    console.log('current domains')

    const updatedDomains = currentDomains.map((domain) => {
      const userData = (domain.subusers && domain.subusers[userId]) || null;
      if (domain.name === domainName) { 
        return {
          ...domain, 
          subusers: {
            ...(domain.subusers || {}),
            [userId]: [
              ...(userData || []),
              newSubuser,
            ],
          },
        };
      }
      return domain;
    });

    console.log('New domain data: ', updatedDomains);

    console.log('updating domains... ');

    const { error: updateError } = await supabaseClient
      .from("workspace")
      .update({ domains: updatedDomains })
      .eq("id", workspaceId);

    if (updateError) { // Added error handling for the update operation
      console.error("Supabase update error: ", updateError);
      throw new Error("Error updating domain data in Supabase.");
    }

    console.log('updated domains');


    return NextResponse.json(
      {
        data: "created",
        error: null,
        message: "Success",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    // Error response to the client
    console.error(error);
    return NextResponse.json(
      {
        data: null,
        error: "Internal Server Error",
        message: error.message || "An error occurred.",
      },
      {
        status: 500,
      }
    );
  }
};

import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import axios from "axios";
const sendgridApiKey = process.env.SENDGRID_API_KEY;

export const POST = async (req: NextRequest, res: NextResponse) => {
  // You must check on the client if the user already has a webhook id. If so, they can use the update endpoint

  const { emailToUpdate, username, workspaceId, open, click } = await req.json();

  // sendgrid expects a unique url for each webhook
  // const url = `https://prosp.ai/api/sendgrid-webhooks?hookowner=${email}`; // this is where sendgrid will post webhook data. Use ngrok for testing: https://ngrok.com/docs/integrations/sendgrid/webhooks/
  // Each webhook must have a unique url hence the redundant hookowner query param
  const url = `https://prosp.ai/api/sendgrid-webhooks?webhookowner=${emailToUpdate}`;
  
  /*
  You can find a list of all possible sendgrid event webhooks here:
  // https://docs.sendgrid.com/api-reference/webhooks/create-an-event-webhook
  // An id is returned and this id is how we modify this webhook for this subuser in the future.
  // Must get id of event webhook ==> Allows for future operations like update and delete
  // 1: We fetch the subsers username from the db
  NOTE: When a subuser is deleted, all the associated webhooks also get deleted.
  */

  try {
    const payload = {};

    // @ts-ignore
    payload.enabled = true;

    // @ts-ignore
    payload.open = open;

    // @ts-ignore
    payload.click = click;

    // @ts-ignore
    payload.friendly_name = emailToUpdate; // while this is marked as optional, it is ABSOLUTELY required for this endpoint to work

    // @ts-ignore
    payload.url = url;

    console.log("Payload: ", payload);

    const sendgridWebhookEndpoint =
      "https://api.sendgrid.com/v3/user/webhooks/event/settings";

    const response = await axios.post(
      sendgridWebhookEndpoint,
      JSON.stringify(payload),
      {
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "on-behalf-of": username, // this is the crux of this endpoint, delete with caution
        },
      }
    );

    console.log("Axios data", response);

    if (response.status === 201) {
      const webhookId = response.data.id;
      console.log("WEBHOOK CREATION RESPONSE: ", response);
      console.log("WEBHOOK ID: ", webhookId);

      // Fetch the workspace data with the "domains" column
      const { data: workspaceData, error: workspaceError } = await supabaseClient
        .from('workspace')
        .select('domains')
        .eq('id', workspaceId)
        .single();

      if (workspaceError) {
        throw new Error(`Error fetching workspace data: ${workspaceError.message || workspaceError}`);
      }

      // Get the "domains" array from the workspace data
      const domains = workspaceData.domains || [];

      // Iterate through the "domains" array and update subusers
      const updatedDomains = domains.map(domain => {
        if (domain.subusers) {
          // Iterate through the subusers using Object.keys to access UUID keys
          const updatedSubusers = Object.keys(domain.subusers).map(uuid => {
            const subuserArray = domain.subusers[uuid];
            const updatedSubuserArray = subuserArray.map(subuser => {
              if (subuser.email === emailToUpdate) {
                // Update the webhookId for the matching email
                return { ...subuser, webhookId };
              }
              return subuser;
            });
            return { [uuid]: updatedSubuserArray };
          });

          // Create a new subusers object with the updated subusers
          const updatedSubusersObject = updatedSubusers.reduce((acc, curr) => ({ ...acc, ...curr }), {});

          // Update the domain object with the updated subusers
          return { ...domain, subusers: updatedSubusersObject };
        }

        // Return the original domain if it has no subusers
        return domain;
      });

      // Update the workspace data with the updated "domains" array
      const { error: updateError } = await supabaseClient
        .from('workspace')
        .update({ domains: updatedDomains })
        .eq('id', workspaceId);

      if (updateError) {
        throw new Error(`Error updating workspace data: ${updateError.message || updateError}`);
      }

      console.log('Updated workspace data:', updatedDomains);

      return NextResponse.json({
        data: webhookId,
        error: null,
        message: `Created a webhook with id ${webhookId}`,
      });
    } else {
      throw new Error(`No matching subuser found`);
    }
  } catch (e: any) {
    console.log("internal server error: ", e.response.data.errors);
    return NextResponse.json({
      data: null,
      error: e,
      message: "internal server error",
    });
  }
};


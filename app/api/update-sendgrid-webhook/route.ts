import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import axios from "axios";

const sendgridApiKey = process.env.SENDGRID_API_KEY;
console.log(sendgridApiKey);

export const POST = async (req: NextRequest, res: NextResponse) => {
  // payload
  const { webhookId, open, click, username, email } = await req.json();

  console.log("HookId: ", webhookId);

  const url = `https://prosp.ai/api/sendgrid-webhooks/hookowner=${email}`;

  // Fetch hookId given a particular user id and subuser
  try {
    const payload = {};

    //   @ts-ignore
    payload.open = open;

    //   @ts-ignore
    payload.click = click;

    //   @ts-ignore
    payload.enabled = true;

    // @ts-ignore
    payload.friendly_name = email; // while this is marked as optional, it is ABSOLUTELY required for this endpoint to work

    // @ts-ignore
    payload.url = url;

    console.log("Payload: ", payload);

    const sendgridWebhookEndpoint = `https://api.sendgrid.com/v3/user/webhooks/event/settings?id=${webhookId}`;

    const response = await axios.patch(sendgridWebhookEndpoint, payload, {
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "on-behalf-of": username, // this is the crux of this endpoint, delete with caution
      },
    });

    console.log("WEBHOOK UPDATE: ", response);
    return NextResponse.json(
      {
        data: null,
        error: null,
        message: "success",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(`Error: `, e);
    return NextResponse.json(
      {
        data: null,
        error: e,
        message: "error",
      },
      {
        status: 500,
      }
    );
  }
};

import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";

/*
The current logic in this endpoint is prone to race condtions.
Supabase does not currrently support transactions.
More research need to be done into supabase functions to optimise this logic
*/

export const POST = async (req: NextRequest, res: NextResponse) => {
  // Ensure that this is an array
  const webhookData = await req.json();

  console.log("Request to webhook endpoint: ", req);
  console.log("Webhook data: ", webhookData);

  try {
    // Iterate through the webhook data array in parallel
    await Promise.all(
      webhookData.map(async (eventData) => {
        const { emailId, event, timestamp, userId } = eventData;

        const { data: userData, error: fetchError } = await supabaseClient
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError) {
          throw new Error(
            `Error fetching user data: ${fetchError.message || fetchError}`
          );
        }

        const sentEmailsArray = userData?.sent_emails || [];

        // Find the index of the sent_email object with the matching emailId
        const sentEmailIndex = sentEmailsArray.findIndex(
          (emailObj) => emailObj.emailId === emailId
        );

        // Update the existing sent_email object
        sentEmailsArray[sentEmailIndex].status = event;
        sentEmailsArray[sentEmailIndex].lastWebhookUpdate = timestamp;

        // Update the "sent_emails" array for the user
        const { error: updateError } = await supabaseClient
          .from("users")
          .update({ sent_emails: sentEmailsArray })
          .eq("id", userId);

        if (updateError) {
          throw new Error(
            `Error updating user data: ${updateError.message || updateError}`
          );
        }
      })
    );

    // All updates were successful
    console.log("Database updated successfully.");

    return NextResponse.json({
      data: null,
      message: "success",
      error: null,
    });
  } catch (error: any) {
    console.error(error.message || error);
    return NextResponse.json({
      data: null,
      error,
      message: "internal server error",
    });
  }
};

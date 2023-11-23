import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import sgMail from "@sendgrid/mail";
import { v4 as random } from "uuid";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { to, from, message, subject, userId } = await req.json();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const emailId = random();
    const data = {
      to,
      from,
      subject,
      text: message,
      custom_args: {
        userId: userId,
        emailId: emailId,
      },
    };

    try {
      const response = await sgMail.send(data);
      // when email is successfully sent, we want to save it as sent email for user.
      const { data: fetchData, error: fetchError } = await supabaseClient
        .from("users")
        .select("sent_emails")
        .eq("id", userId);

      if (fetchError) {
        console.error(
          "Error fetching current sent_emails:",
          fetchError.message
        );
        return;
      }

      const payload = {
        to,
        from, // this is also the subuser email that sent this email
        subject,
        message,
        emailId,
        status: undefined,
      };

      const currentSentEmails = fetchData[0].sent_emails || [];
      const updatedSentEmails = [...currentSentEmails, payload];

      const { error: updateError } = await supabaseClient
        .from("users")
        .update({ sent_emails: updatedSentEmails })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating sent_emails:", updateError.message);
      } else {
        console.log("Sent_emails updated successfully");
      }
      console.log("Email sent successfully");
      return NextResponse.json({
        message: "Email sent successfully",
        data: response,
        error: null,
      });
    } catch (e) {
      console.log("Error sending email: ", e);
      return NextResponse.json({
        message: "Error sending email",
        data: null,
        error: e,
      });
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

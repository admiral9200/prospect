import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import nodemailer from "nodemailer";
import oauth2Client from "@/utils/google-oauth-client";
import _ from "lodash";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { userId, to, subject, text } = await req.json();

  try {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId);

    if (!error) {
      const { email, gmail_tokens, user_name } = data[0];
      const { refresh_token } = gmail_tokens;
      console.log("email: ", email);
      oauth2Client.setCredentials({
        refresh_token:
          refresh_token,
      });
      const accessToken = await oauth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GOOGLE_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: refresh_token,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: `${user_name && _.capitalize(user_name)} <${email}>`,
        to,
        subject,
        text,
      };

      const response = await transporter.sendMail(mailOptions);

      console.log("Response from mailer: ", response);
      return NextResponse.json({
        data: null,
        message: "Email sent",
        error: null,
      });
    } else {
      return NextResponse.json(
        {
          data: null,
          error: "something went wrong",
          message: "Error fetching user data",
        },
        {
          status: 200,
        }
      );
    }
  } catch (e) {
    console.log("internal server error: ", e);
    return NextResponse.json({
      data: null,
      error: e,
      message: "internal server error",
    });
  }
};

import { NextRequest, NextResponse } from "next/server";
import oauth2Client from "@/utils/google-oauth-client";
import supabaseClient from "@/utils/supabase-client";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { code, userId } = await req.json();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const { refresh_token, expiry_date } = tokens;

    console.log("Full token: ", tokens);
    console.log("Refresh Token:", refresh_token);
    console.log("Expires: ", expiry_date);
    console.log("GOT CODE: ", code);
    console.log("GOT ID: ", userId);

    // store tokens

    const { data, error } = await supabaseClient
      .from("users")
      .update({ gmail_tokens: { refresh_token, expiry_date } })
      .eq("id", userId);

    console.log("DB ERROR: ", error);

    if (!error) {
      return NextResponse.json(
        {
          data: null,
          error: null,
          message: "Email authenticated",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          data: null,
          error: null,
          message: "Not authenticated, something went wrong",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    console.error(
      "Error exchanging authorization code for tokens:",
      error.message
    );
    return NextResponse.json({
      data: null,
      error,
      message: "Failed to get access token",
    });
  }
};

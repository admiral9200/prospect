// This endpoint begins the authorisation flow.
// It redirects the user to gmail APIs to extract the authorisation code.
import oauth2Client from "@/utils/google-oauth-client";
import { NextResponse } from "next/server";

export const GET = async (req, res: NextResponse) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Request an access token and refresh token
    scope: ["https://mail.google.com/"],
  });
  return NextResponse.json(
    {
      data: authUrl,
      message: "success",
      error: null,
    },
    {
      status: 200,
    }
  );
};

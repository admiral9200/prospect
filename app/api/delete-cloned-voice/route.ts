import { NextResponse, NextRequest } from "next/server";
import supabaseClient from "@/utils/supabase-client";
import axios from "axios";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const apiKey = process.env.XI_API_KEY;

  try {
    const { userId } = await req.json();

    const { data, error } = await supabaseClient
      .from("users")
      .select("voiceid")
      .eq("id", userId)
      .single();

    if (!error) {
      const headers = {
        "xi-api-key": apiKey,
        Accept: "application/json",
        Authorisation: `Bearer ${apiKey}`,
      };
      const response = await axios.delete(
        `https://api.elevenlabs.io/v1/voices/${data.voiceid}`,
        { headers }
      );

      if (response.status === 200) {
        return NextResponse.json(
          {
            data: "success",
            error: null,
          },

          {
            status: 200,
          }
        );
      }
    }
  } catch (error) {
    console.log("Server error: ", error);
    return NextResponse.json({
      data: null,
      error: error,
    });
  }
};

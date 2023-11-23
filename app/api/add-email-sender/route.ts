import { NextRequest, NextResponse } from "next/server";
import supabaseClient from "@/utils/supabase-client";

// We do not explicitly need to add email senders to semdgrid, as long as domain has been authenticated.
export const POST = async (req: NextRequest, res: NextResponse) => {
  // If email gets here, its been veified from the frontend
  const { userId, email } = await req.json();
  try {
    const { data, error } = await supabaseClient
      .from("workspace")
      .select("senders")
      .eq("user_id", userId);
    //   @ts-ignore
    const currentSenders = data[0].senders;
    if (!currentSenders) {
      const newSendersList = [email];
      await supabaseClient
        .from("workspace")
        .update({ senders: newSendersList })
        .eq("user_id", userId);
    } else {
      await supabaseClient
        .from("workspace")
        .update({ senders: [...currentSenders, email] })
        .eq("user_id", userId);
    }
    return NextResponse.json(
      {
        message: `${email} added to list of senders`,
        data: null,
        error: null,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log("Internal server error: ", e);
    return NextResponse.json({
      data: null,
      error: e,
      message: "Internal server error",
    });
  }
};

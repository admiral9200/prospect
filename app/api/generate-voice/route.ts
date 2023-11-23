import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import FormData from "form-data";
import voice from "elevenlabs-node";
import fs from "fs-extra";
import fetch from "node-fetch";
import supabaseClient from "@/utils/supabase-client";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { voiceid, textInput } = await req.json();
    const apiKey = process.env.XI_API_KEY; // Your API key from Elevenlabs
    const fileName = "public/audio.mp3"; // The name of your audio file

    // Assuming "voice" is an object or module used for text-to-speech functionality
    const voiceResponse = await voice.textToSpeech(
      apiKey,
      voiceid,
      fileName,
      textInput
    );

    console.log("Response from text to speech call: ", voiceResponse); // should get voice back and save here for the user's storage
    if (voiceResponse.status === "ok") {
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
    } else {
      return NextResponse.json(
        {
          data: null,
          error: null,
          message: "error generating voice",
        },
        {
          status: 400,
        }
      );
    }
  } catch (e) {
    console.log("Error generating voice: ", e);

    return NextResponse.json({
      data: null,
      error: e,
    });
  }
};

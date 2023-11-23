import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import FormData from "form-data";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const url = "https://api.elevenlabs.io/v1/voices/add";
    const headers = {
      Accept: "application/json",
      "xi-api-key": process.env.XI_API_KEY,
    };

    const { urls } = await req.json();
    const form = new FormData();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].publicUrl;
      console.log('url: ', url)
      const fileResponse = await axios.get(url, {
        responseType: "arraybuffer",
      });

      form.append("files", fileResponse.data, {
        filename: `audio_${i}`,
        contentType: "audio/mpeg",
      });
    }

    form.append("name", "Cloned Voice Name");
    form.append("description", "description of the voice");
    form.append(
      "labels",
      '{"accent": "british", "gender": "male", "age": "young"}'
    );

    console.log('sending payload... ')
    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders(), ...headers },
    });
    console.log("Response: ", response);

    return NextResponse.json(
      {
        data: response.data,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log('Internal server error: ', error);
    if (error.response) {
      return NextResponse.json(
        {
          error: "External API Error",
          details: error.response.status
            ? `${error.response.status} - ${error.response.statusText}`
            : "Unknown error from external API",
        },
        {
          status: error.response.status || 500,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Internal Server Error",
          details:
            error.message || "An error occurred while processing the request.",
        },
        {
          status: 500,
        }
      );
    }
  }
};

import { NextResponse } from "next/server";
import  axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const GET = async (req, res: NextResponse) => {
  try {
    let url = "https://api.elevenlabs.io/v1/voices/add";
    let headers = {
      Accept: "application/json",
      "xi-api-key": "1c7a4389f2d78dc1e31a1dc4e3dadd18",
    };

    let form = new FormData();
    form.append("name", "Cloned Voice Name");
    form.append("files", fs.createReadStream("../sample1.mp3"), {
      contentType: "audio/mpeg",
    });
    form.append("files", fs.createReadStream("../sample2.mp3"), {
      contentType: "audio/mpeg",
    });
    form.append("description", "description of the voice");
    form.append(
      "labels",
      '{"accent": "british", "gender": "male", "age": "young"}'
    );

    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders(), ...headers },
    });

    return NextResponse.json(
      {
        data: response.data,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        {
          error: "Error:",
          details: error.response.data,
        },
        {
          status: error.response.status,
        }
      );
    } else if (error.request) {
      return NextResponse.json(
        {
          error: "Error:",
          details: error.request,
        },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Error:",
          details: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
};

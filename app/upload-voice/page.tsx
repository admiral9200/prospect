"use client";

import React, { useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import axios from "axios";
import FormData from "form-data";

let url = "https://api.elevenlabs.io/v1/voices/add";
let headers = {
  Accept: "application/json",
  "xi-api-key": "1c7a4389f2d78dc1e31a1dc4e3dadd18",
  "Content-Type": "multipart/form-data",
};

async function getVoiceUrls(voices, supabase) {
  console.log(voices);
  const promises = voices.map(async (voicePath) => {
    const response = await supabase.storage
      .from("voices")
      .getPublicUrl(`${voicePath}`); // Adjust the expiration time as needed
    return response.data;
  });

  return Promise.all(promises);
}

function generateUniqueName() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(7);
  return `audio_${timestamp}_${randomString}`;
}

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const user = useUser();
  const userId = user?.id;
  const supabase = useSupabaseClient();

  const handleFileChange = (e: any) => {
    console.log("clicking");
    const file = e.target.files[0];
    if (file && (file.type === "audio/mp3" || file.type === "audio/mpeg")) {
      setAudioFile(file);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert("Please select an MP3 file.");
      return;
    }

    try {
      setUploading(true);

      // Fetch the user's current voices
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("voices")
        .eq("id", userId);

      if (userError) {
        alert("Error fetching user data.");
        console.error(userError);
        return;
      }

      const voices = userData[0].voices || [];
      // Upload the audio file to Supabase storage
      const { data, error } = await supabase.storage
        .from(`voices`)
        .upload(`audio_${Date.now()}.mp3`, audioFile);

      if (error) {
        alert("Error uploading the audio file.");
        console.error(error);
      } else {
        const audioName = data.path;

        // Update the user's voices array with the new audio URL
        voices.push(audioName);

        // Update the user's voices in the database
        const { error: updateError } = await supabase
          .from("users")
          .update({ voices })
          .eq("id", userId);

        if (updateError) {
          alert("Error updating user data.");

          console.error(updateError);
        } else {
          // get public url of file.
          const urls = await getVoiceUrls(voices, supabase);

          console.log("Urls to send: ", urls);
          const response = await axios.post(
            "/api/train-voice",
            JSON.stringify({ urls }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Response: ", response);
          if (response.status === 200) {
            const voiceId = response.data.data.voice_id;
            // store id db
            const { error } = await supabase
              .from("users")
              .update({ voiceid: voiceId })
              .eq("id", userId);

            console.log("VoiceId: ", voiceId);

            if (!error) {
              alert("Audio file uploaded successfully.");
            }
          } else {
            alert("Error cloning voice");
          }
        }
      }
    } finally {
      setUploading(false);
      setAudioFile(null);
    }
  };

  const getVoice = async () => {
    try {
      // Fetch the voiceid from the users table in Supabase
      const { data: userData, error } = await supabase
        .from("users")
        .select("voiceid")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error("Error fetching voiceid from Supabase");
      }

      const voiceid = userData.voiceid;
      const textInput = "Hello world, we are coding this shit up";

      // Make a POST request to the /generate-voice API
      const apiEndpoint = "/api/generate-voice"; // Replace with your actual API endpoint
      const postData = {
        userId,
        voiceid,
        textInput,
      };

      setUploading(true);
      const response = await axios.post(apiEndpoint, postData);

      // Handle the response from the API
      if (response.status === 200) {
        console.log("vocice generated");

        const audioUrl = "/audio.mp3"; 
        console.log("calling fetch to get from pubic dir");
        const audioResponse = await fetch(audioUrl);
        console.log("done calling fetch");
        const audioBuffer = await audioResponse.arrayBuffer();
        console.log("audio buffer generated");

        // Step 2: Generate a unique name for the file
        const uniqueName = generateUniqueName(); // Implement this function as needed

        // Step 3: Store the file in Supabase "generated_voices" bucket
        console.log("storing buffer");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("generated_voices")
          .upload(`${uniqueName}.mp3`, audioBuffer, {
            contentType: 'audio/mpeg'
          });

        if (uploadError) {
          console.log("error storing buffer");
          throw new Error("Error uploading file to Supabase");
        }
        console.log(
          "buffer stored successfully, check to see if it's valid in storage"
        );

        // Step 4: Retrieve the URL of the stored file
        console.log("getting url");
        const res = await supabase.storage
          .from("generated_voices")
          .getPublicUrl(`${uniqueName}.mp3`);

        const url = res.data;
        console.log("url: ", url);

        // Store this URL for this user
        const newVoice = {
          voice: url.publicUrl,
        };

        // Fetch the current generated_voices_urls array
        console.log("storing new voice");
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("generated_voices_urls")
          .eq("id", userId)
          .single();

        if (fetchError) {
          throw new Error("Error fetching generated_voices_urls");
        }

        const currentGeneratedVoicesUrls = userData.generated_voices_urls || [];

        // Add the new voice object to the array
        const updatedGeneratedVoicesUrls = [
          ...currentGeneratedVoicesUrls,
          newVoice,
        ];

        // Update the "users" table with the updated array
        const { data: updateData, error: updateError } = await supabase
          .from("users")
          .update({
            generated_voices_urls: updatedGeneratedVoicesUrls,
          })
          .eq("id", userId);

        if (updateError) {
          throw new Error("Error updating generated_voices_urls");
        }

        console.log("voice stored in user");
        setUploading(false)
        alert("Everything worked");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="audio-uploader">
      <input
        type="file"
        accept="audio/mp3, audio/mpeg"
        onChange={handleFileChange}
      />
      <button className="bg-[blue] text-white" onClick={() => handleUpload()}>
        Upload
      </button>

      {uploading && <p className="text-[black]">uploading...</p>}

      <button className="text-[black]" onClick={() => getVoice()}>
        Get voice
      </button>
    </div>
  );
}

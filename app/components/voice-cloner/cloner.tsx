// @ts-nocheck

import React, { useState } from "react";
import CompletedClone from "./completed-clone";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";

async function getVoiceUrls(voices, supabase) {
  console.log(voices);
  const promises = voices.map(async (voicePath) => {
    const response = await supabase.storage
      .from("voices")
      .getPublicUrl(`${voicePath}`);
    return response.data;
  });

  return Promise.all(promises);
}

const VoiceCloner = () => {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  const userId = user?.id;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Streams: ", stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        console.log("Chunks: ", event.data);
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        // You can play the recorded audio with the lines below

        // const url = URL.createObjectURL(audioBlob);
        // console.log(url)
        // const audio = new Audio(url);
        // audio.play();

        // Handle the recorded audio blob as needed
        await handleVoiceCloning(audioBlob);
      };

      recorder.start();
      setRecording(true);

      setTimeout(() => {
        console.log("triggered");
        console.log("media recorder: ", recorder);
        if (recorder && recorder.state === "recording") {
          recorder.stop();
          setRecording(false);
          setUploading(true);
        }
      }, 30000);
    } catch (error) {
      alert("Something went wrong");
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      setUploading(true);
    }
  };

  const handleVoiceCloning = async (audioBlob) => {
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
        .upload(`audio_${Date.now()}.mp3`, audioBlob);

      if (error) {
        alert("Error uploading the audio file.");
        console.error(error);
      } else {
        const audioName = data.path;

        voices.push(audioName);

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
            localStorage.setItem("voiceId", voiceId);

            if (!error) {
              alert("Audio file uploaded successfully.");
            }
          } else {
            alert("Error cloning voice");
          }
        }
      }
      setUploading(false);
      setDone(true);
    } catch (e) {
      setUploading(false);
      setRecording(false);
      alert("Error processing the audio");
    }
  };




  return (
    <div className="bg-white text-start rounded-lg">
      {done ? (
        <CompletedClone setDone={setDone}/>
      ) : (
        <>
          <div>
            <p className="text-xl font-bold">
              Read the below paragraph, Record your voice and train your voice
              with AI
            </p>
            <p className="text-gray-500">
              Description of what this feature is about and how to train the
              chatbot. Like “click on the button below and read the text for us
              to train your voice (short and concise).
            </p>
          </div>

          {/* Part B */}
          <div className="flex flex-col items-center my-[25px]">
            {!recording && !uploading && (
              <>
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={startRecording}
                  width={57}
                  height={56}
                  viewBox="0 0 57 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="57" height="56" rx="28" fill="#6039DB" />
                  <path
                    d="M29 34.75C30.5913 34.75 32.1174 34.1179 33.2426 32.9926C34.3679 31.8674 35 30.3413 35 28.75V27.25M29 34.75C27.4087 34.75 25.8826 34.1179 24.7574 32.9926C23.6321 31.8674 23 30.3413 23 28.75V27.25M29 34.75V38.5M25.25 38.5H32.75M29 31.75C28.2044 31.75 27.4413 31.4339 26.8787 30.8713C26.3161 30.3087 26 29.5456 26 28.75V20.5C26 19.7044 26.3161 18.9413 26.8787 18.3787C27.4413 17.8161 28.2044 17.5 29 17.5C29.7956 17.5 30.5587 17.8161 31.1213 18.3787C31.6839 18.9413 32 19.7044 32 20.5V28.75C32 29.5456 31.6839 30.3087 31.1213 30.8713C30.5587 31.4339 29.7956 31.75 29 31.75Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xs text-center mt-[5px] font-bold">
                  Start Recording, <br /> Once you are ready
                </p>
              </>
            )}

            {recording && !uploading && (
              <>
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={stopRecording}
                  width={56}
                  height={56}
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="56" height="56" rx="28" fill="#FF0000" />
                  <rect
                    x="21"
                    y="21"
                    width="14"
                    height="14"
                    rx="1"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
                <p className="text-xs text-center mt-[5px] font-bold">
                  Click stop, <br /> when you are ready
                </p>
              </>
            )}

            {uploading && !recording && (
              <>
                <svg
                  className="animate-spin"
                  width={57}
                  height={56}
                  viewBox="0 0 57 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="57" height="56" rx="28" fill="#6039DB" />
                  <path
                    d="M41 28C41 34.6274 35.6274 40 29 40C22.3726 40 17 34.6274 17 28C17 21.3726 22.3726 16 29 16C35.6274 16 41 21.3726 41 28ZM18.6279 28C18.6279 33.7284 23.2716 38.3721 29 38.3721C34.7284 38.3721 39.3721 33.7284 39.3721 28C39.3721 22.2716 34.7284 17.6279 29 17.6279C23.2716 17.6279 18.6279 22.2716 18.6279 28Z"
                    fill="black"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M40.1861 28C40.6356 28 41.0029 28.3649 40.9724 28.8134C40.8248 30.9871 40.0875 33.0852 38.8327 34.8788C37.422 36.8953 35.4255 38.4293 33.1136 39.2729C30.8018 40.1165 28.2865 40.2289 25.9087 39.595C23.5308 38.961 21.4053 37.6113 19.8203 35.7288C18.2353 33.8462 17.2675 31.5219 17.0479 29.0708C16.8283 26.6197 17.3676 24.1603 18.5927 22.026C19.8178 19.8917 21.6695 18.1857 23.8969 17.1392C25.878 16.2083 28.0711 15.8392 30.2382 16.064C30.6853 16.1104 30.9823 16.5345 30.9057 16.9775C30.8291 17.4204 30.4079 17.7141 29.9603 17.6724C28.1231 17.5016 26.268 17.8236 24.5891 18.6125C22.664 19.5171 21.0635 20.9917 20.0045 22.8364C18.9456 24.6812 18.4795 26.8069 18.6693 28.9255C18.8591 31.0441 19.6957 33.0532 21.0656 34.6803C22.4356 36.3075 24.2727 37.4741 26.328 38.022C28.3833 38.57 30.5574 38.4728 32.5556 37.7436C34.5538 37.0145 36.2795 35.6886 37.4988 33.9457C38.5622 32.4257 39.1956 30.6526 39.3402 28.8131C39.3754 28.365 39.7365 28 40.1861 28Z"
                    fill="white"
                  />
                </svg>
                <p className="text-xs text-center mt-[5px] font-bold">
                  Cloning your voice
                </p>
              </>
            )}
          </div>

          {/* Part C */}
          {!uploading && (
            <div>
              {recording && (
                <p className="font-bold mb-[1px]">Read this aloud</p>
              )}
              <p
                style={{
                  backgroundColor: "rgba(96, 57, 219, 0.10)",
                  opacity: !recording ? "0.4" : undefined,
                }}
                className="text-md p-[16px]"
              >
                Voice training is a transformative journey that empowers
                individuals to discover and refine the unique nuances of their
                vocal abilities. Through a dedicated and structured process,
                participants can unlock the full potential of their voices,
                enhancing not only their communication skills but also their
                confidence and self-expression. Whether pursuing vocal training
                for professional purposes such as singing or public speaking, or
                simply as a means to improve personal communication, voice
                training offers a path towards greater resonance, clarity, and
                control.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceCloner;

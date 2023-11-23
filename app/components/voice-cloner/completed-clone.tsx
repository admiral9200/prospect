'use client'

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";


function generateUniqueName() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(7);
  return `audio_${timestamp}_${randomString}`;
}

async function deleteUserVoiceIdFromDb(userId, supabase) {
  try {
    // Search for the user by userId
    const { data, error } = await supabase
      .from("users")
      .select("voiceid")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      const userVoiceId = data.voiceid;

      // If voiceId is found, delete it for the user
      if (userVoiceId) {
        const { error } = await supabase
          .from("users")
          .update({ voiceid: null }) // Set voiceId to null
          .eq("id", userId);

        if (error) {
          throw error;
        }

        console.log(`VoiceId deleted for user with userId: ${userId}`);
      } else {
        console.log(`No voiceId found for user with userId: ${userId}`);
      }
    } else {
      console.log(`User with userId ${userId} not found`);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

const CompletedClone = ({setDone}) => {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const supabase = useSupabaseClient();
  const userId = user?.id;
  const textInput =
    "Hello there, how are you doing? Hope you are having a great day";
  const [deleting, setDeleting] = useState(false);

  const getVoice = async () => {
    try {
      setLoading(true);
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

      if(!voiceid) {
        alert('You dont have a stored voice')
        setLoading(false)
        return;
      }

      const apiEndpoint = "/api/generate-voice";
      const postData = JSON.stringify({
        voiceid,
        textInput,
      });

      const response = await axios.post(apiEndpoint, postData);

      // Handle the response from the API
      if (response.status === 200) {
        console.log("voice generated");

        const audioUrl = "/audio.mp3";
        console.log("calling fetch to get from pubic dir");
        const audioResponse = await fetch(audioUrl);
        console.log("done calling fetch");
        const audioBuffer = await audioResponse.arrayBuffer();
        console.log("audio buffer generated");

        // Step 2: Generate a unique name for the file
        const uniqueName = generateUniqueName();

        // Step 3: Store the file in Supabase "generated_voices" bucket
        console.log("storing buffer");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("generated_voices")
          .upload(`${uniqueName}.mp3`, audioBuffer, {
            contentType: "audio/mpeg",
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

        const url = res.data.publicUrl;

        console.log("generated audio url: ", url);

        setUrl(url);

        // No need to store this voice as its a temp voice NOT generated by user.

        // // Store this URL for this user
        // const newVoice = {
        //   voice: url.publicUrl,
        // };

        // // Fetch the current generated_voices_urls array
        // console.log("storing new voice");
        // const { data: userData, error: fetchError } = await supabase
        //   .from("users")
        //   .select("generated_voices_urls")
        //   .eq("id", userId)
        //   .single();

        // if (fetchError) {
        //   throw new Error("Error fetching generated_voices_urls");
        // }

        // const currentGeneratedVoicesUrls = userData.generated_voices_urls || [];

        // // Add the new voice object to the array
        // const updatedGeneratedVoicesUrls = [
        //   ...currentGeneratedVoicesUrls,
        //   newVoice,
        // ];

        // // Update the "users" table with the updated array
        // const { data: updateData, error: updateError } = await supabase
        //   .from("users")
        //   .update({
        //     generated_voices_urls: updatedGeneratedVoicesUrls,
        //   })
        //   .eq("id", userId);

        // if (updateError) {
        //   throw new Error("Error updating generated_voices_urls");
        // }
        setLoading(false);
        alert("Everything worked");
      }
    } catch (error: any) {
      alert("There was a problem generating a preview");
      console.error("Error:", error.message);
    }
  };

  const handlePlay = () => {
    if (!loading && url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

const deleteVoice = async () => {
  try {
    setDeleting(true);
    const payload = JSON.stringify({
      userId,
    });
    const response = await axios.post("/api/delete-cloned-voice", payload);

    console.log(response)

    if (response.status === 200) {
      await deleteUserVoiceIdFromDb(userId, supabase);
      alert("Done");
    }

    setDeleting(false);
    setDone(false);
  } catch (e) {
    console.log("Error deleting voice: ", e);
    setDeleting(false);
    alert("Error deleting voice");
  }
};


  useEffect(() => {
    const work = async () => {
      await getVoice();
    };

    if (user) {
      work();
    }
  }, [user]);

  return (
    <div className="container w-full">
      {/* Part A */}
      <div className="partA">
        <h1 className="font-bold text-xl">Your Voice</h1>
        <div className="flex items-center mt-2">
          <div className="iconp-2 w-2/10">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.1306 7.12313C16.9218 6.21043 17.9001 5.47867 18.9991 4.97753C20.0981 4.47639 21.2921 4.21761 22.5 4.21875C25.0444 4.21875 27.3244 5.34375 28.8694 7.12313C30.0744 7.03709 31.2839 7.21141 32.4156 7.63426C33.5473 8.05712 34.5748 8.71859 35.4281 9.57375C36.2829 10.427 36.9442 11.4541 37.3671 12.5855C37.7899 13.7168 37.9644 14.9259 37.8788 16.1306C38.7911 16.922 39.5225 17.9004 40.0233 18.9994C40.5241 20.0984 40.7826 21.2923 40.7813 22.5C40.7824 23.7079 40.5236 24.9019 40.0225 26.0009C39.5213 27.0999 38.7896 28.0782 37.8769 28.8694C37.9625 30.0741 37.788 31.2832 37.3652 32.4145C36.9423 33.5459 36.2811 34.573 35.4263 35.4263C34.573 36.2811 33.5459 36.9423 32.4145 37.3652C31.2832 37.788 30.0741 37.9625 28.8694 37.8769C28.0782 38.7896 27.0999 39.5213 26.0009 40.0225C24.9019 40.5236 23.7079 40.7824 22.5 40.7813C21.2921 40.7824 20.0981 40.5236 18.9991 40.0225C17.9001 39.5213 16.9218 38.7896 16.1306 37.8769C14.9257 37.9632 13.7163 37.7891 12.5846 37.3666C11.4529 36.9441 10.4254 36.283 9.57188 35.4281C8.71682 34.5747 8.05541 33.5472 7.63256 32.4155C7.20972 31.2838 7.03534 30.0744 7.12126 28.8694C6.2089 28.078 5.47749 27.0996 4.97668 26.0006C4.47586 24.9016 4.21737 23.7077 4.21876 22.5C4.21876 19.9556 5.34376 17.6756 7.12313 16.1306C7.03736 14.9259 7.21182 13.7168 7.63467 12.5854C8.05751 11.4541 8.71884 10.4269 9.57376 9.57375C10.4269 8.71884 11.4541 8.05751 12.5854 7.63467C13.7168 7.21182 14.9259 7.03736 16.1306 7.12313ZM29.2688 19.0988C29.3813 18.9488 29.4627 18.778 29.5082 18.5962C29.5537 18.4143 29.5624 18.2253 29.5338 18.04C29.5052 17.8548 29.4398 17.6772 29.3416 17.5176C29.2434 17.3579 29.1142 17.2196 28.9617 17.1106C28.8093 17.0016 28.6365 16.9242 28.4537 16.8829C28.2709 16.8417 28.0817 16.8373 27.8972 16.8702C27.7126 16.9031 27.5366 16.9726 27.3793 17.0745C27.222 17.1764 27.0867 17.3088 26.9813 17.4638L20.9138 25.9575L17.8688 22.9125C17.6022 22.6641 17.2496 22.5289 16.8853 22.5353C16.521 22.5417 16.1734 22.6893 15.9157 22.947C15.6581 23.2046 15.5105 23.5522 15.5041 23.9165C15.4976 24.2808 15.6329 24.6334 15.8813 24.9L20.1 29.1188C20.2444 29.263 20.4184 29.3741 20.61 29.4443C20.8016 29.5146 21.0062 29.5423 21.2096 29.5255C21.4129 29.5087 21.6102 29.4479 21.7877 29.3472C21.9653 29.2465 22.1187 29.1084 22.2375 28.9425L29.2688 19.0988Z"
                fill="#22A04E"
              />
            </svg>
          </div>
          <div className="text-gray-500 p-4">
            Description of what this feature is about and how to train the
            chatbot. Like “click on the button below and read the text for us to
            train your voice.(short and concise)
          </div>
        </div>
      </div>

      {/* Part B */}
      <div className="partB mt-10">
        <button
          onClick={() => handlePlay()}
          type="button"
          className="inline-flex justify-center items-center w-[40%] rounded-[12px] bg-[#6039DB] px-[16px] py-[24px] text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? "Loading a preview..." : "Preview your audio"}
        </button>
      </div>

      {/* Part C */}
      <div className="partC flex justify-between items-center mt-4">
        <div className="leftText">Your recording</div>
        <div className="rightElements flex items-center">
          <span
            onClick={deleteVoice}
            className="removeText mr-2 text-[#6039DB] underline cursor-pointer"
          >
            {deleting ? "Removing..." : "Remove"}
          </span>
          {!loading && (
            <button
              onClick={() => handlePlay()}
              className="whiteButton bg-white border border-gray-300 flex items-center rounded-[18px] p-[14px]"
            >
              Play audio{" "}
              <i className="playIcon ml-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="12" fill="#6039DB" />
                  <path
                    d="M15.6405 11.1221C16.3354 11.5011 16.3354 12.4989 15.6405 12.8779L10.4789 15.6934C9.81248 16.0568 9 15.5745 9 14.8155L9 9.18454C9 8.42548 9.81248 7.94317 10.4789 8.30665L15.6405 11.1221Z"
                    fill="white"
                  />
                </svg>
              </i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedClone;

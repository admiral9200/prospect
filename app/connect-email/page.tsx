"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from '@supabase/auth-helpers-react';

export default function ConnectEmail() {
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const authorizeGmail = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth-gmail");
      setLoading(false);
      if ((response.status = 200)) {
        // This is a workaround for now.
        window.location.replace(response.data.data);
      }
    } catch (e) {
      console.log("Error initiating gmail auth: ", e);
    }
  };

  useEffect(
    () => {
       // Function to handle extract the authorization code
    const handleCodeExtraction = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("Code from google: ", code);
      if (code) {
         setLoading(true)
        const response = await axios.post("/api/get-google-tokens", JSON.stringify({code, userId: user?.id}), {
           headers: { 'Content-Type': 'application/json' }
        })
        setLoading(false);

        console.log(response.data.message);
      }
    };

   
    if(user) {
      handleCodeExtraction();
    }
    
  }, [user])


  return (
    <div className="flex lg:justify-center">
      <button
        onClick={() => authorizeGmail()}
        className="bg-green-500 border text-white p-6"
      >
        Authorize
      </button>

      {loading && <p>Loading...</p>}
    </div>
  );
}

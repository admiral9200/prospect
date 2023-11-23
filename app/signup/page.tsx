"use client";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Head from "next/head";
import { AuthLayout } from "../components/landing/AuthLayout";
import { useBlock } from "@dopt/react";
import Checklist, {
  useChecklist,
  useChecklistItem,
} from "@dopt/react-checklist";
import Divider from "../components/ui/Divider";
import InputWithLabel from "../components/ui/label-input";
import isValidWorkEmail from "../../utils/work-email";
import useNotification from "../../utils/notification";
import Link  from "next/link";
import { useMediaQuery } from 'usehooks-ts'
import Spinner from "../components/ui/spinner";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#9333ea' }} spin />

const Login = () => {
  {
    /*
  useEffect(() => {
    const fetchSearchData = async () => {
      const url = "https://www.linkedin.com/search/results/people/?keywords=sales&origin=SWITCH_SEARCH_VERTICAL&sid=GZj";
      const cookie = {
        "li_at": "AQEDAS62hxMBbGL7AAABiK9ESqoAAAGJkksh8U0ASdGV16r0go8nvDMSXmGN6DON9fPJTfOrF2tieYuXSbHnXWigy1FGjqDlpjP0zkzsXy-MQWRsXWA1x2GQ5RJlRcSdUDPZAOjRXMMNWk-xYqWlQ1Ob",
        "ajax": "\"ajax:1254607226557722062\""
      };
      const res = await fetch('/api/searchPeoples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, cookie })
      });

      if (res.headers.get('Content-Type') === 'application/json') {
        const data = await res.json();
        console.log(data);
      } else {
        console.log(await res.json());
      }
    };

    const fetchPeoplesData = async () => {
      const profiles_urls = ["https://www.linkedin.com/in/hussain-qasim-897874267/", "https://www.linkedin.com/in/kreativeafaq/"];
      const cookie = {
        "li_at": "AQEDAS62hxMBbGL7AAABiK9ESqoAAAGJkksh8U0ASdGV16r0go8nvDMSXmGN6DON9fPJTfOrF2tieYuXSbHnXWigy1FGjqDlpjP0zkzsXy-MQWRsXWA1x2GQ5RJlRcSdUDPZAOjRXMMNWk-xYqWlQ1Ob",
        "ajax": "\"ajax:1254607226557722062\""
      };
      const res = await fetch('/api/scrapProfiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profiles_urls, cookie })
      });

      if (res.headers.get('Content-Type') === 'application/json') {
        const data = await res.json();
        console.log(data);
      } else {
        console.log(await res.json());
      }
    };
    fetchSearchData()
    fetchPeoplesData()
  }, [])
*/
  }

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const supabase = useSupabaseClient();
  const [notify, notification] = useNotification();
  const isLargeScreen = useMediaQuery('(min-width: 900px)');
  const [isLoading, setIsLoading] = useState(false);


  const handleEmail = (e: any) => {
    setEmail(e.target.value);
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      // @ts-ignore
      notification("error", "failed to sign up");
    }
  }

  async function signInWithEmail() {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setIsLoading(false);

    if (error) {
      // @ts-ignore
      notification("error", "failed to Sign up");
    }

    if (data) {
      // @ts-ignore
      notification("success", "sent a login link to your email");
    }
  }

  useEffect(() => {
    const isValidEmail = isValidWorkEmail(email);
    setIsEmailValid(isValidEmail);
  }, [email]);

  return (
    <>
      <Head>
        <title>Sign-up to Prosp</title>
      </Head>
       <Link href="/login">
      {isLargeScreen && <button className="absolute top-4 right-10 w-[200px] px-6 py-4 mt-4 font-semibold text-white bg-gray-900 border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none">Log in</button>}
      </Link>
      <AuthLayout
        title="Welcome to Prosp"
        subtitle="Reach thousands of leads, reach them with superb context"
      >
        {notify}
        <button
          onClick={signInWithGoogle}
          className="w-full px-6 py-4 mt-4 font-semibold text-gray-900 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline w-8 h-8 mr-3 text-gray-900 fill-current"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          Sign in with Google
        </button>
        <div className="py-6">
          <Divider content="Or, sign in with your email" />
        </div>
        <InputWithLabel
          label="Work email"
          info=""
          state={email}
          handler={handleEmail}
        />
        {!isEmailValid && email && (
          <small className="text-[red]">Please enter a valid work email</small>
        )}
        <button
          disabled={!isEmailValid}
          onClick={signInWithEmail}
          className={`w-full px-6 py-4 mt-4 font-semibold  ${
            email && isEmailValid
              ? "bg-white text-gray-900"
              : "bg-zinc-500 text-white"
          } border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none ${
            isEmailValid ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
        {isLoading ? <Spin indicator={antIcon} /> : "Get started"}
        </button>
        {/* We may decide to change to this design later. */}
        {!isLargeScreen && <small className="text-base mt-2">Already have an account? <Link href="/login" className="text-[blue] underline">Sign in</Link></small>}
      </AuthLayout>
    </>
  );
};

export default Login;

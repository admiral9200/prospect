"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function ProductDemo() {
  const path = usePathname()
  const t = useTranslations('common')
  // Set the default input and textarea values
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const searchParams = useSearchParams();
  const initialInputValue = searchParams.has("usr")
    ? `https://www.linkedin.com/in/${searchParams.get("usr")}/`
    : "https://www.linkedin.com/in/yann-dine/";
  const [inputValue, setInputValue] = useState([initialInputValue]);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (searchParams.has("usr")) {
      generateMessage();
      // Scroll to the component
      const productDemoElement = document.getElementById("productDemo");
      if (productDemoElement) {
        window.scrollTo({
          top: productDemoElement.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const url = "https://www.linkedin.com/in/alexandre-k0/";

  const scrapeSenderProfile = async () => {
    const res = await fetch("/api/scrapeProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, cookie }),
    });

    if (res.headers.get("Content-Type") === "application/json") {
      const data = await res.json();
      console.log(data);
      return;
    } else {
      console.log(await res.json());
    }
  };

  const generateMessage = async () => {
    setTextAreaValue([t("live_test_text_area_value")]);

    setProgress(0);
    setLoading(true);
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        const newProgress = oldProgress + 2;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);

    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_extract_profile'),
      ]);
    }, 1000);

    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_extract_post'),
      ]);
    }, 2000);

    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_extract_emp_history'),
      ]);
    }, 3000);

    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_extract_bio'),
      ]);
    }, 4000);

    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_generate_msg'),
      ]);
    }, 5000);
    setTimeout(() => {
      setTextAreaValue((prevMessages) => [
        ...prevMessages,
        t('live_test_two_sec'),
      ]);
    }, 7000);

    console.log(path.split('/')[1]);

    const res = await fetch(`/api/generateMessage/${path.split('/')[1]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profiles_urls: inputValue }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setTextAreaValue([data.iceBreaker]);
    } else {
      console.error("Error:", await res.json());
    }

    setLoading(false);
    clearInterval(interval);
    setProgress(100);
  };

  const [textAreaValue, setTextAreaValue] = useState([

    "Hey Yann! 😊\n\nLoved your take on emails, so relatable! Curious about your use of AI in outreach, got a few Qs. Mind if we discuss?",
  ]);

  return (
    <div>
      {/* <div
        id="productDemo"
        className="w-full bg-white pb-96 flex justify-center"
      >
        <div className="w-full mx-2 md:w-4/5 h-[500px] lg:h-[600px] bg-violet-600 rounded-xl max-w-[1440px] flex flex-col items-center relative md:mx-auto overflow-visible">
          <div
            className="absolute top-4 right-4 hidden md:block" // This will position your image at the top right with a bit of padding and hide it on small screens
          >
            <Image
              src="/linkedin3d.png" // Replace this with the url of your LinkedIn logo
              alt="LinkedIn Logo"
              width={80} // Replace with your desired width
              height={80} // Replace with your desired height
              layout="fixed"
            />

          </div>
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              backgroundImage: `url('/backgroundlines.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center -24px",
            }}
          />
          <h2
            className="mt-10 text-4xl text-center font-extrabold text-white tracking-tighter"
            style={{ fontSize: "38px" }}
          >
            {t('live_test_live_demo')}
          </h2>
          <p className="mt-4 text-center text-md leading-relaxed text-white">
            {t('live_test_generate_icebreaker')} <br />
          </p>
          <div className="tabs"></div>
          <div className="tabs-content w-11/12 md:w-3/4 bg-white border-b-4 border-violet-600 p-4 rounded-md absolute bottom-[-50%] md:bottom-[-35%] lg:bottom-[-23%] sm:px-4 md:px-4 lg:px-16">
            <div className="tab-1-content">
              <div className="relative flex items-center text-md pt-4 pb-2 justify-center">
                <input
                  className="border border-gray-300 p-4 h-12 text-sm md:text-base w-full rounded-md focus:outline-violet-400"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue([e.target.value])}
                  placeholder="Paste LinkedIn Profile URL..."

            {t('live_test_generate_btn')}
          </button>
          <div className="mb-3">
            {loading && (
              <div
                className="w-full rounded bg-gray-200"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#eee",
                  borderRadius: "15px",
                }}
              >
                <div
                  className="bg-violet-600"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: `${progress}%`,
                    maxWidth: "100%",
                  }}
                />
                <button
                  onClick={generateMessage}
                  className={` hidden md:block h-10 w-24 text-sm font-medium absolute right-2 top-10 transform -translate-y-1/2 bg-violet-600 hover:bg-violet-700 text-white rounded-md`}
                >
                  Generate
                </button>
              </div>
              <button
                onClick={generateMessage}
                className={`md:hidden mb-2 h-10 w-full text-sm font-medium bg-violet-600 text-white rounded-md`}
              >
                Generate
              </button>
              <div className="mb-3">
                {loading && (
                  <div
                    className="w-full rounded bg-gray-200"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "15px",
                    }}
                  >
                    <div
                      className="bg-violet-600"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        height: "100%",
                        width: `${progress}%`,
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="relative flex items-center text-md justify-center">
                <textarea
                  className=" shadow-2xl  shadow-violet-100 border border-gray-300 p-4 h-80 md:h-72 w-full rounded-md focus:outline-violet-400 "
                  style={{ minHeight: "7em", resize: "none" }}
                  value={textAreaValue.join("\n")}
                  onChange={(e) => setTextAreaValue([e.target.value])}
                  placeholder="Generated message will appear here..."
                ></textarea>
              </div>
              <div className="mt-12 text-center text-md leading-relaxed text-black shadow-2xl shadow-violet-100">
                <Link
                  href="/login"
                  className="font-medium text-white bg-violet-600 p-3 rounded-md  hover:bg-violet-700"
                >
                  {" "}
                  Sign up for free <br />
                </Link>
              </div>
              <p className="mt-4 text-center text-sm leading-relaxed text-black">
                Book thousands of meetings automatically
              </p>
            </div>
            <div />{" "}
          </div>
        </div>
      </div> */}

      <div
        id="productDemo"
        className="w-full bg-white pb-96 flex justify-center"
      >
        <div className="w-full mx-2 md:w-4/5 h-[500px] lg:h-[600px] bg-violet-600 rounded-xl max-w-[1440px] flex flex-col items-center relative md:mx-auto overflow-visible">
          <div
            className="absolute top-4 right-4 hidden md:block" // This will position your image at the top right with a bit of padding and hide it on small screens
          >
            <Image
              src="/linkedin3d.png" // Replace this with the url of your LinkedIn logo
              alt="LinkedIn Logo"
              width={80} // Replace with your desired width
              height={80} // Replace with your desired height
              layout="fixed"
            />
          </div>
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              backgroundImage: `url('/backgroundlines.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center -24px",
            }}
          />
          <h2
            className="mt-10 text-4xl text-center font-extrabold text-white tracking-tighter"
            style={{ fontSize: "38px" }}
          >
            Live Demo
          </h2>
          <p className="mt-4 text-center text-md leading-relaxed text-white">
            Sign up to send thousands of messages automatically <br />
          </p>
          <div className="z-10 rounded-xl tabs w-10/12 sm:w-auto lg:w-6/12 flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 mt-4 mb-32">
            <div
              onClick={() => setSelectedTab(1)}
              className={`tab flex items-center justify-center w-10/12 sm:w-auto px-4 py-2 cursor-pointer transition-all duration-300 rounded mb-2 sm:mb-0 whitespace-nowrap ${selectedTab === 1
                  ? "bg-white text-black"
                  : "bg-white bg-opacity-20 text-white hover:bg-opacity-40"
                }`}
            >
              <span className="mr-2">⚡️</span>
              <span className="flex-grow text-center">Icebreaker</span>
            </div>
            <div
              onClick={() => setSelectedTab(2)}
              className={`tab flex items-center justify-center w-10/12 sm:w-auto px-4 py-2 cursor-pointer transition-all duration-300 rounded mb-2 sm:mb-0 whitespace-nowrap ${selectedTab === 2
                  ? "bg-white text-black"
                  : "bg-white bg-opacity-20 text-white hover:bg-opacity-40"
                }`}
            >
              <span className="mr-2">🪄</span>
              <span className="flex-grow text-center">Automate Outreach</span>
            </div>
            <div
              onClick={() => setSelectedTab(3)}
              className={`tab flex items-center justify-center w-10/12 sm:w-auto px-4 py-2 cursor-pointer transition-all duration-300 rounded whitespace-nowrap ${selectedTab === 3
                  ? "bg-white text-black"
                  : "bg-white bg-opacity-20 text-white hover:bg-opacity-40"
                }`}
            >

              <span className="mr-2">🗂️</span>
              <span className="flex-grow text-center">CSV Export</span>
            </div>
          </div>

          <div className="tabs-content w-11/12 md:w-3/4 bg-white border-b-4 border-violet-600 p-4 rounded-md absolute  bottom-[-58%] sm:bottom-[-40%] md:bottom-[-36%] lg:bottom-[-15%] sm:px-4 md:px-4 lg:px-4 h-[470px] overflow-y-auto">
            {selectedTab === 1 && (
              <div className="tab-1-content px-6 ">
                <div className="relative flex items-center text-md pt-4 pb-2 justify-center">
                  <input
                    className="border border-gray-300 p-4 h-12 text-sm md:text-base w-full rounded-md focus:outline-violet-400"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue([e.target.value])}
                    placeholder="Paste LinkedIn Profile URL..."
                  />
                  <button
                    onClick={generateMessage}
                    className={` hidden md:block h-10 w-24 text-sm font-medium absolute right-2 top-10 transform -translate-y-1/2 bg-violet-600 hover:bg-violet-700 text-white rounded-md`}
                  >
                    Generate
                  </button>
                </div>
                <button
                  onClick={generateMessage}
                  className={`md:hidden mb-2 h-10 w-full text-sm font-medium bg-violet-600 text-white rounded-md`}
                >
                  Generate
                </button>
                <div className="mb-3">
                  {loading && (
                    <div
                      className="w-full rounded bg-gray-200"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#eee",
                        borderRadius: "15px",
                      }}
                    >
                      <div
                        className="bg-violet-600"
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          height: "100%",
                          width: `${progress}%`,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="relative flex items-center text-md justify-center">
                  <textarea
                    className=" shadow-2xl  shadow-violet-100 border border-gray-300 p-4 h-44 md:h-60 w-full rounded-md focus:outline-violet-400 "
                    style={{ minHeight: "7em", resize: "none" }}
                    value={textAreaValue.join("\n")}
                    onChange={(e) => setTextAreaValue([e.target.value])}
                    placeholder="Generated message will appear here..."
                  ></textarea>
                </div>
                <div className="mt-12 text-center text-md leading-relaxed text-black shadow-2xl shadow-violet-100">
                  <Link
                    href="/login"
                    className="font-medium text-white bg-violet-600 p-3 rounded-md  hover:bg-violet-700"
                  >
                    Access all features for free
                  </Link>
                </div>
                <p className="mt-4 text-center text-sm leading-relaxed text-black">
                  Book thousands of meetings automatically
                </p>
              </div>
            )}

            {selectedTab === 2 && (
              <div className="tab-content tab-2-content lg:px-10 lg:pt-2">
                <div className="tab-content tab-2-content">
                  <div
                    className=""
                    style={{
                      position: "relative",
                      paddingBottom: "calc(54.91289198606272% + 41px)",
                      height: 0,
                      width: "100%",
                    }}
                  >
                    <iframe
                      src="https://demo.arcade.software/pUudvnCcwl4JpacN1Rei?embed"
                      frameBorder="0"
                      loading="lazy"
                      allowFullScreen
                      className="h-full lg:h-[400px]"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        colorScheme: "light",
                      }}
                      title="Arcade Flow (Fri Sep 01 2023)"
                    />
                  </div>
                </div>

                <div className="mt-12 text-center text-md leading-relaxed text-black shadow-2xl shadow-violet-100">
                  <Link
                    href="/login"
                    className="font-medium text-white bg-violet-600 p-3 rounded-md  hover:bg-violet-700"
                  >
                    Access all features for free
                  </Link>
                </div>
              </div>
            )}

            {selectedTab === 3 && (
              <div className="tab-content tab-3-content">
                <div className="tab-content tab-3-content">
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "calc(54.91289198606272% + 41px)",
                      height: 0,
                      width: "100%",
                    }}
                  >
                    <iframe
                      src="https://demo.arcade.software/rdVHmslNMezG6NsTAVrl?embed"
                      frameBorder="0"
                      loading="lazy"
                      allowFullScreen
                      className="h-full lg:h-[400px]"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        colorScheme: "light",
                      }}
                      title="Arcade Flow (Fri Sep 01 2023)"
                    />
                  </div>
                </div>

                <div className="mt-12 text-center text-md leading-relaxed text-black shadow-2xl shadow-violet-100">
                  <Link
                    href="/login"
                    className="font-medium text-white bg-violet-600 p-3 rounded-md  hover:bg-violet-700"
                  >
                    Access all features for free
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

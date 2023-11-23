import Image from "next/image";

export default function ProductDemo() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] flex relative mx-auto">
        <div className="preview mx-auto max-w-[1440px] px-0 md:px-12 relative z-30 pt-12 mb:pt-0 md:flex md:flex-col-reverse lg:flex-row justify-between items-center py-8">
          <div className="w-full hidden lg:block lg:order-1 lg:w-1/2 text-center">
            <h2
              className="text-4xl text-left font-extrabold text-transparent bg-clip-text 2xl:ml-16 bg-gradient-to-r from-purple-600 to-pink-600 tracking-tighter"
              style={{ fontSize: "38px" }}
            >
              AI-Automated
              <br />
              LinkedIn Messaging
            </h2>
            <p
              className="mt-4 text-left text-lg leading-relaxed mw-1/5 2xl:ml-16"
              style={{ color: "#5E5F5F", fontSize: "22px" }}
            >
              Choose or create your own prompts. <br /> Our AI uses LinkedIn
              data to auto-send <br />
              personalized messages. Modify as desired.
            </p>
          </div>
          <div className="hidden w-full order-1 lg:order-2 lg:w-1/2 md:flex justify-center lg:justify-start">
            <Image
              src="/newheroimage.svg"
              alt="AI-powered cold outreach"
              width={735}
              height={455}
            />
          </div>

          <div className="w-full order-1 lg:order-2 lg:w-1/2 md:hidden flex justify-center items-center">
            <div className="w-full max-w-md mx-auto">
              <Image
                src="/newheroimagemobile.svg"
                alt="AI-powered cold outreach"
                width={495}
                height={325.62}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

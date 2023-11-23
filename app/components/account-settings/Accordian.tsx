import Image from "next/image";

interface AccordionProps {
    children: any,
    imgUrl: string,
    title: string,
    isConnected: boolean
}

const Accordion = ({ children, imgUrl, title, isConnected }: AccordionProps) => {
    return <div className="border-[2.5px] border-gray-200 rounded-lg mb-3">
  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 rounded-t-md bg-[#D6D6D6] bg-opacity-40 p-4">
    <div className="flex justify-center items-center">
      <Image
        src={imgUrl}
        width={25}
        height={25}
        alt=""
      />
      <p className="pl-4">{title}</p>
    </div>
    <div className="flex justify-center items-center">
      {isConnected && (
        <div className="rounded-full text-white bg-[#22A04E] py-[1px] text-[12px] px-4">
          Connected
        </div>
      )}
      <button className="ml-2">
        <Image
          src={'/account_settings/down_arrow.svg'}
          width={15}
          height={15}
          alt=""
        />
      </button>
    </div>
  </div>
  <div>
    {children}
  </div>
</div>
}

export default Accordion;
import ConnectorButton from "./connectorButton";

export default function Connector({ isGmailConnected, setIsGmailConnected, isLinkedInConnected, setIsLinkedInConnected }) {
    return (
      <div className='w-[400px]'>
        <div className='flex flex-col justify-center items-start'>
          <h2 className='font-bold text-[24px]'>
            Create a Connector
          </h2>
        </div>
        <div className='flex justify-center items-center my-2'>
          <div className='mr-1'>
            <ConnectorButton url="/linkedin2.png" title="" setConnectionState={setIsLinkedInConnected} isConnected={isLinkedInConnected} />
          </div>
          <div className='ml-1'>
            <ConnectorButton url="/gmail4.png" title="Gmail" setConnectionState={setIsGmailConnected} isConnected={isGmailConnected} />
          </div>
        </div>
      </div>
    )
  }
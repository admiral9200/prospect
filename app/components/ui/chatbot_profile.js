export default function ChatbotProfile({ botName, botIcon }) {
  return (
    <div
      className="relative cursor-pointer bg-purple-700 hover:bg-purple-800"
      style={{
        width: '216px',
        height: '216px',
        border: '1px solid #9252B9',
        borderRadius: '16px',
        position: 'relative',
        marginTop: '32px',
      }}
    >
      <div
        className="left-2 bg-blue-400 top-2 flex items-center justify-center border-purple-700"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '100px',
          position: 'absolute',
          top: '16.01px',
          left: '16.12px',
        }}
      >
        {botIcon && botIcon}
      </div>
      <p className="font-medium text-white"
        style={{
          fontSize: '16px',
          position: 'absolute',
          left: '16.12px',
          bottom: '24.01px',
          lineHeight: "20px"
        }}
      >
        {botName}
      </p>
    </div>
  );
}

import React from 'react';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  plan: string;
  used: number;
  total: number;
}

const NewChatbotBtn: React.FC<Props> = ({ plan, used, total }) => {
  const percentage = (used / total) * 100;

  return (
    <section className="flex flex-col self-center rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-1 flex justify-between">
        <h3 className="text-sm font-semibold">Create a chatbot</h3>
      </div>
    </section>
  );
};

export default NewChatbotBtn;

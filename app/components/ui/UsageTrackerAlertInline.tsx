import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  plan: string;
  used: number;
  total: number;
}

const UsageTrackerAlertInline: React.FC<Props> = ({ plan, used, total }) => {
  const percentage = (used / total) * 100;

  return (
    <section className="flex flex-col p-4 border border-gray-200 rounded-lg self-center bg-white">
      <div className="flex justify-between mb-1">
        <h3 className="text-sm font-semibold">{plan}</h3>
        
        <div className="flex items-center">
          
          <span className="ml-4 text-sm font-semibold text-primary-action">
            {used}/{total}
          </span>
          <div className="ml-2 w-4 h-4">
          <CircularProgressbar
            value={percentage}
            strokeWidth={6}
            styles={buildStyles({
              strokeLinecap: 'round',
              textSize: '0px',
              pathColor: 'rgb(33, 66, 231)',
              trailColor: 'rgb(241, 243, 254)',
            })}
          /></div>
        </div>
      </div>
    </section>
  );
};

export default UsageTrackerAlertInline;

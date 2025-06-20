import React from 'react';
import { LapTime } from '../types';
import { formatTime } from '../utils/time';
import { getImageUrl } from '../utils';
import AssistTags from './AssistTags';
import InputTypeBadge from './InputTypeBadge';

interface LapTimePopupProps {
  lap: LapTime;
}

const LapTimePopup: React.FC<LapTimePopupProps> = ({ lap }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Lap Details</h2>
      {lap.screenshotUrl && (
        <img
          src={getImageUrl(lap.screenshotUrl)}
          alt="Lap screenshot"
          className="w-full rounded"
        />
      )}
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="font-medium pr-2">Driver:</td>
            <td>{lap.username}</td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Game:</td>
            <td>{lap.gameName}</td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Track:</td>
            <td>
              {lap.trackName}
              {lap.layoutName ? ` - ${lap.layoutName}` : ''}
            </td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Car:</td>
            <td>{lap.carName}</td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Input:</td>
            <td>
              <InputTypeBadge inputType={lap.inputType} />
            </td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Time:</td>
            <td>{formatTime(lap.timeMs)}</td>
          </tr>
          <tr>
            <td className="font-medium pr-2">Date:</td>
            <td>{new Date(lap.lapDate).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>
      <AssistTags assists={lap.assists} />
      {lap.notes && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Comments</h3>
          <p className="text-sm whitespace-pre-line">{lap.notes}</p>
        </div>
      )}
    </div>
  );
};

export default LapTimePopup;

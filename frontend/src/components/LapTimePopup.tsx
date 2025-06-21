import React from 'react';
import { LapTime } from '../types';
import { formatTime } from '../utils/time';
import { getImageUrl } from '../utils';
import AssistTags from './AssistTags';
import InputTypeBadge from './InputTypeBadge';
import MarkdownRenderer from './MarkdownRenderer';

interface LapTimePopupProps {
  lap: LapTime;
}

const LapTimePopup: React.FC<LapTimePopupProps> = ({ lap }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Lap Details</h2>

      {lap.screenshotUrl ? (
        <img
          src={getImageUrl(lap.screenshotUrl)}
          alt="Lap screenshot"
          className="w-full rounded"
        />
      ) : (
        <div className="w-full h-40 flex items-center justify-center rounded bg-muted">
          <span className="text-sm text-muted-foreground">No screenshot</span>
        </div>
      )}

      <div className="text-center space-y-2">
        <span className="text-4xl font-bold">{formatTime(lap.timeMs)}</span>
        <AssistTags assists={lap.assists} />
      </div>

      <div className="flex justify-center flex-wrap gap-4 text-sm">
        {lap.avatarUrl && (
          <img
            src={getImageUrl(lap.avatarUrl)}
            alt={lap.username || ''}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        {lap.gameImageUrl && (
          <img
            src={getImageUrl(lap.gameImageUrl)}
            alt={lap.gameName || ''}
            className="h-12 w-20 object-cover rounded"
          />
        )}
        {lap.trackImageUrl && (
          <img
            src={getImageUrl(lap.trackImageUrl)}
            alt={lap.trackName || ''}
            className="h-12 w-20 object-cover rounded"
          />
        )}
        {lap.layoutImageUrl && (
          <img
            src={getImageUrl(lap.layoutImageUrl)}
            alt={lap.layoutName || ''}
            className="h-12 w-20 object-cover rounded"
          />
        )}
      </div>

      <div className="flex flex-col items-center space-y-1">
        {lap.carImageUrl && (
          <img
            src={getImageUrl(lap.carImageUrl)}
            alt={lap.carName || ''}
            className="h-20 object-cover rounded"
          />
        )}
        <span className="font-medium">{lap.carName}</span>
        <InputTypeBadge inputType={lap.inputType} />
      </div>

      <table className="w-full text-sm mt-2">
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
            <td className="font-medium pr-2">Date:</td>
            <td>{new Date(lap.lapDate).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      {lap.notes && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Comments</h3>
          <MarkdownRenderer content={lap.notes} className="text-sm" />
        </div>
      )}
    </div>
  );
};

export default LapTimePopup;

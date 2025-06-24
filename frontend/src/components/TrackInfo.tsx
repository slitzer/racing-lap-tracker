import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { slugify } from '../utils';

interface TrackInfoProps {
  game: string;
  track: string;
  className?: string;
  fallback?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ game, track, className, fallback }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const path = `/GamePack/${game}/tracks/${slugify(track)}/info.md`;
    fetch(path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setContent(text))
      .catch(() => setContent(null));
  }, [game, track]);

  if (content === null) {
    return fallback ? <p className={className}>{fallback}</p> : null;
  }

  return <MarkdownRenderer content={content} className={className} />;
};

export default TrackInfo;

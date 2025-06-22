import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { slugify } from '../utils';

interface GameInfoProps {
  game: string;
  className?: string;
  fallback?: string;
}

const GameInfo: React.FC<GameInfoProps> = ({ game, className, fallback }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const path = `/GamePack/${slugify(game)}/info.md`;
    fetch(path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setContent(text))
      .catch(() => setContent(null));
  }, [game]);

  if (content === null) {
    return fallback ? <p className={className}>{fallback}</p> : null;
  }

  return <MarkdownRenderer content={content} className={className} />;
};

export default GameInfo;

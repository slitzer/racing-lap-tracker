import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { slugify } from '../utils';

interface CarInfoProps {
  game: string;
  car: string;
  className?: string;
  fallback?: string;
}

const CarInfo: React.FC<CarInfoProps> = ({ game, car, className, fallback }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const path = `/GamePack/${game}/cars/${slugify(car)}/info.md`;
    fetch(path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setContent(text))
      .catch(() => setContent(null));
  }, [game, car]);

  if (content === null) {
    return fallback ? <p className={className}>{fallback}</p> : null;
  }

  return <MarkdownRenderer content={content} className={className} />;
};

export default CarInfo;

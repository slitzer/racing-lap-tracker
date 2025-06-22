import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  path: string;
}

const InfoPage: React.FC<Props> = ({ path }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch(() => setMarkdown(''));
  }, [path]);

  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};

export default InfoPage;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className }) => (
  <ReactMarkdown
    className={`prose prose-sm max-w-none ${className || ''}`.trim()}
    remarkPlugins={[remarkGfm]}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;

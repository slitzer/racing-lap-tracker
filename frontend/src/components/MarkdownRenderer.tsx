import React from 'react';

interface Props {
  content: string;
  className?: string;
}

function renderMarkdown(text: string) {
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\n/g, '<br/>');
  return { __html: html };
}

const MarkdownRenderer: React.FC<Props> = ({ content, className }) => (
  <div
    className={`prose prose-sm max-w-none ${className || ''}`.trim()}
    dangerouslySetInnerHTML={renderMarkdown(content)}
  />
);

export default MarkdownRenderer;

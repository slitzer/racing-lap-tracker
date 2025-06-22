module.exports = function ReactMarkdown({children, ...rest}) {
  return require('react').createElement('div', rest, children);
};

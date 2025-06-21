const axios = require('axios');

async function fetchWikipediaInfo(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'RacingLapTracker/1.0 (https://github.com/yourproject)' },
    maxRedirects: 5,
    timeout: 10000
  });
  return {
    title: data.title,
    description: data.extract,
    imageUrl: data.thumbnail ? data.thumbnail.source : null
  };
}

async function main() {
  const terms = process.argv.slice(2);
  if (terms.length === 0) {
    console.error('Usage: node scrapeInfo.js <title1> [title2 ...]');
    process.exit(1);
  }
  const results = [];
  for (const term of terms) {
    try {
      const info = await fetchWikipediaInfo(term);
      results.push(info);
    } catch (err) {
      console.error(`Error fetching ${term}:`, err.message);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { fetchWikipediaInfo };

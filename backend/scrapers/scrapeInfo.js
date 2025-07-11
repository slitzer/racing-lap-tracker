const axios = require('axios');

async function fetchWikipediaInfo(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
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
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Fallback to search API when exact page is missing
      try {
        const searchUrl =
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&format=json&srlimit=1`;
        const { data: searchData } = await axios.get(searchUrl, {
          headers: { 'User-Agent': 'RacingLapTracker/1.0 (https://github.com/yourproject)' },
          timeout: 10000,
        });
        const results = searchData?.query?.search;
        if (Array.isArray(results) && results.length > 0) {
          return fetchWikipediaInfo(results[0].title);
        }
      } catch {
        // ignore search errors and fall back to 404 handling
      }
      const error = new Error('Wikipedia page not found');
      error.status = 404;
      throw error;
    }
    if (err.response) {
      const status = err.response.status;
      const error = new Error('Failed to fetch Wikipedia info');
      error.status = status;
      throw error;
    }
    throw err;
  }
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

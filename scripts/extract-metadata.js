import fs from 'fs';

const LINKS = [
  // Add your article URLs here
  'https://www.cnbc.com/2025/06/10/paramount-to-cut-3percent-of-us-workforce-as-it-deepens-cost-cutting.html',
  'https://www.techradar.com/computing/artificial-intelligence/this-is-what-really-happened-with-siri-and-apple-intelligence-according-to-apple',
  'https://www.politico.com/news/2025/06/10/troops-deployed-to-la-will-cost-134m-pentagon-official-says-00396632',
  'https://www.hollywoodreporter.com/business/business-news/terry-moran-out-abc-news-1236261876/',
  'https://www.hollywoodreporter.com/business/business-news/disney-wont-sell-abc-espn-bob-iger-linear-tv-1236261289/',
  'https://blog.youtube/news-and-events/2024-us-youtube-impact-report/'
];

async function fetchMetadata(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
    
    // Extract description
    const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                      html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract image
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const image = imageMatch ? imageMatch[1] : '';
    
    // Extract site name
    const siteMatch = html.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i);
    const siteName = siteMatch ? siteMatch[1] : new URL(url).hostname;
    
    return {
      url,
      title: title.substring(0, 100),
      description: description.substring(0, 200),
      image,
      siteName
    };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return {
      url,
      title: 'Article',
      description: '',
      image: '',
      siteName: new URL(url).hostname
    };
  }
}

async function extractAllMetadata() {
  console.log('Extracting metadata from URLs...');
  const metadata = [];
  
  for (const url of LINKS) {
    console.log(`Fetching: ${url}`);
    const data = await fetchMetadata(url);
    metadata.push(data);
  }
  
  // Write to JSON file
  fs.writeFileSync(
    './src/articles.json',
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('Metadata extracted and saved to src/articles.json');
}

extractAllMetadata();

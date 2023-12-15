
import * as fs from 'fs'
import Papa from 'papaparse'
import { Teaching, TeachingFeed } from '../types'

function generateRss(teachings: Teaching[]): string {
  let rssItems = '';
  teachings.forEach(teaching => {

    if (!teaching.media?.source) {
      return
    }

    if (!teaching.date || !teaching.media.source.file) {
      console.warn('Skipping', teaching)
      return
    }

    rssItems += `
    <item>
      <title>${teaching.title || 'Untitled Teaching'}</title>
      <link>${teaching.media.link}</link>
      <description>${teaching.title}</description> 
      <guid isPermaLink="false">${teaching.media.source.file}</guid>
      <pubDate>${new Date(teaching.date).toUTCString()}</pubDate>
      <description>${teaching.passage || 'Bible Passage'} - ${teaching.event || 'Event'}</description>
      <enclosure url="${teaching.media.source.file}" type="${teaching.media.source.type}"/>
      <itunes:author>Jon Courson</itunes:author>
      <itunes:explicit>no</itunes:explicit>
      <itunes:duration>${teaching.media.duration}</itunes:duration>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
   <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
   <channel>
     <title>SearchLight with Jon Courson</title>
     <link>https://www.joncourson.com</link>
     <description>Thru-The-Bible teachings by Jon Courson</description>
     <language>en-us</language>
  ${rssItems}
   </channel>
   </rss>`;
}

// function loadTeachingsFromCSV(csvPath: string): Teaching[] {
//   const csv = fs.readFileSync(csvPath, 'utf8')
//   const parsed = Papa.parse(csv, { header: true }).data
//   return parsed as Teaching[]
// }

function main() {
  const book = 'genesis'
  const feed = JSON.parse(fs.readFileSync(`data/${book}.json`, 'utf8')) as TeachingFeed;
  const rss = generateRss(feed.teachings);
  fs.writeFileSync(`data/${book}.xml`, rss);
}

main()

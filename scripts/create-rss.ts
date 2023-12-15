
import * as fs from 'fs'
import Papa from 'papaparse'
import { Teaching } from './types'

function generatePodcastRSS(teachings: Teaching[]): string {
   const rssStart = `<?xml version="1.0" encoding="UTF-8"?>
 <rss version="2.0">
   <channel>
     <title>SearchLight with Jon Courson</title>
     <link>https://www.joncourson.com</link>
     <description>Thru-The-Bible teachings by Jon Courson</description>
     <language>en-us</language>`;

   let rssItems = '';

   teachings.forEach(teaching => {
      if (!teaching.date || !teaching.mediaURL)  {
         console.warn('Skipping', teaching)
         return
      }

      rssItems += `
       <item>
         <title>${teaching.title || 'Untitled Teaching'}</title>
         <link>${teaching.mediaURL}</link>
         <guid>${teaching.mediaURL}</guid>
         <pubDate>${new Date(teaching.date).toUTCString()}</pubDate>
         <description>${teaching.passage || 'Bible Passage'} - ${teaching.event || 'Event'}</description>
         <enclosure url="${teaching.mediaURL}" type="application/vnd.apple.mpegurl"/>
       </item>`;
   });

   const rssEnd = `
   </channel>
 </rss>`;

   return rssStart + rssItems + rssEnd;
}

function loadTeachingsFromCSV(csvPath: string): Teaching[] {
   const csv = fs.readFileSync(csvPath, 'utf8')
   const parsed = Papa.parse(csv, { header: true }).data
   return parsed as Teaching[]
}

function main() {
   const teachings = loadTeachingsFromCSV('data/genesis.csv');
   const rss = generatePodcastRSS(teachings);
   fs.writeFileSync('data/genesis.xml', rss);
}

main()

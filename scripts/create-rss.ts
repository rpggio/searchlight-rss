
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

function generatePodcastRSS2(teachings: Teaching[]): string {
   let itemsXML = teachings.map(teaching => `
     <item>
       <title>${teaching.title}</title>
       <link>${teaching.mediaURL}</link>
       <pubDate>${new Date(teaching.date).toUTCString()}</pubDate>
       <enclosure url="${teaching.mediaURL}" type="${teaching.mediaURL}"/>
       <guid isPermaLink="false">searchlight-${teaching.teachingNumber}</guid>
       <itunes:author>Jon Courson</itunes:author>
       <itunes:explicit>no</itunes:explicit>
     </item>`).join('');
     //<description>${teaching.title}</description> 
 //<itunes:duration>${teaching.itunesDuration}</itunes:duration>

   const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
 <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
 <channel>
   <title>SearchLight with Jon Courson</title>
   <link>https://www.joncourson.com</link>
   <description>Thru-The-Bible teachings by Jon Courson</description>
   <language>en-us</language>
${itemsXML}
 </channel>
 </rss>`;
 
   return rssXML;
 }


function loadTeachingsFromCSV(csvPath: string): Teaching[] {
   const csv = fs.readFileSync(csvPath, 'utf8')
   const parsed = Papa.parse(csv, { header: true }).data
   return parsed as Teaching[]
}

function main() {
   const teachings = loadTeachingsFromCSV('data/genesis.csv');
   const rss = generatePodcastRSS2(teachings);
   fs.writeFileSync('data/genesis.xml', rss);
}

main()

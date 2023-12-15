
import { Teaching } from './types';
import * as fs from 'fs';

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
      rssItems += `
       <item>
         <title>${teaching.title || 'Untitled Teaching'}</title>
         <link>${teaching.mediaURL}</link>
         <guid>${teaching.mediaURL}</guid>
         <pubDate>${new Date(teaching.date).toUTCString()}</pubDate>
         <description>${teaching.passage || 'Bible Passage'} - ${teaching.event || 'Event'}</description>
         <enclosure url="${teaching.mediaURL}" type="audio/mpeg"/>
       </item>`;
   });

   const rssEnd = `
   </channel>
 </rss>`;

   return rssStart + rssItems + rssEnd;
}

function loadTeachingsFromCSV(csvPath: string): Teaching[] {
   const teachingRows: string[] = fs.readFileSync('data/genesis.csv', 'utf8').split('\n')
   return teachingRows.slice(1).map(line => {
      const [date, title, passage, event, teachingNumber, mediaURL] = line.split(',');
      return {
         date,
         title,
         passage,
         event,
         teachingNumber,
         mediaURL
      };
   });
}

function main() {
   const teachings = loadTeachingsFromCSV('data/genesis.csv');
   const rss = generatePodcastRSS(teachings);
   fs.writeFileSync('data/genesis.xml', rss);
   // console.log(rss)
}

main()

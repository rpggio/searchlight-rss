
import * as fs from 'fs';
import { TeachingFeed } from '../types';

function generateRss(feed: TeachingFeed): string {
  let rssItems = '';

  feed.teachings.forEach(teaching => {

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
        <guid isPermaLink="false">joncourson-searchlight-${teaching.teachingNumber}</guid>
        <pubDate>${new Date(teaching.date).toUTCString()}</pubDate>
        <description>${teaching.passage || 'Bible Passage'} - ${teaching.event || 'Event'}</description>
        <enclosure url="${teaching.media.source.file}" length="${teaching.media.source.filesize}" type="${teaching.media.source.type}"/>
        <itunes:author>Jon Courson</itunes:author>
        <itunes:explicit>false</itunes:explicit>
        <itunes:duration>${teaching.media.duration}</itunes:duration>
      </item>`;
  });

  const teachingSlug = feed.title.toLowerCase().replace(/ /g, '-');
  const teachingLink = `https://www.joncourson.com/teachings/${teachingSlug}`
  const feedTitle = `${feed.title} with Jon Courson`
  const lastTeaching = feed.teachings[feed.teachings.length - 1]
  const pubDate = lastTeaching ? new Date(lastTeaching.date).toUTCString() : null

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
   <channel>
    <title>${feedTitle}</title>
    <link>${teachingLink}</link>
    <description>Thru-The-Bible teachings by Jon Courson</description>
    <language>en-us</language>
    <copyright>Copyright 2023 Searchlight</copyright>
    <pubDate>${pubDate}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <title>${feedTitle}</title>
      <url>https://slpodcast.blob.core.windows.net/podcast/podcastimage144.jpg</url>
      <link>${teachingLink}</link>
    </image>
    <itunes:author>Jon Courson</itunes:author>
    <itunes:type>serial</itunes:type>
    <itunes:image href="https://slpodcast.blob.core.windows.net/podcast/podcastimage.jpg"/>
    <itunes:category text="Religion &amp;Spirituality">
      <itunes:category text="Christianity"/>
    </itunes:category>
    <itunes:owner>
      <itunes:name>Searchlight</itunes:name>
      <itunes:email>podcast@joncourson.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>false</itunes:explicit>
    <itunes:keywords>courson, jon, jon courson, searchlight,jesus, bible, christian, christianity</itunes:keywords>
${rssItems}
  </channel>
  </rss>`;
}

// <atom:link href="" rel="self" type="application/rss+xml"/>

function main() {
  const book = 'genesis'
  const feed = JSON.parse(fs.readFileSync(`data/${book}.json`, 'utf8')) as TeachingFeed;
  const rss = generateRss(feed);
  fs.writeFileSync(`data/${book}.xml`, rss);
}

main()

import * as fs from 'fs'
import { bibleBooks } from "./lib/bible";
import { Teaching, TeachingFeed } from './types';

export function loadFeed(book: string) {
   const slug = fileNameSlug(book)
   return JSON.parse(fs.readFileSync(`docs/${slug}.json`, 'utf8')) as TeachingFeed;
}

export function * allFeeds() {
   for (const book of bibleBooks) {
      yield loadFeed(book)
   }
}

export function * allTeachings(): Iterable<Teaching & { book: string }> {
   for (const feed of allFeeds()) {
      for (const teaching of feed.teachings) {
         yield { 
            ...teaching,
            book: feed.title,
         }
      }
   }
}

export function * earlySeriesTeachings() {
   for (const feed of allFeeds()) {
      feed.teachings = feed.teachings.filter(t =>
         t.series === 'Thru-The-Bible Studies'
         || (t.series === 'Miscellaneous Bible Studies' && new Date(t.date) < new Date('2004-12-31'))
      )
      yield feed
   }
}

export function fileNameSlug(book: string) {
   return book.toLowerCase().replace(/ /g, '-')
}
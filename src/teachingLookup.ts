import * as fs from 'fs'
import { BookRange, bibleBooks, bookRanges } from "./lib/bible";
import { Teaching, TeachingFeed } from './types';

export function loadFeed(book: string) {
   const slug = bookFileNameSlug(book)
   const feed = JSON.parse(fs.readFileSync(`docs/feed/${slug}.json`, 'utf8')) as TeachingFeed;
   sortByDate(feed.teachings)
   return feed
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

export function isEarlySeries(teaching: Teaching) {
   return teaching.series === 'Thru-The-Bible Studies'
   // || (teaching.series === 'Miscellaneous Bible Studies' && new Date(teaching.date) < new Date('2004-12-31'))
}

export function * earlySeriesTeachings() {
   for (const feed of allFeeds()) {
      feed.teachings = feed.teachings.filter(isEarlySeries)
      yield feed
   }
}

export function * groupedBookFeeds() {
   for(const range of bookRanges){
      const fromIdx = bibleBooks.indexOf(range.from)
      const toIdx = bibleBooks.indexOf(range.to)

      if (fromIdx === -1 || toIdx === -1 || fromIdx > toIdx) {
         throw new Error(`Invalid range: ${range.from} ${range.to}`)
      }

      const teachings: Teaching[] = []
      for (const book of bibleBooks.slice(fromIdx, toIdx + 1)) {
         teachings.push(...loadFeed(book).teachings.filter(isEarlySeries))
      }

      sortByDate(teachings)

      yield {
         title: `${range.from} - ${range.to}`,
         teachings
      } satisfies TeachingFeed
   }
}

export function sortByDate(teachings: Teaching[]) {
   return teachings.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
   })

}

export function bookRangeFileNameSlug(range: BookRange) {
   return `${bookFileNameSlug(range.from)}-${bookFileNameSlug(range.to)}`
}

export function bookFileNameSlug(book: string) {
   return book.toLowerCase().replace(/ /g, '')
}
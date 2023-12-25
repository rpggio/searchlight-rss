import * as fs from 'fs'
import { Teaching, TeachingFeed } from './types';
import { BibleBook, bibleBooks } from './lib/bible';

export type BookRange = { from: BibleBook, to: BibleBook }

export const bookRanges: BookRange[] = [
   { "from": "Genesis", "to": "Leviticus" },
   { "from": "Numbers", "to": "1 Samuel" },
   { "from": "2 Samuel", "to": "Song of Solomon" },
   { "from": "Isaiah", "to": "Malachi" },
   { "from": "Matthew", "to": "John" },
   { "from": "Acts", "to": "Galatians" },
   { "from": "Ephesians", "to": "Revelation" }
]

export function loadFeed(book: string) {
   const slug = bookFileNameSlug(book)
   const feed = JSON.parse(fs.readFileSync(`docs/feed/${slug}.json`, 'utf8')) as Omit<TeachingFeed, 'books'>;
   sortByDate(feed.teachings)
   return {
      ...feed,
      books: [book],
   } satisfies TeachingFeed
}

export function* allFeeds() {
   for (const book of bibleBooks) {
      yield loadFeed(book)
   }
}

export function* allTeachings(): Iterable<Teaching & { book: string }> {
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

export function* earlySeriesTeachings() {
   for (const feed of allFeeds()) {
      feed.teachings = feed.teachings.filter(isEarlySeries)
      yield feed
   }
}

export function* groupedBookFeeds(filter: (teaching: Teaching) => boolean) {
   for (const range of bookRanges) {
      const fromIdx = bibleBooks.indexOf(range.from)
      const toIdx = bibleBooks.indexOf(range.to)

      if (fromIdx === -1 || toIdx === -1 || fromIdx > toIdx) {
         throw new Error(`Invalid range: ${range.from} ${range.to}`)
      }

      const teachings: Teaching[] = []
      const books = bibleBooks.slice(fromIdx, toIdx + 1)
      for (const book of books) {
         teachings.push(...loadFeed(book).teachings.filter(filter))
      }

      sortByDate(teachings)

      yield {
         title: `${range.from} - ${range.to}`,
         books,
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
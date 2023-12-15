import axios from 'axios'
import * as fs from 'fs'
import { JSDOM } from 'jsdom'
import Papa from 'papaparse'
import { Teaching, TeachingFeed, TeachingMedia } from '../types'
import ky from 'ky'
import { MediaItemPlaylistSource, getMediaItem } from '../lib/jwPlayerApi/getMediaItem'

interface TeachingParseRow {
   date: string
   title?: string
   passage?: string
   event?: string
   teachingNumber: string
}

interface DescriptionComponents {
   title?: string
   passage?: string
   event?: string
}

interface BookData {
   book: string
   bookURL: string
   studies: TeachingParseRow[]
}

interface BibleBook {
   name: string
   url: string
}

async function downloadPage(url: string) {
   return (await axios.get(url)).data
}

function extractTeachings(html: string) {
   const document = new JSDOM(html).window.document
   const tables = document.querySelectorAll('.table.table-striped')
   let targetTable: HTMLTableElement | undefined

   for (const table of tables) {
      const header = table.querySelector('th')
      if (header && header.textContent?.includes('Thru-The-Bible Studies')) {
         targetTable = table as HTMLTableElement
         break
      }
   }

   if (!targetTable) return []

   const rows = targetTable.querySelectorAll('tbody tr')
   const data: TeachingParseRow[] = []

   rows.forEach(row => {
      const cells = row.querySelectorAll('td')
      if (cells.length >= 4) {
         const date = cells[0].textContent?.trim()
         const descriptionHTML = cells[1].innerHTML.trim()
         const playLink = cells[3].querySelector('a')?.getAttribute('href')
         const teachingNumber = playLink?.split('/').pop()

         if (date && descriptionHTML && teachingNumber) {
            const { title, passage, event } = parseDescription(descriptionHTML)

            const finalTitle = title ? `${title} - ${passage}` : passage

            data.push({
               date,
               title: finalTitle,
               passage,
               event,
               teachingNumber
            })
         }
      }
   })

   return data
}


function parseDescription(description: string): DescriptionComponents {
   const dom = new JSDOM(`<body>${description}</body>`)
   const body = dom.window.document.body
   const parts = Array.from(body.childNodes).filter(node => node.textContent?.trim() !== '')

   let title, passage, event

   if (parts.length === 3) {
      // If there are three parts, assume title is included
      title = parts[0].textContent?.trim()
      passage = parts[1].textContent?.trim()
      event = parts[2].textContent?.trim()
   } else {
      // If there are only two parts, assume title is missing
      passage = parts[0].textContent?.trim()
      event = parts[1].textContent?.trim()
   }

   return {
      title,
      passage,
      event
   }
}

function extractMediaId(text: string): string | null {
   const regex = /https:\/\/content\.jwplatform\.com\/manifests\/(.*?)\.m3u8/
   const match = text.match(regex)
   return match ? match[1] : null
}

async function getBookList(html: string) {
   const dom = new JSDOM(html)
   const document = dom.window.document
   const bibleBooks: BibleBook[] = []
   const links = document.querySelectorAll('a.toctext')

   links.forEach(link => {
      const name = link.textContent?.trim()
      const url = link.getAttribute('href')
      if (name && url) {
         bibleBooks.push({ name, url: `https://www.joncourson.com${url}` })
      }
   })

   return bibleBooks
}

async function getTeachingMedia(mediaId: string) {
   const media = await getMediaItem(mediaId)
   const playItem = media?.playlist[0]

   if (!playItem) return null


   return {
      // teachingId: playItem.title,
      link: playItem.link,
      duration: playItem.duration,
      pubdate: playItem.pubdate,
      source: playItem.sources.find(source => source.label.includes('Audio'))
   } satisfies TeachingMedia
}

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
   const startUrl = 'https://www.joncourson.com/teachings/genesis'
   const startContent = await downloadPage(startUrl)
   const books = getBookList(startContent)

   const teachings: Teaching[] = (await extractTeachings(startContent)).slice(5, 10)


   for (const teaching of teachings) {
      const audioPage = `https://www.joncourson.com/playteaching/${teaching.teachingNumber}/teachingaudio`
      const audioPageContent = await downloadPage(audioPage)
      const mediaId = extractMediaId(audioPageContent)
      if (!mediaId) {
         console.warn('No media id found for', teaching)
         continue
      }

      const details = await getTeachingMedia(mediaId)
      if (details) {
      teaching.media = details
      }

      await sleep(500)
   }

   const book = 'Genesis'

   const feed: TeachingFeed = {
      title: book,
      teachings
   }

   const json = JSON.stringify(feed, null, 3)
   fs.writeFileSync(`data/${book.toLowerCase().replace(' ', '')}.json`, json)
}


main()

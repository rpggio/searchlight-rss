import axios from 'axios'
import * as fs from 'fs'
import { JSDOM } from 'jsdom'
import Papa from 'papaparse'
import { Teaching } from './types'

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

function extractMediaFileURL(text: string): string | null {
   const regex = /https:\/\/content\.jwplatform\.com\/.*?\.m3u8/
   const match = text.match(regex)
   return match ? match[0] : null
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

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
   const startUrl = 'https://www.joncourson.com/teachings/genesis'
   const startContent = await downloadPage(startUrl)
   const books = getBookList(startContent)

   const teachings: Teaching[] = (await extractTeachings(startContent)).slice(0, 5)
   for (const teaching of teachings) {
      const audioPage = `https://www.joncourson.com/playteaching/${teaching.teachingNumber}/teachingaudio`
      const audioPageContent = await downloadPage(audioPage)
      const mediaFileURL = extractMediaFileURL(audioPageContent)
      teaching.mediaURL = mediaFileURL || undefined

      await sleep(500)
   }

   const csv = Papa.unparse(teachings)
   fs.writeFileSync('data/genesis.csv', csv)
   // console.log(csv)

}


main()

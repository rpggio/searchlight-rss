import * as fs from 'fs';
import { bibleBooks, fileNameSlug } from "../lib/bible"

function main() {

   const bookLinks = bibleBooks.map(book => {
      const slug = fileNameSlug(book)
      const feedFile = `${slug}.xml`
      const feedUrl = `podcast://rpggio.github.io/searchlight-rss/${feedFile}`
      return `       <a href="${feedUrl}"><div class="book"><span>${book}</span></div></a>`
   })

   const html = `<html><head>
      <style>
      .books {
         display: flex;
         flex-wrap: wrap;
         gap: 1em;
         
      }
      .book {
         display: flex;
         height: 6em;
         width: 6em;
         text-decoration: none;
         background-color: #eee;
         padding: 1em;
         text-align: center;
      }
      .book * {
         display: block;
         text-decoration: none;
         color: #333;
         margin: auto;
      }
      </style>
   </head>
   <body>
      <h1>Searchlight Thru-the-Bible Podcast Feeds</h1>
      <div class="books">
${bookLinks.join('\n')}
      </div>
   </body>
   </html>`

   fs.writeFileSync('docs/index.html', html)
}

main()
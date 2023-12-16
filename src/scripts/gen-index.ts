import * as fs from 'fs';
import { bibleBooks, fileNameSlug } from "../lib/bible"

function main() {

   const bookLinks = bibleBooks.map(book => {
      const slug = fileNameSlug(book)
      const feedFile = `${slug}.xml`
      const basePath = 'rpggio.github.io/searchlight-rss'
      return `       
      <tr>
      <td>${book}</td><td>    
      <td><a href="${`pcast://${basePath}/${feedFile}`}"><button>Subscribe: pcast</button></a></td>
      <td><a href="${feedFile}"><button>Subscribe: http</button></a></td>
      </tr>
      `.trim()
   })

   const html = `<html><head>
      <style>
      .books {
         display: flex;
         flex-wrap: wrap;
         gap: 1em;
      }
      a {
         text-decoration: none;
      }
      .book {
         display: flex;
         height: 6em;
         width: 6em;
         text-decoration: none;
         background-color: #eee;
         color: #333;
         padding: 0.5em;
         text-align: center;
         font-size: 2.5em;
      }
      .book * {
         display: block;
         text-decoration: none;
         color: #333;
         margin: auto;
      }

      button {
         cursor: pointer;
         outline: none;
           &.outline {
               position: relative;
               z-index: 3;
               background: transparent;
               color: #1172c4;
               font-size: 14px;
               border-color: #1172c4;
               border-style: solid;
               border-width: 2px;
               border-radius: 4px;
               padding: 10px 40px;
               text-transform: uppercase;
               transition: all 0.2s linear;
               a {
                   text-decoration: none;
               }
           }
           &.outline:hover {
               color: white;
               background: #1172c4;
               border-color: white;
               transition: all 0.2s linear;
           }
           &.outline:active {
               border-radius: 22px;
           }
           &.white-blue {
               font-weight: 700;
               color: #00aeef;
               border-color: white;
               background: white;
           }
           &.white-blue:hover {
               color: white;
               background: #00aeef;
               border-color: white;
           }
       }

      </style>
   </head>
   <body>
      <h1>Searchlight Thru-the-Bible Podcast Feeds</h1>
      <p>If clicking a link doesn't open your podcast app, copy the link and 'subscribe to URL' in your podcast app.</p>
      <div class="books">
${bookLinks.join('\n')}
      </div>
   </body>
   </html>`

   fs.writeFileSync('docs/index.html', html)
}

main()
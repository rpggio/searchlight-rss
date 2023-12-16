import { bibleBooks } from "./lib/bible";
import { fileNameSlug } from "./teachingLookup";

export function renderIndex() {
   const bookLinks = bibleBooks.map(book => {
      const slug = fileNameSlug(book)
      const feedFile = `${slug}.xml`
      const basePath = 'rpggio.github.io/searchlight-rss'
      return `       
      <tr>
      <td>${book}</td><td>    
      <td><a class="button" href="${`pcast://${basePath}/${feedFile}`}">Podcast link</a></td>
      <td><a class="button" href="${feedFile}">URL link</a></td>
      </tr>
      `.trim()
   })

   return `<html><head>
      <style>
      .footer {
         position: fixed;
         bottom: 0;
         right: 0;
      }
      td {
         padding: 0.5em;
      }
      a {
         color: #1800cd
      }
      body {
         line-height: 1.5;
      }

      .button {
         display: block;
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
      <p>Studies from Mar 1985 to Mar 2003.</p>
      <h2>Instructions</h2>
      <p>
      Try clicking 'Podcast link' to see if it opens your podcast player. 
      <br>
      Otherwise, right-click to copy the link and add the URL to your podcast player.
      <br>
      <a target="_blank" href="https://www.thepitch.show/blog/how-to-manually-add-an-rss-feed-to-your-podcast-app-on-desktop-ios-android/">How to manually add RSS feed to your podcast player.</a>
      </p>
      <div class="books">
       <table>
${bookLinks.join('\n')}
       </table>
      </div>

      <div class="footer">All content copyright Searchlight 2023</div>
   </body>
   </html>`
}
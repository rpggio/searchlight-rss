import { bibleBooks } from "./lib/bible";
import { fileNameSlug } from "./teachingLookup";

export function renderIndex() {
   const bookLinks = bibleBooks.map(book => {
      const slug = fileNameSlug(book)
      const feedFile = `${slug}.xml`

      const basePath = 'rpggio.github.io/searchlight-rss'
      const pcastLink = `pcast://${basePath}/${feedFile}`
      const rssLink = `https://${basePath}/${feedFile}`

      return `       
      <tr>
      <td>${book}</td><td>    
      <td class="feed-link">
         <div class="hstack">
         <a class="button" href="${pcastLink}">Podcast link</a>
         <sl-copy-button value="${pcastLink}"></sl-copy-button>
         </div>
      </td>
      <td class="feed-link">
         <div class="hstack">
         <a class="button" href="${rssLink}">RSS link</a>
         <sl-copy-button value="${rssLink}"></sl-copy-button>
         </div>
      </td>
      </tr>
      `.trim()
   })

   return `<html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace-autoloader.js"></script>

      <style>
      .feed-link {
         margin-left: 1em;
      }
      a {
         color: #1800cd
      }
      body {
         line-height: 1.5;
         background: #fffbf3;
      }
      .hstack { 
         display: flex;
         align-items: center;
      }
      sl-copy-button {
         font-size: 1.5em;
         padding: 0 0 0 6px;
      }
      .books {
         margin-bottom: 2em;
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
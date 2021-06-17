import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import UrlPattern from 'url-pattern'
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const iceCastUrl = encodeURI('https://play.global.audio/status.xsl?mount=/radio1rock.ogg')

// This selector only works for OGG streams
const currentSongUrl = `https://web.scraper.workers.dev/?url=${iceCastUrl}&selector=table+tr%3Anth-child%289%29+td.streamdata&scrape=text&pretty=true`

const DEBUG = false
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

addEventListener("scheduled", event => {
  event.waitUntil(handleScheduled(event))
})

async function handleScheduled(event) {
  await refreshCurrentSong()
  await new Promise(resolve => setTimeout(resolve, 20000));
  await refreshCurrentSong()
}

async function refreshCurrentSong() {
    let songNameRequest = await fetch(currentSongUrl)
    let content = await songNameRequest.json()
    let songName = Object.values(content.result)[0][0]

    // Query musicBrainz for song metadata
    let brainzHeaders = new Headers()
    brainzHeaders.append('User-Agent', 'cool now playing script/0.0.1 ( lrpena@miuandes.cl )')
    const brainzApiUrl = 'https://musicbrainz.org/ws/2/recording?limit=1&query=' + encodeURI(songName)
    let musicBrainzSearch = await fetch(brainzApiUrl, { headers: brainzHeaders })
    const musicMatch = await musicBrainzSearch.text()

    let releaseRegex = /release id="(?<id>[\da-z\-]*)"/gm
    let releaseId = releaseRegex.exec(musicMatch)[1]

    let idRegex = /recording id="(?<id>[\da-z\-]*)"/gm
    let { groups: { id } } = idRegex.exec(musicMatch)
    let bpmCount = null
    let albumImage = null

    if(releaseId) {
      try {
        // prepare covertArtQuery
        const covertArtUrl = `https://coverartarchive.org/release/${releaseId}`
        console.log(covertArtUrl)
        let covertArtSearch = await fetch(covertArtUrl, { headers: brainzHeaders })
        console.log(covertArtSearch.ok)
        let covertMatch = await covertArtSearch.json()
        albumImage = covertMatch.images[0].thumbnails.small
      } catch (e) {
        console.log('error getting covert art')
        console.log(e)
      }
    }

    // prepare query to AcousticBrainz API for BPM info
    if(id) {
      const brainzApiUrl = 'https://acousticbrainz.org/api/v1/' + id + '/low-level'
      try {
        let acousticBrainzSearch = await fetch(brainzApiUrl, { headers: brainzHeaders })
        let acousticMatch = await acousticBrainzSearch.json()
        bpmCount = Math.round(acousticMatch.rhythm.bpm)
      } catch (e) {}
    }
    const kvPush = await nowplaying.put('songData', JSON.stringify({songName: songName, brainzId: id, bpmCount: bpmCount, albumImage: albumImage }))

}

async function handleEvent(event) {
  let options = {}
  const init = {
    headers: {
      ...corsHeaders,
      "content-type": "application/json;charset=UTF-8",
    },
  }
  console.log(event.request.url)
  var apiPattern = new UrlPattern('*/api/current-song/:name')

  if ( apiPattern.match(event.request.url) ) {
    const songData = await nowplaying.get('songData')
    console.log(songData)
    return new Response(songData, init)
  }

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }

    const page = await getAssetFromKV(event, options)

    // allow headers to be altered
    const response = new Response(page.body, page)

    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    response.headers.set('Feature-Policy', 'none')

    return response

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}

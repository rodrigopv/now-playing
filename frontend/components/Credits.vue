<template>
  <div class="flex h-screen items-center relative">
    <div class="flex-1" />
    <div class="flex-1">
      <h1 class="title text-[5rem] text-right mr-14 leading-[4.5rem] mb-8">
        Cat vibes to your music
      </h1>
      <div class="ml-20 text-xl z-[-4]">
        <p class="mb-8">
          This vibing cat will try to match the rhythm of the music you hear 🔥
        </p>
        <p class="font-medium">
          How it works:
        </p>
        <ul class="list-disc mb-6 z-[-4]">
          <li>NuxtJS as front-end framework with static generation</li>
          <li>Cloudflare Workers + KV for deployment at edge</li>
          <li>Cloudflare Triggers for current song refresh and caching</li>
          <li>MusicBrainz API for music metadata</li>
          <li>AcousticBrainz API for BPM extraction</li>
          <li>WebM for vibing cat loop with alpha channel</li>
          <li>Video.js for stream play</li>
        </ul>
        <button
          class="z-5 bg-blue-500 cursor-pointer hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded select-none"
          @click="startJamming"
        >
          Let's Jam!
        </button>
      </div>
    </div>
    <div class="absolute right-5 bottom-5 flex flex-row items-center justify-center z-5">
      <span class="mr-2">Made by</span>
      <a href="https://github.com/rodrigopv" target="_blank" class="flex flex-row items-center">
        <img class="h-4" src="https://github.githubassets.com/favicons/favicon.svg">
        <span class="ml-1 font-medium">rodrigopv</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startJamming () {
      this.$root.$emit('startJamming')
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      window.setInterval(() => {
        this.$root.$emit('fetchSongData')
      }, 5000)
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-weight: 300;
  /* font-size: 70px; */
  color: #35495e;
  letter-spacing: 1px;
}

</style>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="font-sans font-semibold text-white text-2xl mb-4">
      Now Playing 🎧
    </h1>
    <div class="h-72 w-72 relative">
      <div class=" h-72 w-72 z-0 relative">
        <img v-if="albumImage" class="w-full object-contain" :src="albumImage">
      </div>
      <video-player
        ref="videoPlayer"
        class="vjs-custom-skin absolute top-0 z-2  h-72 w-72 "
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @ready="onPlayerReady($event)"
      />
    </div>

    <h2 class="text-xl">
      {{ songName }}
    </h2>
    <h3>{{ artist }}</h3>
    <h4>{{ bpmData }}</h4>
  </div>
</template>

<script>

export default {
  data () {
    return {
      currentSongData: null,
      playerOptions: {
        autoplay: true,
        aspectRatio: '1:1',
        preload: 'auto',
        height: '18rem',
        width: '18rem',
        fluid: false,
        liveui: true,
        controls: true,
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          fullscreenToggle: false,
          pictureInPictureToggle: false
        }
      }
    }
  },
  async fetch () {
    await this.getSongData()
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    songName () {
      if (this.currentSongData) {
        const greedySplit = this.currentSongData.songName.split(' - ')
        return greedySplit[1]
      }
      return ' '
    },
    artist () {
      if (this.currentSongData) {
        const greedySplit = this.currentSongData.songName.split(' - ')
        return greedySplit[0]
      }
      return ' '
    },
    bpmData () {
      if (this.currentSongData && this.currentSongData.bpmCount) {
        return this.currentSongData.bpmCount + ' BPM 🔥'
      }
      return 'no BPM data available 😥'
    },
    albumImage () {
      if (this.currentSongData && this.currentSongData.albumImage) {
        return this.currentSongData.albumImage
      }
      return null
    }
  },
  mounted () {
    const src = 'https://play.global.audio:80/radio1rock.ogg'
    this.$root.$on('startJamming', () => this.playVideo(src))
    this.$root.$on('fetchSongData', () => this.getSongData())
  },
  methods: {
    onPlayerPlay (player) {
    },
    onPlayerReady (player) {
      this.player.play()
    },
    playVideo (source) {
      const video = {
        withCredentials: false,
        type: 'audio/mpeg',
        src: source
      }
      this.player.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.player.src(video)
      // this.player.load()
      this.player.play()
    },
    async getSongData () {
      this.currentSongData = await this.$http.$get('/api/current-song/radio')
      if (this.currentSongData && this.currentSongData.bpmCount) {
        this.$emit('bpmChanged', this.currentSongData.bpmCount)
        console.log('got new BPMs')
      } else {
        this.$emit('bpmChanged', 118)
        console.log('np BPM available')
      }
    }
  }
}
</script>

<style scoped>
  .vjs-custom-skin /deep/ .video-js {
    background-color: transparent;
  }
</style>

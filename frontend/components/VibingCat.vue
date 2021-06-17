<template>
  <div>
    <video
      ref="cat"
      class="relative top-[-5px] z-1"
      loop
      height="720"
      width="1280"
      src="vibing.webm"
      :playbackRate="speed"
    />
    <p class="absolute bottom-4 left-4 z-4">
      Vibing at {{ bpm }} BPM.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    bpm: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
    }
  },
  computed: {
    cat () {
      return this.$refs.cat
    },
    speed () {
      if (this.bpm > 140) {
        return this.bpm / 118 / 2
      }
      return this.bpm / 118
    }
  },
  watch: {
    bpm (old, newValue) {
      this.cat.playbackRate = this.speed
      console.log('cat vibing correctly now...', this.speed)
    }
  },
  mounted () {
    this.$root.$on('startJamming', () => this.cat.play())
    this.cat.playbackRate = this.speed
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>

</style>

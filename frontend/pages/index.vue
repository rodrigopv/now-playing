<template>
  <div class="flex flex-row z-10 h-screen">
    <div class="flex-1" />
    <div class="items-center justify-center flex-1 flex flex-col">
      <div>
        <now-playing @bpmChanged="onBPMChanged" />
      </div>
    </div>
    <div class="fixed bottom-[-5px] overflow-hidden z-[-1]">
      <VibingCat :bpm="bpm" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bpm: 120
    }
  },

  computed: {
  },
  mounted () {
  },
  methods: {
    onBPMChanged (value) {
      console.log('received BPM change on page', value)
      this.bpm = value
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

</style>

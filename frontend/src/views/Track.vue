<template>
  <div>
    <div v-if="error">
      {{ error }}
    </div>
    <v-card v-if="lyrics">
      <div v-for="(p, i) in lyrics" :key="i">
        <div v-if="p.header" class="font-weight-black">{{ p.header }}</div>
        <div v-for="(l, m) in p.lines" :key="m">{{ l }}</div>
        <br/>
      </div>
    </v-card>
  </div>
</template>
<script>
import TrackService from '../api/track.js'

function processResponse(response) {
      var lyrics = response.data['lyrics']
      return { 'lyrics': lyrics }
}

export default {
    data() {
      return {
        error: null,
        artist: null,
        lyrics: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.error = null
        TrackService.getLyrics(this.$route.params.id).then((response) => {
          let resp = processResponse(response)
          this.lyrics = resp.lyrics
        })
      }
    }
}
</script>
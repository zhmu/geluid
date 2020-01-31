<template>
  <div>
    <div v-if="error">
      {{ error }}
    </div>
    <v-card v-if="album">
      <h1>{{ artist.name }} / {{ album.name }}</h1>
      <div v-for="disc in discs" :key="disc.discid">
        <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="track in disc.tracks"
                :key="track.trackid"
                :to="{path:'/track/'+track.trackid}" 
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon v-on:click.prevent="enqueue(track.trackid, artist.name, track.title)">mdi-playlist-plus</v-icon>
                    <v-icon v-if="track.lyrics">mdi-text-subject</v-icon>
                    {{ track.num }}. {{ track.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
        </v-list>
      </div>
    </v-card>
  </div>
</template>
<script>
import AlbumService from '../api/album.js'

function processResponse(response) {
      var album = response.data['album']
      var artist = response.data['artist']

      var discs = Object.values(album['discs'])
      discs.sort((a, b) => {
          if (a.volume != b.volume)
            return a.volume - b.volume
          if (a.title != b.title)
            return a.title - b.title
          return a.discid - b.discid
      })
      discs.forEach((a) => {
          a.tracks.sort((a, b) => {
            return a.num - b.num
          })               
      })
      return { 'album': album, 'artist': artist, 'discs': discs }
}

export default {
    data() {
      return {
        error: null,
        album: null,
        artist: null,
        discs: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.error = null
        AlbumService.get(this.$route.params.id).then((response) => {
          let resp = processResponse(response)
          this.artist = resp.artist
          this.album = resp.album
          this.discs = resp.discs
        })
      },
      enqueue(trackid, artist, title) {
        this.$store.commit('queueTrack', { trackid, artist, title })
      }
    }
}
</script>
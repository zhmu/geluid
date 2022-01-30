<template>
  <div>
    <div v-if="error">
      {{ error }}
    </div>
    <v-card v-if="artist">
    <h1>Artist {{ artist.name }}</h1>
    <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="album in albums"
            :key="album.id"
            :to="{path:'/album/'+album.albumid}" 
          >
            <v-list-item-content>
              <v-list-item-title><v-icon v-on:click.prevent="enqueue(album.albumid)">mdi-playlist-plus</v-icon><span v-if="album.paid">&euro; </span>{{ album.year }} - {{ album.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import ArtistService from '../api/artist.js'
import AlbumService from '../api/album.js'

function processResponse(response) {
      var albums = Object.values(response.data['albums'])
      var artist = response.data['artist']
      albums.sort((a, b) => {
          if (a.year != b.year)
              return a.year - b.year
          return a.name - b.name
      })

      albums.forEach((a) => {
          a.discs.sort((a, b) => {
            if (a.year != b.year)
              return a.year - b.year
            if (a.volume != b.volume)
              return a.volume - b.volume
            return a.discid - b.discid
          })               
      })                   
      return { 'albums': albums, 'artist': artist }
}

export default {
    data() {
      return {
        error: null,
        artist: null,
        albums: null
      }
    },
    created() {
      this.fetchData()
    },
    /*
    beforeRouterEnter(to, from, next) {
      ArtistService.get(to.params.id, (err, result) => {
        next(vm => vm.setData(err, result))
      })
    },
    beforeRouterUpdate(to, from, next) {
      ArtistService.get(to.params.id, (err, result) => {
        this.setData(err, result)
        next()
      })
    },
    */
    methods: {
      fetchData() {
        this.error = null
        ArtistService.get(this.$route.params.id).then((response) => {
          let resp = processResponse(response)
          this.artist = resp.artist
          this.albums = resp.albums
        })
      },
      enqueue(albumid) {
        AlbumService.get(albumid).then((response) => {
          let tracks = AlbumService.parseResponse(response);
          this.$store.commit('queueTracks', tracks)
        });
      }
      /*
      setData(err, response) {
        let resp = processResponse(response)
        this.artist = resp.artist
        this.albums = resp.albums
      }
      */
    }
}
</script>

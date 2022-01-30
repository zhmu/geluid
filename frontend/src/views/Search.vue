<template>
 <div>
    <v-card v-if="artists">
    <h1>Artists</h1>
      <v-list dense>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="artist in artists"
            :key="artist.artistid"
            :to="{path:'/artist/'+artist.artistid}"
          >
            <v-list-item-content>
              <v-list-item-title v-text="artist.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-card v-if="albums">
    <h1>Albums</h1>
    <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="album in albums"
            :key="album.id"
            :to="{path:'/album/'+album.albumid}"
          >
            <v-list-item-content>
              <v-list-item-title><v-icon v-on:click.prevent="enqueueAlbum(album.albumid)">mdi-playlist-plus</v-icon>[{{ album.year }}] {{album.artist}} / {{ album.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <h1>Tracks</h1>
    <v-card v-if="tracks">
        <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="track in tracks"
                :key="track.trackid"
                :to="{path:'/track/'+track.trackid}"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon v-on:click.prevent="enqueueTrack(track.trackid, track.artist, track.title)">mdi-playlist-plus</v-icon>
                    {{ track.artist }} / [{{track.year}}] {{track.album}} - {{ track.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>

 </div>
</template>
<script>
import SearchService from '../api/search.js'
import AlbumService from '../api/album.js'

export default {
    data() {
      return {
        albums: null,
        artists: null,
        tracks: null
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData() {
        this.error = null
        SearchService.get(this.$route.query.needle).then((response) => {
          let resp = SearchService.parseResponse(response)
          this.artists = resp.artists
          this.albums = resp.albums
          this.tracks = resp.tracks
        })
      },
      enqueueTrack(trackid, artist, title) {
        this.$store.commit('queueTrack', { trackid, artist, title })
      },
      enqueueAlbum(albumid) {
        AlbumService.get(albumid).then((response) => {
          let tracks = AlbumService.parseResponse(response);
          this.$store.commit('queueTracks', tracks)
        });
      }
    }
}
</script>

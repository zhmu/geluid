<template>
  <div>
    <v-card v-if="artists">
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
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import ArtistService from '../api/artist.js'

function processResponse(response) {
  var resp = response.data 
  resp.sort((a, b) => {    
    return a.name < b.name ? -1 : 1                                                                                               
  })
  return { artists: resp }
}

export default {
    data () {
      return {
        artists: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.error = null
        ArtistService.getAll().then((response) => {
          let resp = processResponse(response)
          this.artists = resp.artists
        })
      }
    }
}
</script>

<template>
  <div>
    <!--
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
  -->
    <v-container class="ma-1">
      <v-layout row wrap>
        <v-flex v-for="a in letters" :key="a.key" xs6 md4>
          <v-btn outlined block :to="{path: '/artist/by/'+a.key}">{{ a.label }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
        artists: null,
        letters: [
          { label: 'A', key: 'a' },
          { label: 'B', key: 'b' },
          { label: 'C', key: 'c' },
          { label: 'D', key: 'd' },
          { label: 'E', key: 'e' },
          { label: 'F', key: 'f' },
          { label: 'G', key: 'g' },
          { label: 'H', key: 'h' },
          { label: 'I', key: 'i' },
          { label: 'J', key: 'j' },
          { label: 'K', key: 'k' },
          { label: 'L', key: 'l' },
          { label: 'M', key: 'm' },
          { label: 'N', key: 'n' },
          { label: 'O', key: 'o' },
          { label: 'P', key: 'p' },
          { label: 'Q', key: 'q' },
          { label: 'R', key: 'r' },
          { label: 'S', key: 's' },
          { label: 'T', key: 't' },
          { label: 'U', key: 'u' },
          { label: 'V', key: 'v' },
          { label: 'W', key: 'w' },
          { label: 'X', key: 'x' },
          { label: 'Y', key: 'y' },
          { label: 'Z', key: 'z' },
          { label: '...', key: 'other' },
        ]
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

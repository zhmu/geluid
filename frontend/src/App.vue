<template>
   <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link v-for="(item, n) in playlist" :key="n" :class="[{selected: n == index}]">
          <v-list-item-content>
            <v-list-item-title @click.stop="play(n)">{{ item.title }} / {{ item.artist }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <!--<v-icon>md-playlist-music</v-icon>-->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click="playpause"><v-icon>{{ playicon }}</v-icon></v-btn>
      <v-btn icon @click="clearplaylist"><v-icon>mdi-playlist-remove</v-icon></v-btn>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <!--
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      -->
      <router-view/>
    </v-content>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.selected  {
  background-color: #42b983;
}
</style>

<script>
import { mapState } from 'vuex'
const {Howl, Howler} = require('howler');

  export default {
    props: {
      source: String,
    },
    computed: mapState({
      playlist: state => state.playlist
    }),
    data: () => ({
      drawer: true,
      howl: null,
      index: 0,
      playicon: 'mdi-play'
    }),
    created () {
      this.$vuetify.theme.dark = true
    },
    methods: {
      stop() {
        if (this.howl != null) {
          this.howl.stop()
          this.howl = null
          this.playicon = 'mdi-play'
        }
      },
      next() {
        let n = this.index + 1
         if (n >= this.playlist.length) {
           this.stop()
           return
         }
         this.play(n)
      },
      play(n) {
        this.stop()
        let track = this.playlist[n]
        this.howl = new Howl({
          src: [`/api/file/${track.trackid}/mp3`],
          format: [ 'mp3' ],
          html5: true,
          onend: () => { this.next() }
        })
        this.howl.play()
        this.playicon = 'mdi-pause'
        this.index = n
      },
      playpause() {
        if (this.howl != null) {
          if (this.howl.playing()) {
            this.howl.pause()
            this.playicon = 'mdi-play'
          } else {
            this.howl.play()
            this.playicon = 'mdi-pause'
          }
          return
        }
        this.play(0)
      },
      clearplaylist() {
        this.$store.commit('clearPlaylist')
        this.stop()
      }
    }
  }
</script>
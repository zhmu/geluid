<template>
   <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link v-for="(item, n) in playlist" :key="n" :class="[{selected: n == index}]">
          <v-list-item-content @click.stop="play(n)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
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
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">Geluid</v-toolbar-title>
      <v-spacer />
      <v-text-field dense style="width: 10px" v-model="needle" label="search"/>
      <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
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
      <span>&copy; 2020 - 2022</span>
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
const { Howl } = require('howler');

  export default {
    props: {
      source: String,
    },
    computed: mapState({
      playlist: state => state.playlist
    }),
    data: () => ({
      drawer: false,
      howl: null,
      index: 0,
      playicon: 'mdi-play',
      needle: '',
      timer: null,
    }),
    created () {
      this.$vuetify.theme.dark = true
    },
    watch: {
        needle: function(newVal) {
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let r = this.$router.currentRoute.path;
                let q = { path: '/search', query: { needle: newVal } };
                if (r.startsWith('/search')) {
                    this.$router.replace(q);
                } else {
                    this.$router.push(q);
                }
            }, 500);
        }
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
          src: [this.$config.$api_url + `/track/${track.trackid}/mp3`],
          format: [ 'mp3' ],
          html5: true,
          onend: () => { this.next() },
          onloaderror: (a, b) => { alert('load error: ' + b) },
          onplayerror: (a, b) => { alert('play error: ' + b) },
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

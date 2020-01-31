import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		playlist: [ ]
	},
	mutations: {
		queueTrack(state, t) {
			state.playlist.push(t)
		},
		queueTracks(state, tracks) {
			state.playlist.push.apply(state.playlist, tracks)
		},
		clearPlaylist(state) {
			state.playlist = []
		}
	}
})
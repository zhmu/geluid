import Axios from 'axios'
import { config } from '../config.js'

const RESOURCE_NAME = config.$api_url + '/album'

export default {
	get(id) {
			return Axios.get(RESOURCE_NAME + '/' + id)
	},
    parseResponse(response) {
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
        let tracks = [ ]
        discs.forEach((a) => {
            a.tracks.sort((a, b) => {
              return a.num - b.num
            })
            a.tracks.forEach((t) => {
              tracks.push({ 'trackid': t.trackid, 'artist': artist.name, 'title': t.title })
            })
        })
        return tracks
    }
}

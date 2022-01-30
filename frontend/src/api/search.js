import Axios from 'axios'
import { config } from '../config.js'

const RESOURCE_NAME = config.$api_url + '/search'

export default {
	get(needle) {
			return Axios.get(RESOURCE_NAME + '/' + needle)
	},
    parseResponse(response) {
        var albums = Object.values(response.data['albums'])
        albums.sort((a, b) => {
            if (a.year != b.year)
                return a.year - b.year;
            if (a.artist != b.artist)
                return a.artist - b.artist;
            if (a.name != b.name)
                return a.name - b.name;
            return a.albumid - b.albumid;
        });

        var artists = Object.values(response.data['artists'])
        artists.sort((a, b) => {
            if (a.name != b.name)
                return a.name - b.name;
            return a.artistid - b.artistid;
        });

        var tracks = Object.values(response.data['tracks'])
        tracks.sort((a, b) => {
            if (a.year != b.year)
                return a.year - b.year;
            if (a.artist != b.artist)
                return a.artist - b.artist;
            if (a.album != b.album)
                return a.album - b.album;
            if (a.title != b.title)
                return a.title - b.title;
            return a.trackid - b.trackid;
        });
        return { 'artists': artists, 'albums': albums, 'tracks': tracks };
    }
}

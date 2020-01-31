import Axios from 'axios'

const RESOURCE_NAME = '/api/track'

export default {               
	getLyrics(id) {     
			return Axios.get(RESOURCE_NAME + '/' + id + '/lyrics')
	}
}
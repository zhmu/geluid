import Axios from 'axios'

const RESOURCE_NAME = '/api/artist'

export default {               
	getBy(key) {
			return Axios.get(RESOURCE_NAME + '/by/' + key)
	},
	get(id) {     
			return Axios.get(RESOURCE_NAME + '/' + id)
	}
}

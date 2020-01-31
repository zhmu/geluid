import Axios from 'axios'

const RESOURCE_NAME = '/api/artist'

export default {               
	getAll() {
			return Axios.get(RESOURCE_NAME) 
	},
	get(id) {     
			return Axios.get(RESOURCE_NAME + '/' + id)
	}
}
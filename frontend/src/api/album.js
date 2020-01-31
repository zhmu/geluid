import Axios from 'axios'

const RESOURCE_NAME = '/api/album'

export default {               
	get(id) {     
			return Axios.get(RESOURCE_NAME + '/' + id)
	}
}
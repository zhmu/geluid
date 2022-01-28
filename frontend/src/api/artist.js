import Axios from 'axios'
import { config } from '../config.js'

const RESOURCE_NAME = config.$api_url + '/artist'

export default {
	getAll() {
			return Axios.get(RESOURCE_NAME)
	},
	getBy(key) {
			return Axios.get(RESOURCE_NAME + '/by/' + key)
	},
	get(id) {
			return Axios.get(RESOURCE_NAME + '/' + id)
	}
}

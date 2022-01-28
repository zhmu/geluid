import Axios from 'axios'
import { config } from '../config.js'

const RESOURCE_NAME = config.$api_url + '/album'

export default {
	get(id) {
			return Axios.get(RESOURCE_NAME + '/' + id)
	}
}

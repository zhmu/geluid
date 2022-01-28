import Axios from 'axios'
import { config } from '../config.js'

const RESOURCE_NAME = config.$api_url + '/track'

export default {
	getLyrics(id) {
			return Axios.get(RESOURCE_NAME + '/' + id + '/lyrics')
	}
}

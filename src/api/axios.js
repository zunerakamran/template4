import axios from 'axios'
import CONFIG from '../../config.js'

const getBaseUrl = () => {
    if (!CONFIG.API_URL) return './api.php'
    if (CONFIG.API_URL.includes('api.php')) return CONFIG.API_URL
    return CONFIG.API_URL + '/public'
}

export const publicApi = axios.create({
    baseURL: getBaseUrl()
})

export default publicApi
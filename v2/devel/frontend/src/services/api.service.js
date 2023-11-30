import axios from 'axios'

const BASEURL = window.location.origin + import.meta.env.VITE_API_URL

const axios_api = axios.create({
    baseURL:    BASEURL,
})

const getLatest = async (payload) => {
    const response = await axios_api.get(`/latest/${payload}`)
    return response.data
}

const getDescriptors = async () => {
    const response = await axios_api.get('/descriptors')
    return response.data
}

export const apiService = {
    getLatest,
    getDescriptors
}


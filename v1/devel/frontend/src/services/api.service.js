import axios from 'axios'

const BASEURL = window.location.origin + import.meta.env.VITE_API_URL

const axios_api = axios.create({
    baseURL:    BASEURL,
    })

const submitApplication = async (payload) => {
    const response = await axios_api.post('/applications', payload)
    return response.data
}

export const apiService = {
    submitApplication
}


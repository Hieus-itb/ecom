import axiosClient from './axiosClient'

export const getShopSettings = () => {
  return axiosClient.get('/settings')
}

export const updateShopSettings = (data) => {
  return axiosClient.put('/settings', data)
}

export const updateShopSettingsTest = (data) => {
  return axiosClient.put('/settings/test', data)
}

export const updateShopSettingsPublic = (data) => {
  return axiosClient.post('/settings/public', data)
}

export const getContactInfo = () => {
  return axiosClient.get('/settings/contact')
}

export const submitContactForm = (formData) => {
  return axiosClient.post('/contact', formData)
}

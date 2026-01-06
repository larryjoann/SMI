import API_URL from '../../../../../api/API_URL'
import axiosInstance from '../../../../../api/axiosInstance'

export async function getDeclaration() {
  const res = await axiosInstance.get('/NCDetails/declare')
  return res.data
}

export async function getBrouillon() {
  const res = await axiosInstance.get('/NCDetails/drafts')
  return res.data
}

export async function getAll() {
  const res = await axiosInstance.get('/NCDetails/by-matricule')
  return res.data
}

export async function getArchived() {
  const res = await axiosInstance.get('/NCDetails/archived')
  return res.data
}

const BASE = '/api'

async function request(endpoint) {
  const response = await fetch(`${BASE}${endpoint}`)

  if (!response.ok) {
    const error = await response.json()

    throw new Error(
      error.errors?.message || 'Something went wrong'
    )
  }

  return response.json()
}

export const api = {
  // Dashboard
  getDoctors: (params = '') =>
    request(`/doctors${params}`),

  getClinics: (params = '') =>
    request(`/clinics${params}`),

  getMedicalGroups: (params = '') =>
    request(`/medical-groups${params}`),

  getInsurances: () =>
    request('/insurances'),

  getRadiology: (params = '') =>
    request(`/radiology-centers${params}`),

  // Individual
  getDoctorById: (id) =>
    request(`/doctors/${id}`),

  getClinicById: (id) =>
    request(`/clinics/${id}`)
}
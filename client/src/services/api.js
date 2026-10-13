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

  getMedicalGroupById: (id) =>
  request(`/medical-groups/${id}`),

  getInsurances: () =>
    request('/insurances'),

  getRadiology: (params = '') =>
    request(`/radiology-centers${params}`),

  getRadiologyCenterById: (id) =>
    request(`/radiology-centers/${id}`),

  // Individual
  getDoctorById: (id) =>
    request(`/doctors/${id}`),

  getClinicById: (id) =>
    request(`/clinics/${id}`),

  /* desde el Backend -> clinic.router.js */
  getMRFs: () => 
    request('/clinics/mrf'), 

  getPopularMRFs: () =>
    request('/clinics/mrf/popular')
}

/* PARA ANHADIR NOTAS DICE */
/* 
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.errors?.message ||
      result.message ||
      'Something went wrong'
    )
  }

  return result
}
 */

/* 

getMedicalGroupById: (id) =>
  request(`/medical-groups/${id}`),

addMedicalGroupNote: (id, note) =>
  request(`/medical-groups/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
  }),

removeMedicalGroupNote: (id, noteId) =>
  request(`/medical-groups/${id}/notes/${noteId}`, {
    method: 'DELETE',
  }),

getRadiologyCentersOfMedicalGroup: (id) =>
  request(`/medical-groups/${id}/radiology-centers`),
*/
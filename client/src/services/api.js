const BASE = '/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
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
    request('/clinics/mrf/popular'),

  
  createMRFRequest: (id, formData) =>
    request(`/clinics/${id}/mrf-request`, {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  downloadMRF: async (id, formData) => {
      const response = await fetch(
        `${BASE}/clinics/${id}/mrf-request`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let message = 'Unable to generate the MRF PDF.';
        if (contentType.includes('application/json')) {
          const result = await response.json()
          message = result.errors?.message || result.message || message;
        }
        throw new Error(message);
      }

      // 1. Extraemos el nombre enviando desde el backend (Content-Disposition)
      const disposition = response.headers.get('content-disposition');
      let filename = `MRF_${formData.requesting || 'Request'}.pdf`; // Fallback por si acaso

      if (disposition && disposition.includes('filename=')) {
        const filenameMatch = disposition.match(/filename="?([^";]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Recibir el archivo PDF, no JSON
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename;

      document.body.appendChild(link)
      link.click()
      link.remove()

      // Liberar la URL después de iniciar la descarga
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

}

/* PARA ANHADIR NOTAS DICE */
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
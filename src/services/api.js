const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net'

/**
 * Manejo de errores de la API
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    let errorData = {}
    try {
      errorData = JSON.parse(errorText)
    } catch (e) {
      errorData = { message: errorText }
    }
    console.error('Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorData
    })
    throw new Error(
      errorData.message || errorText || `Error ${response.status}: ${response.statusText}`
    )
  }
  return response.json()
}

/**
 * Obtener datos del candidato por email
 * @param {string} email - Email del candidato
 * @returns {Promise<Object>} Datos del candidato
 */
export const getCandidateByEmail = async (email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
    )
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener datos del candidato:', error)
    throw error
  }
}

/**
 * Obtener lista de posiciones disponibles
 * @returns {Promise<Array>} Lista de trabajos
 */
export const getJobsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/jobs/get-list`)
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al obtener lista de trabajos:', error)
    throw error
  }
}

/**
 * Aplicar a un trabajo
 * @param {Object} applicationData - Datos de la aplicación
 * @param {string} applicationData.uuid - UUID del candidato
 * @param {string} applicationData.jobId - ID del trabajo
 * @param {string} applicationData.candidateId - ID del candidato
 * @param {string} applicationData.repoUrl - URL del repositorio de GitHub
 * @returns {Promise<Object>} Respuesta de la aplicación
 */
export const applyToJob = async (applicationData) => {
  try {
    console.log('API Request:', {
      url: `${BASE_URL}/api/candidate/apply-to-job`,
      data: applicationData
    })
    
    const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    })
    
    console.log('API Response Status:', response.status)
    
    return await handleResponse(response)
  } catch (error) {
    console.error('Error al aplicar al trabajo:', error)
    throw error
  }
}

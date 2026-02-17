import { useState } from 'react'
import PropTypes from 'prop-types'
import { applyToJob } from '../services/api'
import './JobItem.css'

function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [applied, setApplied] = useState(() => {
    // Verificar si ya aplicó a esta posición
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '{}')
    return appliedJobs[job.id] || false
  })

  const validateGitHubUrl = (url) => {
    // Eliminar barra final si existe
    const cleanUrl = url.trim().replace(/\/$/, '')
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+$/
    return githubRegex.test(cleanUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!repoUrl.trim()) {
      setError('Por favor ingresa la URL de tu repositorio')
      return
    }

    if (!validateGitHubUrl(repoUrl)) {
      setError('Por favor ingresa una URL válida de GitHub (ej: https://github.com/usuario/repositorio)')
      return
    }

    if (!candidate) {
      setError('No se encontraron datos del candidato')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const applicationData = {
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        repoUrl: repoUrl.trim().replace(/\/$/, '')
      }

      console.log('Enviando aplicación:', applicationData)

      const response = await applyToJob(applicationData)
      
      if (response.ok) {
        setSuccess(true)
        setApplied(true)
        setRepoUrl('')
        
        // Guardar en localStorage
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '{}')
        appliedJobs[job.id] = true
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs))
        
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      }
    } catch (err) {
      setError(err.message || 'Error al enviar la aplicación')
      console.error('Error al aplicar:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`job-item ${success ? 'job-item-success' : ''}`}>
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="job-id" aria-label="ID de la posición">ID: {job.id}</span>
      </div>
      
      {applied && !success && (
        <div className="alert alert-info">
          ℹ️ Ya aplicaste a esta posición anteriormente
        </div>
      )}

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor={`repo-${job.id}`}>
            URL del Repositorio de GitHub
          </label>
          <input
            id={`repo-${job.id}`}
            type="text"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value)
              setError(null)
            }}
            placeholder="https://github.com/tu-usuario/tu-repo"
            className="form-input"
            disabled={loading || success}
            aria-describedby={error ? `error-${job.id}` : undefined}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>

        {error && (
          <div id={`error-${job.id}`} className="alert alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status" aria-live="polite">
            ✅ ¡Aplicación enviada exitosamente!
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || success}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Enviando...
            </>
          ) : success ? (
            '✓ Aplicado'
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  )
}

JobItem.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  candidate: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    candidateId: PropTypes.string.isRequired,
    applicationId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
}

export default JobItem

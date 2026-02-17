import { useState, useEffect } from 'react'
import JobList from './components/JobList'
import { getCandidateByEmail, getJobsList } from './services/api'
import './App.css'

function App() {
  const [candidate, setCandidate] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [email] = useState('rodrigo.leytes@gmail.com') // e-mail personal del candidato para obtener sus datos y mostrar su nombre en la aplicación

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener datos del candidato
        const candidateData = await getCandidateByEmail(email)
        setCandidate(candidateData)

        // Obtener lista de trabajos
        const jobsData = await getJobsList()
        setJobs(jobsData)
      } catch (err) {
        setError(err.message || 'Error al cargar los datos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [email])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando posiciones disponibles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Nimble Gravity Challenge</h1>
        {candidate && (
          <p className="candidate-info">
            Hola, <strong>{candidate.firstName} {candidate.lastName}</strong>
          </p>
        )}
      </header>
      
      <main className="app-main">
        <JobList jobs={jobs} candidate={candidate} />
      </main>

      <footer className="app-footer">
        <p>Aplicación desarrollada con React + Vite</p>
      </footer>
    </div>
  )
}

export default App

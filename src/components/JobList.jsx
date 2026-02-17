import JobItem from './JobItem'
import PropTypes from 'prop-types'
import './JobList.css'

function JobList({ jobs, candidate }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <p>No hay posiciones disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="job-list">
      <h2>Posiciones Disponibles</h2>
      <p className="job-list-description">
        Selecciona la posición a la que deseas aplicar e ingresa la URL de tu repositorio de GitHub.
      </p>
      
      <div className="jobs-container">
        {jobs.map((job) => (
          <JobItem 
            key={job.id} 
            job={job} 
            candidate={candidate}
          />
        ))}
      </div>
    </div>
  )
}

JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  candidate: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    candidateId: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
}

export default JobList

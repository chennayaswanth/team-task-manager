import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';
import { useAuth } from '../AuthContext';
import { FaFolderOpen, FaPlus } from 'react-icons/fa';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const { user } = useAuth();

  const loadProjects = async () => {
    try {
      const data = await fetchApi('/projects');
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
      });
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="project-list-page animate-fade-in">
      <header className="page-header flex justify-between items-center">
        <div>
          <h1>Projects</h1>
          <p>Manage and track your team's projects.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> New Project
          </button>
        )}
      </header>

      <div className="projects-grid">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-card glass-panel">
            <div className="project-icon">
              <FaFolderOpen size={24} />
            </div>
            <h3>{project.name}</h3>
            <p className="project-desc">{project.description || 'No description provided.'}</p>
            <div className="project-meta">
              <span className="badge">
                {project._count?.tasks || 0} Tasks
              </span>
              <span className="badge">
                {project._count?.members || 0} Members
              </span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="empty-state glass-panel" style={{ gridColumn: '1 / -1' }}>
            No projects found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newProjectName} 
                  onChange={e => setNewProjectName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={newProjectDesc} 
                  onChange={e => setNewProjectDesc(e.target.value)} 
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi } from '../api';
import { useAuth } from '../AuthContext';
import { FaPlus, FaCheck, FaClock, FaTasks } from 'react-icons/fa';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const loadProject = async () => {
    try {
      const data = await fetchApi(`/projects/${id}`);
      setProject(data);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Failed to load project", err);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description, projectId: id, assigneeId, dueDate })
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssigneeId('');
      loadProject();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      loadProject();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!project) return <div className="loading">Loading project...</div>;

  const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  return (
    <div className="project-details-page animate-fade-in">
      <header className="page-header flex justify-between items-center">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> New Task
        </button>
      </header>

      <div className="kanban-board">
        {statuses.map(status => (
          <div key={status} className="kanban-column glass-panel">
            <div className={`kanban-header kanban-${status.toLowerCase()}`}>
              <h3>{status.replace('_', ' ')}</h3>
              <span className="task-count">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="kanban-tasks">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="kanban-card">
                  <h4>{task.title}</h4>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  
                  <div className="task-meta">
                    {task.assignee && (
                      <span className="task-assignee" title={task.assignee.name}>
                        {task.assignee.name.charAt(0)}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="task-date">
                        <FaClock /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="task-actions">
                    <select 
                      className="status-select" 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-control" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                  {project.creator && (
                    <option value={project.creator.id}>{project.creator.name} (Creator)</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

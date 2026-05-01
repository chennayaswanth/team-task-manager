import { useEffect, useState } from 'react';
import { fetchApi } from '../api';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchApi('/dashboard');
        setMetrics(dashboardData.metrics);

        const tasksData = await fetchApi('/tasks/my-tasks');
        setMyTasks(tasksData);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };
    loadData();
  }, []);

  if (!metrics) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard animate-fade-in">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your tasks.</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}>
            <FaTasks size={24} />
          </div>
          <div className="metric-info">
            <h3>Total Tasks</h3>
            <p className="metric-value">{metrics.total}</p>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-warning)' }}>
            <FaClock size={24} />
          </div>
          <div className="metric-info">
            <h3>In Progress / Review</h3>
            <p className="metric-value">{metrics.inProgress + metrics.review}</p>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-success)' }}>
            <FaCheckCircle size={24} />
          </div>
          <div className="metric-info">
            <h3>Completed</h3>
            <p className="metric-value">{metrics.done}</p>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-danger)' }}>
            <FaExclamationTriangle size={24} />
          </div>
          <div className="metric-info">
            <h3>Overdue</h3>
            <p className="metric-value" style={{ color: metrics.overdue > 0 ? 'var(--accent-danger)' : 'inherit' }}>
              {metrics.overdue}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="recent-tasks glass-panel">
          <div className="section-header">
            <h2>My Upcoming Tasks</h2>
          </div>
          {myTasks.length === 0 ? (
            <div className="empty-state">No tasks assigned to you right now.</div>
          ) : (
            <div className="task-list">
              {myTasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <span className="task-project">{task.project.name}</span>
                  </div>
                  <div className="task-meta">
                    <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.dueDate && (
                      <span className="task-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

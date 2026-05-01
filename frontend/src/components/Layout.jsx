import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaHome, FaFolder, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-brand">
          <div className="brand-logo">TM</div>
          <h2>TaskMaster</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <FaHome /> <span>Dashboard</span>
          </Link>
          <Link to="/projects" className={`nav-item ${location.pathname.startsWith('/projects') ? 'active' : ''}`}>
            <FaFolder /> <span>Projects</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <FaUserCircle size={24} />
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role badge">{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

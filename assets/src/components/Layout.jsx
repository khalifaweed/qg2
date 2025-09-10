import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/sites', label: 'Sites', icon: '🌐' },
    { path: '/leads', label: 'Leads', icon: '👥' },
    { path: '/tasks', label: 'Tarefas', icon: '✅' },
    { path: '/financial', label: 'Financeiro', icon: '💰' },
    { path: '/backlinks', label: 'Backlinks', icon: '🔗' },
    { path: '/seo', label: 'SEO', icon: '🔍' },
    { path: '/automation', label: 'Automação', icon: '⚡' },
    { path: '/settings', label: 'Configurações', icon: '⚙️' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Company Hub</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
          
          <div className="header-right">
            <div className="user-menu">
              <span className="user-name">{user?.username}</span>
              <div className="user-dropdown">
                <button onClick={handleLogout}>Sair</button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
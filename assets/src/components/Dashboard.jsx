import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    total_sites: 0,
    total_leads: 0,
    new_leads: 0,
    active_tasks: 0,
    sites_down: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      setError('Erro ao carregar estatísticas');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Carregando estatísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <h3>{stats.total_sites}</h3>
            <p>Sites Ativos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total_leads}</h3>
            <p>Total de Leads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <h3>{stats.new_leads}</h3>
            <p>Novos Leads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.active_tasks}</h3>
            <p>Tarefas Ativas</p>
          </div>
        </div>

        {stats.sites_down > 0 && (
          <div className="stat-card alert">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats.sites_down}</h3>
              <p>Sites Fora do Ar</p>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Ações Rápidas</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/company-hub/sites'}>
              Gerenciar Sites
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/company-hub/leads'}>
              Ver Leads
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/company-hub/tasks'}>
              Criar Tarefa
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Atividade Recente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">Há 2 horas</span>
              <span className="activity-text">Novo lead cadastrado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Há 4 horas</span>
              <span className="activity-text">Site verificado com sucesso</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Ontem</span>
              <span className="activity-text">Tarefa concluída</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
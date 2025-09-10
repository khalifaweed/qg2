import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SEO() {
  const [activeTab, setActiveTab] = useState('keywords');
  const [keywords, setKeywords] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'keywords':
          const keywordsResponse = await api.get('/seo/keywords');
          setKeywords(keywordsResponse.data);
          break;
        case 'rankings':
          const rankingsResponse = await api.get('/seo/rankings');
          setRankings(rankingsResponse.data);
          break;
        case 'audits':
          const auditsResponse = await api.get('/seo/audits');
          setAudits(auditsResponse.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `/seo/${activeTab}`;
      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        await api.delete(`/seo/${activeTab}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Erro ao excluir. Tente novamente.');
      }
    }
  };

  const handleRunAudit = async (siteId) => {
    try {
      await api.post(`/seo/audit/${siteId}`);
      alert('Auditoria iniciada com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error running audit:', error);
      alert('Erro ao iniciar auditoria. Tente novamente.');
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'keywords':
        return (
          <>
            <div className="form-group">
              <label>Palavra-chave *</label>
              <input
                type="text"
                value={formData.keyword || ''}
                onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>URL de Destino</label>
              <input
                type="url"
                value={formData.target_url || ''}
                onChange={(e) => setFormData({...formData, target_url: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Volume de Busca</label>
              <input
                type="number"
                value={formData.search_volume || ''}
                onChange={(e) => setFormData({...formData, search_volume: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Dificuldade</label>
              <select
                value={formData.difficulty || 'medium'}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>
          </>
        );
      case 'rankings':
        return (
          <>
            <div className="form-group">
              <label>Palavra-chave *</label>
              <input
                type="text"
                value={formData.keyword || ''}
                onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>URL de Destino</label>
              <input
                type="url"
                value={formData.target_url || ''}
                onChange={(e) => setFormData({...formData, target_url: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Posição Atual</label>
              <input
                type="number"
                value={formData.current_position || ''}
                onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                min="1"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Posição Alvo</label>
              <input
                type="number"
                value={formData.target_position || ''}
                onChange={(e) => setFormData({...formData, target_position: e.target.value})}
                min="1"
                max="100"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderKeywords = () => (
    <div className="keywords-section">
      <div className="section-header">
        <h2>Palavras-chave</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nova Palavra-chave
        </button>
      </div>
      
      <div className="keywords-table">
        <table>
          <thead>
            <tr>
              <th>Palavra-chave</th>
              <th>URL de Destino</th>
              <th>Volume de Busca</th>
              <th>Dificuldade</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={keyword.id}>
                <td><strong>{keyword.keyword}</strong></td>
                <td>
                  {keyword.target_url && (
                    <a href={keyword.target_url} target="_blank" rel="noopener noreferrer">
                      {keyword.target_url.length > 40 
                        ? keyword.target_url.substring(0, 40) + '...' 
                        : keyword.target_url}
                    </a>
                  )}
                </td>
                <td>{keyword.search_volume || '-'}</td>
                <td>
                  <span className={`difficulty-badge ${keyword.difficulty}`}>
                    {keyword.difficulty === 'easy' ? 'Fácil' : 
                     keyword.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </span>
                </td>
                <td>{new Date(keyword.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleEdit(keyword)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(keyword.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRankings = () => (
    <div className="rankings-section">
      <div className="section-header">
        <h2>Rankings</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Ranking
        </button>
      </div>
      
      <div className="rankings-table">
        <table>
          <thead>
            <tr>
              <th>Palavra-chave</th>
              <th>URL</th>
              <th>Posição Anterior</th>
              <th>Posição Atual</th>
              <th>Posição Alvo</th>
              <th>Variação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking) => (
              <tr key={ranking.id}>
                <td><strong>{ranking.keyword}</strong></td>
                <td>
                  {ranking.target_url && (
                    <a href={ranking.target_url} target="_blank" rel="noopener noreferrer">
                      {ranking.target_url.length > 30 
                        ? ranking.target_url.substring(0, 30) + '...' 
                        : ranking.target_url}
                    </a>
                  )}
                </td>
                <td>{ranking.previous_position || '-'}</td>
                <td>
                  <span className={`position-badge ${ranking.current_position <= 10 ? 'good' : ranking.current_position <= 30 ? 'medium' : 'poor'}`}>
                    {ranking.current_position || '-'}
                  </span>
                </td>
                <td>{ranking.target_position || '-'}</td>
                <td>
                  {ranking.previous_position && ranking.current_position ? (
                    <span className={`variation ${ranking.current_position < ranking.previous_position ? 'positive' : ranking.current_position > ranking.previous_position ? 'negative' : 'neutral'}`}>
                      {ranking.current_position < ranking.previous_position ? '↗' : 
                       ranking.current_position > ranking.previous_position ? '↘' : '→'}
                      {Math.abs(ranking.current_position - ranking.previous_position)}
                    </span>
                  ) : '-'}
                </td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleEdit(ranking)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(ranking.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAudits = () => (
    <div className="audits-section">
      <div className="section-header">
        <h2>Auditorias SEO</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            const siteId = prompt('Digite o ID do site para auditoria:');
            if (siteId) handleRunAudit(siteId);
          }}
        >
          Nova Auditoria
        </button>
      </div>
      
      <div className="audits-grid">
        {audits.map((audit) => (
          <div key={audit.id} className="audit-card">
            <div className="audit-header">
              <h3>{audit.site_name || `Site ID: ${audit.site_id}`}</h3>
              <span className={`status-badge ${audit.status}`}>
                {audit.status === 'completed' ? 'Concluída' : 
                 audit.status === 'running' ? 'Executando' : 
                 audit.status === 'failed' ? 'Falhou' : 'Pendente'}
              </span>
            </div>
            
            {audit.results && audit.status === 'completed' && (
              <div className="audit-results">
                {(() => {
                  try {
                    const results = JSON.parse(audit.results);
                    return (
                      <>
                        <div className="seo-score">
                          <span className="score-label">Score SEO:</span>
                          <span className={`score-value ${results.seo_score >= 80 ? 'good' : results.seo_score >= 60 ? 'medium' : 'poor'}`}>
                            {results.seo_score}/100
                          </span>
                        </div>
                        <div className="issues-count">
                          <span>Problemas encontrados: {results.issues_count}</span>
                        </div>
                        {results.recommendations && (
                          <div className="recommendations">
                            <h4>Recomendações:</h4>
                            <ul>
                              {results.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  } catch (e) {
                    return <p>Erro ao carregar resultados</p>;
                  }
                })()}
              </div>
            )}
            
            <div className="audit-date">
              {new Date(audit.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Carregando dados de SEO...</div>;
  }

  return (
    <div className="seo">
      <div className="page-header">
        <h1>SEO & Marketing</h1>
      </div>

      <div className="seo-tabs">
        <button 
          className={`tab ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Palavras-chave
        </button>
        <button 
          className={`tab ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          Rankings
        </button>
        <button 
          className={`tab ${activeTab === 'audits' ? 'active' : ''}`}
          onClick={() => setActiveTab('audits')}
        >
          Auditorias
        </button>
      </div>

      {showForm && activeTab !== 'audits' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Editar' : 'Novo'} {activeTab === 'keywords' ? 'Palavra-chave' : 'Ranking'}</h2>
              <button 
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              {getFormFields()}
              <div className="form-actions">
                <button type="button" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="seo-content">
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'rankings' && renderRankings()}
        {activeTab === 'audits' && renderAudits()}
      </div>

      {((activeTab === 'keywords' && keywords.length === 0) ||
        (activeTab === 'rankings' && rankings.length === 0) ||
        (activeTab === 'audits' && audits.length === 0)) && (
        <div className="empty-state">
          <p>Nenhum dado encontrado para {activeTab === 'keywords' ? 'palavras-chave' : activeTab === 'rankings' ? 'rankings' : 'auditorias'}.</p>
          {activeTab !== 'audits' && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Adicionar {activeTab === 'keywords' ? 'Primeira Palavra-chave' : 'Primeiro Ranking'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SEO;
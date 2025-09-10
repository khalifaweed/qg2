import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Backlinks() {
  const [backlinks, setBacklinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);
  const [formData, setFormData] = useState({
    source_url: '',
    target_url: '',
    anchor_text: '',
    type: 'external'
  });

  useEffect(() => {
    fetchBacklinks();
  }, []);

  const fetchBacklinks = async () => {
    try {
      const response = await api.get('/backlinks');
      setBacklinks(response.data);
    } catch (error) {
      console.error('Error fetching backlinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/backlinks/${editingId}`, formData);
      } else {
        await api.post('/backlinks', formData);
      }
      resetForm();
      fetchBacklinks();
    } catch (error) {
      console.error('Error saving backlink:', error);
      alert('Erro ao salvar backlink. Tente novamente.');
    }
  };

  const handleEdit = (backlink) => {
    setFormData({
      source_url: backlink.source_url,
      target_url: backlink.target_url,
      anchor_text: backlink.anchor_text || '',
      type: backlink.type || 'external'
    });
    setEditingId(backlink.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este backlink?')) {
      try {
        await api.delete(`/backlinks/${id}`);
        fetchBacklinks();
      } catch (error) {
        console.error('Error deleting backlink:', error);
        alert('Erro ao excluir backlink. Tente novamente.');
      }
    }
  };

  const handleCheckBacklink = async (id) => {
    setCheckingId(id);
    try {
      const response = await api.post(`/backlinks/${id}/check`);
      if (response.data.success) {
        alert(`Status do backlink: ${response.data.status}`);
        fetchBacklinks();
      }
    } catch (error) {
      console.error('Error checking backlink:', error);
      alert('Erro ao verificar backlink. Tente novamente.');
    } finally {
      setCheckingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      source_url: '',
      target_url: '',
      anchor_text: '',
      type: 'external'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'broken': return 'red';
      case 'removed': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'internal': return 'blue';
      case 'external': return 'purple';
      default: return 'gray';
    }
  };

  if (loading) {
    return <div className="loading">Carregando backlinks...</div>;
  }

  return (
    <div className="backlinks">
      <div className="page-header">
        <h1>Gestão de Backlinks</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Backlink
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Editar Backlink' : 'Novo Backlink'}</h2>
              <button 
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>URL de Origem *</label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                  placeholder="https://exemplo.com/pagina-com-link"
                  required
                />
                <small>URL da página que contém o link</small>
              </div>
              
              <div className="form-group">
                <label>URL de Destino *</label>
                <input
                  type="url"
                  value={formData.target_url}
                  onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                  placeholder="https://meusite.com/pagina-destino"
                  required
                />
                <small>URL para onde o link aponta</small>
              </div>
              
              <div className="form-group">
                <label>Texto Âncora</label>
                <input
                  type="text"
                  value={formData.anchor_text}
                  onChange={(e) => setFormData({...formData, anchor_text: e.target.value})}
                  placeholder="Texto do link"
                />
              </div>
              
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="external">Externo</option>
                  <option value="internal">Interno</option>
                </select>
              </div>
              
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

      <div className="backlinks-table">
        <table>
          <thead>
            <tr>
              <th>URL de Origem</th>
              <th>URL de Destino</th>
              <th>Texto Âncora</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Última Verificação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {backlinks.map((backlink) => (
              <tr key={backlink.id}>
                <td>
                  <a 
                    href={backlink.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {backlink.source_url.length > 50 
                      ? backlink.source_url.substring(0, 50) + '...' 
                      : backlink.source_url}
                  </a>
                </td>
                <td>
                  <a 
                    href={backlink.target_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {backlink.target_url.length > 50 
                      ? backlink.target_url.substring(0, 50) + '...' 
                      : backlink.target_url}
                  </a>
                </td>
                <td>{backlink.anchor_text || '-'}</td>
                <td>
                  <span className={`type-badge ${getTypeColor(backlink.type)}`}>
                    {backlink.type === 'internal' ? 'Interno' : 'Externo'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(backlink.status)}`}>
                    {backlink.status === 'active' ? 'Ativo' : 
                     backlink.status === 'broken' ? 'Quebrado' : 
                     backlink.status === 'removed' ? 'Removido' : 'Desconhecido'}
                  </span>
                </td>
                <td>
                  {backlink.last_checked 
                    ? new Date(backlink.last_checked).toLocaleDateString()
                    : 'Nunca'
                  }
                </td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleEdit(backlink)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleCheckBacklink(backlink.id)}
                      disabled={checkingId === backlink.id}
                    >
                      {checkingId === backlink.id ? 'Verificando...' : 'Verificar'}
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(backlink.id)}
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

      {backlinks.length === 0 && (
        <div className="empty-state">
          <p>Nenhum backlink cadastrado ainda.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Adicionar Primeiro Backlink
          </button>
        </div>
      )}

      <div className="backlinks-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total de Backlinks</h3>
            <div className="stat-number">{backlinks.length}</div>
          </div>
          <div className="stat-card">
            <h3>Ativos</h3>
            <div className="stat-number">
              {backlinks.filter(b => b.status === 'active').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Quebrados</h3>
            <div className="stat-number">
              {backlinks.filter(b => b.status === 'broken').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Externos</h3>
            <div className="stat-number">
              {backlinks.filter(b => b.type === 'external').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Backlinks;
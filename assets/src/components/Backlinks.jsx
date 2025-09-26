import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Backlinks() {
  const [backlinks, setBacklinks] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    source_url: '',
    target_url: '',
    anchor_text: '',
    type: 'external',
    site_id: '',
    price: 0,
    client_name: '',
    placement_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchBacklinks();
    fetchSites();
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

  const fetchSites = async () => {
    try {
      const response = await api.get('/sites');
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
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
      type: backlink.type || 'external',
      site_id: backlink.site_id || '',
      price: backlink.price || 0,
      client_name: backlink.client_name || '',
      placement_date: backlink.placement_date || '',
      notes: backlink.notes || ''
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
      type: 'external',
      site_id: '',
      price: 0,
      client_name: '',
      placement_date: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'broken': 'bg-red-100 text-red-800 border-red-200',
      'removed': 'bg-orange-100 text-orange-800 border-orange-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeBadge = (type) => {
    const badges = {
      'internal': 'bg-blue-100 text-blue-800 border-blue-200',
      'external': 'bg-purple-100 text-purple-800 border-purple-200',
      'guest_post': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'directory': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return badges[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getSiteById = (siteId) => {
    return sites.find(site => site.id == siteId);
  };

  const filteredBacklinks = backlinks.filter(backlink => {
    const statusMatch = filterStatus === 'all' || backlink.status === filterStatus;
    const typeMatch = filterType === 'all' || backlink.type === filterType;
    return statusMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Backlinks</h1>
            <p className="mt-2 text-gray-600">Gerencie backlinks internos e vendas de links externos</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="mr-2">🔗</span>
            Novo Backlink
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">🔗</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{backlinks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backlinks.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quebrados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backlinks.filter(b => b.status === 'broken').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🌐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Externos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {backlinks.filter(b => b.type === 'external').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="broken">Quebrados</option>
              <option value="removed">Removidos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="internal">Internos</option>
              <option value="external">Externos</option>
              <option value="guest_post">Guest Posts</option>
              <option value="directory">Diretórios</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Editar Backlink' : 'Novo Backlink'}
              </h2>
              <button 
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de Origem *</label>
                  <input
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                    placeholder="https://exemplo.com/pagina-com-link"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de Destino *</label>
                  <input
                    type="url"
                    value={formData.target_url}
                    onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                    placeholder="https://meusite.com/pagina-destino"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texto Âncora</label>
                  <input
                    type="text"
                    value={formData.anchor_text}
                    onChange={(e) => setFormData({...formData, anchor_text: e.target.value})}
                    placeholder="Texto do link"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="external">Externo</option>
                    <option value="internal">Interno</option>
                    <option value="guest_post">Guest Post</option>
                    <option value="directory">Diretório</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Relacionado</label>
                  <select
                    value={formData.site_id}
                    onChange={(e) => setFormData({...formData, site_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um site...</option>
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    placeholder="Nome do cliente (para vendas)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Colocação</label>
                  <input
                    type="date"
                    value={formData.placement_date}
                    onChange={(e) => setFormData({...formData, placement_date: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  placeholder="Observações adicionais..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backlinks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem → Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âncora & Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site & Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Verificação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBacklinks.map((backlink) => {
                const relatedSite = getSiteById(backlink.site_id);
                return (
                  <tr key={backlink.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 block">De:</span>
                          <a 
                            href={backlink.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                            title={backlink.source_url}
                          >
                            {backlink.source_url.length > 40 
                              ? backlink.source_url.substring(0, 40) + '...' 
                              : backlink.source_url}
                          </a>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Para:</span>
                          <a 
                            href={backlink.target_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-800 truncate block max-w-xs"
                            title={backlink.target_url}
                          >
                            {backlink.target_url.length > 40 
                              ? backlink.target_url.substring(0, 40) + '...' 
                              : backlink.target_url}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {backlink.anchor_text || 'Sem âncora'}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadge(backlink.type)}`}>
                          {backlink.type === 'internal' ? '🏠 Interno' : 
                           backlink.type === 'external' ? '🌐 Externo' : 
                           backlink.type === 'guest_post' ? '📝 Guest Post' : 
                           backlink.type === 'directory' ? '📂 Diretório' : backlink.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {relatedSite && (
                          <div className="text-sm font-medium text-gray-900">
                            🌐 {relatedSite.name}
                          </div>
                        )}
                        {backlink.client_name && (
                          <div className="text-sm text-gray-600">
                            👤 {backlink.client_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(backlink.status)}`}>
                          {backlink.status === 'active' ? '✅ Ativo' : 
                           backlink.status === 'broken' ? '❌ Quebrado' : 
                           backlink.status === 'removed' ? '🗑️ Removido' : 
                           backlink.status === 'pending' ? '⏳ Pendente' : backlink.status}
                        </span>
                        {backlink.price > 0 && (
                          <div className="text-sm font-semibold text-green-600">
                            💰 {formatCurrency(backlink.price)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {backlink.last_checked 
                        ? new Date(backlink.last_checked).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(backlink)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleCheckBacklink(backlink.id)}
                          disabled={checkingId === backlink.id}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {checkingId === backlink.id ? '⏳' : '🔍'} 
                          {checkingId === backlink.id ? 'Verificando...' : 'Verificar'}
                        </button>
                        <button 
                          onClick={() => handleDelete(backlink.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBacklinks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🔗</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {backlinks.length === 0 ? 'Nenhum backlink cadastrado' : 'Nenhum backlink encontrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {backlinks.length === 0 
              ? 'Comece adicionando seu primeiro backlink para gerenciar.'
              : 'Tente ajustar os filtros para encontrar o que procura.'
            }
          </p>
          {backlinks.length === 0 && (
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔗 Adicionar Primeiro Backlink
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Backlinks;
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
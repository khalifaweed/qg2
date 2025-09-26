import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SEO() {
  const [activeTab, setActiveTab] = useState('keywords');
  const [keywords, setKeywords] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [audits, setAudits] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterSite, setFilterSite] = useState('all');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
    fetchSites();
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-chave *</label>
                <input
                  type="text"
                  value={formData.keyword || ''}
                  onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site *</label>
                <select
                  value={formData.site_id || ''}
                  onChange={(e) => setFormData({...formData, site_id: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um site...</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de Destino</label>
              <input
                type="url"
                value={formData.target_url || ''}
                onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume de Busca</label>
                <input
                  type="number"
                  value={formData.search_volume || ''}
                  onChange={(e) => setFormData({...formData, search_volume: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
                <select
                  value={formData.difficulty || 'medium'}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posição Atual</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.current_position || ''}
                onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Posição no Google (1-100)"
              />
            </div>
          </>
        );
      case 'rankings':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-chave *</label>
                <input
                  type="text"
                  value={formData.keyword || ''}
                  onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site *</label>
                <select
                  value={formData.site_id || ''}
                  onChange={(e) => setFormData({...formData, site_id: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um site...</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de Destino</label>
              <input
                type="url"
                value={formData.target_url || ''}
                onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posição Atual</label>
                <input
                  type="number"
                  value={formData.current_position || ''}
                  onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                  min="1"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posição Alvo</label>
                <input
                  type="number"
                  value={formData.target_position || ''}
                  onChange={(e) => setFormData({...formData, target_position: e.target.value})}
                  min="1"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getSiteById = (siteId) => {
    return sites.find(site => site.id == siteId);
  };

  const filteredKeywords = keywords.filter(keyword => {
    return filterSite === 'all' || keyword.site_id == filterSite;
  });

  const filteredRankings = rankings.filter(ranking => {
    return filterSite === 'all' || ranking.site_id == filterSite;
  });

  const renderKeywords = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Palavras-chave</h2>
          <p className="text-gray-600">Gerencie palavras-chave por site</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="mr-2">🔍</span>
          Nova Palavra-chave
        </button>
      </div>
      
      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Filtrar por site:</label>
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os sites</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKeywords.map((keyword) => {
          const relatedSite = getSiteById(keyword.site_id);
          return (
            <div key={keyword.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{keyword.keyword}</h3>
                  {relatedSite && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="mr-1">🌐</span>
                      {relatedSite.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(keyword)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(keyword.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {keyword.target_url && (
                  <div>
                    <span className="text-xs text-gray-500 block">URL de Destino:</span>
                    <a 
                      href={keyword.target_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                    >
                      {keyword.target_url.length > 40 
                        ? keyword.target_url.substring(0, 40) + '...' 
                        : keyword.target_url}
                    </a>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">Volume de Busca</span>
                    <span className="text-sm font-medium text-gray-900">
                      {keyword.search_volume ? keyword.search_volume.toLocaleString() : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Dificuldade</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      keyword.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      keyword.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {keyword.difficulty === 'easy' ? '🟢 Fácil' : 
                       keyword.difficulty === 'medium' ? '🟡 Médio' : '🔴 Difícil'}
                    </span>
                  </div>
                </div>
                
                {keyword.current_position && (
                  <div>
                    <span className="text-xs text-gray-500 block">Posição Atual</span>
                    <span className={`text-lg font-bold ${
                      keyword.current_position <= 3 ? 'text-green-600' :
                      keyword.current_position <= 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      #{keyword.current_position}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Criado em {new Date(keyword.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRankings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rankings</h2>
          <p className="text-gray-600">Acompanhe posições no Google</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="mr-2">📊</span>
          Novo Ranking
        </button>
      </div>
      
      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Filtrar por site:</label>
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os sites</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Rankings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Palavra-chave & Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL de Destino
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição Anterior
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição Atual
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição Alvo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRankings.map((ranking) => {
                const relatedSite = getSiteById(ranking.site_id);
                const variation = ranking.previous_position && ranking.current_position 
                  ? ranking.previous_position - ranking.current_position 
                  : 0;
                
                return (
                  <tr key={ranking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ranking.keyword}</div>
                        {relatedSite && (
                          <div className="text-sm text-gray-500">🌐 {relatedSite.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {ranking.target_url && (
                        <a 
                          href={ranking.target_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                        >
                          {ranking.target_url.length > 40 
                            ? ranking.target_url.substring(0, 40) + '...' 
                            : ranking.target_url}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">
                        {ranking.previous_position ? `#${ranking.previous_position}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ranking.current_position ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ranking.current_position <= 3 ? 'bg-green-100 text-green-800' :
                          ranking.current_position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          ranking.current_position <= 30 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          #{ranking.current_position}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">
                        {ranking.target_position ? `#${ranking.target_position}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {variation !== 0 ? (
                        <span className={`inline-flex items-center text-sm font-medium ${
                          variation > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {variation > 0 ? '↗️' : '↘️'} {Math.abs(variation)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(ranking)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(ranking.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
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
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auditorias SEO</h2>
          <p className="text-gray-600">Análises técnicas dos sites</p>
        </div>
        <button 
          onClick={() => {
            const siteId = prompt('Digite o ID do site para auditoria:');
            if (siteId) handleRunAudit(siteId);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="mr-2">🔍</span>
          Nova Auditoria
        </button>
      </div>
      
      {/* Audits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audits.map((audit) => (
          <div key={audit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {audit.site_name || `Site ID: ${audit.site_id}`}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(audit.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                audit.status === 'running' ? 'bg-blue-100 text-blue-800' :
                audit.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {audit.status === 'completed' ? '✅ Concluída' : 
                 audit.status === 'running' ? '⏳ Executando' : 
                 audit.status === 'failed' ? '❌ Falhou' : '⏸️ Pendente'}
              </span>
            </div>
            
            {audit.results && audit.status === 'completed' && (
              <div className="space-y-4">
                {(() => {
                  try {
                    const results = JSON.parse(audit.results);
                    return (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Score SEO</span>
                            <span className={`text-2xl font-bold ${
                              results.seo_score >= 80 ? 'text-green-600' : 
                              results.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {results.seo_score}/100
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Problemas encontrados:</span>
                          <span className="font-medium text-red-600">{results.issues_count}</span>
                        </div>
                        {results.recommendations && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recomendações:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {results.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  } catch (e) {
                    return <p className="text-sm text-red-600">Erro ao carregar resultados</p>;
                  }
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-gray-900">SEO & Marketing</h1>
        <p className="mt-2 text-gray-600">Gerencie palavras-chave, rankings e auditorias por site</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('keywords')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'keywords'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 Palavras-chave
          </button>
          <button 
            onClick={() => setActiveTab('rankings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'rankings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Rankings
          </button>
          <button 
            onClick={() => setActiveTab('audits')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'audits'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 Auditorias
          </button>
        </nav>
      </div>

      {showForm && activeTab !== 'audits' && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Editar' : 'Nova'} {activeTab === 'keywords' ? 'Palavra-chave' : 'Ranking'}
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
              {getFormFields()}
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

      {/* Content */}
      <div>
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'rankings' && renderRankings()}
        {activeTab === 'audits' && renderAudits()}
      </div>

      {/* Empty States */}
      {((activeTab === 'keywords' && filteredKeywords.length === 0) ||
        (activeTab === 'rankings' && filteredRankings.length === 0) ||
        (activeTab === 'audits' && audits.length === 0)) && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">
              {activeTab === 'keywords' ? '🔍' : activeTab === 'rankings' ? '📊' : '🔍'}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum dado encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'keywords' && keywords.length === 0 && 'Comece adicionando sua primeira palavra-chave.'}
            {activeTab === 'keywords' && keywords.length > 0 && 'Nenhuma palavra-chave encontrada para o filtro selecionado.'}
            {activeTab === 'rankings' && rankings.length === 0 && 'Comece adicionando seu primeiro ranking.'}
            {activeTab === 'rankings' && rankings.length > 0 && 'Nenhum ranking encontrado para o filtro selecionado.'}
            {activeTab === 'audits' && 'Nenhuma auditoria foi executada ainda.'}
          </p>
          {activeTab !== 'audits' && (keywords.length === 0 || rankings.length === 0) && (
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {activeTab === 'keywords' ? '🔍 Adicionar Primeira Palavra-chave' : '📊 Adicionar Primeiro Ranking'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SEO;
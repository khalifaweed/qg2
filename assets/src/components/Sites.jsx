import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Utility function to get favicon URL
const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (e) {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/></svg>';
  }
};

// Status icons mapping
const getStatusIcon = (status) => {
  const icons = {
    'active': '🟢',
    'inactive': '🔴',
    'maintenance': '🟡'
  };
  return icons[status] || '⚪';
};

const getUptimeIcon = (uptime) => {
  const icons = {
    'up': '✅',
    'down': '❌',
    'unknown': '❓'
  };
  return icons[uptime] || '❓';
};

function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('identification');
  const [formData, setFormData] = useState({
    // Identification
    name: '',
    primary_url: '',
    other_urls: '',
    category: '',
    cms: '',
    status: 'active',
    
    // Technical Management
    server: '',
    hosting_provider: '',
    hosting_type: 'shared',
    ftp_credentials: { host: '', username: '', password: '', port: '21' },
    ssh_credentials: { host: '', username: '', password: '', port: '22' },
    db_credentials: { host: '', database: '', username: '', password: '', port: '3306' },
    
    // Responsible
    responsible_user_id: '',
    team_members: '',
    external_providers: '',
    
    // Integrations
    google_analytics_id: '',
    search_console_url: '',
    tag_manager_id: '',
    facebook_pixel_id: '',
    webhook_urls: '',
    
    // SEO & Marketing
    main_keywords: '',
    backlinks_count: 0,
    last_audit_date: '',
    indexation_status: 'unknown',
    
    // Financial
    hosting_cost: 0,
    extra_costs: 0,
    estimated_revenue: 0,
    roi: 0,
    
    // Monitoring
    ssl_status: 'valid',
    dns_status: 'ok',
    uptime_alerts: 'enabled',
    
    // Documentation
    internal_notes: ''
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await api.get('/sites');
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/sites/${editingId}`, formData);
      } else {
        await api.post('/sites', formData);
      }
      resetForm();
      fetchSites();
    } catch (error) {
      console.error('Error saving site:', error);
      alert('Erro ao salvar site. Tente novamente.');
    }
  };

  const handleEdit = (site) => {
    setFormData({
      // Identification
      name: site.name || '',
      primary_url: site.primary_url || '',
      other_urls: site.other_urls || '',
      category: site.category || '',
      cms: site.cms || '',
      status: site.status || 'active',
      
      // Technical Management
      server: site.server || '',
      hosting_provider: site.hosting_provider || '',
      hosting_type: site.hosting_type || 'shared',
      ftp_credentials: (() => {
        try {
          return site.ftp_credentials ? JSON.parse(site.ftp_credentials) : { host: '', username: '', password: '', port: '21' };
        } catch (e) {
          return { host: '', username: '', password: '', port: '21' };
        }
      })(),
      ssh_credentials: (() => {
        try {
          return site.ssh_credentials ? JSON.parse(site.ssh_credentials) : { host: '', username: '', password: '', port: '22' };
        } catch (e) {
          return { host: '', username: '', password: '', port: '22' };
        }
      })(),
      db_credentials: (() => {
        try {
          return site.db_credentials ? JSON.parse(site.db_credentials) : { host: '', database: '', username: '', password: '', port: '3306' };
        } catch (e) {
          return { host: '', database: '', username: '', password: '', port: '3306' };
        }
      })(),
      
      // Responsible
      responsible_user_id: site.responsible_user_id || '',
      team_members: site.team_members || '',
      external_providers: site.external_providers || '',
      
      // Integrations
      google_analytics_id: site.google_analytics_id || '',
      search_console_url: site.search_console_url || '',
      tag_manager_id: site.tag_manager_id || '',
      facebook_pixel_id: site.facebook_pixel_id || '',
      webhook_urls: site.webhook_urls || '',
      
      // SEO & Marketing
      main_keywords: site.main_keywords || '',
      backlinks_count: site.backlinks_count || 0,
      last_audit_date: site.last_audit_date || '',
      indexation_status: site.indexation_status || 'unknown',
      
      // Financial
      hosting_cost: site.hosting_cost || 0,
      extra_costs: site.extra_costs || 0,
      estimated_revenue: site.estimated_revenue || 0,
      roi: site.roi || 0,
      
      // Monitoring
      ssl_status: site.ssl_status || 'valid',
      dns_status: site.dns_status || 'ok',
      uptime_alerts: site.uptime_alerts || 'enabled',
      
      // Documentation
      internal_notes: site.internal_notes || ''
    });
    setEditingId(site.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este site?')) {
      try {
        await api.delete(`/sites/${id}`);
        fetchSites();
      } catch (error) {
        console.error('Error deleting site:', error);
        alert('Erro ao excluir site. Tente novamente.');
      }
    }
  };

  const handleCheckUptime = async (site) => {
    try {
      const response = await api.post(`/sites/${site.id}/check-uptime`);
      if (response.data.success) {
        alert(`Status do site: ${response.data.is_up ? 'Online' : 'Offline'}`);
        fetchSites();
      }
    } catch (error) {
      console.error('Error checking uptime:', error);
      alert('Erro ao verificar uptime. Tente novamente.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      primary_url: '',
      other_urls: '',
      category: '',
      cms: '',
      status: 'active',
      server: '',
      hosting_provider: '',
      hosting_type: 'shared',
      ftp_credentials: { host: '', username: '', password: '', port: '21' },
      ssh_credentials: { host: '', username: '', password: '', port: '22' },
      db_credentials: { host: '', database: '', username: '', password: '', port: '3306' },
      responsible_user_id: '',
      team_members: '',
      external_providers: '',
      google_analytics_id: '',
      search_console_url: '',
      tag_manager_id: '',
      facebook_pixel_id: '',
      webhook_urls: '',
      main_keywords: '',
      backlinks_count: 0,
      last_audit_date: '',
      indexation_status: 'unknown',
      hosting_cost: 0,
      extra_costs: 0,
      estimated_revenue: 0,
      roi: 0,
      ssl_status: 'valid',
      dns_status: 'ok',
      uptime_alerts: 'enabled',
      internal_notes: ''
    });
    setEditingId(null);
    setShowForm(false);
    setActiveTab('identification');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'maintenance': return 'orange';
      default: return 'gray';
    }
  };

  const getUptimeColor = (uptime) => {
    switch (uptime) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const renderFormTab = () => {
    switch (activeTab) {
      case 'identification':
        return (
          <>
            <div className="form-group">
              <label>Nome do Site *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>URL Principal *</label>
              <input
                type="url"
                value={formData.primary_url}
                onChange={(e) => setFormData({...formData, primary_url: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Outras URLs</label>
              <textarea
                value={formData.other_urls}
                onChange={(e) => setFormData({...formData, other_urls: e.target.value})}
                placeholder="Uma URL por linha"
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="blog">Blog</option>
                  <option value="corporate">Corporativo</option>
                  <option value="portfolio">Portfólio</option>
                  <option value="landing">Landing Page</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>CMS</label>
                <select
                  value={formData.cms}
                  onChange={(e) => setFormData({...formData, cms: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="wordpress">WordPress</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="shopify">Shopify</option>
                  <option value="magento">Magento</option>
                  <option value="drupal">Drupal</option>
                  <option value="joomla">Joomla</option>
                  <option value="custom">Personalizado</option>
                  <option value="static">Site Estático</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="maintenance">Manutenção</option>
              </select>
            </div>
          </>
        );

      case 'technical':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Servidor</label>
                <input
                  type="text"
                  value={formData.server}
                  onChange={(e) => setFormData({...formData, server: e.target.value})}
                  placeholder="Ex: AWS, DigitalOcean, etc."
                />
              </div>
              <div className="form-group">
                <label>Provedor de Hospedagem</label>
                <input
                  type="text"
                  value={formData.hosting_provider}
                  onChange={(e) => setFormData({...formData, hosting_provider: e.target.value})}
                  placeholder="Ex: Hostgator, SiteGround, etc."
                />
              </div>
            </div>
            <div className="form-group">
              <label>Tipo de Hospedagem</label>
              <select
                value={formData.hosting_type}
                onChange={(e) => setFormData({...formData, hosting_type: e.target.value})}
              >
                <option value="shared">Compartilhada</option>
                <option value="vps">VPS</option>
                <option value="dedicated">Dedicada</option>
                <option value="cloud">Cloud</option>
              </select>
            </div>
            
            <h4>Credenciais FTP</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Host FTP</label>
                <input
                  type="text"
                  value={formData.ftp_credentials.host}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ftp_credentials: {...formData.ftp_credentials, host: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Porta</label>
                <input
                  type="text"
                  value={formData.ftp_credentials.port}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ftp_credentials: {...formData.ftp_credentials, port: e.target.value}
                  })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Usuário FTP</label>
                <input
                  type="text"
                  value={formData.ftp_credentials.username}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ftp_credentials: {...formData.ftp_credentials, username: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Senha FTP</label>
                <input
                  type="password"
                  value={formData.ftp_credentials.password}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ftp_credentials: {...formData.ftp_credentials, password: e.target.value}
                  })}
                />
              </div>
            </div>

            <h4>Credenciais SSH</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Host SSH</label>
                <input
                  type="text"
                  value={formData.ssh_credentials.host}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ssh_credentials: {...formData.ssh_credentials, host: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Porta</label>
                <input
                  type="text"
                  value={formData.ssh_credentials.port}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ssh_credentials: {...formData.ssh_credentials, port: e.target.value}
                  })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Usuário SSH</label>
                <input
                  type="text"
                  value={formData.ssh_credentials.username}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ssh_credentials: {...formData.ssh_credentials, username: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Senha SSH</label>
                <input
                  type="password"
                  value={formData.ssh_credentials.password}
                  onChange={(e) => setFormData({
                    ...formData, 
                    ssh_credentials: {...formData.ssh_credentials, password: e.target.value}
                  })}
                />
              </div>
            </div>

            <h4>Credenciais do Banco de Dados</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Host DB</label>
                <input
                  type="text"
                  value={formData.db_credentials.host}
                  onChange={(e) => setFormData({
                    ...formData, 
                    db_credentials: {...formData.db_credentials, host: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Porta</label>
                <input
                  type="text"
                  value={formData.db_credentials.port}
                  onChange={(e) => setFormData({
                    ...formData, 
                    db_credentials: {...formData.db_credentials, port: e.target.value}
                  })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nome do Banco</label>
                <input
                  type="text"
                  value={formData.db_credentials.database}
                  onChange={(e) => setFormData({
                    ...formData, 
                    db_credentials: {...formData.db_credentials, database: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>Usuário DB</label>
                <input
                  type="text"
                  value={formData.db_credentials.username}
                  onChange={(e) => setFormData({
                    ...formData, 
                    db_credentials: {...formData.db_credentials, username: e.target.value}
                  })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Senha DB</label>
              <input
                type="password"
                value={formData.db_credentials.password}
                onChange={(e) => setFormData({
                  ...formData, 
                  db_credentials: {...formData.db_credentials, password: e.target.value}
                })}
              />
            </div>
          </>
        );

      case 'responsible':
        return (
          <>
            <div className="form-group">
              <label>ID do Responsável</label>
              <input
                type="number"
                value={formData.responsible_user_id}
                onChange={(e) => setFormData({...formData, responsible_user_id: e.target.value})}
                placeholder="ID do usuário responsável"
              />
            </div>
            <div className="form-group">
              <label>Membros da Equipe</label>
              <textarea
                value={formData.team_members}
                onChange={(e) => setFormData({...formData, team_members: e.target.value})}
                placeholder="Lista de membros da equipe envolvidos"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Prestadores Externos</label>
              <textarea
                value={formData.external_providers}
                onChange={(e) => setFormData({...formData, external_providers: e.target.value})}
                placeholder="Freelancers, agências ou outros prestadores"
                rows="3"
              />
            </div>
          </>
        );

      case 'integrations':
        return (
          <>
            <div className="form-group">
              <label>Google Analytics ID</label>
              <input
                type="text"
                value={formData.google_analytics_id}
                onChange={(e) => setFormData({...formData, google_analytics_id: e.target.value})}
                placeholder="GA4-XXXXXXXXX"
              />
            </div>
            <div className="form-group">
              <label>Search Console URL</label>
              <input
                type="url"
                value={formData.search_console_url}
                onChange={(e) => setFormData({...formData, search_console_url: e.target.value})}
                placeholder="https://search.google.com/search-console"
              />
            </div>
            <div className="form-group">
              <label>Tag Manager ID</label>
              <input
                type="text"
                value={formData.tag_manager_id}
                onChange={(e) => setFormData({...formData, tag_manager_id: e.target.value})}
                placeholder="GTM-XXXXXXX"
              />
            </div>
            <div className="form-group">
              <label>Facebook Pixel ID</label>
              <input
                type="text"
                value={formData.facebook_pixel_id}
                onChange={(e) => setFormData({...formData, facebook_pixel_id: e.target.value})}
                placeholder="123456789012345"
              />
            </div>
            <div className="form-group">
              <label>Webhook URLs</label>
              <textarea
                value={formData.webhook_urls}
                onChange={(e) => setFormData({...formData, webhook_urls: e.target.value})}
                placeholder="Uma URL por linha"
                rows="3"
              />
            </div>
          </>
        );

      case 'seo':
        return (
          <>
            <div className="form-group">
              <label>Palavras-chave Principais</label>
              <textarea
                value={formData.main_keywords}
                onChange={(e) => setFormData({...formData, main_keywords: e.target.value})}
                placeholder="Uma palavra-chave por linha"
                rows="4"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantidade de Backlinks</label>
                <input
                  type="number"
                  value={formData.backlinks_count}
                  onChange={(e) => setFormData({...formData, backlinks_count: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Última Auditoria</label>
                <input
                  type="date"
                  value={formData.last_audit_date}
                  onChange={(e) => setFormData({...formData, last_audit_date: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Status de Indexação</label>
              <select
                value={formData.indexation_status}
                onChange={(e) => setFormData({...formData, indexation_status: e.target.value})}
              >
                <option value="unknown">Desconhecido</option>
                <option value="indexed">Indexado</option>
                <option value="not_indexed">Não Indexado</option>
                <option value="partial">Parcialmente Indexado</option>
              </select>
            </div>
          </>
        );

      case 'financial':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Custo de Hospedagem (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hosting_cost}
                  onChange={(e) => setFormData({...formData, hosting_cost: parseFloat(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Custos Extras (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.extra_costs}
                  onChange={(e) => setFormData({...formData, extra_costs: parseFloat(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Receita Estimada (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.estimated_revenue}
                  onChange={(e) => setFormData({...formData, estimated_revenue: parseFloat(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>ROI (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.roi}
                  onChange={(e) => setFormData({...formData, roi: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </>
        );

      case 'monitoring':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Status SSL</label>
                <select
                  value={formData.ssl_status}
                  onChange={(e) => setFormData({...formData, ssl_status: e.target.value})}
                >
                  <option value="valid">Válido</option>
                  <option value="invalid">Inválido</option>
                  <option value="expired">Expirado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status DNS</label>
                <select
                  value={formData.dns_status}
                  onChange={(e) => setFormData({...formData, dns_status: e.target.value})}
                >
                  <option value="ok">OK</option>
                  <option value="warning">Aviso</option>
                  <option value="error">Erro</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Alertas de Uptime</label>
              <select
                value={formData.uptime_alerts}
                onChange={(e) => setFormData({...formData, uptime_alerts: e.target.value})}
              >
                <option value="enabled">Habilitado</option>
                <option value="disabled">Desabilitado</option>
              </select>
            </div>
          </>
        );

      case 'documentation':
        return (
          <>
            <div className="form-group">
              <label>Notas Internas</label>
              <textarea
                value={formData.internal_notes}
                onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
                placeholder="Observações, instruções especiais, histórico, etc."
                rows="6"
              />
            </div>
            <div className="form-group">
              <label>Arquivos Anexos</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                onChange={(e) => {
                  // Placeholder for file handling
                  console.log('Files selected:', e.target.files);
                }}
              />
              <small>Formatos aceitos: PDF, DOC, DOCX, TXT, JPG, PNG</small>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Carregando sites...</div>;
  }

  return (
    <div className="sites">
      <div className="page-header">
        <h1>Gestão de Sites</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Adicionar Site
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>{editingId ? 'Editar Site' : 'Novo Site'}</h2>
              <button 
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            
            <div className="modal-tabs">
              <button 
                className={`tab ${activeTab === 'identification' ? 'active' : ''}`}
                onClick={() => setActiveTab('identification')}
              >
                Identificação
              </button>
              <button 
                className={`tab ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                Técnico
              </button>
              <button 
                className={`tab ${activeTab === 'responsible' ? 'active' : ''}`}
                onClick={() => setActiveTab('responsible')}
              >
                Responsáveis
              </button>
              <button 
                className={`tab ${activeTab === 'integrations' ? 'active' : ''}`}
                onClick={() => setActiveTab('integrations')}
              >
                Integrações
              </button>
              <button 
                className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
                onClick={() => setActiveTab('seo')}
              >
                SEO
              </button>
              <button 
                className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
                onClick={() => setActiveTab('financial')}
              >
                Financeiro
              </button>
              <button 
                className={`tab ${activeTab === 'monitoring' ? 'active' : ''}`}
                onClick={() => setActiveTab('monitoring')}
              >
                Monitoramento
              </button>
              <button 
                className={`tab ${activeTab === 'documentation' ? 'active' : ''}`}
                onClick={() => setActiveTab('documentation')}
              >
                Documentação
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="form">
              <div className="form-content">
                {renderFormTab()}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Header with favicon and status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img 
                    src={getFaviconUrl(site.primary_url)} 
                    alt="Favicon"
                    className="w-8 h-8 rounded-full bg-white p-1 shadow-sm"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray"><circle cx="12" cy="12" r="10"/></svg>';
                    }}
                  />
                  <h3 className="font-semibold text-gray-800 truncate">{site.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg" title={`Status: ${site.status}`}>
                    {getStatusIcon(site.status)}
                  </span>
                  <span className="text-lg" title={`Uptime: ${site.uptime_status || 'unknown'}`}>
                    {getUptimeIcon(site.uptime_status)}
                  </span>
                </div>
              </div>
              <a 
                href={site.primary_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 truncate block"
              >
                {site.primary_url}
              </a>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {site.category && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📂</span>
                    <span className="text-gray-600 truncate">{site.category}</span>
                  </div>
                )}
                {site.cms && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">⚙️</span>
                    <span className="text-gray-600 truncate">{site.cms}</span>
                  </div>
                )}
                {site.hosting_provider && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">🏢</span>
                    <span className="text-gray-600 truncate">{site.hosting_provider}</span>
                  </div>
                )}
                {site.responsible_name && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">👤</span>
                    <span className="text-gray-600 truncate">{site.responsible_name}</span>
                  </div>
                )}
              </div>
              
              {/* Financial Info */}
              {site.hosting_cost > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">💰 Custo Mensal</span>
                    <span className="font-semibold text-green-700">
                      {formatCurrency(site.hosting_cost)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Last Check */}
              {site.last_uptime_check && (
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <span>🕒</span>
                  <span>Última verificação: {new Date(site.last_uptime_check).toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(site)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleCheckUptime(site)}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    🔍 Verificar
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(site.id)}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🌐</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum site cadastrado</h3>
          <p className="text-gray-500 mb-6">Comece adicionando seu primeiro site para gerenciar.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Adicionar Primeiro Site
          </button>
        </div>
      )}
    </div>
  );
}

export default Sites;
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Automation() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [integrations, setIntegrations] = useState({});
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
        case 'rules':
          const rulesResponse = await api.get('/automation/rules');
          setRules(rulesResponse.data);
          break;
        case 'webhooks':
          const webhooksResponse = await api.get('/automation/webhooks');
          setWebhooks(webhooksResponse.data);
          break;
        case 'integrations':
          const integrationsResponse = await api.get('/integrations');
          setIntegrations(integrationsResponse.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `/automation/${activeTab}`;
      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving automation data:', error);
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
        await api.delete(`/automation/${activeTab}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Erro ao excluir. Tente novamente.');
      }
    }
  };

  const handleTestWebhook = async (id) => {
    try {
      const response = await api.post(`/automation/webhooks/${id}/test`);
      if (response.data.success) {
        alert(`Webhook testado com sucesso! Status: ${response.data.status_code}`);
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      alert('Erro ao testar webhook. Verifique a URL e tente novamente.');
    }
  };

  const handleSaveIntegration = async (type, config) => {
    try {
      await api.post(`/integrations/${type}`, { config });
      alert('Integração salva com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error saving integration:', error);
      alert('Erro ao salvar integração. Tente novamente.');
    }
  };

  const handleTestIntegration = async (type, config) => {
    try {
      const response = await api.post(`/integrations/${type}/test`, { config });
      if (response.data.success) {
        alert(`Integração testada com sucesso! ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error testing integration:', error);
      alert('Erro ao testar integração. Verifique as configurações.');
    }
  };

  const handleDeleteIntegration = async (type) => {
    if (window.confirm('Tem certeza que deseja desconectar esta integração?')) {
      try {
        await api.delete(`/integrations/${type}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting integration:', error);
        alert('Erro ao desconectar integração.');
      }
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <>
            <div className="form-group">
              <label>Nome da Regra *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Gatilho *</label>
              <select
                value={formData.trigger || ''}
                onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                required
              >
                <option value="">Selecione...</option>
                <option value="new_lead">Novo Lead</option>
                <option value="lead_status_change">Mudança de Status do Lead</option>
                <option value="task_completed">Tarefa Concluída</option>
                <option value="site_down">Site Offline</option>
                <option value="new_backlink">Novo Backlink</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ação *</label>
              <select
                value={formData.action || ''}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
                required
              >
                <option value="">Selecione...</option>
                <option value="send_email">Enviar Email</option>
                <option value="send_webhook">Enviar Webhook</option>
                <option value="create_task">Criar Tarefa</option>
                <option value="send_notification">Enviar Notificação</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condições</label>
              <textarea
                value={formData.conditions || ''}
                onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                placeholder="Ex: status = 'qualified' AND source = 'website'"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>URL do Webhook</label>
              <input
                type="url"
                value={formData.webhook_url || ''}
                onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
                placeholder="https://exemplo.com/webhook"
              />
            </div>
            <div className="form-group">
              <label>Template de Email</label>
              <textarea
                value={formData.email_template || ''}
                onChange={(e) => setFormData({...formData, email_template: e.target.value})}
                placeholder="Assunto: {{subject}}\n\nOlá {{name}},\n\n{{message}}"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                Regra Ativa
              </label>
            </div>
          </>
        );
      case 'webhooks':
        return (
          <>
            <div className="form-group">
              <label>Nome do Webhook *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>URL do Webhook *</label>
              <input
                type="url"
                value={formData.webhook_url || ''}
                onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Gatilho *</label>
              <select
                value={formData.trigger || ''}
                onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                required
              >
                <option value="">Selecione...</option>
                <option value="new_lead">Novo Lead</option>
                <option value="lead_converted">Lead Convertido</option>
                <option value="task_completed">Tarefa Concluída</option>
                <option value="site_down">Site Offline</option>
                <option value="financial_record">Novo Registro Financeiro</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                Webhook Ativo
              </label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderRules = () => (
    <div className="rules-section">
      <div className="section-header">
        <h2>Regras de Automação</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nova Regra
        </button>
      </div>
      
      <div className="rules-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Gatilho</th>
              <th>Ação</th>
              <th>Status</th>
              <th>Execuções</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td><strong>{rule.name}</strong></td>
                <td>{rule.trigger}</td>
                <td>{rule.action}</td>
                <td>
                  <span className={`status-badge ${rule.is_active ? 'active' : 'inactive'}`}>
                    {rule.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>{rule.execution_count || 0}</td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleEdit(rule)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(rule.id)}
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

  const renderWebhooks = () => (
    <div className="webhooks-section">
      <div className="section-header">
        <h2>Webhooks</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Webhook
        </button>
      </div>
      
      <div className="webhooks-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>URL</th>
              <th>Gatilho</th>
              <th>Status</th>
              <th>Última Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <tr key={webhook.id}>
                <td><strong>{webhook.name}</strong></td>
                <td>
                  <a href={webhook.webhook_url} target="_blank" rel="noopener noreferrer">
                    {webhook.webhook_url.length > 40 
                      ? webhook.webhook_url.substring(0, 40) + '...' 
                      : webhook.webhook_url}
                  </a>
                </td>
                <td>{webhook.trigger}</td>
                <td>
                  <span className={`status-badge ${webhook.is_active ? 'active' : 'inactive'}`}>
                    {webhook.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  {webhook.last_execution 
                    ? new Date(webhook.last_execution).toLocaleString()
                    : 'Nunca'
                  }
                </td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => handleEdit(webhook)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleTestWebhook(webhook.id)}
                    >
                      Testar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(webhook.id)}
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

  const renderIntegrations = () => (
    <div className="integrations-section">
      <div className="section-header">
        <h2>Integrações</h2>
      </div>
      
      <div className="integrations-grid">
        {Object.entries(integrations).map(([type, integration]) => (
          <IntegrationCard
            key={type}
            type={type}
            integration={integration}
            onSave={handleSaveIntegration}
            onTest={handleTestIntegration}
            onDelete={handleDeleteIntegration}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Carregando automações...</div>;
  }

  return (
    <div className="automation">
      <div className="page-header">
        <h1>Automação</h1>
      </div>

      <div className="automation-tabs">
        <button 
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Regras
        </button>
        <button 
          className={`tab ${activeTab === 'webhooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('webhooks')}
        >
          Webhooks
        </button>
        <button 
          className={`tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrações
        </button>
      </div>

      {showForm && activeTab !== 'integrations' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Editar' : 'Nova'} {activeTab === 'rules' ? 'Regra' : 'Webhook'}</h2>
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

      <div className="automation-content">
        {activeTab === 'rules' && renderRules()}
        {activeTab === 'webhooks' && renderWebhooks()}
        {activeTab === 'integrations' && renderIntegrations()}
      </div>
    </div>
  );
}

// Component for integration cards
function IntegrationCard({ type, integration, onSave, onTest, onDelete }) {
  const [config, setConfig] = useState(integration.config || {});
  const [showConfig, setShowConfig] = useState(false);

  const getIntegrationName = (type) => {
    const names = {
      'google_analytics': 'Google Analytics',
      'google_search_console': 'Google Search Console',
      'webhooks': 'Webhooks Gerais'
    };
    return names[type] || type;
  };

  const getConfigFields = () => {
    switch (type) {
      case 'google_analytics':
        return (
          <>
            <div className="form-group">
              <label>Property ID</label>
              <input
                type="text"
                value={config.property_id || ''}
                onChange={(e) => setConfig({...config, property_id: e.target.value})}
                placeholder="GA4-XXXXXXXXX"
              />
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={config.api_key || ''}
                onChange={(e) => setConfig({...config, api_key: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client ID</label>
              <input
                type="text"
                value={config.client_id || ''}
                onChange={(e) => setConfig({...config, client_id: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client Secret</label>
              <input
                type="password"
                value={config.client_secret || ''}
                onChange={(e) => setConfig({...config, client_secret: e.target.value})}
              />
            </div>
          </>
        );
      case 'google_search_console':
        return (
          <>
            <div className="form-group">
              <label>Site URL</label>
              <input
                type="url"
                value={config.site_url || ''}
                onChange={(e) => setConfig({...config, site_url: e.target.value})}
                placeholder="https://meusite.com"
              />
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={config.api_key || ''}
                onChange={(e) => setConfig({...config, api_key: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client ID</label>
              <input
                type="text"
                value={config.client_id || ''}
                onChange={(e) => setConfig({...config, client_id: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Client Secret</label>
              <input
                type="password"
                value={config.client_secret || ''}
                onChange={(e) => setConfig({...config, client_secret: e.target.value})}
              />
            </div>
          </>
        );
      case 'webhooks':
        return (
          <>
            <div className="form-group">
              <label>Endpoint URL</label>
              <input
                type="url"
                value={config.endpoint_url || ''}
                onChange={(e) => setConfig({...config, endpoint_url: e.target.value})}
                placeholder="https://exemplo.com/webhook"
              />
            </div>
            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="password"
                value={config.secret_key || ''}
                onChange={(e) => setConfig({...config, secret_key: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Eventos</label>
              <div className="checkbox-group">
                {['new_lead', 'lead_converted', 'task_completed', 'site_down'].map(event => (
                  <label key={event}>
                    <input
                      type="checkbox"
                      checked={(config.events || []).includes(event)}
                      onChange={(e) => {
                        const events = config.events || [];
                        if (e.target.checked) {
                          setConfig({...config, events: [...events, event]});
                        } else {
                          setConfig({...config, events: events.filter(ev => ev !== event)});
                        }
                      }}
                    />
                    {event}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return <p>Configuração não disponível para este tipo de integração.</p>;
    }
  };

  return (
    <div className="integration-card">
      <div className="integration-header">
        <h3>{getIntegrationName(type)}</h3>
        <span className={`status-badge ${integration.status === 'connected' ? 'connected' : 'disconnected'}`}>
          {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
      
      <div className="integration-actions">
        <button 
          className="btn btn-sm"
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig ? 'Ocultar' : 'Configurar'}
        </button>
        {integration.status === 'connected' && (
          <>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => onTest(type, config)}
            >
              Testar
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(type)}
            >
              Desconectar
            </button>
          </>
        )}
      </div>

      {showConfig && (
        <div className="integration-config">
          <form onSubmit={(e) => {
            e.preventDefault();
            onSave(type, config);
          }}>
            {getConfigFields()}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Salvar Configuração
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Automation;
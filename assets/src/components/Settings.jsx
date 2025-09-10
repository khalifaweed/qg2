import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Settings() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [integrations, setIntegrations] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'integrations') {
      fetchIntegrations();
    }
  }, [activeTab]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/integrations');
      setIntegrations(response.data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setMessage('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const saveIntegration = async (type, config) => {
    try {
      setLoading(true);
      await api.post(`/integrations/${type}`, { config });
      setMessage('Integração salva com sucesso!');
      fetchIntegrations();
    } catch (error) {
      console.error('Error saving integration:', error);
      setMessage('Erro ao salvar integração');
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (type, config) => {
    try {
      setLoading(true);
      const response = await api.post(`/integrations/${type}/test`, { config });
      if (response.data.success) {
        setMessage('Teste de integração bem-sucedido!');
      } else {
        setMessage('Falha no teste de integração');
      }
    } catch (error) {
      console.error('Error testing integration:', error);
      setMessage('Erro ao testar integração');
    } finally {
      setLoading(false);
    }
  };

  const deleteIntegration = async (type) => {
    if (!confirm('Tem certeza que deseja remover esta integração?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/integrations/${type}`);
      setMessage('Integração removida com sucesso!');
      fetchIntegrations();
    } catch (error) {
      console.error('Error deleting integration:', error);
      setMessage('Erro ao remover integração');
    } finally {
      setLoading(false);
    }
  };

  const GoogleAnalyticsForm = ({ integration }) => {
    const [config, setConfig] = useState(integration?.config || {});

    const handleSubmit = (e) => {
      e.preventDefault();
      saveIntegration('google_analytics', config);
    };

    const handleTest = () => {
      testIntegration('google_analytics', config);
    };

    return (
      <form onSubmit={handleSubmit} className="integration-form">
        <h3>Google Analytics</h3>
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
            placeholder="Sua API Key do Google"
          />
        </div>
        <div className="form-group">
          <label>Client ID</label>
          <input
            type="text"
            value={config.client_id || ''}
            onChange={(e) => setConfig({...config, client_id: e.target.value})}
            placeholder="Client ID OAuth"
          />
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <input
            type="password"
            value={config.client_secret || ''}
            onChange={(e) => setConfig({...config, client_secret: e.target.value})}
            placeholder="Client Secret OAuth"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleTest} disabled={loading}>
            Testar Conexão
          </button>
          <button type="submit" disabled={loading}>
            Salvar
          </button>
          {integration?.status === 'connected' && (
            <button 
              type="button" 
              onClick={() => deleteIntegration('google_analytics')}
              className="btn-danger"
              disabled={loading}
            >
              Remover
            </button>
          )}
        </div>
      </form>
    );
  };

  const SearchConsoleForm = ({ integration }) => {
    const [config, setConfig] = useState(integration?.config || {});

    const handleSubmit = (e) => {
      e.preventDefault();
      saveIntegration('google_search_console', config);
    };

    const handleTest = () => {
      testIntegration('google_search_console', config);
    };

    return (
      <form onSubmit={handleSubmit} className="integration-form">
        <h3>Google Search Console</h3>
        <div className="form-group">
          <label>Site URL</label>
          <input
            type="url"
            value={config.site_url || ''}
            onChange={(e) => setConfig({...config, site_url: e.target.value})}
            placeholder="https://seusite.com"
          />
        </div>
        <div className="form-group">
          <label>API Key</label>
          <input
            type="password"
            value={config.api_key || ''}
            onChange={(e) => setConfig({...config, api_key: e.target.value})}
            placeholder="Sua API Key do Google"
          />
        </div>
        <div className="form-group">
          <label>Client ID</label>
          <input
            type="text"
            value={config.client_id || ''}
            onChange={(e) => setConfig({...config, client_id: e.target.value})}
            placeholder="Client ID OAuth"
          />
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <input
            type="password"
            value={config.client_secret || ''}
            onChange={(e) => setConfig({...config, client_secret: e.target.value})}
            placeholder="Client Secret OAuth"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleTest} disabled={loading}>
            Testar Conexão
          </button>
          <button type="submit" disabled={loading}>
            Salvar
          </button>
          {integration?.status === 'connected' && (
            <button 
              type="button" 
              onClick={() => deleteIntegration('google_search_console')}
              className="btn-danger"
              disabled={loading}
            >
              Remover
            </button>
          )}
        </div>
      </form>
    );
  };

  const WebhooksForm = ({ integration }) => {
    const [config, setConfig] = useState(integration?.config || {});

    const handleSubmit = (e) => {
      e.preventDefault();
      saveIntegration('webhooks', config);
    };

    const handleTest = () => {
      testIntegration('webhooks', config);
    };

    return (
      <form onSubmit={handleSubmit} className="integration-form">
        <h3>Webhooks</h3>
        <div className="form-group">
          <label>Endpoint URL</label>
          <input
            type="url"
            value={config.endpoint_url || ''}
            onChange={(e) => setConfig({...config, endpoint_url: e.target.value})}
            placeholder="https://seusite.com/webhook"
          />
        </div>
        <div className="form-group">
          <label>Secret Key</label>
          <input
            type="password"
            value={config.secret_key || ''}
            onChange={(e) => setConfig({...config, secret_key: e.target.value})}
            placeholder="Chave secreta para validação"
          />
        </div>
        <div className="form-group">
          <label>Eventos</label>
          <div className="checkbox-group">
            {['lead_created', 'task_completed', 'site_down', 'financial_record'].map(event => (
              <label key={event} className="checkbox-label">
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
                {event.replace('_', ' ').toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleTest} disabled={loading}>
            Testar Webhook
          </button>
          <button type="submit" disabled={loading}>
            Salvar
          </button>
          {integration?.status === 'connected' && (
            <button 
              type="button" 
              onClick={() => deleteIntegration('webhooks')}
              className="btn-danger"
              disabled={loading}
            >
              Remover
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Configurações</h1>
      </div>

      <div className="settings-tabs">
        <button 
          className={activeTab === 'integrations' ? 'active' : ''}
          onClick={() => setActiveTab('integrations')}
        >
          Integrações
        </button>
        <button 
          className={activeTab === 'general' ? 'active' : ''}
          onClick={() => setActiveTab('general')}
        >
          Geral
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="settings-content">
        {activeTab === 'integrations' && (
          <div className="integrations-tab">
            <h2>Integrações com APIs Externas</h2>
            <p>Configure as integrações com serviços externos para automatizar coleta de dados.</p>
            
            {loading && <div className="loading">Carregando...</div>}
            
            <div className="integrations-grid">
              <div className="integration-card">
                <div className="integration-status">
                  <span className={`status-badge ${integrations.google_analytics?.status || 'disconnected'}`}>
                    {integrations.google_analytics?.status === 'connected' ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <GoogleAnalyticsForm integration={integrations.google_analytics} />
              </div>

              <div className="integration-card">
                <div className="integration-status">
                  <span className={`status-badge ${integrations.google_search_console?.status || 'disconnected'}`}>
                    {integrations.google_search_console?.status === 'connected' ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <SearchConsoleForm integration={integrations.google_search_console} />
              </div>

              <div className="integration-card">
                <div className="integration-status">
                  <span className={`status-badge ${integrations.webhooks?.status || 'inactive'}`}>
                    {integrations.webhooks?.status === 'connected' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <WebhooksForm integration={integrations.webhooks} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="general-tab">
            <h2>Configurações Gerais</h2>
            <p>Configurações básicas do sistema.</p>
            
            <form className="general-form">
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input type="text" placeholder="Nome da sua empresa" />
              </div>
              
              <div className="form-group">
                <label>Email de Notificações</label>
                <input type="email" placeholder="email@empresa.com" />
              </div>
              
              <div className="form-group">
                <label>Fuso Horário</label>
                <select>
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>
              
              <button type="submit">Salvar Configurações</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
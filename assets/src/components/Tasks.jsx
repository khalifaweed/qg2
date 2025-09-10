import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    project: '',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', priority: 'medium', project: '', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'urgent': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'gray';
      case 'in_progress': return 'blue';
      case 'done': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'todo': 'A Fazer',
      'in_progress': 'Em Andamento',
      'done': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'urgent': 'Urgente'
    };
    return priorityMap[priority] || priority;
  };

  if (loading) {
    return <div className="loading">Carregando tarefas...</div>;
  }

  return (
    <div className="tasks">
      <div className="page-header">
        <h1>Gestão de Tarefas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nova Tarefa
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Nova Tarefa</h2>
              <button 
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Projeto</label>
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Data de Vencimento</label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-kanban">
        <div className="kanban-column">
          <h3>A Fazer</h3>
          <div className="tasks-list">
            {tasks.filter(task => task.status === 'todo').map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  {task.project && <span className="task-project">📁 {task.project}</span>}
                  {task.due_date && (
                    <span className="task-due-date">
                      📅 {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="kanban-column">
          <h3>Em Andamento</h3>
          <div className="tasks-list">
            {tasks.filter(task => task.status === 'in_progress').map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  {task.project && <span className="task-project">📁 {task.project}</span>}
                  {task.due_date && (
                    <span className="task-due-date">
                      📅 {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="kanban-column">
          <h3>Concluídas</h3>
          <div className="tasks-list">
            {tasks.filter(task => task.status === 'done').map((task) => (
              <div key={task.id} className="task-card completed">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  {task.project && <span className="task-project">📁 {task.project}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma tarefa cadastrada ainda.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Criar Primeira Tarefa
          </button>
        </div>
      )}
    </div>
  );
}

export default Tasks;
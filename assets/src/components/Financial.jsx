import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Financial() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0
  });

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  const fetchFinancialRecords = async () => {
    try {
      const response = await api.get('/financial');
      setRecords(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error('Error fetching financial records:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const income = data
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + parseFloat(record.amount), 0);
    
    const expense = data
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + parseFloat(record.amount), 0);

    setSummary({
      totalIncome: income,
      totalExpense: expense,
      profit: income - expense
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'green' : 'red';
  };

  const getTypeText = (type) => {
    return type === 'income' ? 'Receita' : 'Despesa';
  };

  if (loading) {
    return <div className="loading">Carregando dados financeiros...</div>;
  }

  return (
    <div className="financial">
      <div className="page-header">
        <h1>Gestão Financeira</h1>
      </div>

      <div className="financial-summary">
        <div className="summary-card income">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>Receitas</h3>
            <div className="summary-amount">{formatCurrency(summary.totalIncome)}</div>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="summary-icon">💸</div>
          <div className="summary-content">
            <h3>Despesas</h3>
            <div className="summary-amount">{formatCurrency(summary.totalExpense)}</div>
          </div>
        </div>

        <div className={`summary-card profit ${summary.profit >= 0 ? 'positive' : 'negative'}`}>
          <div className="summary-icon">{summary.profit >= 0 ? '📈' : '📉'}</div>
          <div className="summary-content">
            <h3>Lucro</h3>
            <div className="summary-amount">{formatCurrency(summary.profit)}</div>
          </div>
        </div>
      </div>

      <div className="financial-records">
        <div className="records-header">
          <h2>Registros Financeiros</h2>
          <button className="btn btn-primary">
            Novo Registro
          </button>
        </div>

        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Site</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`type-badge ${getTypeColor(record.type)}`}>
                      {getTypeText(record.type)}
                    </span>
                  </td>
                  <td>{record.category}</td>
                  <td>{record.description}</td>
                  <td>{record.site_name || '-'}</td>
                  <td className={`amount ${getTypeColor(record.type)}`}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(record.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="empty-state">
            <p>Nenhum registro financeiro encontrado.</p>
            <button className="btn btn-primary">
              Adicionar Primeiro Registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Financial;
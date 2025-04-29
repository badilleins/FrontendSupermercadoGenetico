// Tabs.js
import React, { useState } from 'react';
import OptimizadorProductos from './OptimizadorProductos.js';
import CrudProductosCategorias from './CrudProductosCategorias.js';
import './tabs.css';
function Tabs() {
  const [activeTab, setActiveTab] = useState('optimizador');

  return (
    <div>
      <div className="tab-buttons">
        <button
          className={activeTab === 'optimizador' ? 'active' : ''}
          onClick={() => setActiveTab('optimizador')}
        >
          Optimizador
        </button>
        <button
          className={activeTab === 'crud' ? 'active' : ''}
          onClick={() => setActiveTab('crud')}
        >
          Gestiona Productos / Categorías
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'optimizador' && <OptimizadorProductos />}
        {activeTab === 'crud' && <CrudProductosCategorias />}
      </div>
    </div>
  );
}

export default Tabs;

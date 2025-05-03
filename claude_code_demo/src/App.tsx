import { useState } from 'react';
import './App.css';
import LLMDiagram from './components/LLMDiagram';
import RAGDiagram from './components/RAGDiagram';
import AppIntegrationDiagram from './components/AppIntegrationDiagram';

const App = () => {
  const [activeTab, setActiveTab] = useState<'llm' | 'rag' | 'app'>('llm');

  return (
    <div className="app-container">
      <header>
        <h1>Interactive LLM Architecture Diagrams</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'llm' ? 'active' : ''}
            onClick={() => setActiveTab('llm')}
          >
            LLM Internals
          </button>
          <button 
            className={activeTab === 'rag' ? 'active' : ''}
            onClick={() => setActiveTab('rag')}
          >
            Retrieval Augmented Generation
          </button>
          <button 
            className={activeTab === 'app' ? 'active' : ''}
            onClick={() => setActiveTab('app')}
          >
            Application Integration
          </button>
        </div>
      </header>
      
      <main>
        {activeTab === 'llm' && <LLMDiagram />}
        {activeTab === 'rag' && <RAGDiagram />}
        {activeTab === 'app' && <AppIntegrationDiagram />}
      </main>
      
      <footer>
        <p>Interactive visualization of Large Language Models and their applications</p>
      </footer>
    </div>
  );
};

export default App;
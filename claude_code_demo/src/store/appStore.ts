import { create } from 'zustand';
import { LLMNode, RAGNode, AppIntegrationNode } from '../types/node-types';

interface AppState {
  // Selected node information
  selectedLLMNode: string | null;
  selectedRAGNode: string | null;
  selectedAppNode: string | null;
  
  // Actions
  setSelectedLLMNode: (nodeId: string | null) => void;
  setSelectedRAGNode: (nodeId: string | null) => void;
  setSelectedAppNode: (nodeId: string | null) => void;
  
  // LLM animation state (for showing token flow, attention weights, etc)
  llmAnimationActive: boolean;
  setLLMAnimationActive: (active: boolean) => void;
  
  // RAG animation state (for showing data flow)
  ragAnimationActive: boolean;
  setRAGAnimationActive: (active: boolean) => void;
  
  // App integration animation state
  appAnimationActive: boolean;
  setAppAnimationActive: (active: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedLLMNode: null,
  selectedRAGNode: null,
  selectedAppNode: null,
  llmAnimationActive: false,
  ragAnimationActive: false,
  appAnimationActive: false,
  
  // Actions
  setSelectedLLMNode: (nodeId) => set({ selectedLLMNode: nodeId }),
  setSelectedRAGNode: (nodeId) => set({ selectedRAGNode: nodeId }),
  setSelectedAppNode: (nodeId) => set({ selectedAppNode: nodeId }),
  
  setLLMAnimationActive: (active) => set({ llmAnimationActive: active }),
  setRAGAnimationActive: (active) => set({ ragAnimationActive: active }),
  setAppAnimationActive: (active) => set({ appAnimationActive: active }),
}));
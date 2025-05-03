import { Node, Edge, Position } from 'reactflow';

export interface NodeData {
  label: string;
  description?: string;
  details?: string;
  type?: string;
  subType?: string;
  icon?: string;
  color?: string;
  state?: { [key: string]: any };
  onNodeClick?: (nodeId: string) => void;
}

export interface LLMNodeData extends NodeData {
  section?: 'input' | 'embedding' | 'attention' | 'feedforward' | 'output';
  activationValue?: number;
}

export interface RAGNodeData extends NodeData {
  section?: 'document' | 'embedding' | 'vector-db' | 'retriever' | 'llm' | 'output';
}

export interface AppIntegrationNodeData extends NodeData {
  section?: 'frontend' | 'middleware' | 'llm-service' | 'database';
  apiType?: 'rest' | 'graphql' | 'grpc';
}

export type CustomNode = Node<NodeData>;
export type LLMNode = Node<LLMNodeData>;
export type RAGNode = Node<RAGNodeData>;
export type AppIntegrationNode = Node<AppIntegrationNodeData>;

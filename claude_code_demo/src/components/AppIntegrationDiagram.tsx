import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { AppIntegrationNode, AppIntegrationNodeData } from '../types/node-types';

// Define node types for ReactFlow
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes representing application integration components
const initialNodes: AppIntegrationNode[] = [
  // Frontend client
  {
    id: 'frontend',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: {
      label: 'Frontend Client',
      description: 'Web or mobile application UI',
      color: '#2196F3',
      section: 'frontend',
      details: 'User interface built with frameworks like React, Angular, or Vue.js. Handles user interactions, input collection, and displaying responses.',
    },
  },
  
  // API Gateway
  {
    id: 'api-gateway',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: {
      label: 'API Gateway',
      description: 'Routes and manages API requests',
      color: '#9C27B0',
      section: 'middleware',
      apiType: 'rest',
      details: 'Manages API traffic, authentication, request validation, and routing requests to appropriate services. Can also handle rate limiting and logging.',
    },
  },
  
  // Authentication
  {
    id: 'auth-service',
    type: 'custom',
    position: { x: 50, y: 150 },
    data: {
      label: 'Authentication Service',
      description: 'User authentication and authorization',
      color: '#FF9800',
      section: 'middleware',
      details: 'Handles user authentication, token validation, and authorization. Ensures only authorized users can access LLM services.',
    },
  },
  
  // Request processing service
  {
    id: 'request-processor',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: {
      label: 'Request Processor',
      description: 'Processes and validates user requests',
      color: '#4CAF50',
      section: 'middleware',
      details: 'Preprocesses input, performs validation, handles content moderation, and prepares requests for the LLM service.',
    },
  },
  
  // LLM API service
  {
    id: 'llm-service',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: {
      label: 'LLM API Service',
      description: 'Interface to LLM providers (OpenAI, Anthropic, etc.)',
      color: '#E91E63',
      section: 'llm-service',
      details: 'Integrates with LLM providers like OpenAI, Anthropic, or self-hosted models. Handles API keys, request formatting, and response parsing.',
    },
  },
  
  // Caching service
  {
    id: 'cache',
    type: 'custom',
    position: { x: 450, y: 250 },
    data: {
      label: 'Caching Service',
      description: 'Caches common responses for performance',
      color: '#009688',
      section: 'middleware',
      details: 'Stores frequently requested responses to reduce latency and API costs. Implements invalidation strategies to keep responses fresh.',
    },
  },
  
  // Vector database
  {
    id: 'vector-db',
    type: 'custom',
    position: { x: 450, y: 350 },
    data: {
      label: 'Vector Database',
      description: 'Stores embeddings for RAG functionality',
      color: '#673AB7',
      section: 'database',
      details: 'Specialized database for storing and querying vector embeddings. Used for semantic search and retrieval augmented generation.',
    },
  },
  
  // Conversation history
  {
    id: 'conversation-db',
    type: 'custom',
    position: { x: 50, y: 350 },
    data: {
      label: 'Conversation Database',
      description: 'Stores chat history and user interactions',
      color: '#795548',
      section: 'database',
      details: 'Persists conversation history, user interactions, and context. Enables multi-turn conversations and personalization.',
    },
  },
  
  // Response post-processing
  {
    id: 'response-processor',
    type: 'custom',
    position: { x: 250, y: 450 },
    data: {
      label: 'Response Processor',
      description: 'Formats and enhances LLM responses',
      color: '#4CAF50',
      section: 'middleware',
      details: 'Post-processes LLM outputs, adds metadata, formats responses, performs additional verification, and handles citations or references.',
    },
  },
  
  // Analytics and monitoring
  {
    id: 'analytics',
    type: 'custom',
    position: { x: 450, y: 450 },
    data: {
      label: 'Analytics Service',
      description: 'Monitors performance and user interactions',
      color: '#607D8B',
      section: 'middleware',
      details: 'Collects metrics on response quality, latency, user satisfaction, and usage patterns. Helps improve system performance and identify issues.',
    },
  },
];

// Define connections between components
const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'frontend', target: 'api-gateway' },
  { id: 'e2-3', source: 'api-gateway', target: 'auth-service', type: 'step' },
  { id: 'e2-4', source: 'api-gateway', target: 'request-processor' },
  { id: 'e4-5', source: 'request-processor', target: 'llm-service' },
  { id: 'e4-6', source: 'request-processor', target: 'cache', type: 'step' },
  { id: 'e6-4', source: 'cache', target: 'request-processor', type: 'step' },
  { id: 'e5-7', source: 'llm-service', target: 'vector-db', type: 'step' },
  { id: 'e5-8', source: 'llm-service', target: 'conversation-db', type: 'step' },
  { id: 'e4-8', source: 'request-processor', target: 'conversation-db', type: 'step' },
  { id: 'e5-9', source: 'llm-service', target: 'response-processor' },
  { id: 'e9-10', source: 'response-processor', target: 'analytics', type: 'step' },
  { id: 'e9-1', source: 'response-processor', target: 'frontend', animated: true },
];

const AppIntegrationDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<AppIntegrationNodeData | null>(null);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle node click to show details
  const onNodeClick = useCallback((event: React.MouseEvent, node: AppIntegrationNode) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <div className="diagram-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
      
      {selectedNode && (
        <div className="diagram-info">
          <h3>{selectedNode.label}</h3>
          <p>{selectedNode.details}</p>
        </div>
      )}
    </div>
  );
};

export default AppIntegrationDiagram;
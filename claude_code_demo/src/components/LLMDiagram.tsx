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
import { LLMNode, LLMNodeData } from '../types/node-types';

// Define node types for ReactFlow
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes representing LLM components
const initialNodes: LLMNode[] = [
  // Input layer
  {
    id: 'input',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: {
      label: 'Input Layer',
      description: 'Text is tokenized and converted to embeddings',
      color: '#2196F3',
      section: 'input',
      details: 'Transforms raw text into token IDs using a vocabulary. Each token is converted into a numerical vector (embedding) representing its semantic meaning.',
    },
  },
  
  // Embedding layer
  {
    id: 'embedding',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: {
      label: 'Embedding Layer',
      description: 'Converts tokens to vector representations',
      color: '#4CAF50',
      section: 'embedding',
      details: 'Each token is mapped to a high-dimensional vector that captures its semantic meaning. These embeddings are learned during training.',
    },
  },
  
  // Self-attention mechanism
  {
    id: 'self-attention',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: {
      label: 'Self-Attention Mechanism',
      description: 'Calculates attention scores between tokens',
      color: '#FF9800',
      section: 'attention',
      details: 'The core of the transformer architecture. Calculates how much each token should attend to every other token using query, key, and value projections.',
    },
  },
  
  // Feed-forward networks
  {
    id: 'feed-forward',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: {
      label: 'Feed-Forward Networks',
      description: 'Processes token representations individually',
      color: '#E91E63',
      section: 'feedforward',
      details: 'Each token's representation is processed independently through fully connected neural networks with non-linear activations.',
    },
  },
  
  // Output layer
  {
    id: 'output',
    type: 'custom',
    position: { x: 250, y: 450 },
    data: {
      label: 'Output Layer',
      description: 'Generates probability distribution over vocabulary',
      color: '#9C27B0',
      section: 'output',
      details: 'Takes the final hidden states and projects them to vocabulary size, producing probabilities for the next token prediction.',
    },
  },
];

// Define connections between layers
const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'input', target: 'embedding' },
  { id: 'e2-3', source: 'embedding', target: 'self-attention' },
  { id: 'e3-4', source: 'self-attention', target: 'feed-forward' },
  { id: 'e4-5', source: 'feed-forward', target: 'output' },
];

const LLMDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<LLMNodeData | null>(null);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle node click to show details
  const onNodeClick = useCallback((event: React.MouseEvent, node: LLMNode) => {
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

export default LLMDiagram;
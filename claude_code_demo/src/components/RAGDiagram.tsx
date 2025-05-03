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
import { RAGNode, RAGNodeData } from '../types/node-types';

// Define node types for ReactFlow
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes representing RAG components
const initialNodes: RAGNode[] = [
  // Document sources
  {
    id: 'documents',
    type: 'custom',
    position: { x: 100, y: 50 },
    data: {
      label: 'Document Collection',
      description: 'Knowledge base documents',
      color: '#2196F3',
      section: 'document',
      details: 'A collection of documents that serve as the knowledge base. These could be PDFs, web pages, internal documentation, or any text-based information.',
    },
  },
  
  // Document chunking
  {
    id: 'chunking',
    type: 'custom',
    position: { x: 100, y: 150 },
    data: {
      label: 'Document Chunking',
      description: 'Splits documents into smaller chunks',
      color: '#2196F3',
      section: 'document',
      details: 'Documents are split into smaller chunks for more effective processing and retrieval. Chunking strategies balance context preservation with processing efficiency.',
    },
  },
  
  // Embedding generation
  {
    id: 'embedding',
    type: 'custom',
    position: { x: 100, y: 250 },
    data: {
      label: 'Embedding Generation',
      description: 'Converts text chunks to vector embeddings',
      color: '#4CAF50',
      section: 'embedding',
      details: 'Each document chunk is processed through an embedding model to create vector representations that capture semantic meaning.',
    },
  },
  
  // Vector database
  {
    id: 'vector-db',
    type: 'custom',
    position: { x: 100, y: 350 },
    data: {
      label: 'Vector Database',
      description: 'Stores and indexes document embeddings',
      color: '#673AB7',
      section: 'vector-db',
      details: 'A specialized database for storing and efficiently querying vector embeddings, often supporting approximate nearest neighbor search algorithms.',
    },
  },
  
  // User query
  {
    id: 'user-query',
    type: 'custom',
    position: { x: 400, y: 50 },
    data: {
      label: 'User Query',
      description: 'Question or prompt from the user',
      color: '#FF9800',
      section: 'retriever',
      details: 'The input from the user that will be processed to retrieve relevant information and generate a response.',
    },
  },
  
  // Query embedding
  {
    id: 'query-embedding',
    type: 'custom',
    position: { x: 400, y: 150 },
    data: {
      label: 'Query Embedding',
      description: 'Converts user query to vector representation',
      color: '#4CAF50',
      section: 'embedding',
      details: 'The user query is processed through the same embedding model to create a vector representation compatible with the document embeddings.',
    },
  },
  
  // Retriever
  {
    id: 'retriever',
    type: 'custom',
    position: { x: 400, y: 250 },
    data: {
      label: 'Retriever',
      description: 'Finds relevant documents using similarity search',
      color: '#FF9800',
      section: 'retriever',
      details: 'Uses the query embedding to search the vector database for the most semantically similar document chunks, often using cosine similarity measures.',
    },
  },
  
  // Context assembly
  {
    id: 'context',
    type: 'custom',
    position: { x: 400, y: 350 },
    data: {
      label: 'Context Assembly',
      description: 'Prepares retrieved documents as context',
      color: '#FF9800',
      section: 'retriever',
      details: 'The retrieved document chunks are assembled into a coherent context format that can be provided to the LLM along with the user query.',
    },
  },
  
  // LLM
  {
    id: 'llm',
    type: 'custom',
    position: { x: 250, y: 450 },
    data: {
      label: 'Large Language Model',
      description: 'Generates response based on query and context',
      color: '#E91E63',
      section: 'llm',
      details: 'The large language model processes the user query together with the retrieved context to generate a response that leverages both the model\'s parameters and the external knowledge.',
    },
  },
  
  // Response
  {
    id: 'response',
    type: 'custom',
    position: { x: 250, y: 550 },
    data: {
      label: 'Response Generation',
      description: 'Final answer synthesized from context and model knowledge',
      color: '#9C27B0',
      section: 'output',
      details: 'The final response is generated, combining information from the retrieved documents with the LLM\'s built-in knowledge, providing citations when appropriate.',
    },
  },
];

// Define connections between components
const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'documents', target: 'chunking' },
  { id: 'e2-3', source: 'chunking', target: 'embedding' },
  { id: 'e3-4', source: 'embedding', target: 'vector-db' },
  { id: 'e5-6', source: 'user-query', target: 'query-embedding' },
  { id: 'e6-7', source: 'query-embedding', target: 'retriever' },
  { id: 'e4-7', source: 'vector-db', target: 'retriever', type: 'step', animated: true },
  { id: 'e7-8', source: 'retriever', target: 'context' },
  { id: 'e8-9', source: 'context', target: 'llm' },
  { id: 'e5-9', source: 'user-query', target: 'llm', type: 'step', animated: true },
  { id: 'e9-10', source: 'llm', target: 'response' },
];

const RAGDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<RAGNodeData | null>(null);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Handle node click to show details
  const onNodeClick = useCallback((event: React.MouseEvent, node: RAGNode) => {
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

export default RAGDiagram;
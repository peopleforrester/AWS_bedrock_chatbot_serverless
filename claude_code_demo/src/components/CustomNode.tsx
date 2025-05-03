import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types/node-types';

const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  return (
    <div className={`node ${selected ? 'selected' : ''}`} style={{ 
      borderColor: data.color || '#ccc',
      backgroundColor: data.color ? `${data.color}10` : 'white',
    }}>
      <Handle type="target" position={Position.Top} />
      
      <div className="node-content">
        <h3 style={{ color: data.color }}>{data.label}</h3>
        {data.description && <p>{data.description}</p>}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default CustomNode;
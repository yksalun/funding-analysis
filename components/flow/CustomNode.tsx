'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps, useStore } from '@xyflow/react';
import { Banknote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNodeInteraction } from '@/hooks/useNodeInteraction';

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;
const selectedNodesSelector = (state: any) => state.selectedNodes;

export const CustomNode = memo(({ id, data, isConnectable = true }: any) => {
  // const { highlightConnections, resetHighlight } = useNodeInteraction();
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const selectedNodes = useStore(selectedNodesSelector);

  const isTarget = connectionNodeId && connectionNodeId !== id;
  const isSource = connectionNodeId === id;
  const isSelected = selectedNodes?.includes(id);

  const handleStyle = {
    width: '12px',
    height: '12px',
    border: '2px solid white',
    borderRadius: '50%'
  };

  return (
    <div
      className={`group transition-all duration-200 ease-in-out
        ${isTarget ? 'highlighted' : ''} 
        ${isSource ? 'opacity-50' : ''} 
        ${isSelected ? 'highlighted' : ''}`}
      // onMouseEnter={() => highlightConnections(id)}
      // onMouseLeave={resetHighlight}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left-1"
        isConnectable={isConnectable}
        className="bg-emerald-500 transition-all duration-200 rounded-full size-3"
        // style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-2"
        isConnectable={isConnectable}
        className="bg-rose-500 transition-all duration-200  rounded-full size-3"
        // style={{ ...handleStyle, top: '70%' }}
      />

      <Card className="min-w-[180px] bg-white shadow-md transition-all duration-200 hover:shadow-lg">
        <div className="p-3 border-b flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <Banknote className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium">{data.label}</span>
        </div>
        <div className="p-3 flex gap-6 text-sm">
          {data.totalIn !== undefined && (
            <div>
              <span className="text-neutral-500">流入总额</span>
              <p className="font-medium text-emerald-600">
                ¥{data.totalIn.toLocaleString()}
              </p>
            </div>
          )}
          {data.totalOut !== undefined && (
            <div>
              <span className="text-neutral-500">流出总额</span>
              <p className="font-medium text-rose-600">
                ¥{data.totalOut.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        id="right-1"
        isConnectable={isConnectable}
        className="bg-emerald-500! transition-all duration-200 rounded-full size-3"
        // style={handleStyle}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-2"
        isConnectable={isConnectable}
        className="!bg-rose-500 transition-all duration-200  rounded-full size-3"
        // style={{ ...handleStyle, top: '70%' }}
      />
    </div>
  );
});

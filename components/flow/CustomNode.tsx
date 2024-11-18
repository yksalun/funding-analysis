'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps, useStore, Node } from '@xyflow/react';
import { Banknote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNodeInteraction } from '@/hooks/useNodeInteraction';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;
const selectedNodesSelector = (state: any) => state.selectedNodes;

// interface NodeData {
//   label: string;
//   username?: string;
//   amount?: number;
//   date?: string;
//   type?: string;
//   description?: string;
// }

export type NodeData = Node<{
  label: string;
  username?: string;
  amount?: number;
  date?: string;
  type?: string;
  description?: string;
}>;

export const CustomNode = memo(
  ({ id, data, isConnectable = true }: NodeProps<NodeData>) => {
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={`group transition-all duration-200 ease-in-out
              ${isTarget ? 'highlighted' : ''} 
              ${isSource ? 'opacity-50' : ''} 
              ${isSelected ? 'highlighted' : ''}`}
            >
              <Handle
                type="target"
                position={Position.Left}
                id="left"
                isConnectable={isConnectable}
                className="rounded-full size-3 opacity-0"
              />

              <Card className="min-w-[180px] bg-white shadow-md transition-all duration-200 hover:shadow-lg">
                <div className="p-3 border-b flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-md">
                    <Banknote className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{data.label}</span>
                    {data.username && (
                      <span className="text-sm text-gray-500">
                        {data.username}
                      </span>
                    )}
                  </div>
                </div>
                {data.amount && (
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      ¥{data.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </Card>

              <Handle
                type="source"
                position={Position.Right}
                id="right"
                isConnectable={isConnectable}
                className="rounded-full size-3 opacity-0"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <p className="font-medium">{data.label}</p>
              {data.username && (
                <p className="text-sm">用户: {data.username}</p>
              )}
              {data.amount && (
                <p className="text-sm">金额: ¥{data.amount.toLocaleString()}</p>
              )}
              {data.date && <p className="text-sm">日期: {data.date}</p>}
              {data.type && <p className="text-sm">类型: {data.type}</p>}
              {data.description && (
                <p className="text-sm">描述: {data.description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

CustomNode.displayName = 'CustomNode';

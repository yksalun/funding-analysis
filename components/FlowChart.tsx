'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  Panel,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  useStore
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { CustomNode } from './flow/CustomNode';
import { CustomEdge } from './flow/CustomEdge';
import { forceDirectedLayout } from '@/lib/layout-utils';

const nodeTypes = {
  custom: CustomNode
};

const edgeTypes = {
  custom: CustomEdge
};

// 智能连接点选择
const getSmartHandles = (sourceNode: Node, targetNode: Node) => {
  const sourceX = sourceNode.position.x;
  const targetX = targetNode.position.x;
  const isSourceLeftOfTarget = sourceX < targetX;

  return {
    sourceHandle: isSourceLeftOfTarget ? 'right-1' : 'left-2',
    targetHandle: isSourceLeftOfTarget ? 'left-1' : 'right-2'
  };
};

interface FlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

function Flow({ initialNodes, initialEdges }: FlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) return;

      const smartHandles = getSmartHandles(sourceNode, targetNode);

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            ...smartHandles,
            type: 'custom',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
            labelStyle: { fill: '#4b5563', fontWeight: 500, fontSize: 12 }
          },
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  const handleAutoLayout = useCallback(() => {
    if (!flowRef.current) return;
    const { width, height } = flowRef.current.getBoundingClientRect();
    const newLayout = forceDirectedLayout(nodes, edges, {
      width,
      height,
      iterations: 50,
      nodeSpacing: 200
    });

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        position:
          newLayout.find((n) => n.id === node.id)?.position || node.position
      }))
    );

    setTimeout(() => fitView({ duration: 500 }), 50);
  }, [nodes, edges, setNodes, fitView]);

  return (
    <div ref={flowRef} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5
        }}
        defaultEdgeOptions={{
          type: 'custom',
          animated: false
        }}
      >
        <Background />
        <Controls showZoom={false} />
        <Panel position="top-left">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoLayout}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            自动布局
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function FlowChart(props: FlowChartProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}

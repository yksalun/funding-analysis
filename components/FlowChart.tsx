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
import { forceDirectedLayout, horizontalLayout } from '@/lib/layout-utils';

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
  const layoutedNodes = horizontalLayout(initialNodes, initialEdges, {
    startX: 50,
    startY: 50,
    levelSpacing: 300,
    nodeSpacing: 100
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
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

  const handleAutoLayout = () => {
    if (!flowRef.current) return;
    const { width, height } = flowRef.current.getBoundingClientRect();
    const newLayout = horizontalLayout(nodes, edges, {
      startX: 50,
      startY: 50,
      levelSpacing: 250,
      nodeSpacing: 100
    });

    setNodes(newLayout);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  };

  return (
    <div className="w-full h-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
          animated: false
        }}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        draggable={false}
      >
        <Panel position="top-right">
          <Button
            variant="outline"
            size="icon"
            onClick={handleAutoLayout}
            className="bg-white"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </Panel>
        <Background />
        <Controls />
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

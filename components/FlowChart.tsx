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

interface FlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

function Flow({ initialNodes, initialEdges }: FlowChartProps) {
  const doLayoutNode = () => {
    return horizontalLayout(initialNodes, initialEdges, {
      startX: 50,
      startY: 50,
      levelSpacing: 300,
      nodeSpacing: 100
    });
  };

  const layoutedNodes: any = doLayoutNode();

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  const handleAutoLayout = () => {
    if (!flowRef.current) return;
    const { width, height } = flowRef.current.getBoundingClientRect();
    const newLayout: any = doLayoutNode();

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

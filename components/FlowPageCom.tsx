'use client';

import {
  FlowView,
  Node,
  SelectType,
  useFlowViewer,
  useNodesState
} from '@ant-design/pro-flow';
import { useState } from 'react';
import { edges as initEdges } from '@/data/edges';
import { nodes as initNodes } from '@/data/nodes';
import PersonNodeCom from './PersonNodeCom';

const nodeTypes = { personNode: PersonNodeCom };

export default function FlowPageCom() {
  const [nodes, , onNodesChange] = useNodesState(initNodes);

  const { selectNode, selectEdges, selectNodes } = useFlowViewer();
  const [node, setNode] = useState<Node | null>(null);

  const [open, setOpen] = useState<boolean>(true);

  return (
    <FlowView
      miniMap={false}
      autoLayout={open}
      nodes={nodes}
      edges={initEdges}
      onNodeClick={(e, _node: Node) => {
        setNode(_node);
        selectNodes(['a1', 'a2', 'a3'], SelectType.SUB_SELECT);
        selectNode(_node.id, SelectType.SELECT);
        selectEdges(['a1-a2', 'a1-a3'], SelectType.SUB_SELECT);
      }}
      onPaneClick={() => {
        setNode(null);
        selectNodes(['a1', 'a2', 'a3'], SelectType.DEFAULT);
        selectEdges(['a1-a2', 'a1-a3'], SelectType.DEFAULT);
      }}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
    >
      {/* <FlowPanel position="top-center">
      </FlowPanel> */}
    </FlowView>
  );
}

'use client';

import { useState } from 'react';
import { read, utils } from 'xlsx';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { toast } from 'sonner';
import { FileUploadZone } from './FileUploadZone';
import { FlowChart } from './FlowChart';
import { Transaction, createNodesAndEdges } from '@/lib/flow-utils';

// 初始化示例数据
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 200, y: 100 },
    data: {
      label: '账户 6789',
      totalIn: 0,
      totalOut: 100000
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: {
      label: '账户 3456',
      totalIn: 100000,
      totalOut: 60000
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 350, y: 300 },
    data: {
      label: '账户 1234',
      totalIn: 60000,
      totalOut: 20000
    }
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 650, y: 300 },
    data: {
      label: '账户 5678',
      totalIn: 20000,
      totalOut: 0
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'right-1',
    targetHandle: 'left-1',
    type: 'custom',
    label: '¥100,000',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#4b5563', fontWeight: 500, fontSize: 12 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6366f1',
      width: 20,
      height: 20
    },
    data: {
      amount: 100000,
      date: '2024-01-15'
    }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'right-1',
    targetHandle: 'left-1',
    type: 'custom',
    label: '¥60,000',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#4b5563', fontWeight: 500, fontSize: 12 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6366f1',
      width: 20,
      height: 20
    },
    data: {
      amount: 60000,
      date: '2024-01-16'
    }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    sourceHandle: 'right-1',
    targetHandle: 'left-1',
    type: 'custom',
    label: '¥20,000',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#4b5563', fontWeight: 500, fontSize: 12 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6366f1',
      width: 20,
      height: 20
    },
    data: {
      amount: 20000,
      date: '2024-01-17'
    }
  }
];

export default function FinancialFlow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    try {
      const allData: any[] = [];

      for (const file of acceptedFiles) {
        const buffer = await file.arrayBuffer();
        const workbook = read(buffer);

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const data = utils.sheet_to_json(worksheet);
          allData.push(...data);
        });
      }

      if (allData.length === 0) {
        toast.error('上传的文件中没有找到有效数据');
        return;
      }

      const transactions: Transaction[] = allData
        .map((row) => ({
          fromAccount: row['From Account'] || row['Source Account'] || '',
          toAccount: row['To Account'] || row['Destination Account'] || '',
          amount: parseFloat(row['Amount'] || '0'),
          date: row['Date'] || ''
        }))
        .filter((t) => t.fromAccount && t.toAccount && t.amount > 0);

      const { nodes: newNodes, edges: newEdges } =
        createNodesAndEdges(transactions);
      setNodes(newNodes);
      setEdges(newEdges);

      toast.success(`成功处理 ${acceptedFiles.length} 个文件`);
    } catch (error) {
      console.error('处理文件时出错:', error);
      toast.error('处理文件时出错，请检查文件格式');
    }
  };

  return (
    // <div className="flex flex-col gap-4">
    //   <FileUploadZone onFilesAccepted={handleFilesAccepted} />
    //   <div className="">
    //     <FlowChart initialNodes={nodes} initialEdges={edges} />
    //   </div>
    // </div>
    <div className="size-full">
      <FlowChart initialNodes={nodes} initialEdges={edges} />
    </div>
  );
}

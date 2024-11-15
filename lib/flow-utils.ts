import { Node, Edge, MarkerType } from '@xyflow/react';

export interface Transaction {
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
}

interface AccountSummary {
  totalIn: number;
  totalOut: number;
}

export const createNodesAndEdges = (transactions: Transaction[]): {
  nodes: Node[];
  edges: Edge[];
} => {
  const accountSet = new Set<string>();
  const accountSummary = new Map<string, AccountSummary>();

  // 收集所有唯一账户并计算流入流出总额
  transactions.forEach((transaction) => {
    if (transaction.fromAccount && transaction.toAccount) {
      accountSet.add(transaction.fromAccount);
      accountSet.add(transaction.toAccount);

      // 更新转出账户统计
      const fromSummary = accountSummary.get(transaction.fromAccount) || { totalIn: 0, totalOut: 0 };
      fromSummary.totalOut += transaction.amount;
      accountSummary.set(transaction.fromAccount, fromSummary);

      // 更新转入账户统计
      const toSummary = accountSummary.get(transaction.toAccount) || { totalIn: 0, totalOut: 0 };
      toSummary.totalIn += transaction.amount;
      accountSummary.set(transaction.toAccount, toSummary);
    }
  });

  // 限制节点数量为10个
  const accountArray = Array.from(accountSet).slice(0, 10);

  // 创建节点
  const nodes: Node[] = accountArray.map((account, index) => {
    const summary = accountSummary.get(account);
    const angle = (index * (2 * Math.PI / accountArray.length));
    return {
      id: account,
      type: 'custom',
      data: {
        label: `账户 ${account.slice(-4)}`,
        totalIn: summary?.totalIn,
        totalOut: summary?.totalOut,
      },
      position: {
        x: 400 + Math.cos(angle) * 300,
        y: 300 + Math.sin(angle) * 200,
      },
    };
  });

  // 创建边
  const edges: Edge[] = transactions
    .filter(t => 
      accountArray.includes(t.fromAccount) && 
      accountArray.includes(t.toAccount)
    )
    .map((transaction, index) => {
      const sourceNode = nodes.find(n => n.id === transaction.fromAccount);
      const targetNode = nodes.find(n => n.id === transaction.toAccount);
      
      if (!sourceNode || !targetNode) return null;

      // 根据节点位置决定使用哪个连接点
      const isSourceLeftOfTarget = sourceNode.position.x < targetNode.position.x;
      const sourceHandle = isSourceLeftOfTarget ? 'right-1' : 'left-2';
      const targetHandle = isSourceLeftOfTarget ? 'left-1' : 'right-2';

      return {
        id: `e${index}`,
        source: transaction.fromAccount,
        target: transaction.toAccount,
        sourceHandle,
        targetHandle,
        type: 'custom',
        label: `¥${transaction.amount.toLocaleString()}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        labelStyle: { fill: '#4b5563', fontWeight: 500, fontSize: 12 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6366f1',
          width: 20,
          height: 20,
        },
        data: {
          amount: transaction.amount,
          date: transaction.date,
        },
      };
    })
    .filter((edge): edge is Edge => edge !== null);

  return { nodes, edges };
};
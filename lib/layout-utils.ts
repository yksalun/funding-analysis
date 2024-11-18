"use client";

interface Point {
  x: number;
  y: number;
}

interface ForceDirectedConfig {
  width: number;
  height: number;
  iterations: number;
  nodeSpacing: number;
  springLength: number;
  springStrength: number;
  repulsionStrength: number;
}

interface HorizontalLayoutConfig {
  startX: number;
  startY: number;
  levelSpacing: number;
  nodeSpacing: number;
}

export const forceDirectedLayout = (
  nodes: { id: string; position: Point }[],
  edges: { source: string; target: string }[],
  config: Partial<ForceDirectedConfig> = {}
) => {
  const {
    width = 800,
    height = 600,
    iterations = 100,
    nodeSpacing = 200,
    springLength = 200,
    springStrength = 0.6,
    repulsionStrength = 3000,
  } = config;

  // 深拷贝节点以避免直接修改原始数据
  const positions = nodes.map(node => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    vx: 0,
    vy: 0,
  }));

  // 力导向算法主循环
  for (let i = 0; i < iterations; i++) {
    // 重置加速度
    positions.forEach(node => {
      node.vx = 0;
      node.vy = 0;
    });

    // 计算节点间的排斥力
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const nodeA = positions[i];
        const nodeB = positions[j];
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 1) continue;

        const force = repulsionStrength / (distance * distance);
        const forceX = (dx / distance) * force;
        const forceY = (dy / distance) * force;

        nodeB.vx += forceX;
        nodeB.vy += forceY;
        nodeA.vx -= forceX;
        nodeA.vy -= forceY;
      }
    }

    // 计算边的弹簧力
    edges.forEach(edge => {
      const source = positions.find(n => n.id === edge.source);
      const target = positions.find(n => n.id === edge.target);
      
      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 1) return;

      const force = (distance - springLength) * springStrength;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;

      source.vx += forceX;
      source.vy += forceY;
      target.vx -= forceX;
      target.vy -= forceY;
    });

    // 更新位置
    positions.forEach(node => {
      node.x += Math.min(Math.max(node.vx, -10), 10);
      node.y += Math.min(Math.max(node.vy, -10), 10);

      // 确保节点不会超出边界
      node.x = Math.min(Math.max(node.x, nodeSpacing), width - nodeSpacing);
      node.y = Math.min(Math.max(node.y, nodeSpacing), height - nodeSpacing);
    });
  }

  // 返回新的节点位置
  return positions.map(node => ({
    id: node.id,
    position: { x: node.x, y: node.y },
  }));
};

export const horizontalLayout = (
  nodes: { id: string; position: Point; data?: any }[],
  edges: { source: string; target: string }[],
  config: Partial<HorizontalLayoutConfig> = {}
) => {
  const {
    startX = 50,
    startY = 50,
    levelSpacing = 250,
    nodeSpacing = 100,
  } = config;

  // 创建邻接表
  const graph: { [key: string]: string[] } = {};
  edges.forEach(({ source, target }) => {
    if (!graph[source]) graph[source] = [];
    graph[source].push(target);
  });

  // 计算每个节点的层级（从左到右的距离）
  const levels: { [key: string]: number } = {};
  const calculateLevels = (nodeId: string, level: number = 0) => {
    if (levels[nodeId] === undefined || level > levels[nodeId]) {
      levels[nodeId] = level;
      if (graph[nodeId]) {
        graph[nodeId].forEach(targetId => {
          calculateLevels(targetId, level + 1);
        });
      }
    }
  };

  // 找到所有根节点（入度为0的节点）
  const inDegree: { [key: string]: number } = {};
  edges.forEach(({ target }) => {
    inDegree[target] = (inDegree[target] || 0) + 1;
  });
  const rootNodes = nodes.filter(node => !inDegree[node.id]);
  rootNodes.forEach(node => calculateLevels(node.id));

  // 计算每一层有多少节点
  const nodesAtLevel: { [key: number]: string[] } = {};
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!nodesAtLevel[level]) nodesAtLevel[level] = [];
    nodesAtLevel[level].push(nodeId);
  });

  // 计算新的节点位置
  return nodes.map(node => {
    const level = levels[node.id] || 0;
    const nodesInLevel = nodesAtLevel[level] || [];
    const indexInLevel = nodesInLevel.indexOf(node.id);
    const x = startX + level * levelSpacing;
    const y = startY + indexInLevel * nodeSpacing;

    return {
      ...node,
      position: { x, y },
      // 禁止拖拽
      draggable: false,
    };
  });
};
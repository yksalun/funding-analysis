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
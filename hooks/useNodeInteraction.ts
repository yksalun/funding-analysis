'use client';

import { useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';

export function useNodeInteraction() {
  const { getEdges, setEdges, setNodes } = useReactFlow();

  const highlightConnections = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const connectedEdges = edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );

      const connectedEdgeIds = connectedEdges.map((edge) => edge.id);

      const connectedNodeIds = new Set(
        connectedEdges.flatMap((edge) => [edge.source, edge.target])
      );

      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          className: connectedNodeIds.has(node.id) ? 'highlighted' : 'dimmed',
          style: {
            ...node.style,
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }))
      );

      setEdges((edges) =>
        edges.map((edge) => {
          return {
            ...edge,
            //className: connectedEdges.includes(edge) ? 'highlighted' : '',
            style: {
              ...edge.style,
              // transition: 'all 200ms',
              opacity: connectedEdgeIds.includes(edge.id) ? 1 : 0.2,
              strokeWidth: connectedEdgeIds.includes(edge.id) ? 3 : 2
            },
            labelStyle: {
              ...edge.labelStyle,
              // transition: 'all 200ms',
              opacity: connectedEdgeIds.includes(edge.id) ? 1 : 0.2
            }
          };
        })
      );
    },
    [getEdges, setEdges, setNodes]
  );

  const resetHighlight = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        className: '',
        style: {
          ...node.style,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }))
    );

    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        className: '',
        style: {
          ...edge.style,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1,
          strokeWidth: 2
        },
        labelStyle: {
          ...edge.labelStyle,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1
        }
      }))
    );
  }, [setEdges, setNodes]);

  return {
    highlightConnections,
    resetHighlight
  };
}

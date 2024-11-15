"use client";

import { EdgeProps, getBezierPath } from "@xyflow/react";

export interface CustomEdgeProps extends EdgeProps {
  className?: string;
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle,
  className,
}: CustomEdgeProps) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHighlighted = className?.includes("highlighted");

  const baseStyle = {
    ...style,
    stroke: isHighlighted ? "#3b82f6" : "#6366f1",
    strokeWidth: isHighlighted ? 3 : 2,
    // transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const baseLabelStyle = {
    ...labelStyle,
    fill: isHighlighted ? "#3b82f6" : "#4b5563",
    // transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: 12,
    fontWeight: 500,
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        style={baseStyle}
        markerEnd={markerEnd}
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          style={baseLabelStyle}
          className="react-flow__edge-text"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </>
  );
}

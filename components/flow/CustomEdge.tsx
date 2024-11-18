'use client';

import { useState } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath
} from '@xyflow/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export interface CustomEdgeProps extends EdgeProps {
  className?: string;
  data?: {
    amount?: number;
    date?: string;
    type?: string;
    description?: string;
  };
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
  data
}: CustomEdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const isHighlighted = className?.includes('highlighted');

  const baseStyle = {
    ...style,
    stroke: isHovered ? '#2563eb' : isHighlighted ? '#3b82f6' : '#6366f1',
    strokeWidth: isHovered || isHighlighted ? 3 : 2
  };

  const baseLabelStyle = {
    ...labelStyle,
    fill: isHovered ? '#2563eb' : isHighlighted ? '#3b82f6' : '#4b5563',
    fontSize: 12,
    fontWeight: 500
  };

  const onOpenChange = (open: boolean) => {
    setTooltipOpen(open);
  };

  return (
    <>
      <path
        id={id}
        style={baseStyle}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
      <path
        d={path}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        strokeLinecap="round"
        style={{ cursor: 'pointer' }}
        className="react-flow__edge-interaction"
        onMouseEnter={() => {
          setIsHovered(true);
          setTooltipOpen(true);
        }}
        onMouseLeave={(e) => {
          // 检查是否移动到了 tooltip 上
          const tooltipElement = document.querySelector('.edge-tooltip');
          if (
            tooltipElement &&
            (e.relatedTarget as HTMLElement)?.closest('.edge-tooltip')
          ) {
            return;
          }
          setIsHovered(false);
          setTooltipOpen(false);
        }}
      />
      {label && (
        <text
          style={baseLabelStyle}
          x={labelX}
          y={labelY - 10}
          textAnchor="middle"
          alignmentBaseline="middle"
          dominantBaseline="central"
          pointerEvents="none"
        >
          {label}
        </text>
      )}
      {tooltipOpen && (
        <foreignObject
          width={200}
          height={120}
          x={labelX - 100}
          y={labelY - 90}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            className="edge-tooltip bg-white rounded-lg shadow-lg border border-gray-200 p-2 text-sm"
            onMouseEnter={() => {
              setIsHovered(true);
              setTooltipOpen(true);
            }}
            onMouseLeave={(e) => {
              // 检查是否移动回到了边上
              const path = document.querySelector(
                '.react-flow__edge-interaction'
              );
              if (
                path &&
                (e.relatedTarget as SVGElement)?.classList.contains(
                  'react-flow__edge-interaction'
                )
              ) {
                return;
              }
              setIsHovered(false);
              setTooltipOpen(false);
            }}
          >
            <div className="space-y-1.5">
              {data?.amount && (
                <p className="font-medium">
                  交易金额: ¥{data.amount.toLocaleString()}
                </p>
              )}
              {data?.date && <p>交易日期: {data.date}</p>}
              {data?.type && <p>交易类型: {data.type}</p>}
              {data?.description && <p>交易描述: {data.description}</p>}
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
}

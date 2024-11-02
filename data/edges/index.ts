import { MarkerType } from '@ant-design/pro-flow';

const edgeType = 'radius';
// const edgeType = 'bezier';

export const edges = [
  {
    id: 'a1-a2',
    source: 'a1',
    target: 'a2',
    type: edgeType,
    markerEnd: {
      type: MarkerType.Arrow
    },
    animated: true,
    data: 'xyz',
    sourceHandle: 'right-out-1',
    targetHandle: 'left-in-1'
  },
  {
    id: 'a2-a1',
    source: 'a2',
    target: 'a1',
    type: edgeType,
    animated: true,
    data: 'xyz',
    sourceHandle: 'left-out-2',
    targetHandle: 'right-in-2'
  }
  // {
  //   id: 'a1-a3',
  //   source: 'a1',
  //   target: 'a3',
  //   type: edgeType,
  //   animated: true,
  //   data: 'abc',
  //   sourceHandle: 'left-out',
  //   targetHandle: 'right-in',
  // },
  // {
  //   id: 'a3-a1',
  //   source: 'a3',
  //   target: 'a1',
  //   type: edgeType,
  //   animated: true,
  //   data: 'abcd',
  //   sourceHandle: 'right-out',
  //   targetHandle: 'left-in',
  // },
];

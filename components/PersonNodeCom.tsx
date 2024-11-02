import { Handle, Position } from '@ant-design/pro-flow';
import { FC } from 'react';

interface PersonData {
  name: string;
}

const PersonNodeCom: FC<{
  data: PersonData;
}> = ({ data }) => {
  const { name } = data;

  return (
    <div className="p-2 rounded bg-blue-500">
      <span className="text-white text-xl ">{name}</span>
      <Handle
        id={`right-in-1`}
        type="target"
        position={Position.Right}
        style={{ opacity: 0.5, top: 10 }}
      />
      <Handle
        id={`right-out-1`}
        type="source"
        position={Position.Right}
        style={{ opacity: 0.5, top: 10 }}
      />
      <Handle
        id={`right-in-2`}
        type="target"
        position={Position.Right}
        style={{ opacity: 0.5, top: 'unset', bottom: 10 }}
      />
      <Handle
        id={`right-out-2`}
        type="source"
        position={Position.Right}
        style={{ opacity: 0.5, top: 'unset', bottom: 10 }}
      />
      <Handle
        id={`left-in-1`}
        type="target"
        position={Position.Left}
        style={{ opacity: 0.5, top: 10 }}
      />
      <Handle
        id={`left-out-1`}
        type="source"
        position={Position.Left}
        style={{ opacity: 0.5, top: 10 }}
      />
      <Handle
        id={`left-in-2`}
        type="target"
        position={Position.Left}
        style={{ opacity: 0.5, top: 'unset', bottom: 10 }}
      />
      <Handle
        id={`left-out-2`}
        type="source"
        position={Position.Left}
        style={{ opacity: 0.5, top: 'unset', bottom: 10 }}
      />
    </div>
  );
};

export default PersonNodeCom;

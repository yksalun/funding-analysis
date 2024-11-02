'use client';
import { FlowViewProvider } from '@ant-design/pro-flow';
import FlowPageCom from '@/components/FlowPageCom';

export default function Home() {
  return (
    <div className="h-full">
      <FlowViewProvider>
        <FlowPageCom></FlowPageCom>
      </FlowViewProvider>
    </div>
  );
}

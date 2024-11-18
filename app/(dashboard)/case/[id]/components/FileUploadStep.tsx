'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
import { Search } from 'lucide-react';
import { UploadModal } from './UploadModal';

export function FileUploadStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFilesUpload = (files: File[]) => {
    // 处理文件上传逻辑
    console.log('Uploading files:', files);
    setIsUploadModalOpen(false);
  };

  const columns = [
    { accessorKey: 'name', header: '文件名称' },
    { accessorKey: 'size', header: '文件大小' },
    { accessorKey: 'uploadTime', header: '上传时间' },
    { accessorKey: 'status', header: '状态' },
    { accessorKey: 'statusDetail', header: '状态详情' },
    { accessorKey: 'account', header: '关联账户' },
    { accessorKey: 'actions', header: '操作' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="输入账户搜索文件（仅支持银行卡交易记录...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
          上传文件
        </Button>
        <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
          上传压缩包
        </Button>
        <Button variant="default" onClick={() => setIsUploadModalOpen(true)}>
          上传文件夹
        </Button>
        <UploadModal
          open={isUploadModalOpen}
          onCancel={() => setIsUploadModalOpen(false)}
          onConfirm={handleFilesUpload}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" /> 只显示待处理文件
        <span>导入成功(0)</span>
        <span>特殊处理(0)</span>
      </div>
      {/* <DataTable columns={columns} data={[]} /> */}
    </div>
  );
}

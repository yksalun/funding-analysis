'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal } from 'antd';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { CloudCog, FolderUp } from 'lucide-react';

interface UploadModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (files: File[]) => void;
}

export function UploadModal({ open, onCancel, onConfirm }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // 验证文件数量
      if (acceptedFiles.length + files.length > 150) {
        setError('文件数量超过150个限制');
        return;
      }

      // 验证文件总大小
      const totalSize =
        acceptedFiles.reduce((acc, file) => acc + file.size, 0) +
        files.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 1000 * 1024 * 1024) {
        // 1000MB
        setError('文件总大小超过1000MB限制');
        return;
      }

      setFiles((prev) => [...prev, ...acceptedFiles]);
      setError('');
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx'
      ],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  const onClose = () => {
    // console.log('onClose');
    setFiles([]);
    setError('');
    onCancel();
  };
  const handleConfirm = () => {
    onConfirm(files);
  };

  return (
    <Modal
      title="文件上传窗口"
      open={open}
      footer={null}
      width={800}
      destroyOnClose={true}
      afterClose={onClose}
    >
      <div className="p-6">
        {/* <Alert variant="destructive" className="mb-4">
          <p>请注意检查上传的文件，确认上传后无法取消上传状态或删除文件。</p>
        </Alert> */}

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            hover:border-primary/50
          `}
        >
          <input {...getInputProps()} />
          <FolderUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">点击上传文件</p>
            <p className="text-sm text-muted-foreground">
              或将文件拖拽到这里上传
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            文件要求：
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                支持Excel格式文件（.xlsx/.xls），文件名长度限制128位（包括文件后缀）
              </li>
              <li>单次每次上传总大小1000MB，150个以内文件数量</li>
            </ul>
          </div>

          <div className="flex justify-between text-sm">
            <span>当前上传文件数量：{files.length}/150</span>
            <span>总文件大小：{totalSizeMB}/1000 MB</span>
          </div>

          {error && <Alert variant="destructive">{error}</Alert>}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onCancel}>
            取消上传
          </Button>
          <Button
            disabled={files.length === 0 || !!error}
            onClick={handleConfirm}
          >
            确认上传
          </Button>
        </div>
      </div>
    </Modal>
  );
}

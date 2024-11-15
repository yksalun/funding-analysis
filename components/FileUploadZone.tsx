"use client";

import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
}

export function FileUploadZone({ onFilesAccepted }: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAccepted,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: true,
  });

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium">
            {isDragActive ? '将 Excel 文件拖放到此处' : '拖放 Excel 文件到此处'}
          </p>
          <p className="text-sm text-muted-foreground">
            或点击选择文件
          </p>
          <Button variant="outline" className="mt-2">
            <Upload className="w-4 h-4 mr-2" />
            选择文件
          </Button>
        </div>
      </div>
    </Card>
  );
}
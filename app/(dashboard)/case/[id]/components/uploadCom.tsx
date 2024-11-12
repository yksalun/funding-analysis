'use client';

import { AiOutlineInbox } from 'react-icons/ai';
import type { UploadProps, UploadFile, GetProp } from 'antd';
import { message, Upload } from 'antd';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LuLoader2 } from 'react-icons/lu';

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function UploadCom() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as FileType);
    });
    setUploading(true);
    // You can use any AJAX library you like
    // fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
    //   method: 'POST',
    //   body: formData
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setFileList([]);
    //     message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     setUploading(false);
    //   });

    //todo
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onChange(info) {
      console.log(info, 'onChange');
      //   const { status } = info.file;
      //   if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      //   }
      //   if (status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully.`);
      //   } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      //   }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file, _fileList) => {
      //   console.log(file, 'beforeUpload');
      console.log(_fileList, 'beforeUpload');
      setFileList([...fileList, ..._fileList]);

      return false;
    },
    fileList,
    className: 'w-1/2 h-40 relative'
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="w-1/2">
        <Dragger {...props}>
          <p className="ant-upload-text">点击或拖入文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持单次或批量上传</p>
        </Dragger>
        <div className="mt-4 flex justify-center items-center">
          <Button
            onClick={handleUpload}
            disabled={fileList.length === 0}
            className=""
          >
            {uploading && <LuLoader2 className="animate-spin" />}
            {uploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </div>
    </div>
  );
}

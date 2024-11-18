'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploadStep } from './FileUploadStep';
import { TransactionStep } from './TransactionStep';

export function StepForm() {
  const [currentStep, setCurrentStep] = useState('upload');

  return (
    <Card className="w-full p-6">
      <Tabs value={currentStep} onValueChange={setCurrentStep}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              1
            </span>
            录入案件信息
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              2
            </span>
            录入嫌疑人转账信息
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <FileUploadStep />
        </TabsContent>
        <TabsContent value="transaction">
          <TransactionStep />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

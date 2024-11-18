'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TransactionStep() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('bank');

  const columns = [
    { accessorKey: 'accountName', header: '开户名' },
    { accessorKey: 'accountNumber', header: '查询卡号' },
    { accessorKey: 'counterpartyAccount', header: '对方开户名' },
    { accessorKey: 'counterpartyNumber', header: '对方卡号' },
    { accessorKey: 'remarks', header: '借贷标志' },
    { accessorKey: 'amount', header: '交易金额' },
    { accessorKey: 'transactionTime', header: '交易时间' }
  ];

  return (
    <div className="space-y-4">
      <Input
        placeholder="请输入嫌疑人姓名或账号卡号号码搜索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <Tabs value={transactionType} onValueChange={setTransactionType}>
          <TabsList>
            <TabsTrigger value="bank">银行交易</TabsTrigger>
            <TabsTrigger value="thirdParty">三方交易</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline">导出分析结果</Button>
          <Button variant="outline">虚拟当事人</Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">共计：0笔，0.00元</div>

      {/* <DataTable columns={columns} data={[]} /> */}

      <Button className="w-full">请选择中交易为嫌疑资金，开始分析</Button>
    </div>
  );
}

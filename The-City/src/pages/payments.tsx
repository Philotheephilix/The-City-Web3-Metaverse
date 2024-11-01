"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CreditCard } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CustomModal from '@/components/common/Modal'
import PYUSDTransfer from '@/utils/pyusd/transfer'

// Mock data for bills and fines
const mockBills = {
  utilities: [
    { id: 'water1', type: 'Water', amount: 45.50, dueDate: '2023-12-15' },
    { id: 'elec1', type: 'Electricity', amount: 78.20, dueDate: '2023-12-20' },
  ],
  traffic: [
    { id: 'traffic1', type: 'Speeding Ticket', amount: 150.00, dueDate: '2023-12-10' },
    { id: 'traffic2', type: 'Parking Violation', amount: 50.00, dueDate: '2023-12-18' },
  ],
  environmental: [
    { id: 'env1', type: 'Recycling Fee', amount: 10.00, dueDate: '2023-12-31' },
  ],
  safety: [
    { id: 'safety1', type: 'Fire Safety Inspection', amount: 25.00, dueDate: '2023-12-25' },
  ],
  taxes: [
    { id: 'tax1', type: 'Property Tax', amount: 1200.00, dueDate: '2023-12-31' },
  ],
}
const addressMapping: Record<string, string> = {
  utilities: '0x108CB27C14Da908A53bFC676044B3fF5C8cC1657', // pwd account
  traffic: '0x108CB27C14Da908A53bFC676044B3fF5C8cC1657', // police department account
  environmental: '0x108CB27C14Da908A53bFC676044B3fF5C8cC1657', // pwd account
  safety: '0x108CB27C14Da908A53bFC676044B3fF5C8cC1657', // pwd account
  taxes: '0x108CB27C14Da908A53bFC676044B3fF5C8cC1657', // government official account
};
export default function UserBillsPage() {
  const [selectedBills, setSelectedBills] = useState<string[]>([])
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const handleBillSelection = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    )
  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const calculateTotal = () => {
    return Object.values(mockBills)
      .flat()
      .filter(bill => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0)
      .toFixed(2)
  }


  const renderBillsTable = (bills: typeof mockBills.utilities) => (
    <table className="w-full text-center">
      <thead className='mb-2'>
        <tr>
          <th className="text-center">Select</th>
          <th className="text-center">Type</th>
          <th className="text-center">Amount</th>
          <th className="text-center">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {bills.map(bill => (
          <tr key={bill.id}>
            <td>
              <Checkbox
                id={bill.id}
                checked={selectedBills.includes(bill.id)}
                onCheckedChange={() => handleBillSelection(bill.id)}
              />
            </td>
            <td>{bill.type}</td>
            <td>${bill.amount.toFixed(2)}</td>
            <td>{bill.dueDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  function getAddressFromList(): string {
    return addressMapping[activeTab]
  }
  const [activeTab, setActiveTab] = useState<string>('utilities'); // Default active tab

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-4 bg-background text-foreground dark">
      <h1 className="text-3xl font-bold mb-4">Your Bills and Fines</h1>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Please review your bills and fines carefully. Late payments may incur additional fees.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="utilities" className="w-full">
        <TabsList>
          <TabsTrigger
            value="utilities"
            onClick={() => handleTabChange('utilities')}
          >
            Utilities
          </TabsTrigger>
          <TabsTrigger
            value="traffic"
            onClick={() => handleTabChange('traffic')}
          >
            Traffic
          </TabsTrigger>
          <TabsTrigger
            value="environmental"
            onClick={() => handleTabChange('environmental')}
          >
            Environmental
          </TabsTrigger>
          <TabsTrigger
            value="safety"
            onClick={() => handleTabChange('safety')}
          >
            Safety
          </TabsTrigger>
          <TabsTrigger
            value="taxes"
            onClick={() => handleTabChange('taxes')}
          >
            Taxes
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <TabsContent value="utilities">
            <Card>
              <CardHeader>
                <CardTitle>Utility Bills</CardTitle>
                <CardDescription>Your water and electricity bills</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBillsTable(mockBills.utilities)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Fines</CardTitle>
                <CardDescription>Your outstanding traffic violations</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBillsTable(mockBills.traffic)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="environmental">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Fees</CardTitle>
                <CardDescription>Fees related to environmental services</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBillsTable(mockBills.environmental)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="safety">
            <Card>
              <CardHeader>
                <CardTitle>Safety Fees</CardTitle>
                <CardDescription>Fees related to public safety services</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBillsTable(mockBills.safety)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="taxes">
            <Card>
              <CardHeader>
                <CardTitle>Taxes</CardTitle>
                <CardDescription>Your local tax obligations</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBillsTable(mockBills.taxes)}
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <PYUSDTransfer initialReceiverAddress={getAddressFromList()} initialAmount={calculateTotal()} />
      </CustomModal>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-semibold">Total Selected: ${calculateTotal()}</p>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedBills.length === 0} onClick={openModal}>
              <CreditCard className="mr-2 h-4 w-4" /> Pay Selected Bills
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  )
}
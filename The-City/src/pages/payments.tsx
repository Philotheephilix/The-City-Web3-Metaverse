"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CreditCard } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function UserBillsPage() {
  const [selectedBills, setSelectedBills] = useState<string[]>([])
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

  const handleBillSelection = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    )
  }

  const calculateTotal = () => {
    return Object.values(mockBills)
      .flat()
      .filter(bill => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0)
      .toFixed(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const total = calculateTotal()
    if (parseFloat(paymentAmount) < parseFloat(total)) {
      alert("Payment amount must be at least the total of selected bills.")
      return
    }
    alert(`Payment of $${paymentAmount} submitted successfully for selected bills!`)
    setIsPaymentDialogOpen(false)
    setPaymentAmount('')
    setSelectedBills([])
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
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
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

      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-semibold">Total Selected: ${calculateTotal()}</p>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedBills.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" /> Pay Selected Bills
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pay Bills</DialogTitle>
              <DialogDescription>
                Enter the amount you wish to pay for the selected bills.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="col-span-3"
                    min={calculateTotal()}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Pay Now</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
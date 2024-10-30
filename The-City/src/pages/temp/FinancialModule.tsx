import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  { id: 1, date: '2023-03-15', amount: 1000, type: 'PYUSD Deposit' },
  { id: 2, date: '2023-03-16', amount: -50, type: 'Gas Fee' },
  { id: 3, date: '2023-03-17', amount: 500, type: 'PYUSD Withdrawal' },
  { id: 4, date: '2023-03-18', amount: -25, type: 'QuickNode Fee' },
]

export default function FinancialModule() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount (PYUSD)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.date}</TableCell>
            <TableCell>{tx.type}</TableCell>
            <TableCell className="text-right">
              <span className={tx.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                {tx.amount.toFixed(2)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
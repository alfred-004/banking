import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  const sampleTransactions = [
    { id: 1, name: "Grocery Shopping", amount: 120, date: "2024-03-20", type: "debit", paymentChannel: "Card", category: "Groceries" },
    { id: 2, name: "Uber Ride", amount: 15, date: "2024-03-18", type: "debit", paymentChannel: "Wallet", category: "Transport" },
    { id: 3, name: "Salary Credit", amount: 2000, date: "2024-03-15", type: "credit", paymentChannel: "Bank Transfer", category: "Income" },
    { id: 4, name: "Netflix Subscription", amount: 10, date: "2024-03-10", type: "debit", paymentChannel: "Card", category: "Entertainment" },
    { id: 5, name: "Electricity Bill", amount: 50, date: "2024-03-07", type: "debit", paymentChannel: "UPI", category: "Bills" },
  ];

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
      <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <BankTabItem
                key={account.id}
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

<TransactionsTable transactions={sampleTransactions} />;
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentTransactions
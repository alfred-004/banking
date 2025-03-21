import HeaderBox from '@/components/HeaderBox';
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react';

const sampleTransactions = [
  { id: 1, name: 'Amazon Purchase', amount: 50, date: '2024-03-21', type: 'debit', paymentChannel: 'Card', category: 'Shopping' },
  { id: 2, name: 'Uber Ride', amount: 20, date: '2024-03-20', type: 'debit', paymentChannel: 'Wallet', category: 'Transport' },
  { id: 3, name: 'Salary', amount: 2000, date: '2024-03-18', type: 'credit', paymentChannel: 'Bank Transfer', category: 'Income' },
  { id: 4, name: 'Netflix Subscription', amount: 15, date: '2024-03-15', type: 'debit', paymentChannel: 'Card', category: 'Entertainment' },
  { id: 5, name: 'Grocery Shopping', amount: 100, date: '2024-03-10', type: 'debit', paymentChannel: 'UPI', category: 'Groceries' },
];

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts || accounts.data.length === 0) return <p className="text-center text-gray-500">No accounts found.</p>;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });

  const rowsPerPage = 10;
  const totalPages = Math.ceil((account?.transactions.length || sampleTransactions.length) / rowsPerPage);
  
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = (account?.transactions || sampleTransactions).slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  return (
    <div className="bg-white min-h-screen p-6 text-gray-800 rounded-lg shadow-md">
      <HeaderBox title="Transaction History" subtext="See your bank details and transactions." />
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-sm">
        <div>
          <h2 className="text-lg font-bold">{account?.data?.name || "Sample Account"}</h2>
          <p className="text-sm text-gray-600">{account?.data?.officialName || "Official Name"}</p>
          <p className="text-sm font-semibold tracking-[1.1px] text-gray-500">●●●● ●●●● ●●●● {account?.data?.mask || "XXXX"}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Current balance</p>
          <p className="text-2xl font-bold">{formatAmount(account?.data?.currentBalance) || "$2,500.00"}</p>
        </div>
      </div>

      <section className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <TransactionsTable transactions={currentTransactions} />
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination totalPages={totalPages} page={currentPage} />
          </div>
        )}
      </section>
    </div>
  );
};

export default TransactionHistory;

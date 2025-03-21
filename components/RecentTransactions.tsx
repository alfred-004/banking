"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import { getAccounts, getAccount } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";

const RecentTransactions = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appwriteItemId, setAppwriteItemId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        const fetchedAccounts = await getAccounts({ userId: loggedInUser.$id });

        if (fetchedAccounts?.data.length > 0) {
          setAccounts(fetchedAccounts.data);
          setAppwriteItemId(fetchedAccounts.data[0].appwriteItemId);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (appwriteItemId) {
          const account = await getAccount({ appwriteItemId });
          setTransactions(account?.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [appwriteItemId]);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link href={`/transaction-history/?id=${appwriteItemId}`} className="view-all-btn">
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account) => (
            <TabsTrigger
              key={account.id}
              value={account.appwriteItemId}
              onClick={() => setAppwriteItemId(account.appwriteItemId)}
            >
              <BankTabItem account={account} appwriteItemId={appwriteItemId} />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account) => (
          <TabsContent value={account.appwriteItemId} key={account.id} className="space-y-4">
            <BankInfo account={account} appwriteItemId={appwriteItemId} type="full" />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;

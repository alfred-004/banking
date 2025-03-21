"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";

type Transaction = {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: "debit" | "credit";
  paymentChannel: string;
  category: string;
};

type TransactionsTableProps = {
  transactions: Transaction[];
};

type CategoryBadgeProps = {
  category: string;
};

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor = "border-gray-300",
    backgroundColor = "bg-gray-200",
    textColor = "text-gray-600",
    chipBackgroundColor = "bg-gray-100",
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border", borderColor, chipBackgroundColor)}>
      <div className={cn("w-2 h-2 rounded-full", backgroundColor)} />
      <p className={cn("text-xs font-medium", textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white shadow-sm rounded-lg border border-gray-100">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="mt-2 text-gray-500 text-sm">No transactions available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Channel</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t, index) => {
              const status = getTransactionStatus(new Date(t.date));
              const amount = formatAmount(t.amount);
              const isDebit = t.type === "debit";
              const isCredit = t.type === "credit";
              
              return (
                <TableRow 
                  key={t.id} 
                  className={cn(
                    "hover:bg-gray-50 transition-colors border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-800 truncate max-w-xs">
                        {removeSpecialCharacters(t.name)}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden">
                        {t.paymentChannel} • {t.category}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className={cn(
                      "font-semibold inline-flex items-center",
                      isDebit ? "text-red-600" : "text-green-600"
                    )}>
                      {isDebit ? (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          {amount}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {amount}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <CategoryBadge category={status} />
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="text-sm text-gray-700">
                      {formatDateTime(new Date(t.date)).dateTime}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 hidden md:table-cell">
                    <div className="text-sm text-gray-700 capitalize">{t.paymentChannel}</div>
                  </TableCell>

                  <TableCell className="px-4 py-3 hidden md:table-cell">
                    <CategoryBadge category={t.category} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;
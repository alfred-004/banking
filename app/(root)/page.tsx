import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import BudgetProgress from './test/_components/BudgetProgress ';
import SpendingCategories from './test/_components/SpendingCategories ';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  })

  if(!accounts) return;
  
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })
  const userBudget = loggedIn?.budget ?? 2000;
  const usedBudget = account?.transactions
    ? account.transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0)
    : 0;
    console.log('real total balance',accounts?.totalCurrentBalance)

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
       
       

<BudgetProgress totalBudget={accounts?.totalCurrentBalance} usedBudget={3000} />



{/* Add Spending Categories */}

  <SpendingCategories transactions={ [
    { id: 1, category: "Groceries", amount: 150 },
    { id: 2, category: "Transport", amount: 50 },
    { id: 3, category: "Entertainment", amount: 100 },
    { id: 4, category: "Groceries", amount: 200 },
    { id: 5, category: "Bills", amount: 300 },
    { id: 6, category: "Miscellaneous", amount: 80 },
    { id: 7, category: "Transport", amount: 40 },
    { id: 8, category: "Shopping", amount: 250 },
    { id: 9, category: "Bills", amount: 150 },
    { id: 10, category: "Dining", amount: 60 },
  ]} />



        <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}

export default Home
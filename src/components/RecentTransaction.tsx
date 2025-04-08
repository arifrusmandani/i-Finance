type Transaction = {
    name: string;
    category: string;
    date: string;
    amount: string;
    type: "income" | "outcome";
  };
  
  const outcomeTransactions: Transaction[] = [
    { name: "Emirates", category: "Transport", date: "Today", amount: "-683.00 $", type: "outcome" },
    { name: "Cinema", category: "Other", date: "Yesterday", amount: "-17.20 $", type: "outcome" },
    { name: "Starbucks", category: "Restaurant", date: "21.04.2020", amount: "-14.99 $", type: "outcome" },
  ];
  
  const incomeTransactions: Transaction[] = [
    { name: "Dividends", category: "Investment", date: "Yesterday", amount: "+281.73 $", type: "income" },
    { name: "Salary", category: "Other", date: "Yesterday", amount: "+2000.00 $", type: "income" },
    { name: "John Doe", category: "Other", date: "21.04.2020", amount: "+356.99 $", type: "income" },
  ];
  
  const TransactionItem = ({ tx }: { tx: Transaction }) => {
    return (
      <div className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl shadow-sm hover:bg-neutral-700 transition">
        <div className="flex flex-col">
          <span className="font-semibold text-white">{tx.name}</span>
          <span className="text-sm text-neutral-400">{tx.category} • {tx.date}</span>
        </div>
        <span className={`font-medium ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
          {tx.amount}
        </span>
      </div>
    );
  };
  
  const RecentTransactions = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Outcome</h3>
          <div className="flex flex-col gap-3">
            {outcomeTransactions.map((tx, i) => (
              <TransactionItem key={i} tx={tx} />
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Income</h3>
          <div className="flex flex-col gap-3">
            {incomeTransactions.map((tx, i) => (
              <TransactionItem key={i} tx={tx} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default RecentTransactions;
  
import Card from '../components/Card';
import Chart from '../components/Chart';
import GreetingCard from '../components/GreetingCard';
import OverviewSection from '../components/OverviewSection';
import RecentTransaction from '../components/RecentTransaction';

export default function Dashboard() {
  const dummyData = {
    saldo: 'Rp 12.500.000',
    pemasukan: 'Rp 7.000.000',
    pengeluaran: 'Rp 4.500.000',
  };

  return (
    <div className="min-h-screen">
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
        <GreetingCard />
        <OverviewSection />
        <RecentTransaction />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Card title="Total Saldo" amount={dummyData.saldo} />
          <Card title="Total Pemasukan" amount={dummyData.pemasukan} />
          <Card title="Total Pengeluaran" amount={dummyData.pengeluaran} />
        </div>
        <div>
          <Chart />
        </div>
      </div>
    </div>
  );
}
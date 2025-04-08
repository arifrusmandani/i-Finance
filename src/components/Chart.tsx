import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', pemasukan: 4000, pengeluaran: 2400 },
  { name: 'Feb', pemasukan: 3000, pengeluaran: 1398 },
  { name: 'Mar', pemasukan: 2000, pengeluaran: 9800 },
  { name: 'Apr', pemasukan: 2780, pengeluaran: 3908 },
];

export default function Chart() {
  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Grafik Keuangan</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pemasukan" stroke="#4ade80" strokeWidth={2} />
          <Line type="monotone" dataKey="pengeluaran" stroke="#f87171" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
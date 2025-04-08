export default function Card({ title, amount }: { title: string; amount: string }) {
    return (
      <div className="bg-white dark:bg-gray-700 shadow rounded-2xl p-6">
        <h2 className="text-sm text-gray-500 dark:text-gray-300">{title}</h2>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{amount}</p>
      </div>
    );
  }
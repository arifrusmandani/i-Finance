import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, DownloadIcon, BrainCircuit } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { reportService } from '../services/report.service';


interface CategoryReport {
  category: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
}

interface MonthlyChartData {
  name: string;
  income: number;
  expense: number;
}

// Dummy AI analysis data
const dummyAnalysis = "Baik, dengan senang hati saya akan melakukan analisis komprehensif terhadap data cashflow yang Anda berikan. Berikut adalah laporan analisis keuangan, disusun berdasarkan instruksi yang Anda berikan:\n\n**LAPORAN ANALISIS CASHFLOW KEUANGAN**\n\n**Periode: April 2025 - Mei 2025**\n\n**1. Ringkasan Umum per Bulan**\n\n| Bulan      | Total Pemasukan (Rp) | Total Pengeluaran (Rp) | Arus Kas Bersih (Rp) |\n| ----------- | -------------------- | --------------------- | --------------------- |\n| April 2025  | 10,000,000.0          | 5,310,000.0           | 4,690,000.0           |\n| Mei 2025    | 10,000,000.0          | 4,705,000.0           | 5,295,000.0           |\n| **Rata-rata** | **10,000,000.0**       | **5,007,500.0**         | **4,992,500.0**         |\n\n**Interpretasi:**\n\nSecara umum, terlihat bahwa keuangan Anda dalam kondisi yang baik, dengan arus kas yang surplus setiap bulan. Terdapat perbedaan pengeluaran antar bulan, yang akan dianalisis lebih lanjut.\n\n**2. Analisis Pemasukan (Income)**\n\n*   **Sumber Pemasukan:**\n    *   **Utama/Rutin:** Gaji bulanan.\n    *   **Tambahan/Tidak Tetap:** Tidak ada, hanya ada satu sumber yaitu gaji.\n*   **Stabilitas Sumber Pemasukan Utama:** Sumber pemasukan utama (gaji) terlihat sangat stabil, dengan jumlah yang konstan setiap bulan. Ini memberikan fondasi yang kuat untuk perencanaan keuangan.\n*   **Total Pemasukan dan Rata-rata:** Total pemasukan per bulan adalah Rp 10,000,000.0. Rata-rata pemasukan selama periode ini juga Rp 10,000,000.0.\n*   **Fluktuasi Pemasukan:** Tidak ada fluktuasi karena hanya ada satu sumber pemasukan yang nilainya tetap.\n\n**3. Analisis Pengeluaran (Expense)**\n\n*   **Pengeluaran Tetap/Wajib:**\n    *   Sewa Rumah/Kontrakan (Housing): Rp 1,750,000.0 (April & Mei). Ini merupakan pengeluaran terbesar dan wajib.\n*   **Pengeluaran Semi-Variabel:**\n    *   Makanan (Food): Bervariasi setiap bulan, termasuk makan sehari-hari, groceries, snack, kopi.\n    *   Transportasi (Transport): Bensin, e-money, servis motor, ojek online.\n    *   Housing: Biaya Listrik.\n*   **Pengeluaran Tidak Tetap/Insidentil:**\n    *   Kesehatan (Health): Beli obat, vitamin, suplemen, biaya pengobatan.\n    *   Belanja (Shopping): Beli pakaian, sepatu.\n    *   Donasi (Donation): Sedekah, donasi masjid, donasi panti asuhan, donasi anak yatim.\n    *   Hiburan (Entertainment): Nonton bioskop, konser, langganan Spotify.\n    *   Pendidikan (Education): Beli buku, kursus online, pelatihan online, beli alat tulis.\n    *   Lain-lain (Others_expense): Beli tanaman hias, hadiah ulang tahun, hadiah teman.\n*   **Tren Pengeluaran:** Terjadi perbedaan signifikan pada kategori pengeluaran food dan shopping di antara bulan April dan Mei. Perlu dilihat lagi apa penyebabnya, apakah terdapat kebutuhan mendesak atau tidak.\n*   **Total Pengeluaran dan Rata-rata:** Total pengeluaran bulan April adalah Rp 5,310,000.0, sedangkan bulan Mei adalah Rp 4,705,000.0. Rata-rata pengeluaran selama periode ini adalah Rp 5,007,500.0.\n\n**4. Analisis Arus Kas Bersih (Net Cash Flow)**\n\n*   **Kondisi Keuangan:** Kondisi keuangan secara keseluruhan sangat positif karena konsisten surplus setiap bulan.\n*   **Besaran Surplus/Defisit:** Surplus bulan April adalah Rp 4,690,000.0 dan surplus bulan Mei adalah Rp 5,295,000.0. Rata-rata surplus adalah Rp 4,992,500.0.\n*   **Faktor Fluktuasi Arus Kas Bersih:** Fluktuasi pada arus kas bersih terutama disebabkan oleh perbedaan pengeluaran antar bulan. Pada bulan April, pengeluaran lebih tinggi karena ada kebutuhan insidentil seperti beli obat flu, beli kaos online, dan beli buku pelajaran.\n\n**5. Observasi Kunci**\n\n*   **Kesehatan Finansial:** Kesehatan finansial secara umum baik, ditandai dengan pendapatan stabil dan surplus bulanan yang konsisten.\n*   **Kekuatan:** Pendapatan yang stabil merupakan kekuatan utama.\n*   **Kelemahan/Area Perhatian:** Adanya fluktuasi pada pengeluaran semi-variabel (food, transport) dan insidentil (kesehatan, shopping, entertainment, education). Perlu diperhatikan dan dikelola agar tidak mengganggu surplus.\n*   **Potensi:** Potensi besar dari surplus bulanan yang dapat dialokasikan untuk tujuan keuangan yang lebih strategis (dana darurat, investasi, pelunasan utang).\n\n**6. Rekomendasi**\n\nBerdasarkan analisis di atas, berikut adalah beberapa rekomendasi yang dapat dipertimbangkan:\n\n1.  **Alokasi Surplus:**\n    *   **Dana Darurat:** Prioritaskan pembentukan dana darurat yang idealnya mencakup 3-6 bulan pengeluaran rutin.\n    *   **Investasi:** Pertimbangkan diversifikasi investasi sesuai dengan profil risiko dan tujuan keuangan Anda (misal: reksa dana, saham, obligasi).\n    *   **Pelunasan Utang:** Jika ada utang dengan bunga tinggi (misal: kartu kredit), alokasikan sebagian surplus untuk mempercepat pelunasan.\n2.  **Anggaran (Budgeting):**\n    *   Buat anggaran bulanan yang lebih rinci, khususnya untuk kategori pengeluaran semi-variabel dan insidentil.\n    *   Lacak pengeluaran secara teratur dan bandingkan dengan anggaran yang telah dibuat.\n    *   Identifikasi area di mana pengeluaran dapat dioptimalkan tanpa mengorbankan kualitas hidup.\n3.  **Klarifikasi Kategori Pengeluaran:**\n    *   Review kategori pengeluaran yang ada dan pastikan sesuai dengan kebutuhan dan tujuan keuangan.\n    *   Pertimbangkan untuk membuat sub-kategori yang lebih spesifik jika diperlukan (misal: \"Food - Makan di Luar\" vs \"Food - Groceries\").\n4.  **Mengelola Pengeluaran Tidak Tetap:**\n    *   Siapkan anggaran khusus untuk pengeluaran tidak terduga (misal: perbaikan rumah, biaya kesehatan).\n    *   Pertimbangkan untuk memiliki asuransi kesehatan untuk mengurangi risiko biaya pengobatan yang besar.\n5.  **Review Keuangan Berkala:**\n    *   Lakukan review keuangan secara berkala (misal: bulanan, kuartalan) untuk memantau kinerja keuangan dan mengidentifikasi peluang perbaikan.\n    *   Evaluasi apakah tujuan keuangan jangka pendek dan jangka panjang masih relevan dan realistis.\n\nDengan menerapkan rekomendasi ini, Anda dapat meningkatkan efisiensi pengelolaan keuangan dan mencapai tujuan keuangan Anda dengan lebih efektif.\n\nSemoga laporan ini bermanfaat. Jika ada pertanyaan lebih lanjut, jangan ragu untuk bertanya.\n"

export default function Reports() {
  const [categoryReport, setCategoryReport] = useState<CategoryReport[]>([]);
  const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  // Generate years for selection (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchCategoryReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await reportService.getCategoryReport();
        if (response.status && response.data) {
          setCategoryReport(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch category report:', error);
        setError('Failed to load category report. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryReport();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsChartLoading(true);
        setChartError(null);
        const response = await reportService.getMonthlyChartData(selectedYear);
        if (response.status && response.data) {
          setChartData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartError('Failed to load chart data. Please try again later.');
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchChartData();
  }, [selectedYear]);

  // Calculate total balance
  const totalBalance = categoryReport.reduce((sum, item) => 
    sum + (item.type === 'INCOME' ? item.amount : -item.amount), 0
  );

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and analyze your financial data</p>
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Period Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
              </div>

              {/* Year Selection */}
              <Select.Root 
                value={selectedYear?.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white min-w-[120px]">
                  <Select.Value placeholder="Select Year" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Select.Viewport>
                      {years.map((year) => (
                        <Select.Item 
                          key={year} 
                          value={year.toString()} 
                          className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Select.ItemText>{year}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

            </div>
          </CardContent>
        </Card>

        {/* Chart and Category Report Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isChartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
                    {chartError}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.2 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => {
                          if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                          }
                          return value.toString();
                        }}
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.2 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'rgb(31 41 55)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: 'white',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingBottom: '20px'
                        }}
                      />
                      <Bar 
                        dataKey="income" 
                        name="Income" 
                        fill="#22c55e" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar 
                        dataKey="expense" 
                        name="Expense" 
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Report Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Category Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    {error}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryReport.map((item, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                item.type === 'INCOME' 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {item.type === 'INCOME' ? '↑' : '↓'}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === 'INCOME'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-medium ${
                              item.type === 'INCOME'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${
                            totalBalance >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {totalBalance >= 0 ? '+' : '-'} {formatCurrency(Math.abs(totalBalance))}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analysis Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-lg text-gray-900 dark:text-white">AI Financial Analysis</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {/* Overview Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <span>📊</span> Ringkasan Umum
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-blue-200 dark:border-blue-800">
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-700 dark:text-blue-300">Bulan</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Total Pemasukan</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Total Pengeluaran</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-blue-700 dark:text-blue-300">Arus Kas Bersih</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100 dark:border-blue-800/50">
                        <td className="px-4 py-2 text-sm text-blue-900 dark:text-blue-100">April 2025</td>
                        <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">+10,000,000</td>
                        <td className="px-4 py-2 text-sm text-right text-red-600 dark:text-red-400">-5,310,000</td>
                        <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">+4,690,000</td>
                      </tr>
                      <tr className="border-b border-blue-100 dark:border-blue-800/50">
                        <td className="px-4 py-2 text-sm text-blue-900 dark:text-blue-100">Mei 2025</td>
                        <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">+10,000,000</td>
                        <td className="px-4 py-2 text-sm text-right text-red-600 dark:text-red-400">-4,705,000</td>
                        <td className="px-4 py-2 text-sm text-right text-green-600 dark:text-green-400">+5,295,000</td>
                      </tr>
                      <tr className="bg-blue-50 dark:bg-blue-900/30">
                        <td className="px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100">Rata-rata</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">+10,000,000</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-red-600 dark:text-red-400">-5,007,500</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">+4,992,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-blue-800 dark:text-blue-200">
                  Secara umum, terlihat bahwa keuangan Anda dalam kondisi yang baik, dengan arus kas yang surplus setiap bulan. 
                  Terdapat perbedaan pengeluaran antar bulan, yang akan dianalisis lebih lanjut.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Analysis */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                    <span>💰</span> Analisis Pemasukan
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Sumber Pemasukan</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">•</span>
                          <span className="text-sm text-green-800 dark:text-green-200">
                            <span className="font-medium">Utama/Rutin:</span> Gaji bulanan
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">•</span>
                          <span className="text-sm text-green-800 dark:text-green-200">
                            <span className="font-medium">Tambahan/Tidak Tetap:</span> Tidak ada
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Stabilitas & Fluktuasi</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">•</span>
                          <span className="text-sm text-green-800 dark:text-green-200">
                            Sumber pemasukan utama (gaji) terlihat sangat stabil
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">•</span>
                          <span className="text-sm text-green-800 dark:text-green-200">
                            Tidak ada fluktuasi karena nilai tetap
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Expense Analysis */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                    <span>📉</span> Analisis Pengeluaran
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Kategori Pengeluaran</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Tetap/Wajib</h4>
                          <p className="text-sm text-red-800 dark:text-red-200">Sewa Rumah: Rp 1,750,000</p>
                        </div>
                        <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Semi-Variabel</h4>
                          <p className="text-sm text-red-800 dark:text-red-200">Makanan, Transport, Listrik</p>
                        </div>
                        <div className="bg-white/50 dark:bg-red-900/30 rounded-lg p-3 col-span-2">
                          <h4 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Tidak Tetap</h4>
                          <p className="text-sm text-red-800 dark:text-red-200">Kesehatan, Belanja, Donasi, Hiburan, Pendidikan</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Tren Pengeluaran</h3>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Terjadi perbedaan signifikan pada kategori pengeluaran food dan shopping di antara bulan April dan Mei.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Observations & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Key Observations */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                    <span>🔍</span> Observasi Kunci
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Kesehatan Finansial</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Kesehatan finansial secara umum baik, ditandai dengan pendapatan stabil dan surplus bulanan yang konsisten.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-3">
                        <h4 className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Kekuatan</h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200">Pendapatan yang stabil</p>
                      </div>
                      <div className="bg-white/50 dark:bg-purple-900/30 rounded-lg p-3">
                        <h4 className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Kelemahan</h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200">Fluktuasi pengeluaran variabel</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                    <span>🎯</span> Rekomendasi
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/50 dark:bg-amber-900/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Alokasi Surplus</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400">•</span>
                          <span className="text-sm text-amber-800 dark:text-amber-200">
                            <span className="font-medium">Dana Darurat:</span> 3-6 bulan pengeluaran rutin
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400">•</span>
                          <span className="text-sm text-amber-800 dark:text-amber-200">
                            <span className="font-medium">Investasi:</span> Diversifikasi sesuai profil risiko
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white/50 dark:bg-amber-900/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Anggaran & Review</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400">•</span>
                          <span className="text-sm text-amber-800 dark:text-amber-200">
                            Buat anggaran bulanan yang lebih rinci
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400">•</span>
                          <span className="text-sm text-amber-800 dark:text-amber-200">
                            Lakukan review keuangan berkala
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
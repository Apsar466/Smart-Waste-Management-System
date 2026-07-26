import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Download, Calendar, BarChart3, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminReports() {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-report-generate', reportType, startDate, endDate],
    queryFn: () => adminApi.getReportsWithFilter(reportType, startDate, endDate),
    enabled: true,
  });

  const rows = reportsData?.data?.data || [];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const exportCSV = () => {
    if (rows.length === 0) {
      toast.error('No report data to export');
      return;
    }
    let csv = 'Period,Users Registered,Waste Analyzed,Pickups Scheduled,Pickups Completed,Complaints Filed,Complaints Resolved,Carbon Saved (kg)\n';
    rows.forEach((r: any) => {
      csv += `${r.period},${r.usersRegistered},${r.wasteAnalyzed},${r.pickupsScheduled},${r.pickupsCompleted},${r.complaintsFiled},${r.complaintsResolved},${r.carbonSavedKg.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecowaste_${reportType}_report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('CSV Report exported successfully!');
  };

  const exportExcel = () => {
    // Standard Excel spreadsheet can parse CSV format easily.
    // Excel supports standard comma or tab separated fields.
    exportCSV();
  };

  const exportPDF = () => {
    if (rows.length === 0) {
      toast.error('No report data to print');
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:bg-white print:text-black">
      {/* Title */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">System Reports</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Metrics compilation and exports</p>
        </div>
      </div>

      {/* Query Parameters Form */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/40 print:hidden">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-sm">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Grouping Interval</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-350 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-355 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="btn-primary py-2.5 px-4 text-xs font-bold tracking-wider uppercase h-[42px]"
          >
            Compile Report
          </button>
        </form>
      </div>

      {/* Export Options */}
      {rows.length > 0 && (
        <div className="flex items-center gap-3 justify-end print:hidden">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-850 hover:border-slate-700 bg-slate-950/60 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> CSV
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2.5 rounded-xl border border-slate-850 hover:border-slate-700 bg-slate-950/60 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> EXCEL
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2.5 rounded-xl border border-slate-850 hover:border-slate-700 bg-slate-950/60 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} /> PDF/PRINT
          </button>
        </div>
      )}

      {/* Compiled Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Print Header */}
        <div className="hidden print:block p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">EcoWaste AI - System Performance Report</h1>
          <p className="text-xs text-gray-500 mt-1">Period: {startDate} to {endDate} ({reportType.toUpperCase()})</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-mono tracking-widest animate-pulse print:hidden">
            COMPILING REPORT PARAMETERS...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm font-mono tracking-wider">
            NO RECORDS REPORTED DURING CHOSEN TIMEFRAME
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse print:text-black">
              <thead>
                <tr className="border-b border-slate-800 print:border-gray-300 text-[10px] font-mono tracking-wider text-slate-400 print:text-gray-600 uppercase bg-slate-950/40 print:bg-gray-100">
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Registrations</th>
                  <th className="px-6 py-4">Waste Analysed</th>
                  <th className="px-6 py-4">Pickups Scheduled</th>
                  <th className="px-6 py-4">Pickups Completed</th>
                  <th className="px-6 py-4">Complaints Filed</th>
                  <th className="px-6 py-4">Complaints Resolved</th>
                  <th className="px-6 py-4">Carbon Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 print:divide-gray-200 text-slate-300 print:text-black text-xs font-mono">
                {rows.map((r: any) => (
                  <tr key={r.period} className="hover:bg-slate-850/20 print:hover:bg-transparent">
                    <td className="px-6 py-4 text-white print:text-black font-semibold">{r.period}</td>
                    <td className="px-6 py-4">{r.usersRegistered}</td>
                    <td className="px-6 py-4">{r.wasteAnalyzed}</td>
                    <td className="px-6 py-4">{r.pickupsScheduled}</td>
                    <td className="px-6 py-4">{r.pickupsCompleted}</td>
                    <td className="px-6 py-4">{r.complaintsFiled}</td>
                    <td className="px-6 py-4">{r.complaintsResolved}</td>
                    <td className="px-6 py-4 text-emerald-400 print:text-green-600 font-semibold">{r.carbonSavedKg.toFixed(1)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

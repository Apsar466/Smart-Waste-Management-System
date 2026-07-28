import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wasteApi } from '@/api/endpoints';
import { Search, Image, Download, ExternalLink, Calendar, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function AdminWasteAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports-list'],
    queryFn: () => wasteApi.getHistory(0, 1000), // Get all reports
  });

  const reports = reportsData?.data?.data?.content || [];

  const filteredReports = reports.filter((r: any) => {
    const matchesSearch = r.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    // In our code, cache reports set source = 'CACHE', else standard is GEMINI or not specified.
    const isCache = r.source === 'CACHE';
    const matchesSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'CACHE' && isCache) ||
      (sourceFilter === 'GEMINI' && !isCache);
    return matchesSearch && matchesSource;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const downloadCSVReport = () => {
    if (filteredReports.length === 0) {
      toast.error('No reports to download');
      return;
    }
    let csv = 'ID,User ID,Waste Type,Confidence,Recyclable,Source,Location,Latitude,Longitude,Date\n';
    filteredReports.forEach((r: any) => {
      csv += `${r.id},${r.userId},"${r.wasteType}",${(r.aiConfidence * 100).toFixed(0)}%,${r.recyclable ? 'Yes' : 'No'},${r.source || 'GEMINI'},"${r.location || 'N/A'}",${r.latitude || 'N/A'},${r.longitude || 'N/A'},"${new Date(r.createdAt).toLocaleString()}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste_analysis_reports_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Report downloaded successfully!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Waste Analysis Registry</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">AI Classification Logs</p>
        </div>
        <button
          onClick={downloadCSVReport}
          className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by waste type (e.g. plastic)..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Sources</option>
            <option value="GEMINI">Gemini AI</option>
            <option value="CACHE">Cached Database</option>
          </select>
        </div>
      </div>

      {/* Waste Analysis Table */}
      <div className="glass-card rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-mono tracking-widest animate-pulse">
            LOADING WASTE CLASSIFICATIONS...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm font-mono tracking-wider">
            NO LOGS FOUND MATCHING SPECIFIED CRITERIA
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono tracking-wider text-slate-400 uppercase bg-slate-950/40">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Waste Type</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Recyclable</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Analyzed Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                {currentReports.map((r: any) => {
                  const isCache = r.source === 'CACHE';
                  // Formulate absolute thumbnail paths using production backend URL
                  const relativeUrl = r.imageUrl?.replace(/^\/api/, '') || '';
                  const absoluteUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://ecowaste-backend-4jll.onrender.com/api'}${relativeUrl}`;

                  return (
                    <tr key={r.id} className="hover:bg-slate-850/20 transition-colors">
                      <td className="px-6 py-3">
                        <div className="relative group/img w-10 h-10 rounded-lg bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center cursor-zoom-in">
                          {r.imageUrl ? (
                            <>
                              <img
                                src={absoluteUrl}
                                alt={r.wasteType}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                                onError={(e) => {
                                  // Fallback text icon
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              {/* Magnify hover layer */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <a href={absoluteUrl} target="_blank" rel="noreferrer" className="text-white">
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </>
                          ) : (
                            <Image size={14} className="text-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{r.wasteType}</td>
                      <td className="px-6 py-4 font-mono">{(r.aiConfidence * 100).toFixed(0)}%</td>
                      <td className="px-6 py-4">
                        {r.recyclable ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <Check size={12} /> Recyclable
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500">
                            <X size={12} /> Landfill
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isCache ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isCache ? 'CACHE' : 'GEMINI'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} /> {new Date(r.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-slate-800 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            PREV
          </button>
          <span className="text-xs font-mono text-slate-500 px-3">
            PAGE {currentPage} OF {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-slate-800 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}

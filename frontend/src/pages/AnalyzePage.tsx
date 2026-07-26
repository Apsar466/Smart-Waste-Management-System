import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Camera, Sparkles, CheckCircle2, AlertTriangle, Leaf,
  RotateCcw, ShieldCheck, Zap, Database, ArrowRight, MessageSquare
} from 'lucide-react';
import { wasteApi } from '@/api/endpoints';
import type { WasteReport } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WasteReport | null>(null);
  const queryClient = useQueryClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const analyzeMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return wasteApi.analyze(fd);
    },
    onSuccess: (resp) => {
      setResult(resp.data.data);
      queryClient.invalidateQueries({ queryKey: ['wasteHistory'] });
      toast.success('AI Waste Classification completed!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to analyze image. Please try again.';
      toast.error(msg);
    },
  });

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles size={12} className="animate-pulse" /> COMPUTER VISION ENGINE
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Waste <span className="gradient-text">Classifier</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Upload any waste image to receive instant classification, disposal instructions, and carbon impact metrics.
          </p>
        </div>
      </div>

      {/* Main Full-Width Grid */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
        
        {/* Left Side: Upload Panel */}
        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 space-y-6 border-r border-slate-200 dark:border-slate-800">
          <div
            {...getRootProps()}
            className={`glass-card p-8 sm:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-emerald-400 bg-emerald-500/10 shadow-glow'
                : 'border-slate-300 dark:border-white/20 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />

            {previewUrl ? (
              <div className="space-y-4 w-full">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                  <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-white/10">
                    READY FOR ANALYSIS
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-400">Click or drag a new image to replace</p>
              </div>
            ) : (
              <div className="space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-sm">
                  <Upload size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Drop your waste photo here</h3>
                  <p className="text-slate-400 text-xs mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Camera size={14} className="text-emerald-400" />
                  <span>Browse Files</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {selectedFile && (
            <div className="flex gap-3">
              <button
                onClick={() => analyzeMutation.mutate(selectedFile)}
                disabled={analyzeMutation.isPending}
                className="btn-primary flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Analyzing Image with Gemini...</span>
                  </>
                ) : (
                  <>
                    <span>Run AI Classification</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                title="Reset Upload"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          )}

          {/* Supported Formats */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Supported Formats</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">JPG</span>
              <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">PNG</span>
              <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">WEBP</span>
              <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">Max 10MB</span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Result Card */}
        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-slate-50/50 dark:bg-slate-900/50">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 sm:p-8 space-y-6 relative overflow-hidden h-full"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">CLASSIFICATION COMPLETE</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    result.source === 'CACHE' 
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    PROVENANCE: {result.source || 'GEMINI 1.5'}
                  </span>
                </div>

                {/* Waste Category Title & Recyclability Badge */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400">DETECTED CATEGORY</span>
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold gradient-text">
                      {result.wasteCategory}
                    </h2>
                    {result.recyclable ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> RECYCLABLE
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> NON-RECYCLABLE
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Confidence Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-400">AI CONFIDENCE SCORE</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round((result.confidence || 0.92) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((result.confidence || 0.92) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown Details */}
                <div className="space-y-4 pt-2">
                  
                  {/* Disposal Method */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">RECOMMENDED DISPOSAL METHOD</span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {result.disposalMethod}
                    </p>
                  </div>

                  {/* Environmental Impact */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">ENVIRONMENTAL IMPACT</span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {result.environmentalImpact}
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider font-mono">GEMINI DETAILED EXPLANATION</span>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                      {result.aiAnalysis}
                    </p>
                  </div>

                </div>

                {/* Chat with AI Button */}
                <Link
                  to="/chat"
                  className="btn-outline w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} className="text-emerald-400" />
                  <span>Chat with AI for More Details</span>
                </Link>

              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center space-y-4 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                  <Sparkles size={28} />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-700 dark:text-slate-300">Awaiting Waste Image</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Upload an image on the left to activate Gemini 1.5 computer vision analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

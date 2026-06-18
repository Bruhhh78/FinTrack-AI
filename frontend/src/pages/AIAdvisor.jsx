import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { aiAPI } from '../services/api';
import {
  Sparkles, AlertTriangle, TrendingUp,
  Lightbulb, RefreshCw, ArrowUpRight,
} from 'lucide-react';

const AIAdvisor = () => {
  const { data: insightsData, isLoading, isError, refetch, isFetching } = useQuery(
    'ai-insights',
    () => aiAPI.getInsights().then((res) => res.data.insights),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      onError: () => toast.error('Failed to load financial insights'),
    }
  );

  const score = insightsData?.healthScore || 0;
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <Layout>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles style={{ color: '#a855f7', width: 22, height: 22 }} /> AI Financial Advisor
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Personalized spending forecasts and savings recommendations
          </p>
        </div>

        <div style={{ minHeight: 'calc(100vh - 200px)' }}>
          <AnimatePresence mode="wait">
            {isLoading || isFetching ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                  gap: 16,
                }}
              >
                <RefreshCw className="animate-spin" style={{ width: 32, height: 32, color: '#a855f7' }} />
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>AI is analyzing your financial records...</p>
              </div>
            ) : isError ? (
              <div className="glass-card p-6 text-center" style={{ padding: 40 }}>
                <AlertTriangle style={{ width: 44, height: 44, color: '#f43f5e', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Error Loading Insights</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 20 }}>
                  We couldn&apos;t connect with the AI generator right now. Please ensure your backend is running and Gemini API Key is set.
                </p>
                <button onClick={() => refetch()} className="btn-primary">
                  <RefreshCw style={{ width: 14, height: 14 }} /> Retry Analysis
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="glass-card p-5 sm:p-6" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Financial Health Score
                    </span>
                    <button onClick={() => refetch()} disabled={isFetching} className="btn-icon" title="Recalculate Insights">
                      <RefreshCw style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: 90,
                        height: 90,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="90" height="90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="var(--border)" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={scoreColor}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {score}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {score >= 80 ? 'Excellent Standing 🎉' : score >= 60 ? 'Healthy Balance ⚖️' : 'Needs Optimization ⚠️'}
                      </h4>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                        {insightsData?.summary}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                    gap: 20,
                  }}
                >
                  <div className="glass-card p-5 sm:p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <TrendingUp style={{ color: '#8b5cf6', width: 18, height: 18 }} /> Future Projections
                    </h4>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {insightsData?.predictions}
                    </p>
                  </div>

                  <div className="glass-card p-5 sm:p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Lightbulb style={{ color: '#fbbf24', width: 18, height: 18 }} /> Savings & Investing Advice
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {insightsData?.recommendations?.map((rec, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'rgba(245,158,11,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            <ArrowUpRight style={{ width: 12, height: 12, color: '#f59e0b' }} />
                          </div>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                    gap: 20,
                  }}
                >
                  <div className="glass-card p-5 sm:p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertTriangle style={{ width: 18, height: 18 }} /> Budget Warning Areas
                    </h4>
                    <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {insightsData?.warnings?.map((w, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
                          <span>{w}</span>
                        </li>
                      ))}
                      {(!insightsData?.warnings || insightsData.warnings.length === 0) && (
                        <li style={{ fontSize: 13, color: 'var(--text-muted)' }}>No current warnings. Excellent budget tracking!</li>
                      )}
                    </ul>
                  </div>

                  <div className="glass-card p-5 sm:p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#ec4899',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertTriangle style={{ width: 18, height: 18, color: '#ec4899' }} /> Non-Essential Expenses
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      AI detected non-essential spending trends you can reduce to grow savings faster:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {insightsData?.unnecessaryExpenses?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: 'rgba(236,72,153,0.06)',
                            border: '1px solid rgba(236,72,153,0.1)',
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                          }}
                        >
                          📌 {item}
                        </div>
                      ))}
                      {(!insightsData?.unnecessaryExpenses || insightsData.unnecessaryExpenses.length === 0) && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No recurring non-essential luxury expenses found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default AIAdvisor;

import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { analyticsAPI } from '../services/api';
import Layout from '../components/Layout';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, Zap, Wallet } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card-el)', border: '1px solid var(--border-modal)', borderRadius: 12, padding: '12px 16px', minWidth: 160, boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
            <span style={{ fontSize: 12, color: p.color, textTransform: 'capitalize' }}>{p.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>₹{Number(p.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { data: overview }    = useQuery('analyticsOverview',    analyticsAPI.getOverview);
  const { data: trends }      = useQuery('analyticsTrends',      analyticsAPI.getTrends);
  const { data: categories }  = useQuery('analyticsCategories',  () => analyticsAPI.getCategories());
  const { data: healthScore }  = useQuery('analyticsHealthScore', analyticsAPI.getHealthScore);

  const overviewData  = overview?.data?.data    || {};
  const trendData     = trends?.data?.data      || { months: [], incomeData: [], expenseData: [] };
  const categoryData  = categories?.data?.data  || [];
  const healthData    = healthScore?.data?.data || { score: 0, rating: 'N/A', breakdown: {} };

  const chartData = trendData.months?.map((month, idx) => ({
    month,
    income:  trendData.incomeData?.[idx]  || 0,
    expense: trendData.expenseData?.[idx] || 0,
    savings: Math.max(0, (trendData.incomeData?.[idx] || 0) - (trendData.expenseData?.[idx] || 0)),
  })) || [];

  const safeScore   = isNaN(healthData.score) ? 0 : healthData.score;
  const healthColor = safeScore >= 75 ? '#10b981' : safeScore >= 50 ? '#f59e0b' : '#f43f5e';
  const circumference = 2 * Math.PI * 54;
  const strokeDash    = (safeScore / 100) * circumference;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Financial Analytics</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Comprehensive view of your financial data</p>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Savings Pot', value: `₹${((overviewData.savingsBalance || 0) + (overviewData.savings || 0)).toLocaleString()}`, icon: Wallet, color: '#8b5cf6' },
            { label: 'Total Income',   value: `₹${(overviewData.totalIncome  || 0).toLocaleString()}`, icon: TrendingUp,   color: '#10b981' },
            { label: 'Total Expenses', value: `₹${(overviewData.totalExpense || 0).toLocaleString()}`, icon: TrendingDown, color: '#f43f5e' },
            { label: 'Net Savings',    value: `₹${(overviewData.savings      || 0).toLocaleString()}`, icon: Target,       color: '#6366f1' },
            { label: 'Savings Rate',   value: `${(overviewData.savingsRate   || 0).toFixed(1)}%`,      icon: Zap,          color: '#f59e0b' },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                <m.icon style={{ width: 20, height: 20, color: m.color }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{m.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 12-Month Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>12-Month Trends</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Income, expenses, and savings over time</p>
            </div>
            <Activity style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                {[['aInc','#10b981'],['aExp','#f43f5e'],['aSav','#6366f1']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0}   />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
              <Area type="monotone" dataKey="income"  name="Income"  stroke="#10b981" strokeWidth={2.5} fill="url(#aInc)" dot={false} />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#aExp)" dot={false} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#6366f1" strokeWidth={2.5} fill="url(#aSav)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Charts */}
        <div className="analytics-half-grid">
          {/* Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Spending by Category</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>This month's breakdown</p>
              </div>
              <BarChart3 style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" />
                  <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '60px 0' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No category data available</p>
              </div>
            )}
          </motion.div>

          {/* Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Expense Distribution</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Category proportions</p>
            </div>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `₹${Number(v).toLocaleString()}`}
                      contentStyle={{ background: 'var(--bg-card-el)', border: '1px solid var(--border-modal)', borderRadius: 12, color: 'var(--text-primary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {categoryData.map((item, i) => {
                    const total = categoryData.reduce((s, d) => s + d.value, 0);
                    return (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS[i % COLORS.length] }}>{((item.value / total) * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '60px 0' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Financial Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Financial Health Score</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>How you're performing across key metrics</p>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 12, fontWeight: 700, fontSize: 18, background: `${healthColor}15`, color: healthColor, border: `1px solid ${healthColor}30` }}>
              {safeScore}/100
            </div>
          </div>

          <div className="analytics-health-grid">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <svg width="160" height="160" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke={healthColor} strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - strokeDash}
                    transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                    filter={`drop-shadow(0 0 8px ${healthColor}60)`}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>{safeScore}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: healthColor }}>{healthData.rating}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {healthData.breakdown && Object.entries(healthData.breakdown).map(([key, val]) => {
                const labels = { savingsScore: 'Savings Rate', budgetScore: 'Budget Discipline', goalsScore: 'Goal Achievement', expenseScore: 'Expense Control' };
                const pct = (val / 25) * 100;
                const c = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e';
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{labels[key]}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{Number(val).toFixed(0)} / 25</span>
                    </div>
                    <div className="progress-bar-track">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        className="progress-bar-fill" style={{ background: `linear-gradient(90deg, ${c}, ${c}aa)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Analytics;

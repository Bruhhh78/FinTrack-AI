import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { analyticsAPI } from '../services/api';

import {
  TrendingUp, TrendingDown, Target, Zap, Activity,
  ArrowUpRight, ArrowDownRight, Layers, Award, Wallet
} from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card-el)',
        border: '1px solid var(--border-modal)',
        borderRadius: 12,
        padding: '12px 16px',
        minWidth: 160,
        boxShadow: 'var(--shadow-card)',
      }}>
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

const StatCard = ({ label, value, icon: Icon, color, bg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
    className="stat-card"
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, border: `1px solid ${color}25`,
      }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>
    </div>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const { data: overview } = useQuery('dashboardOverview', analyticsAPI.getOverview);
  const { data: trends } = useQuery('trends', analyticsAPI.getTrends);
  const { data: healthScore } = useQuery('healthScore', analyticsAPI.getHealthScore);

  const overviewData = overview?.data?.data || {};
  const trendData = trends?.data?.data || { months: [], incomeData: [], expenseData: [] };
  const healthData = healthScore?.data?.data || { score: 0, rating: 'N/A', breakdown: {} };

  const chartData = trendData.months?.map((month, idx) => ({
    month,
    income: trendData.incomeData?.[idx] || 0,
    expense: trendData.expenseData?.[idx] || 0,
    savings: Math.max(0, (trendData.incomeData?.[idx] || 0) - (trendData.expenseData?.[idx] || 0)),
  })) || [];

  const pieData = Object.keys(overviewData.categoryExpenses || {}).map(category => ({
    name: category,
    value: overviewData.categoryExpenses[category],
  }));

  const cards = [
    { label: 'Total Savings Pot', value: `₹${((overviewData.savingsBalance || 0) + (overviewData.savings || 0)).toLocaleString()}`, icon: Wallet, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Monthly Income',   value: `₹${(overviewData.totalIncome  || 0).toLocaleString()}`, icon: TrendingUp,   color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
    { label: 'Monthly Expenses', value: `₹${(overviewData.totalExpense || 0).toLocaleString()}`, icon: TrendingDown, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'   },
    { label: 'Net Savings (Month)', value: `₹${(overviewData.savings      || 0).toLocaleString()}`, icon: Target,       color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
    { label: 'Savings Rate',     value: `${(overviewData.savingsRate   || 0).toFixed(1)}%`,      icon: Zap,          color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  ];

  const getHealthColor = (score) =>
    score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';
  const healthColor = getHealthColor(healthData.score);
  const circumference = 2 * Math.PI * 54;
  const safeScore = isNaN(healthData.score) ? 0 : healthData.score;
  const strokeDash = (safeScore / 100) * circumference;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {cards.map((card, idx) => (
            <StatCard key={idx} {...card} delay={idx * 0.08} />
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="dashboard-charts-grid">
          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <div className="section-header">
              <div>
                <h3 className="section-title">Income vs Expenses</h3>
                <p className="section-subtitle">12-month financial overview</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['Income','#10b981'],['Expenses','#f43f5e']].map(([l,c]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ width: 12, height: 3, borderRadius: 4, background: c, display: 'inline-block' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income"  stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)"  dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: '#f43f5e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Expense Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <h3 className="section-title" style={{ marginBottom: 4 }}>Expense Breakdown</h3>
            <p className="section-subtitle" style={{ marginBottom: 16 }}>By category this month</p>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString()}`}
                      contentStyle={{ background: 'var(--bg-card-el)', border: '1px solid var(--border-modal)', borderRadius: 12, color: 'var(--text-primary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                  {pieData.slice(0, 4).map((item, index) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-state-icon"><Layers style={{ width: 28, height: 28 }} /></div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No expense data yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom-grid">
          {/* Health Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
            <h3 className="section-title" style={{ marginBottom: 4 }}>Financial Health</h3>
            <p className="section-subtitle" style={{ marginBottom: 20 }}>Your overall score</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke={healthColor} strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - strokeDash}
                    transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease' }}
                    filter={`drop-shadow(0 0 6px ${healthColor}80)`}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{safeScore}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{healthData.rating}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Financial wellness</p>
                {healthData.breakdown && Object.entries(healthData.breakdown).map(([key, val]) => {
                  const labels = { savingsScore: 'Savings', budgetScore: 'Budget', goalsScore: 'Goals', expenseScore: 'Expenses' };
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 56 }}>{labels[key]}</span>
                      <div className="progress-bar-track" style={{ flex: 1, height: 4 }}>
                        <div className="progress-bar-fill" style={{ width: `${(val / 25) * 100}%`, height: 4 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', width: 24, textAlign: 'right' }}>{Number(val).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card" style={{ padding: 24 }}>
            <h3 className="section-title" style={{ marginBottom: 4 }}>Quick Summary</h3>
            <p className="section-subtitle" style={{ marginBottom: 20 }}>Month at a glance</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Transactions',    value: overviewData.expenseCount || 0,             icon: Activity,   color: '#818cf8' },
                { label: 'Income Sources',  value: overviewData.incomeCount  || 0,             icon: TrendingUp, color: '#34d399' },
                { label: 'Active Goals',    value: overviewData.activeGoals  || 0,             icon: Award,      color: '#fbbf24' },
                { label: 'Avg Daily Spend', value: `₹${Math.round((overviewData.totalExpense || 0) / 30).toLocaleString()}`, icon: Zap, color: '#f87171' },
                { label: 'Categories',      value: pieData.length,                             icon: Layers,     color: '#06b6d4' },
                { label: 'Save/Day',        value: `₹${Math.round((overviewData.savings || 0) / 30).toLocaleString()}`, icon: Target, color: '#a78bfa' },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.05 }}
                  style={{ padding: 16, borderRadius: 12, background: 'var(--bg-nav-hover)', border: '1px solid var(--border)' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.color}18`, marginBottom: 10 }}>
                    <item.icon style={{ width: 16, height: 16, color: item.color }} />
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;

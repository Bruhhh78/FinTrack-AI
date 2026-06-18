import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { budgetAPI } from '../services/api';

import {
  AlertCircle, Save, Wallet, TrendingDown, BarChart2,
  Utensils, ShoppingBag, Car, Zap, Film, BookOpen, Heart, MoreHorizontal
} from 'lucide-react';

const CATEGORIES = ['Food', 'Shopping', 'Transportation', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];

const categoryConfig = {
  Food:           { icon: Utensils,      color: '#f59e0b' },
  Shopping:       { icon: ShoppingBag,   color: '#8b5cf6' },
  Transportation: { icon: Car,           color: '#06b6d4' },
  Bills:          { icon: Zap,           color: '#f43f5e' },
  Entertainment:  { icon: Film,          color: '#ec4899' },
  Education:      { icon: BookOpen,      color: '#6366f1' },
  Health:         { icon: Heart,         color: '#10b981' },
  Other:          { icon: MoreHorizontal,color: '#94a3b8' },
};

const Budget = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear  = new Date().getFullYear();
  const queryClient  = useQueryClient();

  const { data, isLoading } = useQuery(
    ['budget', currentMonth, currentYear],
    () => budgetAPI.getMonthly(currentMonth, currentYear)
  );

  const { register, handleSubmit } = useForm();

  const updateMutation = useMutation(
    (formData) => budgetAPI.create(formData),
    {
      onSuccess: () => { queryClient.invalidateQueries('budget'); toast.success('Budget saved! 🎯'); },
      onError: () => toast.error('Failed to save budget')
    }
  );

  const onSubmit = async (formData) => {
    const categoryLimits = Object.keys(formData)
      .filter(key => key.startsWith('limit_'))
      .map(key => ({ category: key.replace('limit_', ''), limit: parseFloat(formData[key]) || 0 }));
    await updateMutation.mutateAsync({ month: new Date(currentYear, currentMonth - 1, 1), categoryLimits });
  };

  const budget = data?.data?.budget || {};
  const categoryLimits = budget.categoryLimits || [];
  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const exceededCount = categoryLimits.filter(c => c.limit > 0 && c.spent > c.limit).length;
  const totalBudget = budget.totalBudget || 0;
  const totalSpent  = budget.totalSpent  || 0;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Budget Planning</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{monthName} · Set limits and track spending</p>
          </div>
          {exceededCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
              <AlertCircle style={{ width: 16, height: 16, color: '#f87171' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>{exceededCount} budget{exceededCount > 1 ? 's' : ''} exceeded</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid-three-col">
          {[
            { label: 'Total Budget',  value: `₹${totalBudget.toLocaleString()}`,                                  color: '#6366f1', icon: Wallet     },
            { label: 'Total Spent',   value: `₹${totalSpent.toLocaleString()}`,                                   color: '#f43f5e', icon: TrendingDown},
            { label: 'Remaining',     value: `₹${Math.max(0, totalBudget - totalSpent).toLocaleString()}`,        color: '#10b981', icon: BarChart2   },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card p-4 sm:p-5 flex items-center gap-4">
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}15`, border: `1px solid ${s.color}25`, flexShrink: 0 }}>
                <s.icon style={{ width: 20, height: 20, color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Bar */}
        {totalBudget > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 sm:p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Overall Budget Usage</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{((totalSpent / totalBudget) * 100).toFixed(1)}%</p>
            </div>
            <div className="progress-bar-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`progress-bar-fill ${totalSpent / totalBudget > 1 ? 'red' : totalSpent / totalBudget > 0.8 ? 'yellow' : ''}`}
              />
            </div>
          </motion.div>
        )}

        {/* Budget Grid */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {CATEGORIES.map((category, idx) => {
              const categoryData = categoryLimits.find(c => c.category === category);
              const limit = categoryData?.limit || 0;
              const spent = categoryData?.spent || 0;
              const percentage = limit > 0 ? (spent / limit) * 100 : 0;
              const isExceeded = limit > 0 && spent > limit;
              const isWarning  = !isExceeded && percentage > 80;
              const cfg = categoryConfig[category] || categoryConfig.Other;
              const CatIcon = cfg.icon;

              return (
                <motion.div key={category} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                  className="glass-card p-4 sm:p-5" style={{ border: `1px solid ${isExceeded ? 'rgba(244,63,94,0.2)' : isWarning ? 'rgba(245,158,11,0.15)' : 'var(--border)'}` }}
                >
                  <div className="flex flex-row items-center justify-between gap-3 flex-wrap mb-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cfg.color}15`, border: `1px solid ${cfg.color}25` }}>
                        <CatIcon style={{ width: 16, height: 16, color: cfg.color }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Spent / Limit</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: isExceeded ? '#f87171' : 'var(--text-secondary)' }}>
                        ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {isExceeded ? '🔴 Over budget' : isWarning ? '🟡 Near limit' : '🟢 On track'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: isExceeded ? '#f87171' : 'var(--text-secondary)' }}>{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.06 }}
                        className={`progress-bar-fill ${isExceeded ? 'red' : isWarning ? 'yellow' : 'green'}`}
                      />
                    </div>
                    {isExceeded && (
                      <p style={{ fontSize: 11, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertCircle style={{ width: 12, height: 12 }} /> Over by ₹{(spent - limit).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label-text">Monthly Limit (₹)</label>
                    <input type="number" min="0" defaultValue={limit || ''} {...register(`limit_${category}`)} className="input-field" placeholder="Set budget limit" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            <button type="submit" disabled={updateMutation.isLoading} className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
              {updateMutation.isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <><Save style={{ width: 16, height: 16 }} /> Save Budget</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Budget;

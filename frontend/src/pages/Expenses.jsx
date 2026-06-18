import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { expenseAPI } from '../services/api';

import {
  Plus, Trash2, X, ShoppingBag, Car, Utensils,
  Zap, Film, BookOpen, Heart, MoreHorizontal, Search,
  TrendingDown, DollarSign, Calendar, Receipt, Filter
} from 'lucide-react';

const CATEGORIES = ['Food', 'Shopping', 'Transportation', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];

const categoryConfig = {
  Food:           { icon: Utensils,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  Shopping:       { icon: ShoppingBag,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  Transportation: { icon: Car,           color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  Bills:          { icon: Zap,           color: '#f43f5e', bg: 'rgba(244,63,94,0.1)'   },
  Entertainment:  { icon: Film,          color: '#ec4899', bg: 'rgba(236,72,153,0.1)'  },
  Education:      { icon: BookOpen,      color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  Health:         { icon: Heart,         color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  Other:          { icon: MoreHorizontal,color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const ExpenseModal = ({ onClose, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add Expense</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Record a new expense transaction</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X style={{ width: 16, height: 16 }} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label-text">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="e.g., Grocery shopping" />
            {errors.title && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.title.message}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label-text">Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input type="number" step="0.01" min="0" {...register('amount', { required: 'Amount required', min: { value: 0.01, message: 'Must be > 0' } })} className="input-field" style={{ paddingLeft: 36 }} placeholder="0.00" />
              </div>
              {errors.amount && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.amount.message}</p>}
            </div>
            <div>
              <label className="label-text">Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input type="date" {...register('date', { required: true })} className="input-field" style={{ paddingLeft: 36 }} />
              </div>
            </div>
          </div>
          <div>
            <label className="label-text">Category</label>
            <select {...register('category', { required: true })} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Description (optional)</label>
            <textarea {...register('description')} className="input-field" rows="2" placeholder="Add a note..." />
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '12px 0' }}>{loading ? 'Adding...' : 'Add Expense'}</button>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px 0' }}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('expenses', () => expenseAPI.getAll());

  const createMutation = useMutation(expenseAPI.create, {
    onSuccess: () => { queryClient.invalidateQueries('expenses'); queryClient.invalidateQueries('dashboardOverview'); setShowModal(false); toast.success('Expense added! 🎯'); },
    onError: () => toast.error('Failed to add expense')
  });
  const deleteMutation = useMutation(expenseAPI.delete, {
    onSuccess: () => { queryClient.invalidateQueries('expenses'); queryClient.invalidateQueries('dashboardOverview'); toast.success('Expense deleted'); },
    onError: () => toast.error('Failed to delete')
  });

  const expenses = data?.data?.expenses || [];
  const filtered = expenses.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || e.category === filterCat;
    return matchSearch && matchCat;
  });
  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <AnimatePresence>
        {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSubmit={(d) => createMutation.mutateAsync(d)} loading={createMutation.isLoading} />}
      </AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Expenses</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Track your spending habits</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Add Expense</button>
        </div>

        {/* Summary Cards */}
        <div className="grid-three-col">
          {[
            { label: 'Total Expenses', value: `₹${totalAll.toLocaleString()}`,      color: '#f43f5e', icon: TrendingDown },
            { label: 'This Period',    value: `₹${totalFiltered.toLocaleString()}`,  color: '#f59e0b', icon: Receipt      },
            { label: 'Transactions',   value: expenses.length,                       color: '#6366f1', icon: Filter       },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon style={{ width: 20, height: 20, color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s ease',
                  background: filterCat === cat ? 'rgba(99,102,241,0.15)' : 'var(--bg-nav-hover)',
                  border: `1px solid ${filterCat === cat ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                  color: filterCat === cat ? '#818cf8' : 'var(--text-muted)',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Expense List */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><TrendingDown style={{ width: 28, height: 28 }} /></div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No expenses found</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {search || filterCat !== 'All' ? 'Try adjusting your filters' : 'Click "Add Expense" to get started'}
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="responsive-table-header">
                {['Transaction','Category','Date','Amount',''].map((h, i) => (
                  <p key={i} className={(i === 1 || i === 2) ? "hidden md:block" : ""} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</p>
                ))}
              </div>
              {filtered.map((expense, idx) => {
                const cfg = categoryConfig[expense.category] || categoryConfig.Other;
                const CatIcon = cfg.icon;
                return (
                  <motion.div key={expense._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    className="responsive-table-row"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-nav-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div className="cat-icon" style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                        <CatIcon style={{ width: 16, height: 16, color: cfg.color }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.title}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 2 }}>
                          {/* Only shown on mobile */}
                          <span className="md:hidden badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`, fontSize: 10, padding: '1px 6px' }}>{expense.category}</span>
                          <span className="md:hidden" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(expense.date).toLocaleDateString()}</span>
                          {/* Description */}
                          {expense.description && (
                            <>
                              <span className="hidden md:inline" style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.description}</span>
                              <span className="md:hidden" style={{ color: 'var(--text-faint)' }}>·</span>
                              <p className="md:hidden" style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.description}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`, fontSize: 11 }}>{expense.category}</span>
                    </div>
                    <p className="hidden md:block" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', textAlign: 'right' }}>-₹{Number(expense.amount).toLocaleString()}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => deleteMutation.mutate(expense._id)} className="btn-icon btn-icon-danger" disabled={deleteMutation.isLoading}>
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg-nav-hover)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>-₹{totalFiltered.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Expenses;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { incomeAPI } from '../services/api';
import Layout from '../components/Layout';
import {
  Plus, Trash2, X, Search, TrendingUp, Briefcase, Laptop,
  Building2, LineChart, HelpCircle, DollarSign, Calendar, Receipt
} from 'lucide-react';

const SOURCES = ['Salary', 'Freelancing', 'Business', 'Investments', 'Other'];

const sourceConfig = {
  Salary:      { icon: Briefcase,  color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  Freelancing: { icon: Laptop,     color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  Business:    { icon: Building2,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  Investments: { icon: LineChart,  color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  Other:       { icon: HelpCircle, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const IncomeModal = ({ onClose, onSubmit, loading }) => {
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
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add Income</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Record a new income entry</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X style={{ width: 16, height: 16 }} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label-text">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="e.g., Monthly salary" />
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
            <label className="label-text">Source</label>
            <select {...register('source', { required: true })} className="input-field">
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Description (optional)</label>
            <textarea {...register('description')} className="input-field" rows="2" placeholder="Add a note..." />
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '12px 0' }}>{loading ? 'Adding...' : 'Add Income'}</button>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px 0' }}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Income = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('incomes', () => incomeAPI.getAll());

  const createMutation = useMutation(incomeAPI.create, {
    onSuccess: () => { queryClient.invalidateQueries('incomes'); queryClient.invalidateQueries('dashboardOverview'); setShowModal(false); toast.success('Income added! 💰'); },
    onError: () => toast.error('Failed to add income')
  });
  const deleteMutation = useMutation(incomeAPI.delete, {
    onSuccess: () => { queryClient.invalidateQueries('incomes'); queryClient.invalidateQueries('dashboardOverview'); toast.success('Income removed'); },
    onError: () => toast.error('Failed to delete')
  });

  const incomes = data?.data?.incomes || [];
  const filtered = incomes.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.source.toLowerCase().includes(search.toLowerCase());
    const matchSrc = filterSource === 'All' || i.source === filterSource;
    return matchSearch && matchSrc;
  });
  const totalFiltered = filtered.reduce((sum, i) => sum + i.amount, 0);
  const totalAll = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <Layout>
      <AnimatePresence>
        {showModal && <IncomeModal onClose={() => setShowModal(false)} onSubmit={(d) => createMutation.mutateAsync(d)} loading={createMutation.isLoading} />}
      </AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Income</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Track all your income sources</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Add Income</button>
        </div>

        <div className="grid-three-col">
          {[
            { label: 'Total Income',   value: `₹${totalAll.toLocaleString()}`,                   color: '#10b981', icon: TrendingUp },
            { label: 'This Period',    value: `₹${totalFiltered.toLocaleString()}`,              color: '#6366f1', icon: Receipt    },
            { label: 'Sources',        value: new Set(incomes.map(i => i.source)).size,          color: '#f59e0b', icon: Briefcase  },
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

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search income..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', ...SOURCES].map(src => (
              <button key={src} onClick={() => setFilterSource(src)}
                style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s ease',
                  background: filterSource === src ? 'rgba(16,185,129,0.12)' : 'var(--bg-nav-hover)',
                  border: `1px solid ${filterSource === src ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                  color: filterSource === src ? '#34d399' : 'var(--text-muted)',
                }}
              >{src}</button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><TrendingUp style={{ width: 28, height: 28 }} /></div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No income records found</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {search || filterSource !== 'All' ? 'Try adjusting your filters' : 'Click "Add Income" to get started'}
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="responsive-table-header">
                {['Income','Source','Date','Amount',''].map((h, i) => (
                  <p key={i} className={(i === 1 || i === 2) ? "hidden md:block" : ""} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</p>
                ))}
              </div>
              {filtered.map((income, idx) => {
                const cfg = sourceConfig[income.source] || sourceConfig.Other;
                const SrcIcon = cfg.icon;
                return (
                  <motion.div key={income._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    className="responsive-table-row"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-nav-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div className="cat-icon" style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                        <SrcIcon style={{ width: 16, height: 16, color: cfg.color }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{income.title}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 2 }}>
                          {/* Only shown on mobile */}
                          <span className="md:hidden badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`, fontSize: 10, padding: '1px 6px' }}>{income.source}</span>
                          <span className="md:hidden" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(income.date).toLocaleDateString()}</span>
                          {/* Description */}
                          {income.description && (
                            <>
                              <span className="hidden md:inline" style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{income.description}</span>
                              <span className="md:hidden" style={{ color: 'var(--text-faint)' }}>·</span>
                              <p className="md:hidden" style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{income.description}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`, fontSize: 11 }}>{income.source}</span>
                    </div>
                    <p className="hidden md:block" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(income.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#34d399', textAlign: 'right' }}>+₹{Number(income.amount).toLocaleString()}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => deleteMutation.mutate(income._id)} className="btn-icon btn-icon-danger" disabled={deleteMutation.isLoading}>
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg-nav-hover)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>+₹{totalFiltered.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Income;

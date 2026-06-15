import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { goalAPI } from '../services/api';
import Layout from '../components/Layout';
import {
  Plus, Trash2, X, Target, Clock, DollarSign, Calendar,
  CheckCircle2, TrendingUp, Trophy, Plane, GraduationCap,
  ShoppingBag, Shield, LineChart, Sparkles
} from 'lucide-react';

const CATEGORIES = ['Education', 'Travel', 'Purchase', 'Emergency', 'Investment', 'Other'];

const categoryConfig = {
  Education:  { icon: GraduationCap, color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  Travel:     { icon: Plane,         color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  Purchase:   { icon: ShoppingBag,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  Emergency:  { icon: Shield,        color: '#f43f5e', bg: 'rgba(244,63,94,0.1)'   },
  Investment: { icon: LineChart,     color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  Other:      { icon: Target,        color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const GoalModal = ({ onClose, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>New Goal</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Set a savings goal to work towards</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X style={{ width: 16, height: 16 }} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label-text">Goal Name</label>
            <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="e.g., Buy a new laptop" />
            {errors.name && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.name.message}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label-text">Target Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input type="number" min="1" step="0.01" {...register('targetAmount', { required: 'Amount required', min: { value: 1, message: 'Must be > 0' } })} className="input-field" style={{ paddingLeft: 36 }} placeholder="0.00" />
              </div>
              {errors.targetAmount && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.targetAmount.message}</p>}
            </div>
            <div>
              <label className="label-text">Deadline</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input type="date" {...register('deadline', { required: 'Deadline required' })} className="input-field" style={{ paddingLeft: 36 }} />
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
            <textarea {...register('description')} className="input-field" rows="2" placeholder="Why is this goal important?" />
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '12px 0' }}>{loading ? 'Creating...' : 'Create Goal'}</button>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px 0' }}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ContributeModal = ({ goal, onClose, onContribute, loading }) => {
  const [amount, setAmount] = useState('');
  const remaining = goal.targetAmount - goal.currentSavings;
  const quickAmounts = [1000, 5000, 10000].filter(v => v < remaining).concat(remaining > 0 ? [remaining] : []).slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content" style={{ maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Contribute</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Add savings to "{goal.name}"</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X style={{ width: 16, height: 16 }} /></button>
        </div>

        <div style={{ padding: 16, borderRadius: 12, marginBottom: 20, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>Saved so far</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{goal.currentSavings.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Remaining</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>₹{remaining.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="label-text">Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" style={{ paddingLeft: 36 }} placeholder="0.00" autoFocus />
            </div>
          </div>
          {quickAmounts.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {quickAmounts.map(v => (
                <button key={v} type="button" onClick={() => setAmount(v.toString())}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  ₹{v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={() => { if (!amount || parseFloat(amount) <= 0) { toast.error('Please enter a valid amount'); return; } onContribute(goal._id, parseFloat(amount)); }}
            disabled={loading || !amount} className="btn-primary" style={{ flex: 1, padding: '12px 0' }}>
            {loading ? 'Adding...' : 'Add Contribution'}
          </button>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px 0' }}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Goals = () => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('goals', () => goalAPI.getAll());

  const createMutation = useMutation(goalAPI.create, {
    onSuccess: () => { queryClient.invalidateQueries('goals'); setShowGoalModal(false); toast.success('Goal created! 🎯'); },
    onError: () => toast.error('Failed to create goal')
  });
  const deleteMutation = useMutation(goalAPI.delete, {
    onSuccess: () => { queryClient.invalidateQueries('goals'); toast.success('Goal deleted'); },
    onError: () => toast.error('Failed to delete')
  });
  const contributeMutation = useMutation(
    ([id, amount]) => goalAPI.contribute(id, { amount }),
    {
      onSuccess: () => { queryClient.invalidateQueries('goals'); setContributeGoal(null); toast.success('Contribution added! 💸'); },
      onError: () => toast.error('Failed to add contribution')
    }
  );

  const goals = data?.data?.goals || data?.goals || [];
  const activeGoals    = goals.filter(g => g.status !== 'Completed');
  const completedGoals = goals.filter(g => g.status === 'Completed');

  return (
    <Layout>
      <AnimatePresence>
        {showGoalModal && (
          <GoalModal onClose={() => setShowGoalModal(false)}
            onSubmit={(d) => createMutation.mutateAsync({ ...d, deadline: new Date(d.deadline).toISOString() })}
            loading={createMutation.isLoading} />
        )}
        {contributeGoal && (
          <ContributeModal goal={contributeGoal} onClose={() => setContributeGoal(null)}
            onContribute={(id, amount) => contributeMutation.mutate([id, amount])}
            loading={contributeMutation.isLoading} />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Financial Goals</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Track your savings milestones</p>
          </div>
          <button onClick={() => setShowGoalModal(true)} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> New Goal</button>
        </div>

        {/* Summary */}
        <div className="grid-three-col">
          {[
            { label: 'Active Goals', value: activeGoals.length,                                                                                color: '#6366f1', icon: Target    },
            { label: 'Completed',    value: completedGoals.length,                                                                             color: '#10b981', icon: Trophy    },
            { label: 'Total Saved',  value: `₹${goals.reduce((s, g) => s + (g.currentSavings || 0), 0).toLocaleString()}`, color: '#f59e0b', icon: TrendingUp },
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

        {/* Goals grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />)}
          </div>
        ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <div className="empty-state-icon"><Sparkles style={{ width: 28, height: 28 }} /></div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No goals yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first financial goal to start tracking</p>
              <button onClick={() => setShowGoalModal(true)} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Create First Goal</button>
            </div>
          </div>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Goals</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {activeGoals.map((goal, idx) => {
                    const progress  = Math.min((goal.currentSavings / goal.targetAmount) * 100, 100);
                    const daysLeft  = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    const cfg       = categoryConfig[goal.category] || categoryConfig.Other;
                    const GoalIcon  = cfg.icon;
                    const isUrgent  = daysLeft <= 30 && daysLeft > 0;
                    const isOverdue = daysLeft < 0;

                    return (
                      <motion.div key={goal._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                        className="glass-card" style={{ padding: 24, border: `1px solid ${isOverdue ? 'rgba(244,63,94,0.2)' : 'var(--border)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                              <GoalIcon style={{ width: 20, height: 20, color: cfg.color }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{goal.name}</p>
                              <p style={{ fontSize: 12, color: cfg.color }}>{goal.category}</p>
                            </div>
                          </div>
                          <button onClick={() => deleteMutation.mutate(goal._id)} className="btn-icon btn-icon-danger">
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: cfg.color }}>₹{(goal.currentSavings || 0).toLocaleString()}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>₹{goal.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="progress-bar-track" style={{ height: 8 }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.07 + 0.2 }}
                              style={{ height: 8, borderRadius: 100, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}bb)` }} />
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{progress.toFixed(1)}% achieved</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, marginBottom: 16,
                          background: isOverdue ? 'rgba(244,63,94,0.08)' : isUrgent ? 'rgba(245,158,11,0.08)' : 'var(--bg-nav-hover)',
                          border: `1px solid ${isOverdue ? 'rgba(244,63,94,0.15)' : isUrgent ? 'rgba(245,158,11,0.15)' : 'var(--border)'}` }}>
                          <Clock style={{ width: 15, height: 15, flexShrink: 0, color: isOverdue ? '#f87171' : isUrgent ? '#fbbf24' : 'var(--text-muted)' }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: isOverdue ? '#f87171' : isUrgent ? '#fbbf24' : 'var(--text-secondary)' }}>
                            {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days remaining`}
                          </span>
                        </div>

                        <button onClick={() => setContributeGoal(goal)} className="btn-primary" style={{ width: '100%', background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}bb)` }}>
                          <TrendingUp style={{ width: 16, height: 16 }} /> Add Contribution
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🏆 Completed Goals</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {completedGoals.map((goal, idx) => {
                    const cfg = categoryConfig[goal.category] || categoryConfig.Other;
                    const GoalIcon = cfg.icon;
                    return (
                      <motion.div key={goal._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                        className="glass-card" style={{ padding: 24, border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                              <GoalIcon style={{ width: 20, height: 20, color: '#10b981' }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{goal.name}</p>
                              <p style={{ fontSize: 12, color: '#34d399' }}>₹{goal.targetAmount.toLocaleString()} · Completed</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle2 style={{ width: 18, height: 18, color: '#34d399' }} />
                            <button onClick={() => deleteMutation.mutate(goal._id)} className="btn-icon btn-icon-danger">
                              <Trash2 style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </div>
                        <div className="progress-bar-track" style={{ height: 4 }}>
                          <div className="progress-bar-fill green" style={{ width: '100%', height: 4 }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default Goals;

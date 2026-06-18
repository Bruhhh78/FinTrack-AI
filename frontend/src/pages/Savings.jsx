import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { savingsAPI, goalAPI } from '../services/api';

import {
  Wallet, ArrowUpRight, ArrowDownRight, Layers,
  Calendar, Clock, PiggyBank, Plus, Minus, Info
} from 'lucide-react';

const Savings = () => {
  const queryClient = useQueryClient();
  const [transactionType, setTransactionType] = useState('deposit');
  
  // Queries
  const { data: savingsData, isLoading: savingsLoading } = useQuery('savingsDetails', savingsAPI.getDetails);
  const { data: goalsData, isLoading: goalsLoading } = useQuery('savingsGoals', () => goalAPI.getAll());

  // Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Mutations
  const transactionMutation = useMutation(savingsAPI.createTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries('savingsDetails');
      queryClient.invalidateQueries('dashboardOverview');
      queryClient.invalidateQueries('savingsGoals');
      reset();
      toast.success(transactionType === 'deposit' ? 'Added to Savings Pot! 💰' : 'Withdrawn from Savings Pot! 💸');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Transaction failed');
    }
  });

  const totalPot = savingsData?.data?.savingsBalance || 0;
  const logs = savingsData?.data?.logs || [];
  const goals = goalsData?.data?.goals || [];

  // Calculate Allocated vs Unallocated
  const allocated = goals.reduce((sum, g) => sum + (g.currentSavings || 0), 0);
  const unallocated = Math.max(0, totalPot - allocated);

  const onSubmit = async (data) => {
    await transactionMutation.mutateAsync({
      type: transactionType,
      amount: Number(data.amount),
      description: data.description || (transactionType === 'deposit' ? 'Savings Deposit' : 'Savings Withdrawal')
    });
  };

  const isLoading = savingsLoading || goalsLoading;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Savings Manager</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Manage your capital pots and track where your savings are allocated.</p>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading savings data...</p>
          </div>
        ) : (
          <>
            {/* Top Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              
              {/* Total Pot */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.12)' }}>
                    <Wallet style={{ width: 18, height: 18, color: '#8b5cf6' }} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', tracking: '0.05em' }}>Total Savings Pot</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>₹{totalPot.toLocaleString()}</p>
              </motion.div>

              {/* Allocated */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="stat-card" style={{ borderLeft: '4px solid #06b6d4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,182,212,0.12)' }}>
                    <PiggyBank style={{ width: 18, height: 18, color: '#06b6d4' }} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', tracking: '0.05em' }}>Allocated to Goals</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>₹{allocated.toLocaleString()}</p>
              </motion.div>

              {/* Unallocated */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.12)' }}>
                    <Layers style={{ width: 18, height: 18, color: '#10b981' }} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', tracking: '0.05em' }}>Unallocated / Available</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>₹{unallocated.toLocaleString()}</p>
              </motion.div>

            </div>

            {/* Split Content: Log vs Action Form */}
            <div className="savings-split-grid" style={{ alignItems: 'start' }}>
              
              {/* Savings Log */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Savings Outflows & Logs</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Track where your savings are distributed or spent.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 420, overflowY: 'auto', paddingRight: 6 }}>
                  {logs.length > 0 ? (
                    logs.map((log) => {
                      const isDeposit = log.type === 'deposit';
                      const isAllocation = log.type === 'allocation';
                      const color = isDeposit ? '#10b981' : isAllocation ? '#06b6d4' : '#f43f5e';
                      const bg = isDeposit ? 'rgba(16,185,129,0.1)' : isAllocation ? 'rgba(6,182,212,0.1)' : 'rgba(244,63,94,0.1)';
                      const Icon = isDeposit ? ArrowUpRight : isAllocation ? PiggyBank : ArrowDownRight;

                      return (
                        <div key={log._id} className="glass-card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card-el)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
                              <Icon style={{ width: 16, height: 16, color }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{log.description}</p>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Calendar style={{ width: 10, height: 10 }} />
                                {new Date(log.date).toLocaleDateString()}
                                <span style={{ color: 'var(--text-faint)' }}>·</span>
                                <Clock style={{ width: 10, height: 10 }} />
                                {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color }}>
                            {isDeposit ? '+' : '-'}₹{log.amount.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No savings transactions logged yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Savings Transaction</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Deposit funds to your savings pot or withdraw capital.</p>
                </div>

                {/* Tab selector */}
                <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 12, padding: 4 }}>
                  <button type="button" onClick={() => setTransactionType('deposit')}
                    style={{ flex: 1, border: 'none', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: transactionType === 'deposit' ? 'rgba(16,185,129,0.12)' : 'transparent', color: transactionType === 'deposit' ? '#10b981' : 'var(--text-muted)' }}
                  >
                    <Plus style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Deposit
                  </button>
                  <button type="button" onClick={() => setTransactionType('withdrawal')}
                    style={{ flex: 1, border: 'none', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: transactionType === 'withdrawal' ? 'rgba(244,63,94,0.12)' : 'transparent', color: transactionType === 'withdrawal' ? '#f43f5e' : 'var(--text-muted)' }}
                  >
                    <Minus style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Withdraw
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label className="label-text">Amount (₹)</label>
                    <input type="number" step="any" min="1" {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Must be > 0' } })} className="input-field" placeholder="e.g. 5000" />
                    {errors.amount && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.amount.message}</p>}
                  </div>

                  <div>
                    <label className="label-text">Description / Source</label>
                    <input {...register('description')} className="input-field" placeholder={transactionType === 'deposit' ? 'e.g. Extra savings' : 'e.g. Home expense'} />
                  </div>

                  {transactionType === 'withdrawal' && (
                    <div style={{ display: 'flex', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: '10px 14px', borderRadius: 10 }}>
                      <Info style={{ width: 16, height: 16, color: '#fbbf24', flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontSize: 11, color: '#fbbf24', lineHeight: 1.4 }}>Withdrawing will deduct money directly from your total savings balance.</p>
                    </div>
                  )}

                  <button type="submit" disabled={transactionMutation.isLoading} className="btn-primary" style={{ padding: '12px 0', marginTop: 6 }}>
                    {transactionMutation.isLoading ? 'Processing...' : transactionType === 'deposit' ? 'Add to Savings' : 'Withdraw from Savings'}
                  </button>
                </form>
              </motion.div>

            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default Savings;

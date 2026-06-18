import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

import {
  User, Mail, Globe, Palette, Shield, Trash2, Save,
  Calendar, Clock, Camera, Edit3, CheckCircle2, Wallet, AlertTriangle
} from 'lucide-react';

const Profile = () => {
  const queryClient = useQueryClient();
  const { user: storeUser, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { data } = useQuery('profile', userAPI.getProfile);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = data?.data?.user || storeUser || {};

  useEffect(() => {
    if (user.name) {
      reset({
        name: user.name,
        currency: user.currency || 'INR',
        theme: theme,
        savingsBalance: user.savingsBalance || 0,
      });
    }
  }, [user.name, theme, user.savingsBalance, reset]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    setValue('theme', e.target.value);
  };

  const updateMutation = useMutation(userAPI.updateProfile, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('profile');
      if (res?.data?.user) setUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile')
  });

  const deleteMutation = useMutation(userAPI.deleteAccount, {
    onSuccess: () => {
      logout();
      toast.success('Account deleted successfully');
    },
    onError: () => toast.error('Failed to delete account')
  });

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Profile Settings</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Manage your account and preferences</p>
        </div>

        {/* Profile Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 28, fontWeight: 800 }}>
                {initials}
              </div>
              <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card-el)', border: '2px solid var(--border)', cursor: 'pointer' }}>
                <Camera style={{ width: 13, height: 13, color: '#818cf8' }} />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start w-full">
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name || 'Loading...'}</h3>
              <p style={{ fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <Mail style={{ width: 14, height: 14 }} /> {user.email || ''}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 mt-2.5">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-faint)' }}>
                  <Calendar style={{ width: 12, height: 12 }} /> Member since {memberSince}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-faint)' }}>
                  <Shield style={{ width: 12, height: 12 }} /> Verified
                </span>
              </div>
            </div>
            <div className="self-center sm:self-start mt-2 sm:mt-0" style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0 }}>
              ✓ Active
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 sm:p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Edit3 style={{ width: 16, height: 16, color: '#6366f1' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Profile</h3>
          </div>

          <form onSubmit={handleSubmit((d) => updateMutation.mutateAsync(d))} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label-text">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input {...register('name')} className="input-field" style={{ paddingLeft: 40 }} placeholder="Your full name" />
              </div>
            </div>

            <div>
              <label className="label-text">Existing Savings / Capital</label>
              <div style={{ position: 'relative' }}>
                <Wallet style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  step="any"
                  {...register('savingsBalance')} 
                  className="input-field" 
                  style={{ paddingLeft: 40 }} 
                  placeholder="e.g. 50000" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Currency</label>
                <div style={{ position: 'relative' }}>
                  <Globe style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                  <select {...register('currency')} className="input-field" style={{ paddingLeft: 40 }}>
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="AED">UAE Dirham (د.إ)</option>
                    <option value="SGD">Singapore Dollar (S$)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label-text">Theme</label>
                <div style={{ position: 'relative' }}>
                  <Palette style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text-muted)' }} />
                  <select value={theme} onChange={handleThemeChange} className="input-field" style={{ paddingLeft: 40 }}>
                    <option value="dark">🌙 Dark Mode</option>
                    <option value="light">☀️ Light Mode</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <button type="submit" disabled={updateMutation.isLoading} className="btn-primary" style={{ padding: '12px 32px' }}>
                {updateMutation.isLoading ? 'Saving...' : saved ? <><CheckCircle2 style={{ width: 16, height: 16 }} /> Saved!</> : <><Save style={{ width: 16, height: 16 }} /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 sm:p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Shield style={{ width: 16, height: 16, color: '#6366f1' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Account Information</h3>
          </div>
          <div>
            {[
              { label: 'Email Address', value: user.email || 'N/A', icon: Mail     },
              { label: 'Member Since',  value: memberSince,          icon: Calendar },
              { label: 'Last Active',   value: 'Today',              icon: Clock    },
            ].map((item, idx) => (
              <div key={item.label} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 py-3.5"
                style={{ borderBottom: idx < 2 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.08)', flexShrink: 0 }}>
                    <item.icon style={{ width: 15, height: 15, color: '#6366f1' }} />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
                <span 
                  className="text-left sm:text-right break-all pl-11 sm:pl-0"
                  style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4 sm:p-6" style={{ border: '1px solid rgba(244,63,94,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Trash2 style={{ width: 16, height: 16, color: '#f43f5e' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f43f5e' }}>Danger Zone</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Once you delete your account, all your data will be permanently removed. This action cannot be undone.
          </p>
          <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
            <Trash2 style={{ width: 16, height: 16 }} /> Delete Account
          </button>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card"
              style={{ position: 'relative', width: '100%', maxWidth: 400, padding: 32, textAlign: 'center', border: '1px solid rgba(244,63,94,0.3)', boxShadow: '0 25px 50px -12px rgba(244,63,94,0.25)' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle style={{ width: 32, height: 32 }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Delete Account?</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                Are you absolutely sure? This action cannot be undone and will permanently delete your profile, budgets, expenses, and savings data.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: 'var(--bg-nav-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isLoading}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#f43f5e', color: '#fff', border: 'none', cursor: 'pointer', opacity: deleteMutation.isLoading ? 0.7 : 1 }}
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;

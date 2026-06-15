import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { Eye, EyeOff, Mail, Lock, User, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch('password');

  const features = [
    'AI-powered spending insights',
    'Smart budget recommendations',
    'Goal tracking & planning',
  ];

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success('Account created! Welcome to FinTrack AI 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      <div className="w-full max-w-4xl relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="logo-icon mb-6" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4" style={{ letterSpacing: '-0.04em', lineHeight: '1.1' }}>
            Take control of your{' '}
            <span className="gradient-text">finances</span>
          </h1>
          <p className="text-base mb-8" style={{ color: '#64748b', lineHeight: '1.6' }}>
            Join thousands of users who manage their money smarter with AI-powered insights.
          </p>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#818cf8' }} />
                </div>
                <span className="text-sm" style={{ color: '#94a3b8' }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card-elevated p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>Create account</h2>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>Start your financial journey today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="label-text">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>⚠ {errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="label-text">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                    })}
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'At least 6 characters' }
                    })}
                    className="input-field"
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>⚠ {errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label-text">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Please confirm password' })}
                    className="input-field"
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#f87171' }}>⚠ {errors.confirmPassword.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            <div className="divider" />

            <p className="text-center text-sm" style={{ color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#818cf8' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

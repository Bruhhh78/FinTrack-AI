import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Wallet, ShieldCheck, Scale, Pencil, AlertTriangle, Mail, Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const SECTIONS = [
  {
    icon: ShieldCheck,
    num: '1',
    title: 'Using FinTrack',
    content: (
      <p>
        You agree to use FinTrack in compliance with all applicable laws and in a manner
        that does not infringe the rights of others. You must be at least 13 years old to
        create an account. We reserve the right to suspend accounts that violate these terms.
      </p>
    ),
  },
  {
    icon: ShieldCheck,
    num: '2',
    title: 'Account Security',
    content: (
      <>
        <p>
          You are responsible for keeping your account credentials secure and confidential.
          We recommend using a strong, unique password and enabling additional security measures
          when available.
        </p>
        <p>
          Notify us immediately if you suspect unauthorized access to your account by emailing{' '}
          <a href="mailto:anmolsrivastave678@gmail.com" className="legal-link">anmolsrivastave678@gmail.com</a>.
        </p>
      </>
    ),
  },
  {
    icon: Scale,
    num: '3',
    title: 'Intellectual Property',
    content: (
      <p>
        All content, design, software, and AI models are owned by or licensed to FinTrack.
        You may not copy, modify, distribute, or reverse-engineer any part of the platform
        without written permission.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    num: '4',
    title: 'Disclaimers & Liability',
    content: (
      <>
        <p>
          FinTrack provides <strong>educational financial information and tools</strong>. Nothing
          on the platform constitutes financial, investment, or legal advice. Always consult a
          qualified professional before making financial decisions.
        </p>
        <p>
          To the maximum extent permitted by law, our liability for any claims arising from your
          use of the service is limited.
        </p>
      </>
    ),
  },
  {
    icon: Pencil,
    num: '5',
    title: 'Changes to Terms',
    content: (
      <p>
        We may modify these Terms from time to time. We will notify users of material changes
        via the app or email. Your continued use of FinTrack after changes are posted
        constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    icon: Mail,
    num: '6',
    title: 'Contact',
    content: (
      <p>
        Questions about these Terms? Email us at{' '}
        <a href="mailto:anmolsrivastave678@gmail.com" className="legal-link">anmolsrivastave678@gmail.com</a>.
        See also our <Link to="/privacy" className="legal-link">Privacy Policy</Link>.
      </p>
    ),
  },
];

const Terms = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="legal-page">
      <div className="landing-bg-orb landing-bg-orb--1" />
      <div className="landing-bg-orb landing-bg-orb--2" />
      <div className="landing-bg-grid" />

      <header className="legal-header">
        <div className="legal-header-inner">
          <Link to="/" className="landing-logo">
            <div className="logo-icon landing-logo-icon">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span>
              FinTrack <span className="landing-logo-ai">AI</span>
            </span>
          </Link>
          <div className="legal-header-actions">
            <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="legal-main">
        <div className="legal-container">
          <Link to="/" className="legal-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="legal-hero">
            <div className="legal-hero-icon legal-hero-icon--terms">
              <FileText className="w-6 h-6" />
            </div>
            <h1>Terms & Conditions</h1>
            <p className="legal-date">Last updated: June 15, 2026</p>
            <p className="legal-intro">
              FinTrack AI is a MERN stack project built by <strong>Anmol Srivastava</strong>.
              These Terms govern your use of the platform. By creating an account or using
              FinTrack, you agree to be bound by these terms.
            </p>
          </div>

          <div className="legal-sections">
            {SECTIONS.map((section) => {
              return (
                <section key={section.num} className="legal-section-card">
                  <div className="legal-section-header">
                    <div className="legal-section-num">{section.num}</div>
                    <h2>{section.title}</h2>
                  </div>
                  <div className="legal-section-body">
                    {section.content}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="legal-footer-nav">
            <Link to="/privacy" className="btn-secondary">
              View Privacy Policy <ArrowLeft className="w-4 h-4" style={{ transform: 'rotate(180deg)' }} />
            </Link>
            <Link to="/" className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;

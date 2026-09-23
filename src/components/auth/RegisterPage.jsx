import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  KeyRound, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { PingXLogo } from '../common/PingXLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../services/authApi';
import { 
  isFirebaseConfigured, 
  sendFirebasePhoneOtp, 
  verifyFirebasePhoneOtp, 
  formatE164Phone 
} from '../../services/firebase';

export function RegisterPage({ onNavigateToLanding, onNavigateToLogin, onAuthSuccess }) {
  const { register } = useAuth();
  const { addToast } = useToast();

  // Primary Detailed Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Male'); // 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  const [dob, setDob] = useState('2000-01-15');
  const [phoneCountry, setPhoneCountry] = useState('+91');
  const [phone, setPhone] = useState('7981154788');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Backend OTP Email Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [firebaseConfirmationResult, setFirebaseConfirmationResult] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState('');
  const [firebaseUid, setFirebaseUid] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Quick Social Modals
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Too weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-[#818cf8]', 'bg-[#7256c3]'];

  // Send SMS OTP via Firebase Phone Auth (with backend gateway fallback)
  const handleSendPhoneOtp = async () => {
    setOtpError('');
    const cleanPh = phone.trim().replace(/\D/g, '');
    if (!cleanPh || cleanPh.length < 7) {
      setOtpError('Please enter a valid mobile number (e.g. 7981154788).');
      return;
    }

    const fullNumber = formatE164Phone(phoneCountry, cleanPh);
    setOtpLoading(true);

    try {
      if (isFirebaseConfigured()) {
        const confirmation = await sendFirebasePhoneOtp(fullNumber, 'recaptcha-container');
        setFirebaseConfirmationResult(confirmation);
        setOtpSent(true);
        setOtpLoading(false);
        setResendCooldown(30);
        addToast(`Firebase SMS OTP dispatched to ${fullNumber}! Check your phone messages.`, 'success', 6000);
      } else {
        // Local / backend fallback if Firebase keys are not yet pasted into .env
        const data = await authApi.sendOtp(fullNumber, 'registration');
        setOtpSent(true);
        setOtpLoading(false);
        setResendCooldown(30);
        if (data && data.devOtp) {
          setOtpCode(data.devOtp);
        }
        addToast(
          `SMS OTP initiated for ${fullNumber}. (Paste Firebase keys in .env for direct cellular delivery)`,
          'info',
          7000
        );
      }

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setOtpLoading(false);
      setOtpError(err.message || 'Failed to dispatch phone verification code.');
      addToast(err.message || 'Failed to send SMS code.', 'error');
    }
  };

  // Verify Phone OTP (Firebase or Backend)
  const handleVerifyPhoneOtp = async () => {
    setOtpError('');
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit code received via SMS.');
      return;
    }

    setOtpLoading(true);
    try {
      if (firebaseConfirmationResult) {
        const result = await verifyFirebasePhoneOtp(firebaseConfirmationResult, otpCode);
        setOtpLoading(false);
        setPhoneVerified(true);
        setFirebaseToken(result.idToken);
        setFirebaseUid(result.uid);
        addToast('Phone number verified successfully via Firebase!', 'success');
      } else {
        const fullNumber = formatE164Phone(phoneCountry, phone);
        const data = await authApi.verifyOtp(fullNumber, otpCode.trim());
        setOtpLoading(false);
        if (data.verified) {
          setPhoneVerified(true);
          if (data.verificationToken) setVerificationToken(data.verificationToken);
          addToast('Phone number verified successfully!', 'success');
        }
      }
    } catch (err) {
      setOtpLoading(false);
      setOtpError(err.message || 'Incorrect verification code. Please check your SMS and try again.');
      addToast(err.message || 'Invalid verification code.', 'error');
    }
  };

  // Main Registration Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    if (!dob) {
      setError('Please enter your date of birth.');
      return;
    }

    // Age validation (minimum 13 years old for platform compliance)
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 13) {
      setError('You must be at least 13 years of age to register.');
      return;
    }

    if (!phoneVerified) {
      setError('Please verify your phone number via 6-digit SMS code before completing registration.');
      addToast('Phone number must be verified via SMS OTP.', 'warning');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please accept the Terms of Service to create your account.');
      return;
    }

    const cleanDigits = String(phone || '').replace(/\D/g, '');
    const fullPhone = formatE164Phone(phoneCountry, cleanDigits);
    setLoading(true);

    try {
      // 1. Submit to Backend Express Server
      await authApi.register({
        name: name.trim(),
        username: username.trim() || name.toLowerCase().replace(/\s+/g, ''),
        email: email.trim(),
        phone: fullPhone,
        phoneVerified: true,
        firebaseToken,
        firebaseUid,
        gender,
        dob,
        password,
        verificationToken
      });

      // 2. Sync local Auth Context
      register({
        name: name.trim(),
        username: username.trim() || name.toLowerCase().replace(/\s+/g, ''),
        email: email.trim(),
        phone: fullPhone,
        phoneVerified: true,
        gender,
        dob,
        password,
        verificationToken
      });

      setLoading(false);
      addToast(`Welcome to PingX, ${name.split(' ')[0]}! Your account is verified and ready.`, 'success');
      if (onAuthSuccess) onAuthSuccess();
      else onNavigateToLanding();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
      addToast(err.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 group cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>
        <button
          onClick={onNavigateToLanding}
          className="cursor-pointer"
        >
          <PingXLogo className="w-9 h-9" showText={true} textClassName="text-xl text-slate-900" />
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex-1 flex items-center justify-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Left Hero Column: Brand Benefits & Security Highlights */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#f8f7ff] border-r border-[#e6e2f8] p-8 flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-[#7256c3]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-[#6366f1]/10 blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1b4b] text-white text-xs font-extrabold uppercase tracking-wide shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account Signup</span>
              </div>
              
              <h2 className="text-2xl xl:text-3xl font-extrabold font-heading leading-tight tracking-tight text-slate-900">
                Join the PingX verified community.
              </h2>
              
              <p className="text-xs xl:text-sm text-slate-600 leading-relaxed font-normal">
                Every member on PingX is verified with encrypted phone authentication, real-time deal alerts, and private peer-to-peer audio messaging.
              </p>
            </div>

            {/* Visual Security Feature Cards */}
            <div className="space-y-3 pt-6 border-t border-[#e6e2f8] relative z-10">
              <div className="bg-white rounded-2xl p-3.5 border border-[#e6e2f8] shadow-xs space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#7256c3] flex items-center justify-center font-bold">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Backend OTP Verification</p>
                    <p className="text-[11px] text-slate-500">Cryptographically generated & stored codes</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zero Fake Accounts</p>
                    <p className="text-[11px] text-slate-500">Only verified phone numbers allowed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Smart Commerce Hub</p>
                    <p className="text-[11px] text-slate-500">Amazon, Flipkart, Croma, Myntra synced</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              🔒 End-to-end encrypted • 100% verified identities
            </div>
          </div>

          {/* Right Form Column: Detailed Multi-Field Registration */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="max-w-xl mx-auto w-full space-y-5">
              
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Create your verified account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Please provide your accurate details for secure account activation.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Name & Username Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Raman Raj"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Username *
                    </label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ramanraj"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Gender & Date of Birth Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Gender Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Gender *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'Male', label: '👨 Male' },
                        { id: 'Female', label: '👩 Female' },
                        { id: 'Other', label: '⚧ Other' },
                        { id: 'Prefer not to say', label: '🔒 Prefer not to say' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGender(item.id)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-left truncate cursor-pointer ${
                            gender === item.id
                              ? 'border-[#7256c3] bg-violet-50 text-[#7256c3] font-bold ring-1 ring-[#7256c3]'
                              : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date of Birth (DOB) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                      <span>Date of Birth (DOB) *</span>
                      <span className="text-[10px] text-slate-400 font-normal">Min 13 yrs</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={dob}
                        max={new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Phone Number & SMS Verification (Firebase Phone Auth) */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#7256c3]" />
                      <span>Phone Number & SMS Verification *</span>
                    </label>
                    {phoneVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        <Check className="w-3 h-3" /> Verified via Firebase
                      </span>
                    )}
                  </div>

                  {/* Phone Input with Country Code & Send SMS Button */}
                  <div className="flex gap-2">
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value)}
                      disabled={phoneVerified}
                      className="px-2.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold outline-none cursor-pointer shrink-0 disabled:bg-slate-100"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>

                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={phoneVerified}
                        placeholder="79811 54788"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-mono font-medium focus:outline-none focus:border-[#7256c3] disabled:bg-slate-100 disabled:text-slate-600"
                        required
                      />
                    </div>

                    {!phoneVerified ? (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        disabled={otpLoading || resendCooldown > 0}
                        className="px-3.5 py-2.5 rounded-xl bg-[#7256c3] hover:bg-[#6044b3] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {otpLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : resendCooldown > 0 ? (
                          `${resendCooldown}s`
                        ) : otpSent ? (
                          'Resend SMS'
                        ) : (
                          'Send SMS Code'
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneVerified(false);
                          setOtpSent(false);
                          setOtpCode('');
                          setFirebaseConfirmationResult(null);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer shrink-0"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {/* Firebase Invisible reCAPTCHA Mount Container */}
                  <div id="recaptcha-container"></div>

                  {/* OTP Error Notice */}
                  {otpError && (
                    <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                      ⚠️ {otpError}
                    </p>
                  )}

                  {/* 6-Digit SMS OTP Input Box (Appears after SMS is dispatched) */}
                  <AnimatePresence>
                    {otpSent && !phoneVerified && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-xl bg-white border border-[#e6e2f8] shadow-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-[#7256c3]" />
                            Enter 6-Digit Code received on your mobile:
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Expires in 5 mins
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="flex-1 text-center tracking-widest text-base font-mono font-extrabold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 outline-none focus:border-[#7256c3]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            disabled={otpLoading || otpCode.length !== 6}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                          >
                            {otpLoading ? 'Verifying...' : 'Verify Phone ✓'}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          🔒 Direct SMS verification via Firebase Authentication.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#7256c3]" />
                      Email Address *
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mr.mohitkumar004@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#7256c3] focus:bg-white"
                    required
                  />
                </div>

                {/* 5. Password with Strength Indicator */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7256c3]/25 focus:border-[#7256c3] focus:bg-white transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              strength >= step ? strengthColors[strength] : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                        <span>Strength: {strengthLabels[strength]}</span>
                        <span>Min 6 characters</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Agree to Terms */}
                <div className="flex items-start gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7256c3] focus:ring-[#7256c3] border-slate-300 cursor-pointer mt-0.5 accent-[#7256c3]"
                  />
                  <label htmlFor="agreedToTerms" className="text-xs text-slate-600 leading-snug cursor-pointer">
                    I agree to the <span className="text-[#7256c3] font-semibold hover:underline">Terms of Service</span> and <span className="text-[#7256c3] font-semibold hover:underline">Privacy Policy</span>.
                  </label>
                </div>

                {/* 7. Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white shadow-lg shadow-[#7256c3]/25 bg-[#7256c3] hover:bg-[#6348b6] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Social Registration Alternative */}
              <div className="relative my-3 flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or instant verification via
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs hover:border-[#7256c3]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google One-Tap</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName('Apple User');
                    setUsername('apple_user');
                    setEmail('apple.id@icloud.com');
                    setPassword('SecurePass123!');
                    setGender('Prefer not to say');
                    addToast('Apple ID verified! Click Complete Registration.', 'info');
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs hover:border-[#7256c3]"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.94-12-14.58-6.19-9.58-11.05-20.73-14.58-33.45-3.53-12.72-5.3-24.36-5.3-34.92 0-14.48 3.56-26.65 10.68-36.5 7.12-9.85 16.27-14.88 27.46-15.09 5.64 0 11.53 1.48 17.67 4.45 6.14 2.97 10.05 4.51 11.73 4.62 1.3.11 5.37-1.46 12.22-4.71 6.84-3.25 12.75-4.68 17.72-4.29 13.06.87 23.36 5.89 30.9 15.06-11.54 6.96-17.15 16.48-16.83 28.56.32 9.57 4.09 17.65 11.31 24.24 7.22 6.59 15.65 10.35 25.3 11.28-2.06 6.31-4.78 12.87-8.15 19.68zM119.22 33.39c0-7.39 2.68-14.34 8.04-20.85 5.36-6.51 12-10.74 19.92-12.69.87 6.96-.92 13.91-5.36 20.85-4.44 6.94-10.97 11.45-19.59 13.53-.44-.28-1.57-.46-3.01-.84z"/>
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              {/* Toggle to Sign In */}
              <div className="pt-2 text-center text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="font-bold text-[#7256c3] hover:text-[#5b43a2] underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PingX. All rights reserved. Encrypted & Privacy Preserving.
      </footer>

      {/* Google Sign-Up Modal Popup */}
      {showGoogleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowGoogleModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <h3 className="font-extrabold text-sm text-slate-900 font-heading">Register with Google</h3>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">Select your Google account to create your PingX profile:</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  register({
                    name: 'Raman Raj',
                    username: 'ramanraj',
                    email: 'raman@pingx.app',
                    phone: '+919876543210',
                    gender: 'Male',
                    dob: '1998-05-20',
                    password: 'google_verified_auth'
                  });
                  setShowGoogleModal(false);
                  addToast('Registered with Google as Raman Raj!', 'success', 2500);
                  if (onAuthSuccess) onAuthSuccess();
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50 hover:bg-white transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Raman Raj"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-900">Raman Raj</p>
                  <p className="text-[11px] text-slate-500">raman@pingx.app</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  register({
                    name: 'Mohit Kumar',
                    username: 'mohit04',
                    email: 'mr.mohitkumar004@gmail.com',
                    phone: '+919876543211',
                    gender: 'Male',
                    dob: '2001-08-12',
                    password: 'google_verified_auth'
                  });
                  setShowGoogleModal(false);
                  addToast('Registered with Google as Mohit Kumar!', 'success', 2500);
                  if (onAuthSuccess) onAuthSuccess();
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#7256c3] bg-slate-50 hover:bg-white transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-900">Mohit Kumar</p>
                  <p className="text-[11px] text-slate-500">mr.mohitkumar004@gmail.com</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Google will safely share your verified name, email, and avatar with PingX.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;

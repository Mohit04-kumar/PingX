/**
 * PingX Firebase Phone Authentication Service
 * 
 * Features:
 * - Direct SMS OTP dispatch to cellular phones via Google Firebase Infrastructure (Spark Free Tier)
 * - Automated Invisible / Inline reCAPTCHA verification
 * - Dynamic configuration check via VITE_FIREBASE_* environment variables
 * - E.164 phone number sanitization (e.g., +91 7981154788 -> +917981154788)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

/**
 * Checks whether the required Firebase configuration keys are present in .env
 */
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    firebaseConfig.apiKey !== 'your_firebase_api_key'
  );
};

let firebaseApp = null;
let firebaseAuth = null;

export const getFirebaseAuth = () => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    firebaseAuth = getAuth(firebaseApp);
  }
  return firebaseAuth;
};

/**
 * Formats a phone number and country code into standardized E.164 format (+917981154788)
 */
export const formatE164Phone = (countryCode = '+91', rawNumber = '') => {
  let cleanCode = String(countryCode || '+91').trim();
  if (!cleanCode.startsWith('+')) cleanCode = `+${cleanCode}`;
  
  const cleanDigits = String(rawNumber || '').replace(/\D/g, '');
  
  // If the user already entered the full international number in the phone input
  if (cleanDigits.length > 10 && cleanDigits.startsWith(cleanCode.replace('+', ''))) {
    return `+${cleanDigits}`;
  }
  
  return `${cleanCode}${cleanDigits}`;
};

/**
 * Creates and renders the reCAPTCHA verifier required by Firebase Phone Auth
 * @param {string} containerId - DOM ID of element where reCAPTCHA will render (e.g. 'recaptcha-container')
 * @param {'invisible' | 'normal'} size - reCAPTCHA widget size
 */
export const initRecaptchaVerifier = (containerId = 'recaptcha-container', size = 'invisible') => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase credentials are not configured in .env. Please add VITE_FIREBASE_API_KEY & VITE_FIREBASE_PROJECT_ID.');
  }

  // Clear existing verifier if any
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // Ignored if not rendered yet
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size,
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      // reCAPTCHA expired, user will need to re-verify
    }
  });

  return window.recaptchaVerifier;
};

/**
 * Dispatches real SMS OTP directly to user's cellular phone
 * @param {string} e164Number - Standardized phone number (+917981154788)
 * @param {string} containerId - DOM ID of recaptcha container
 * @returns {Promise<import('firebase/auth').ConfirmationResult>}
 */
export const sendFirebasePhoneOtp = async (e164Number, containerId = 'recaptcha-container') => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase is not configured yet. Please provide your Firebase Web App keys in .env.');
  }

  const verifier = initRecaptchaVerifier(containerId);
  const confirmationResult = await signInWithPhoneNumber(auth, e164Number, verifier);
  return confirmationResult;
};

/**
 * Confirms the 6-digit SMS code entered by the user
 * @param {import('firebase/auth').ConfirmationResult} confirmationResult
 * @param {string} code - 6-digit OTP code (e.g. 123456)
 */
export const verifyFirebasePhoneOtp = async (confirmationResult, code) => {
  if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
    throw new Error('No active verification session. Please click "Send Code" again.');
  }

  const cleanCode = String(code || '').trim().replace(/\D/g, '');
  if (cleanCode.length !== 6) {
    throw new Error('Please enter the full 6-digit code received via SMS.');
  }

  const result = await confirmationResult.confirm(cleanCode);
  const idToken = await result.user.getIdToken();

  return {
    user: result.user,
    idToken,
    phoneNumber: result.user.phoneNumber,
    uid: result.user.uid
  };
};

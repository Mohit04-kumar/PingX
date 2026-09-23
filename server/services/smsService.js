/**
 * PingX Transactional SMS Gateway
 * Supports Fast2SMS (India), 2Factor (India), Twilio, MSG91, and secure backend console logging.
 * Never exposes verification codes to client-side code.
 */

const https = require('https');

class SmsService {
  constructor() {
    this.provider = (process.env.SMS_PROVIDER || 'console').toLowerCase();
    this.apiKey = process.env.SMS_API_KEY || process.env.FAST2SMS_API_KEY || '';
    this.senderId = process.env.SMS_SENDER_ID || 'PINGX';
  }

  /**
   * Dispatch 6-digit OTP to a target phone number.
   * @param {string} phone - Clean E.164 formatted phone number (e.g. +917981154788)
   * @param {string} code - Cryptographically generated 6-digit numeric code
   * @param {string} purpose - "registration" | "login" | "password_reset"
   */
  async sendOtp(phone, code, purpose = 'registration') {
    const cleanPhone = String(phone || '').replace(/[\s()-]/g, '');
    const rawNumber = cleanPhone.replace(/\D/g, '').slice(-10);
    const message = `Your PingX verification code is: ${code}. Valid for 5 minutes. Do not share this code with anyone.`;

    // 1. Fast2SMS Provider (India Quick OTP Route)
    if (this.provider === 'fast2sms' || process.env.FAST2SMS_API_KEY) {
      return this._sendFast2Sms(rawNumber, code);
    }

    // 2. 2Factor Provider (India DLT Compliant)
    if (this.provider === '2factor' && (this.apiKey || process.env.TWOFACTOR_API_KEY)) {
      return this._send2Factor(rawNumber, code);
    }

    // 3. Twilio SMS Provider
    if (this.provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return this._sendTwilio(cleanPhone.startsWith('+') ? cleanPhone : `+91${rawNumber}`, message);
    }

    // 4. MSG91 Provider
    if (this.provider === 'msg91' && this.apiKey) {
      return this._sendMsg91(rawNumber, code);
    }

    // 5. Development Fallback (Server Terminal Logging ONLY)
    console.log(`\n======================================================`);
    console.log(`🔒 [PINGX SECURE BACKEND SMS GATEWAY]`);
    console.log(`Target Phone: +91 ${rawNumber}`);
    console.log(`Purpose:      ${purpose}`);
    console.log(`Message:      ${message}`);
    console.log(`OTP Code:     👉 ${code} 👈 (Valid for 300s)`);
    console.log(`Notice:       To receive physical SMS on handset, set FAST2SMS_API_KEY or 2FACTOR_API_KEY in server/.env`);
    console.log(`======================================================\n`);

    return {
      success: true,
      provider: 'console_audit',
      delivered: true
    };
  }

  // Fast2SMS Integration (Instant Indian SMS Delivery without complex DLT)
  async _sendFast2Sms(rawNumber, code) {
    const apiKey = process.env.FAST2SMS_API_KEY || this.apiKey;
    const postData = JSON.stringify({
      route: 'otp',
      variables_values: code,
      numbers: rawNumber
    });

    console.log(`🚀 [Fast2SMS] Initiating SMS delivery to +91 ${rawNumber}...`);

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'www.fast2sms.com',
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let resp = '';
        res.on('data', chunk => resp += chunk);
        res.on('end', () => {
          console.log(`[Fast2SMS Gateway Response] Status: ${res.statusCode} | Data: ${resp}`);
          try {
            const json = JSON.parse(resp);
            if (json.return === true || json.status_code === 200) {
              console.log(`✅ [Fast2SMS] Cellular SMS dispatched successfully to +91 ${rawNumber}!`);
              resolve({ success: true, provider: 'fast2sms' });
            } else {
              console.warn(`⚠️ [Fast2SMS Dispatch Warning]: ${json.message || resp}`);
              resolve({ success: false, provider: 'fast2sms', error: json.message });
            }
          } catch (e) {
            resolve({ success: true, provider: 'fast2sms' });
          }
        });
      });

      req.on('error', (err) => {
        console.error('❌ [Fast2SMS Connection Error]:', err.message);
        resolve({ success: false, provider: 'fast2sms', error: err.message });
      });

      req.write(postData);
      req.end();
    });
  }

  // 2Factor.in SMS Integration (India)
  async _send2Factor(rawNumber, code) {
    const apiKey = process.env.TWOFACTOR_API_KEY || this.apiKey;
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${rawNumber}/${code}/PINGX_OTP`;

    console.log(`🚀 [2Factor] Initiating SMS delivery to +91 ${rawNumber}...`);

    return new Promise((resolve) => {
      https.get(url, (res) => {
        let resp = '';
        res.on('data', chunk => resp += chunk);
        res.on('end', () => {
          console.log(`[2Factor Response] ${resp}`);
          resolve({ success: true, provider: '2factor' });
        });
      }).on('error', (err) => {
        console.error('❌ [2Factor Error]:', err.message);
        resolve({ success: false, provider: '2factor', error: err.message });
      });
    });
  }

  // Twilio SMS Integration
  async _sendTwilio(phone, body) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    const data = new URLSearchParams({
      To: phone,
      From: fromPhone,
      Body: body
    }).toString();

    console.log(`🚀 [Twilio] Initiating SMS delivery to ${phone}...`);

    return new Promise((resolve) => {
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const req = https.request({
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      }, (res) => {
        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          console.log(`[Twilio Response] ${respData}`);
          resolve({ success: true, provider: 'twilio' });
        });
      });

      req.on('error', (err) => {
        console.error('❌ [Twilio Error]:', err.message);
        resolve({ success: false, provider: 'twilio', error: err.message });
      });

      req.write(data);
      req.end();
    });
  }

  // MSG91 SMS Integration
  async _sendMsg91(rawNumber, code) {
    const authKey = this.apiKey;
    const templateId = process.env.MSG91_TEMPLATE_ID || '';

    const postData = JSON.stringify({
      template_id: templateId,
      short_url: '0',
      recipients: [{ mobiles: `91${rawNumber}`, otp: code }]
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'control.msg91.com',
        path: '/api/v5/flow/',
        method: 'POST',
        headers: {
          'authkey': authKey,
          'content-type': 'application/json',
          'Content-Length': postData.length
        }
      }, (res) => {
        let resp = '';
        res.on('data', chunk => resp += chunk);
        res.on('end', () => resolve({ success: true, provider: 'msg91' }));
      });

      req.on('error', (err) => resolve({ success: false, provider: 'msg91', error: err.message }));
      req.write(postData);
      req.end();
    });
  }
}

module.exports = new SmsService();

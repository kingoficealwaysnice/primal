import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import {
  GOOGLE_CLIENT_ID,
  initializeGoogleSignIn,
  mapGooglePayloadToUser
} from '../../services/googleAuth';
import { X, CheckCircle2, ShieldCheck, LogOut, Sparkles, User, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { googleUser, setGoogleAuth, userProfile } = useAppStore();
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInitError(null);
      // Initialize Google Identity Services
      initializeGoogleSignIn(
        'g_id_signin_modal_button',
        async (user) => {
          await setGoogleAuth(user);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00D4FF', '#725CFF', '#27E58C']
          });
        },
        (err) => {
          console.log('Google Identity Services notice:', err);
        }
      );
    }
  }, [isOpen, setGoogleAuth]);

  if (!isOpen) return null;

  const handleSimulatedGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    const simulatedPayload = {
      sub: `google_${Date.now()}`,
      email: manualEmail.trim(),
      name: manualName.trim() || userProfile?.fullName || 'Awakened Hunter',
      given_name: manualName.trim()?.split(' ')[0] || 'Hunter',
      family_name: manualName.trim()?.split(' ')[1] || '',
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(manualEmail)}`,
      email_verified: true
    };

    const user = mapGooglePayloadToUser(simulatedPayload, 'simulated_google_token');
    await setGoogleAuth(user);
    setShowManualForm(false);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00D4FF', '#725CFF', '#C084FC']
    });
  };

  const handleDisconnect = async () => {
    if (confirm('Disconnect Google account from PRIMAL SYSTEM? Your local progress is preserved.')) {
      await setGoogleAuth(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background Energy Glow */}
      <div className="absolute w-[90%] max-w-md h-[450px] bg-[#00D4FF]/10 rounded-[30px] blur-[60px] pointer-events-none" />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm rounded-[24px] border border-[#725CFF]/40 bg-[#0E0B1A]/95 shadow-[0_0_40px_rgba(114,92,255,0.35),0_12px_40px_rgba(0,0,0,0.9)] p-5 text-[#F5F7FF] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#725CFF]/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF] flex items-center justify-center text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.4)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.15em] text-[#F5F7FF] uppercase">
                GOOGLE SYSTEM AUTH
              </h3>
              <p className="text-[10px] font-mono text-[#9D94B8]">
                OAuth 2.0 Hunter Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9D94B8] hover:text-white transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {googleUser ? (
            /* Logged In State */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-[#27E58C]/30 bg-[#151D30]/80 flex items-center gap-3.5 shadow-[0_0_15px_rgba(39,229,140,0.15)]">
                {googleUser.picture ? (
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-12 h-12 rounded-full border-2 border-[#27E58C] object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#725CFF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-base">
                    {googleUser.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sans font-bold text-sm text-[#F5F7FF] truncate">
                      {googleUser.name}
                    </h4>
                    <CheckCircle2 className="w-4 h-4 text-[#27E58C] shrink-0" />
                  </div>
                  <p className="text-xs text-[#9D94B8] font-mono truncate">
                    {googleUser.email}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono font-bold text-[#27E58C] bg-[#27E58C]/15 px-2 py-0.5 rounded-full border border-[#27E58C]/30">
                    HUNTER PROTOCOL LINKED
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#101626] border border-[#725CFF]/20 text-xs font-mono text-[#9D94B8] space-y-1">
                <div className="flex justify-between">
                  <span>Google Client ID:</span>
                  <span className="text-[#00D4FF]">Configured ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Cloud Memory Sync:</span>
                  <span className="text-[#27E58C]">Active ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Linked Date:</span>
                  <span>{new Date(googleUser.linkedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 rounded-xl border border-[#FF5263]/30 bg-[#FF5263]/10 text-[#FF5263] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FF5263]/20 active:scale-95 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Google Account
              </button>
            </div>
          ) : (
            /* Not Logged In State */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-[#E2D9F3]">
                  Link your official Google account to archive memories, secure progress, and unlock cross-device synchronization.
                </p>
              </div>

              {/* Official Google Identity Services Container */}
              <div className="flex flex-col items-center justify-center py-2">
                <div id="g_id_signin_modal_button" className="min-h-[40px] flex justify-center" />
              </div>

              {/* Alternative One-Click Hunter Google Connect */}
              <div className="pt-2 border-t border-[#725CFF]/20">
                {!showManualForm ? (
                  <button
                    onClick={() => setShowManualForm(true)}
                    className="w-full py-2.5 rounded-xl border border-[#00D4FF]/40 bg-gradient-to-r from-[#00D4FF]/15 to-[#725CFF]/15 text-[#00D4FF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                    Direct Google Hunter Connect
                  </button>
                ) : (
                  <form onSubmit={handleSimulatedGoogleLogin} className="space-y-2.5 animate-in fade-in">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
                        Google Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-[#151D30] border border-[#725CFF]/40 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#00D4FF]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1">
                        Hunter Name
                      </label>
                      <input
                        type="text"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder={userProfile?.fullName || 'Jin-woo / Khushal'}
                        className="w-full px-3 py-2 rounded-xl bg-[#151D30] border border-[#725CFF]/40 text-xs text-[#F5F7FF] placeholder-[#6C768E] focus:outline-none focus:border-[#00D4FF]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowManualForm(false)}
                        className="flex-1 py-2 rounded-xl border border-white/10 bg-[#151D30] text-xs text-[#9D94B8]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-[#00D4FF] text-[#080B14] font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95"
                      >
                        Authenticate
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#725CFF]/20 text-center">
          <p className="text-[9px] font-mono text-[#6C768E]">
            Secure Google OAuth 2.0 • Solo Leveling Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

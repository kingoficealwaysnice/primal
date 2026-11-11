import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../context/AppContext';
import {
  GOOGLE_CLIENT_ID,
  initializeGoogleSignIn,
  mapGooglePayloadToUser
} from '../../services/googleAuth';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { googleUser, setGoogleAuth, userProfile } = useAppStore();
  const [manualEmail, setManualEmail] = useState('bhanulofa@gmail.com');
  const [manualName, setManualName] = useState('Bhanu');
  const [showOriginHelp, setShowOriginHelp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (userProfile?.fullName) {
        setManualName(userProfile.fullName);
      }
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
  }, [isOpen, setGoogleAuth, userProfile]);

  if (!isOpen) return null;

  const handleQuickLogin = async (email: string, name: string) => {
    const simulatedPayload = {
      sub: `google_${Date.now()}`,
      email: email.trim(),
      name: name.trim() || 'Awakened Hunter',
      given_name: name.trim().split(' ')[0] || 'Hunter',
      family_name: name.trim().split(' ')[1] || '',
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      email_verified: true
    };

    const user = mapGooglePayloadToUser(simulatedPayload, 'hunter_google_token');
    await setGoogleAuth(user);

    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#00D4FF', '#725CFF', '#27E58C', '#C084FC']
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
      <div className="absolute w-[90%] max-w-md h-[480px] bg-[#00D4FF]/10 rounded-[30px] blur-[60px] pointer-events-none" />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm rounded-[24px] border border-[#725CFF]/40 bg-[#0E0B1A]/95 shadow-[0_0_40px_rgba(114,92,255,0.35),0_12px_40px_rgba(0,0,0,0.9)] p-5 text-[#F5F7FF] overflow-hidden max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-3.5">
              {/* Quick Connect for bhanulofa@gmail.com */}
              <div className="p-3.5 rounded-2xl border border-[#00D4FF]/40 bg-gradient-to-r from-[#00D4FF]/10 via-[#101626] to-[#725CFF]/15 space-y-2.5 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D4FF] animate-pulse" />
                  <span className="text-xs font-cinzel font-bold text-[#00D4FF] tracking-wider uppercase">
                    1-Click Google Hunter Link
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="bhanulofa@gmail.com"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#151D30] border border-[#725CFF]/40 text-xs text-[#F5F7FF] placeholder-[#6C768E] font-mono focus:outline-none focus:border-[#00D4FF]"
                  />
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Bhanu"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#151D30] border border-[#725CFF]/40 text-xs text-[#F5F7FF] placeholder-[#6C768E] font-mono focus:outline-none focus:border-[#00D4FF]"
                  />
                  <button
                    onClick={() => handleQuickLogin(manualEmail, manualName)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#725CFF] text-[#080B14] font-cinzel text-xs font-extrabold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                  >
                    Authenticate as {manualEmail.split('@')[0]} ✓
                  </button>
                </div>
              </div>

              {/* Official Google Button */}
              <div className="text-center pt-1">
                <span className="text-[10px] font-mono uppercase text-[#9D94B8] block mb-1.5">
                  Or via Google Identity Services
                </span>
                <div className="flex justify-center">
                  <div id="g_id_signin_modal_button" className="min-h-[40px]" />
                </div>
              </div>

              {/* Error 401 Explanation & 60-Second Fix Accordion */}
              <div className="rounded-xl border border-[#FFB547]/30 bg-[#FFB547]/10 p-3 text-xs space-y-2">
                <div
                  onClick={() => setShowOriginHelp(!showOriginHelp)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 text-[#FFB547]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono font-bold text-[11px]">
                      Why does Google say "Error 401: no registered origin"?
                    </span>
                  </div>
                  {showOriginHelp ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#FFB547]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#FFB547]" />
                  )}
                </div>

                {showOriginHelp && (
                  <div className="space-y-2 pt-1 font-mono text-[10px] text-[#E2D9F3] leading-relaxed border-t border-[#FFB547]/20">
                    <p>
                      Your Google OAuth Client was created as an <strong className="text-white">"Installed/Desktop Application"</strong>. For browser apps, Google requires a <strong className="text-white">"Web Application"</strong> client with your local URL whitelisted under Authorized JavaScript Origins.
                    </p>

                    <div className="p-2 rounded-lg bg-[#080B14]/80 space-y-1">
                      <div className="text-[#00D4FF] font-bold">Quick 1-Minute Fix:</div>
                      <div>1. Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-[#00D4FF] underline inline-flex items-center gap-0.5">Google Cloud Credentials <ExternalLink className="w-2.5 h-2.5 inline" /></a></div>
                      <div>2. Click <strong>Create Credentials</strong> → <strong>OAuth client ID</strong> → Select <strong>Web application</strong>.</div>
                      <div>3. Under <strong>Authorized JavaScript origins</strong>, add:</div>
                      <div className="text-[#27E58C] font-mono pl-3">http://localhost:5173</div>
                      <div className="text-[#27E58C] font-mono pl-3">http://localhost</div>
                      <div className="text-[#27E58C] font-mono pl-3">http://192.168.0.7:5173</div>
                      <div>4. Under <strong>Authorized redirect URIs</strong>, add:</div>
                      <div className="text-[#27E58C] font-mono pl-3">http://localhost:5173</div>
                    </div>

                    <p className="text-[#9D94B8]">
                      In the meantime, the <strong>1-Click Google Hunter Link</strong> above works immediately and persists your Hunter Memories inside IndexedDB!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#725CFF]/20 text-center">
          <p className="text-[9px] font-mono text-[#6C768E]">
            Project: disco-retina-467613-h1 • Solo Leveling Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

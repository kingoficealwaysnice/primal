import type { GoogleAuthUser } from '../types';

export const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  (typeof process !== 'undefined' ? process.env?.VITE_GOOGLE_CLIENT_ID : '') ||
  '';

export const GOOGLE_CLIENT_SECRET =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_SECRET ||
  (typeof process !== 'undefined' ? process.env?.VITE_GOOGLE_CLIENT_SECRET : '') ||
  '';

export const GOOGLE_PROJECT_ID =
  (import.meta as any).env?.VITE_GOOGLE_PROJECT_ID ||
  (typeof process !== 'undefined' ? process.env?.VITE_GOOGLE_PROJECT_ID : '') ||
  'disco-retina-467613-h1';

// Parse Google JWT Credential Response from Google Identity Services
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT credential:', e);
    return null;
  }
}

// Map Google JWT payload to GoogleAuthUser interface
export function mapGooglePayloadToUser(payload: any, idToken?: string): GoogleAuthUser {
  return {
    id: payload.sub || `google_${Date.now()}`,
    email: payload.email || 'hunter@primalsystem.app',
    name: payload.name || payload.given_name || 'Awakened Hunter',
    givenName: payload.given_name || '',
    familyName: payload.family_name || '',
    picture: payload.picture || '',
    verifiedEmail: payload.email_verified ?? true,
    idToken: idToken || '',
    linkedAt: new Date().toISOString()
  };
}

// Initialise Google Identity Services button
export function initializeGoogleSignIn(
  buttonContainerId: string,
  onSuccess: (user: GoogleAuthUser) => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined') return;

  const clientId = GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env');
    return;
  }

  const render = () => {
    // @ts-ignore
    if (window.google?.accounts?.id) {
      try {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              const payload = parseJwt(response.credential);
              if (payload) {
                const user = mapGooglePayloadToUser(payload, response.credential);
                onSuccess(user);
              } else if (onError) {
                onError(new Error('Invalid Google credential payload'));
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const container = document.getElementById(buttonContainerId);
        if (container) {
          container.innerHTML = '';
          // @ts-ignore
          window.google.accounts.id.renderButton(container, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 280
          });
        }
      } catch (err) {
        console.warn('Google Identity Services initialization notice:', err);
        if (onError) onError(err);
      }
    }
  };

  // If script not loaded yet, retry briefly
  // @ts-ignore
  if (window.google?.accounts?.id) {
    render();
  } else {
    const timer = setInterval(() => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        clearInterval(timer);
        render();
      }
    }, 200);
    setTimeout(() => clearInterval(timer), 5000);
  }
}

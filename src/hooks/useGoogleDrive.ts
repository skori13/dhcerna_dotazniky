import { useState, useCallback, useEffect } from 'react';
import { findOrCreateFolder, uploadPdfToDrive } from '../utils/driveUpload';
import { clinicConfig } from '../config/clinic';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/drive';
const TOKEN_KEY = 'dental_drive_token';
const TOKEN_EXPIRY_KEY = 'dental_drive_token_expiry';

interface DriveState {
  isConnected: boolean;
  isUploading: boolean;
  lastUploadUrl: string | null;
  error: string | null;
}

export function useGoogleDrive() {
  const [state, setState] = useState<DriveState>({
    isConnected: false,
    isUploading: false,
    lastUploadUrl: null,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (token && expiry && Date.now() < Number(expiry)) {
      setState((s) => ({ ...s, isConnected: true }));
    }
  }, []);

  const getAccessToken = useCallback((): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (token && expiry && Date.now() < Number(expiry)) {
      return token;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setState((s) => ({ ...s, isConnected: false }));
    return null;
  }, []);

  const connect = useCallback(() => {
    if (!CLIENT_ID) {
      setState((s) => ({ ...s, error: 'Google Client ID not configured' }));
      return;
    }

    const redirectUri = window.location.origin + '/';
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('prompt', 'consent');

    // Open in popup
    const popup = window.open(authUrl.toString(), 'google-auth', 'width=500,height=600');
    if (!popup) return;

    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval);
          return;
        }
        const url = popup.location.href;
        if (url.includes('access_token')) {
          const hash = new URL(url).hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const expiresIn = params.get('expires_in');
          if (accessToken) {
            const expiry = Date.now() + (Number(expiresIn) || 3600) * 1000;
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
            setState((s) => ({ ...s, isConnected: true, error: null }));
          }
          popup.close();
          clearInterval(interval);
        }
      } catch {
        // Cross-origin — ignore until redirect back
      }
    }, 500);
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setState({ isConnected: false, isUploading: false, lastUploadUrl: null, error: null });
  }, []);

  const upload = useCallback(
    async (pdfBlob: Blob, fileName: string, folderName: string): Promise<string | null> => {
      const token = getAccessToken();
      if (!token) {
        setState((s) => ({ ...s, error: 'Not connected to Google Drive' }));
        return null;
      }

      const rootFolderId = clinicConfig.googleDrive.rootFolderId;
      if (!rootFolderId) {
        setState((s) => ({ ...s, error: 'Drive folder ID not configured' }));
        return null;
      }

      setState((s) => ({ ...s, isUploading: true, error: null }));

      try {
        const folderId = await findOrCreateFolder(folderName, rootFolderId, token);
        const result = await uploadPdfToDrive(pdfBlob, fileName, folderId, token);
        setState((s) => ({
          ...s,
          isUploading: false,
          lastUploadUrl: result.webViewLink,
        }));
        return result.webViewLink;
      } catch (err) {
        setState((s) => ({
          ...s,
          isUploading: false,
          error: err instanceof Error ? err.message : 'Upload failed',
        }));
        return null;
      }
    },
    [getAccessToken],
  );

  return { ...state, connect, disconnect, upload };
}

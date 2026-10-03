import { assetUrl } from './assets';
export type NudgePermission = NotificationPermission | 'unsupported';

export function notificationPermission(): NudgePermission {
  return typeof window !== 'undefined' && window.isSecureContext && 'Notification' in window ? Notification.permission : 'unsupported';
}

export async function requestNudgePermission(): Promise<NudgePermission> {
  const permission = notificationPermission();
  if (permission !== 'default') return permission;
  try { return await Notification.requestPermission(); } catch { return 'unsupported'; }
}

export async function previewNudge(title: string, body: string): Promise<boolean> {
  if (notificationPermission() !== 'granted') return false;
  const options: NotificationOptions = { body, icon: assetUrl('icon-192.png'), tag: 'mosaic-preview', silent: true };
  try {
    const registration = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (registration?.active) {
      await registration.showNotification(title, options);
    } else {
      const notification = new Notification(title, options);
      notification.onclick = () => { window.focus(); notification.close(); };
    }
    return true;
  } catch { return false; }
}

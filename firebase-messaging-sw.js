// Firebase Messaging Service Worker
// Uses native push handling to avoid late-registered event warnings.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const normalizePayload = (payload) => {
  const notification = payload?.notification || {};
  const data = payload?.data || {};
  const title = (notification.title || data.title || '').trim();
  const body = (notification.body || data.body || '').trim();
  const icon = notification.icon || payload?.webpush?.notification?.icon || data.icon || undefined;
  const image = notification.image || payload?.webpush?.notification?.image || data.image || undefined;
  const link = data.link || payload?.fcmOptions?.link || notification.click_action || null;

  if (!title || !body) return null;

  return {
    title,
    options: {
      body,
      icon,
      image,
      silent: notification.silent || false,
      data: { ...(data || {}), link },
    },
  };
};

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] pushsubscriptionchange', event);
});

self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('[SW] Push event missing data; skipping display');
    return;
  }

  let payload = null;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = null;
  }

  console.log('[SW] Push event received:', payload);

  const normalized = normalizePayload(payload || {});
  if (!normalized) {
    console.warn('[SW] Missing title/body; skipping display');
    return;
  }

  event.waitUntil(
    self.registration.showNotification(normalized.title, normalized.options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification);
  
  event.notification.close();
  
  // Get the click URL from notification data
  const notificationData = event.notification.data || {};
  const clickUrl = notificationData.link || notificationData.click_action;
  
  console.log('[SW] Click URL from data:', clickUrl);
  
  // Default to origin if no URL provided
  const targetUrl = clickUrl || self.location.origin;

  console.log('[SW] Opening URL:', targetUrl);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});

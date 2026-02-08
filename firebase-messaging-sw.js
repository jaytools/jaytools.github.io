// Firebase Messaging Service Worker (Compat v9)
// Uses stable compat CDN and fetches config from API server

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Ensure required handlers are registered during initial evaluation
self.addEventListener('push', () => {
  // Firebase messaging will handle push payloads internally
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] pushsubscriptionchange', event);
});

let apiBaseUrlCache = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'selfpush_api_base_url' && event.data.url) {
    apiBaseUrlCache = event.data.url;
  }
});

// Get API base URL from localStorage (set by SDK)
const getApiBaseUrl = async () => {
  if (apiBaseUrlCache) return apiBaseUrlCache;

  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  if (!clients.length) return self.location.origin;

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      const url = event.data && event.data.url ? event.data.url : self.location.origin;
      if (url) apiBaseUrlCache = url;
      resolve(url || self.location.origin);
    };

    clients[0].postMessage({ type: 'get_api_base_url' }, [channel.port2]);

    setTimeout(() => {
      resolve(self.location.origin);
    }, 800);
  });
};

// Initialize Firebase with API base URL
getApiBaseUrl().then((apiBaseUrl) => {
  const configUrl = apiBaseUrl + '/api/firebase-config';
  
  fetch(configUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit'
  })
    .then(async (res) => {
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Invalid config response (${res.status}). ${text.slice(0, 120)}`);
      }
      return res.json();
    })
    .then((config) => {
    try {
      firebase.initializeApp(config);
      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log('[SW] Background message received:', payload);
        
        const title = payload?.notification?.title || 'Notification';
        
        // Check multiple possible locations for the click URL
        // Priority: data.link (set by our backend) > fcmOptions.link > notification.click_action
        const link = payload?.data?.link || 
                     payload?.fcmOptions?.link || 
                     payload?.notification?.click_action || 
                     null;
        
        console.log('[SW] Click URL extracted:', link);
        
        const options = {
          body: payload?.notification?.body || '',
          icon: payload?.notification?.icon || '/favicon.ico',
          image: payload?.notification?.image || payload?.webpush?.notification?.image || undefined,
          silent: payload?.notification?.silent || false,
          data: { 
            ...(payload?.data || {}), 
            link: link // Ensure link is in data for click handler
          },
        };
        
        console.log('[SW] Showing notification with options:', options);
        
        // Notify all clients about the new notification for custom UI display
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'PUSH_NOTIFICATION',
              payload: {
                title: title,
                body: options.body,
                icon: options.icon,
              }
            });
          });
        });
        
        self.registration.showNotification(title, options);
      });
    } catch (e) {
      console.error('[SW] Firebase init error', e);
    }
  })
  .catch((err) => {
    console.error('[SW] Failed to load Firebase config', err);
  });
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
  
  // Open the URL in a new window/tab
  event.waitUntil(
    self.clients.openWindow(targetUrl)
  );
});

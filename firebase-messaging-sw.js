// Firebase Messaging Service Worker (Compat v9)
// Uses stable compat CDN and fetches config from API server

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Get API base URL from localStorage (set by SDK)
const getApiBaseUrl = () => {
  // Try to get from clients first (more reliable)
  return self.clients.matchAll().then((clients) => {
    if (clients.length > 0) {
      return new Promise((resolve) => {
        const handler = (event) => {
          if (event.data && event.data.type === 'selfpush_api_base_url') {
            self.removeEventListener('message', handler);
            resolve(event.data.url);
          }
        };
        self.addEventListener('message', handler);
        clients[0].postMessage({ type: 'get_api_base_url' });
        setTimeout(() => {
          self.removeEventListener('message', handler);
          resolve(self.location.origin);
        }, 500);
      });
    }
    return self.location.origin;
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
    .then((res) => res.json())
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

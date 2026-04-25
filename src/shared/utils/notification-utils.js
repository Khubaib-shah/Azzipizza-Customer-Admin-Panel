// BroadcastChannel for cross-tab communication
const notificationChannel = new BroadcastChannel('azzi_notifications');

let notificationAudio = null;

export const initNotificationAudio = (soundUrl) => {
  if (!notificationAudio) {
    notificationAudio = new Audio(soundUrl);
  }
  return notificationAudio;
};

export const playNotificationSound = async () => {
  if (!notificationAudio) return;

  // Coordination Logic: Use a simple lock mechanism with timestamps in localStorage
  // Or just use the BroadcastChannel to see if another tab is already handling it.
  const now = Date.now();
  const lastAlert = localStorage.getItem('last_notification_time');
  
  // If an alert was played in the last 2 seconds in another tab, skip this one
  if (lastAlert && (now - parseInt(lastAlert)) < 2000) {
    console.log("[Notification]: Sound suppressed (played recently in another tab)");
    return;
  }

  try {
    localStorage.setItem('last_notification_time', now.toString());
    notificationAudio.currentTime = 0;
    await notificationAudio.play();
  } catch (err) {
    console.error("[Notification]: Audio playback failed", err);
  }
};

export const showCoordinatedToast = (message, toastFn) => {
  const now = Date.now();
  const lastToast = localStorage.getItem('last_toast_time');

  // If a toast was shown in the last 2 seconds in another tab, skip this one
  if (lastToast && (now - parseInt(lastToast)) < 2000) {
    console.log("[Notification]: Toast suppressed (shown recently in another tab)");
    return;
  }

  localStorage.setItem('last_toast_time', now.toString());
  toastFn(message);
};

export const subscribeToNotifications = (callback) => {
  const handler = (event) => {
    if (event.data.type === 'NEW_NOTIFICATION') {
      callback(event.data.payload);
    }
  };
  notificationChannel.addEventListener('message', handler);
  return () => notificationChannel.removeEventListener('message', handler);
};

export const broadcastNotification = (payload) => {
  notificationChannel.postMessage({ type: 'NEW_NOTIFICATION', payload });
};

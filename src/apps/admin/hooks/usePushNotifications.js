import { useEffect, useState, useCallback } from "react";
import { requestForToken, onMessageListener } from "@shared/config/firebase";
import { toast } from "react-toastify";
import { apiClient } from "@shared/services/api-client";
import { playNotificationSound, broadcastNotification, showCoordinatedToast } from "@shared/utils/notification-utils";

export const usePushNotifications = () => {
  const [token, setToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);

  const syncTokenWithBackend = useCallback(async (fcmToken) => {
    try {
      await apiClient.post("/api/admin/device", { fcmToken });
      console.log("[PushNotifications]: Token synced with backend");
    } catch (err) {
      console.error("[PushNotifications]: Failed to sync token", err);
    }
  }, []);

  const initNotifications = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);

    if (permission === "granted") {
      const fcmToken = await requestForToken();
      if (fcmToken) {
        setToken(fcmToken);
        await syncTokenWithBackend(fcmToken);
      }
    }
  }, [syncTokenWithBackend]);

  useEffect(() => {
    // Listener for foreground FCM messages
    onMessageListener()
      .then((payload) => {
        console.log("[PushNotifications]: Foreground message received", payload);
        
        // Show toast and play sound (coordinated)
        showCoordinatedToast(payload.notification.title || "New Order Received!", toast.info);
        playNotificationSound();
        
        // Broadcast to other tabs so they don't play sound but might update UI
        broadcastNotification(payload);
      })
      .catch((err) => console.log("Failed to receive foreground message: ", err));
  }, []);

  return {
    token,
    permissionStatus,
    initNotifications,
  };
};

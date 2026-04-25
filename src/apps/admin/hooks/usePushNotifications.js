import { useEffect, useState, useCallback } from "react";
import { requestForToken, onMessageListener } from "@shared/config/firebase";
import { toast } from "react-toastify";
import apiClient from "@shared/services/api-client";
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

  const testPush = useCallback(async () => {
    try {
      const response = await apiClient.post("/api/admin/test-push");
      toast.success(`Test push sent to ${response.data.deviceCount} devices!`);
    } catch (err) {
      console.error("[PushNotifications]: Test failed", err);
      toast.error(err.message || "Failed to send test push");
    }
  }, []);

  const getDeviceCount = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/admin/device/count");
      return response.data.count;
    } catch (err) {
      console.error("[PushNotifications]: Failed to get count", err);
      return 0;
    }
  }, []);

  return {
    token,
    permissionStatus,
    initNotifications,
    testPush,
    getDeviceCount
  };
};

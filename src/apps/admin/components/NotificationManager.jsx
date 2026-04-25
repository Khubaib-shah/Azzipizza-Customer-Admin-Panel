import { useEffect } from "react";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { initNotificationAudio } from "@shared/utils/notification-utils";
import NotificationSound from "/notification-sound.wav";

const NotificationManager = () => {
  const { initNotifications } = usePushNotifications();

  useEffect(() => {
    // Initialize audio
    const audio = initNotificationAudio(NotificationSound);
    
    // Prime audio on first interaction
    const primeAudio = () => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("[Audio]: Primed successfully");
      }).catch(() => {
        console.log("[Audio]: Waiting for interaction to prime");
      });
      window.removeEventListener("click", primeAudio);
    };
    window.addEventListener("click", primeAudio);

    // Initialize Push Notifications
    initNotifications();

    return () => window.removeEventListener("click", primeAudio);
  }, [initNotifications]);

  return null; // This component doesn't render anything
};

export default NotificationManager;

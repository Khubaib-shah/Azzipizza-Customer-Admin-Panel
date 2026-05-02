import { useEffect } from "react";
import { initNotificationAudio } from "@shared/utils/notification-utils";
import NotificationSound from "/notification-sound.wav";

const AudioManager = () => {
  useEffect(() => {
    const audio = initNotificationAudio(NotificationSound);

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

    return () => window.removeEventListener("click", primeAudio);
  }, []);

  return null; // This component doesn't render anything
};

export default AudioManager;

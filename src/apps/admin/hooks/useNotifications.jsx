import { createContext, useState, useContext } from "react";

const NotificationsContext = createContext({
  notifications: [],
  setNotifications: () => {},
});

// Provider Component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const value = React.useMemo(() => ({ notifications, setNotifications }), [notifications]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook for using notifications
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

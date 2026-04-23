import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";

// Shared components/providers can go here
import LoadingSpinner from "@shared/components/ui/LoadingSpinner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);

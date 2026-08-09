// This file defines the URL structure of the entire app
// createBrowserRouter() uses the HTML5 History API (no hash in URLs)
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingPage } from "./OnboardingPage";
import { UploadPage } from "./UploadPage";
import { RoadmapsListPage } from "./RoadmapsListPage";
import { RoadmapPage } from "./RoadmapPage";
import { ProgressPage } from "./ProgressPage";
import { SettingsPage } from "./SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,   // AppShell wraps all pages with the sidebar
    children: [
      { index: true, element: <OnboardingPage /> },          // "/"
      { path: "upload/:goalId", element: <UploadPage /> },   // "/upload/42"
      { path: "roadmaps", element: <RoadmapsListPage /> },   // "/roadmaps"
      { path: "roadmap/:roadmapId", element: <RoadmapPage /> }, // "/roadmap/7"
      { path: "progress", element: <ProgressPage /> },       // "/progress"
      { path: "settings", element: <SettingsPage /> },       // "/settings"
    ],
  },
]);

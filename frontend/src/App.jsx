import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import VolunteerProfilePage from "./pages/VolunteerProfilePage";
import MyEventsPage from "./pages/MyEventsPage";
import EventSignupsPage from "./pages/EventSignupsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute role="ORGANISER">
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute role="ORGANISER">
              <EditEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/signups"
          element={
            <ProtectedRoute role="ORGANISER">
              <EventSignupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute role="VOLUNTEER">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/profile"
          element={
            <ProtectedRoute role="VOLUNTEER">
              <VolunteerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/my-events"
          element={
            <ProtectedRoute role="VOLUNTEER">
              <MyEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organiser"
          element={
            <ProtectedRoute role="ORGANISER">
              <OrganiserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

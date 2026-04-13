import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Clients } from '@/pages/Clients'
import { ClientDetail } from '@/pages/ClientDetail'
import { Events } from '@/pages/Events'
import { NewEvent } from '@/pages/NewEvent'
import { EventDetail } from '@/pages/EventDetail'
import { QuoteBuilder } from '@/pages/QuoteBuilder'
import { Staff } from '@/pages/Staff'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/new" element={<NewEvent />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/quote" element={<QuoteBuilder />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

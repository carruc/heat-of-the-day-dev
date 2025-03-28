import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App'
import Auth from './components/Auth'
import AuthSuccess from './components/AuthSuccess'
import Record from './components/Record.tsx'
import RecordList from './components/RecordList'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <RecordList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Auth />,
      },
      {
        path: "/auth-success",
        element: <AuthSuccess />,
      },
      {
        path: "/edit/:id",
        element: (
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

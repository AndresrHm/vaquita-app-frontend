import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import MainLayout from '@/layouts/MainLayout'
import AccountPage from '@/pages/AccountPage.tsx'
import ActivityPage from '@/pages/ActivityPage.tsx'
import FriendsPage from '@/pages/FriendsPage.tsx'
import GroupsPage from '@/pages/GroupsPage.tsx'
import GroupsScanPage from '@/pages/GroupsScanPage.tsx'
import GroupDetailPage from '@/pages/GroupDetailPage.tsx'
import LoginPage from '@/pages/LoginPage.tsx'
import RegisterPage from '@/pages/RegisterPage'
import CreateManualExpensePage from './pages/CreateManualExpensePage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/groups" replace /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'groups/:groupId', element: <GroupDetailPage /> },
      { path: 'groups/scan', element: <GroupsScanPage /> },
      { path: 'groups/expense/create', element: <CreateManualExpensePage /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'account', element: <AccountPage /> },
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
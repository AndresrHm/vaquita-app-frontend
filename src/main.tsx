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
import GroupSettingsPage from '@/pages/GroupSettingsPage.tsx'
import CreateGroupPage from '@/pages/CreateGroupPage.tsx'
import LoginPage from '@/pages/LoginPage.tsx'
import RegisterPage from '@/pages/RegisterPage'
import CreateManualExpensePage from './pages/CreateManualExpensePage'
import UserExpensesPage from '@/pages/UserExpensesPage'
import UserProfilePage from '@/pages/UserProfilePage'
import ToastProvider from '@/customHooks/ToastProvider'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/groups" replace /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'groups/new', element: <CreateGroupPage /> },
      { path: 'groups/:groupId', element: <GroupDetailPage /> },
      { path: 'groups/:groupId/settings', element: <GroupSettingsPage /> },
      { path: 'groups/:groupId/expense/create', element: <CreateManualExpensePage /> },
      { path: 'groups/expense/create', element: <CreateManualExpensePage /> },
      { path: 'groups/scan', element: <GroupsScanPage /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'friends/:userId', element: <UserProfilePage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'account/expenses', element: <UserExpensesPage /> },
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>,
)
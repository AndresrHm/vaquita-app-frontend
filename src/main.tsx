/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { BannerOffline } from '@/components/common/BannerOffline'
import './index.css'

import MainLayout from '@/layouts/MainLayout'
import AccountPage from '@/pages/AccountPage.tsx'
import ActivityPage from '@/pages/ActivityPage.tsx'
import FriendsPage from '@/pages/FriendsPage.tsx'
import GroupsPage from '@/pages/GroupsPage.tsx'
import GroupsScanPage from '@/pages/SmartScanPage'
import GroupDetailPage from '@/pages/GroupDetailPage.tsx'
import JoinGroupPage from '@/pages/JoinGroupPage.tsx'
import GroupSettingsPage from '@/pages/GroupSettingsPage.tsx'
import CreateGroupPage from '@/pages/CreateGroupPage.tsx'
import LoginPage from '@/pages/LoginPage.tsx'
import RegisterPage from '@/pages/RegisterPage'
import CreateManualExpensePage from './pages/CreateManualExpensePage'
import UserExpensesPage from '@/pages/UserExpensesPage'
import GroupBalancesPage from './pages/GroupBalancesPage'
import UserProfilePage from '@/pages/UserProfilePage'
import SettingsAccountPage from '@/pages/SettingsAccountPage'
import ToastProvider from '@/customHooks/ToastProvider'
import ChangePasswordPage from './pages/ChangePasswordPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import NotFoundPage from '@/pages/NotFoundPage.tsx'
import { SessionTimeoutProvider } from './customHooks/sessionTimeoutProvider'


const theme = localStorage.getItem('theme') ?? 'light'

document.documentElement.classList.toggle('dark', theme === 'dark')

const router = createBrowserRouter([
  {
    element: (
      <SessionTimeoutProvider>
        <Outlet />
      </SessionTimeoutProvider>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/groups" replace /> },
          { path: 'groups', element: <GroupsPage /> },
          { path: 'groups/new', element: <CreateGroupPage /> },
          { path: 'groups/join/:inviteToken', element: <JoinGroupPage /> },
          { path: 'groups/:groupId', element: <GroupDetailPage /> },
          { path: 'groups/:groupId/settings', element: <GroupSettingsPage /> },
          { path: 'groups/:groupId/balances', element: <GroupBalancesPage /> },
          { path: 'groups/:groupId/expense/create', element: <CreateManualExpensePage /> },
          { path: 'groups/expense/create', element: <CreateManualExpensePage /> },
          { path: 'groups/scan', element: <GroupsScanPage /> },
          { path: 'friends', element: <FriendsPage /> },
          { path: 'friends/:userId', element: <UserProfilePage /> },
          { path: 'activity', element: <ActivityPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'account/expenses', element: <UserExpensesPage /> },
          { path: 'account/settings', element: <SettingsAccountPage />},
          { path: 'account/password', element: <ChangePasswordPage /> }
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
])

const rootElement = document.getElementById('root')!
const splashElement = document.getElementById('splash-screen')

const root = ReactDOM.createRoot(rootElement)

setTimeout(() => {
  if (splashElement) {
    splashElement.classList.add('fade-out')
  }
}, 1500)

setTimeout(() => {
  root.render(
    <React.StrictMode>
      <ToastProvider>
        <BannerOffline/>
        <RouterProvider router={router} />
      </ToastProvider>
    </React.StrictMode>
  )
}, 2000)
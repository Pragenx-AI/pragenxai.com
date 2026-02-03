import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Today from './pages/Today'
import Bills from './pages/Bills'
import Meetings from './pages/Meetings'
import Travel from './pages/Travel'
import Health from './pages/Health'
import Records from './pages/Records'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Login from './pages/Login'

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useApp()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

function App() {
    return (
        <AppProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <AuthGuard>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/chat" element={<Chat />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/today" element={<Today />} />
                                    <Route path="/bills" element={<Bills />} />
                                    <Route path="/meetings" element={<Meetings />} />
                                    <Route path="/travel" element={<Travel />} />
                                    <Route path="/health" element={<Health />} />
                                    <Route path="/records" element={<Records />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </MainLayout>
                        </AuthGuard>
                    }
                />
            </Routes>
        </AppProvider>
    )
}

export default App

import React from 'react'
import { 
    Routes, 
    Route, 
    Navigate, 
    Outlet, 
    useLocation 
} from 'react-router-dom'

import { Layout } from './layout'
import * as Page from './pages'
import { useAuth } from './auth'

const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/login',
    children
}) => {
    const location = useLocation()

    if (!isAllowed) {
        return <Navigate to={redirectPath} replace state={{ from: location }} />
    }

    return children ? children : <Outlet /> 
}

const App = () => {

    const auth = useAuth()
    const is_admin = auth.hasRole('admin')
    const is_manager = auth.hasRole('manager')
    const is_member = auth.hasRole('member') 

    return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Page.Dashboard />} />
            <Route path="pmcu" element={<Page.PMCUPower />} />
            <Route path="contacts" element={<Page.Contacts/>} />
            <Route path="login" element={<Page.Auth.Login />} />
            <Route path="logout" element={<Page.Auth.Logout />} />
            <Route element={<ProtectedRoute isAllowed={is_member || is_manager || is_admin} />}>
              <Route path="admin" element={<Page.Admin.Home />} /> 
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    )
}

export { App } 

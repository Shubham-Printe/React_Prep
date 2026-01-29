import React, { useState, lazy, Suspense } from 'react';
import { wait } from '../helpers/WaitHelper';
// import { AdminData } from './AdminData';

const moduleLoadedAt = new Date().toLocaleTimeString()

// this is a lazy loaded named component.
// this is different from the lazy loaded default component.
const AdminData = lazy(() => wait(1000).then(() => import('./AdminData').then(module => ({default: module.AdminData}))))

const AdminDashboardPanel = () => {

    const [isAdminMode, setIsAdminMode] = useState(false);
    
    return (
        <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontWeight: 600 }}>Analytics Overview</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Module loaded at: {moduleLoadedAt}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>

                <button
                    onClick={async () => {

                        if(isAdminMode){
                            setIsAdminMode(false);
                        }else{
                            setIsAdminMode(true);
                        }
                    }}
                >
                Toggle Admin Mode
                </button>
                <br/>
                <br/>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
                <Suspense fallback={<div>Loading Admin Data...</div>}>
                    {isAdminMode ? <AdminData/> : 'User Mode'}
                </Suspense>
            </div>
        </div>
    )
}

export default AdminDashboardPanel
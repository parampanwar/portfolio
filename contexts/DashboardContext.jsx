import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
const DashboardContext = React.createContext()
const DashboardProvider = ({ children }) => {
    const router = useRouter()
    return (
        <DashboardContext.Provider value={{}}>
            {children}
        </DashboardContext.Provider>
    )
}
export const useGlobalDashboardContext = () => {
    return useContext(DashboardContext)
  }
  
  export { DashboardContext, DashboardProvider }
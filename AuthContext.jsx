import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

const AuthContext = React.createContext()
const AuthProvider = ({children}) => {
    const router = useRouter()
    function isPublic(pathname){
        return (
            pathname === '/' || 
            pathname === '/projects' ||
            pathname === 'contact' ||
            pathname === '/dashboard'
        )
    }
    return (
        <AuthContext.Provider 
        value=
            {{
                isPublic,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export const useGlobalAuthContext = () => {
    return useContext(AuthContext)
  }
  
  export { AuthContext, AuthProvider };
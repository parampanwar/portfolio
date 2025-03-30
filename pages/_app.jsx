import Link from 'next/link';
import "../styles/global.css";
import { useState } from 'react';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { DashboardProvider } from '../contexts/DashboardContext';
import { AuthProvider } from '../AuthContext'
import { Analytics } from "@vercel/analytics/react"
function MyApp({ Component, pageProps }) {
    //states
    const [title, setTitle] = useState('Param Panwar')
    const [showHeader, setShowHeader] = useState(true)
    const [showFooter, setShowFooter] = useState(false)

    //routers
    const router = useRouter()
    return (
        <div id="appId">
            <Head>
                <title>Param Panwar</title>
                <meta name="description" content="Portfolio of Param Panwar, a web developer." />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />            
                </Head>
            <AuthProvider>
                <DashboardProvider>
                <Analytics />
                    <Component {...pageProps} />
                </DashboardProvider>
            </AuthProvider>
        </div>
    )
}
export default MyApp;
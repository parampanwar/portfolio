import Link from 'next/link'
import React from 'react'

const MainScreenWrapper = ({
    children,
    screenHeader = 'Header',

}) => {

    return (
        <div className={`justify-start relative w-full flex h-full items-start flex-col min-h-screen gap-1 text-black`} >
            
               {/* {headerItem} */}
               <div className="w-full h-full pt-1">
                {children}
               </div>
        </div>
    )
}
export default MainScreenWrapper
import React from 'react'
import {getUser, logoutUser, storeUserData} from "~/appwrite/auth";
import {useNavigate} from "react-router";
// Registering Syncfusion<sup style="font-size:70%">&reg;</sup> license key
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENCE_KEY);
export const clientLoader = async () => {
    const authUser = await getUser()
    console.log(authUser)
}

const PageLayout = () => {

    const navigate = useNavigate()
    const handleLogout = async () => {
        await logoutUser()
        navigate('/sign-in')
    }
    return (
        <div>
            <button onClick={handleLogout} className="cursor-pointer">
                <img src="/assets/icons/logout.svg"
                     alt="logout"
                     className="size-6"
                />
            </button>
            <button onClick={() => navigate('/dashboard')}>
                Dashboard
            </button>
        </div>
    )
}
export default PageLayout

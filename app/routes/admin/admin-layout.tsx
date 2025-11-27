import {Outlet, redirect} from 'react-router'
import {MobileSidebar, NavItems} from "../../../components";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import {getUser} from "~/appwrite/auth";

export async function clientLoader() {
    try{
        const authUser = await getUser()

        //if (existingUser?.$id) {
        //    const userFromRowId = await getUserFromRowId(existingUser.$id)
        //    console.log(userFromRowId)
        //}
        console.log(authUser)
        if (authUser?.status === 'user') return redirect('/')
        return authUser
    } catch (e) {
        console.log('Error in clientLoader', e)
        return redirect('/sign-in')
    }
}

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems />
                </SidebarComponent>
            </aside>
            <aside className="children"> <Outlet /> </aside>
        </div>
    )
}
export default AdminLayout

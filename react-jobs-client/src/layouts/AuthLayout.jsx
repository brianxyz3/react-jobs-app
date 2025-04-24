import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CopyrightFooter from "../components/CopyrightFooter"

const AuthLayout = () => {
    return (
        <>
            <NavBar />
            <main className="min-h-[calc(100dvh-5dvh)] flex flex-col justify-center">
                <Outlet />
            </main>
            <CopyrightFooter />
            <ToastContainer />
        </>
    )
}

export default AuthLayout;
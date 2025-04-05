import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CopyrightFooter from "../components/CopyrightFooter"

const AuthLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <CopyrightFooter />
            <ToastContainer />
        </>
    )
}

export default AuthLayout;
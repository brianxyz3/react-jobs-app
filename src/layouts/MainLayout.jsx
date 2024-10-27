import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
            <ToastContainer />
        </>
    )
}

export default MainLayout;
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";

const MainLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const toggleSideBar = () => {
        window.document.body.classList.toggle("disableScroll");
        setShowSideBar(prevState => !prevState)
    };

    return (
        <section className="flex">
            <SideBar showSideBar={showSideBar} toggleSideBar={toggleSideBar} />
            <main className="w-svw overflow-x-hidden">
                <NavBar />
            <section className="min-h-[calc(100dvh-5dvh)] flex flex-col">
                <Outlet />
            </section>
            <Footer />
            <ToastContainer />
            </main>
        </section>
    )
}

export default MainLayout;
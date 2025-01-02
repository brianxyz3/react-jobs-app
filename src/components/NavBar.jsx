import { NavLink } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import ConfirmPopup from "./ConfirmPopup";
import { doLogOut } from "../../controllers/auth";
import { useAuth } from "../firebaseContext/authContext";

const NavBar = () => {
    const [showLogOutPopup, setShowLogOutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const { currentUser } = useAuth();
    // const navigate = useNavigate();



    const toggleLogOutPopup = () => { setShowLogOutPopup(prevState => !prevState) };
    const toggleDeletePopup = () => { setShowDeletePopup(prevState => !prevState) };



    const logOut = async () => {
        doLogOut();
        await cookieStore.delete("userId");
        toggleLogOutPopup();
        toast.success("Logout Successful, Goodbye");
    }

    const deleteUser = async () => {
        console.log("in delete func");

        toggleDeletePopup();
    }

    const cancel = () => {
        if (showLogOutPopup) {
            setShowLogOutPopup(false);
            toast.error("Cancelled Logout");
        }
        if (showDeletePopup) {
            setShowDeletePopup(false);

            toast.error("Cancelled User Profile Delete");
        }
    }
    const checkActive = ({ isActive }) => {
        if (isActive) {
            return "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";
        } else {
            return "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";
        };
    };



    return (
        <nav className="bg-indigo-700 border-b border-indigo-500">
            {showLogOutPopup && <ConfirmPopup onConfirm={logOut} onCancel={cancel} text="Logout" />}
            {showDeletePopup && <ConfirmPopup onConfirm={deleteUser} onCancel={cancel} text="Delete User Profile" />}

            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div
                        className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
                    >
                        {/*  Logo  */}
                        <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                            <img
                                className="h-10 w-auto"
                                src={logo}
                                alt="React Jobs"
                            />
                            <span className="hidden md:block text-white text-2xl font-bold ml-2"
                            >React Jobs</span>
                        </NavLink>
                        {/* Nav Link Items */}
                        <div className="md:ml-auto">
                            <div className="flex space-x-2">
                                <NavLink
                                    to="/"
                                    className={checkActive}
                                >Home</NavLink>
                                <NavLink
                                    to="/jobs"
                                    className={checkActive}
                                >Jobs</NavLink>
                                {currentUser ?
                                    <><NavLink
                                    to="/add-job"
                                    className={checkActive}
                                    >Add Job</NavLink>
                                        <NavLink
                                            className={`text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 ${showLogOutPopup && "bg-red-900"}`}
                                            onClick={toggleLogOutPopup}>
                                            Logout
                                        </NavLink>
                                        <NavLink
                                            className={`text-white hover:bg-red-700 hover:text-white rounded-md px-3 py-2 ${showDeletePopup && "bg-red-900"}`}
                                            onClick={toggleDeletePopup}
                                        >
                                            Delete User
                                        </NavLink>
                                    </> : <>
                                        <NavLink to="/register" className={checkActive}>Sign Up</NavLink>
                                        <NavLink to="/login" className={checkActive}>Login</NavLink>
                                    </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
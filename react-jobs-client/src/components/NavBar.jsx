import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import ConfirmPopup from "./ConfirmPopup";
import { doLogOut } from "../../controllers/auth";
import { useAuth } from "../firebaseContext/authContext";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebase.config";
import { apiDeleteUser } from "../../controllers/user";
import AuthPopUp from "./AuthPopUp";
import { DeleteForever } from "@mui/icons-material";
import { setCookie } from "../../controllers/auth";

// import { AuthCredential } from "firebase/auth";

const NavBar = () => {
    const [showLogOutPopup, setShowLogOutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

    const navigate = useNavigate();
    const user = auth.currentUser;
    const { currentUser } = useAuth();



    const toggleLogOutPopup = () => { setShowLogOutPopup(prevState => !prevState) };
    const toggleDeletePopup = () => { setShowDeletePopup(prevState => !prevState) };


    const logOut = () => {
        doLogOut();
        setCookie("userId", "", -100);
        toggleLogOutPopup();
        toast.success("Logout Successful, Goodbye");
        navigate("/")
    }

    const doDeleteUser = async (data) => {
        try {
            if (!isDeletingUser) {
                setIsDeletingUser(true);
                const userId = user.uid;
                const userInput = { ...data };
                const credential = EmailAuthProvider.credential(
                    user.email,
                    userInput.password,
                );
                await reauthenticateWithCredential(user, credential);
                await deleteUser(user);
                await apiDeleteUser({ userId });
                setCookie("userId", "", -100);
                toast.success("User Profile Deleted Successfully");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            };
        } catch (err) {
            setIsDeletingUser(false);
            toast.error(err.message + ". Something Went wrong, Try Again");
            console.log(err);
        };
        toggleDeletePopup();
    }

    const cancel = () => {
        if (showLogOutPopup) {
            toggleLogOutPopup();
            toast.error("Cancelled Logout");
        }
        if (showDeletePopup) {
            toggleDeletePopup();
            toast.error("Cancelled User Profile Delete");
        };
    };

    const checkActive = ({ isActive }) => {
        if (isActive) {
            return "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-2 py-2 sm:px-3";
        } else {
            return "duration-300 text-white hover:bg-gray-900 hover:text-white rounded-md px-2 py-2 sm:px-3";
        };
    };



    return (
        <nav className="bg-indigo-700 border-b border-indigo-500 text-nowrap">
            {showLogOutPopup && <ConfirmPopup onConfirm={logOut} onCancel={cancel} text="Logout" />}
            {showDeletePopup && <AuthPopUp onConfirm={doDeleteUser} onCancel={cancel} text="Are You Sure You Want To Delete User?" password={true} />}

            <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div
                        className="flex flex-1 items-center justify-evenly md:items-stretch md:justify-start"
                    >
                        {/*  Logo  */}
                        <NavLink className="flex flex-shrink-0 items-center sm:mr-4 mr-1" to="/">
                            <img
                                className="h-8 sm:h-10 w-auto"
                                src={logo}
                                alt="React Jobs"
                            />
                            <span className="hidden md:block text-white text-2xl font-bold ml-2"
                            >React Jobs</span>
                        </NavLink>
                        {/* Nav Link Items */}
                        <div className="md:ml-auto text-sm sm:text-base">
                            <div className="flex sm:gap-2 sm:space-x-2 space-x-0">
                                <NavLink
                                    to="/"
                                    className={checkActive}
                                >Home</NavLink>
                                <NavLink
                                    to="/jobs"
                                    className={checkActive}
                                >Jobs</NavLink>
                                {currentUser &&
                                    <><NavLink
                                    to="/add-job"
                                    className={checkActive}
                                    >Add Job</NavLink>

                                        <NavLink
                                            className={`duration-300 text-white group hover:bg-red-700 hover:text-white rounded-md px-3 py-2 flex items-center ${showDeletePopup && "bg-red-900"}`}
                                            onClick={toggleDeletePopup}
                                        >
                                        User<DeleteForever sx={{ fontSize: 16 }} className="text-red-600 group-hover:text-yellow-400" />
                                    </NavLink>
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
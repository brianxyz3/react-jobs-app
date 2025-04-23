import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { logInWithEmailAndPassword, logInWithGoogle, resetPassword } from "../../controllers/auth";
// import { useAuth } from "../firebaseContext/authContext";
import { apiLoginUser } from "../../controllers/user";
import AuthPopUp from "../components/AuthPopUp";
import { deleteUser } from "firebase/auth";
import { auth } from "../../firebase.config";
import { setCookie } from "../../controllers/auth";

const LoginPage = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const navigate = useNavigate();

        

    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showResetPopup, setShowResetPopUp] = useState(false);

    const day = 24 * 60 * 60 * 1000;
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEvtDefault = (evt) => {
        evt.preventDefault();
    };


    const handleLogin = async (data, evt) => {
        try {
            if (!isLoggingIn) {
                setIsLoggingIn(true);
                const currentUser = await logInWithEmailAndPassword(data.email, data.password);
                const userId = currentUser.user.uid;
                setCookie("userId", userId, day);
                toast.success("Welcome Back");
                setTimeout(() => {
                    navigate("/jobs");
                }, 2000);
            }
        } catch (err) {
            const errorMsg = err.message.replace(/Firebase: /i, "")
            toast.error(errorMsg + "Check Your Internet Connection");
            navigate("/login");
        } finally {
            setIsLoggingIn(false);
        }
    }



    const handleGoogleLogIn = async () => {
        if (!isLoggingIn) {
            try {
            setIsLoggingIn(true);
                const currentUser = await logInWithGoogle();
                const userId = currentUser.user.uid;
                const googleData = currentUser.user.providerData[0]
                const userNames = googleData.displayName.split(" ");
                const userData = { email: googleData.email, firstName: userNames[0], lastName: userNames[1], userId };
                const res = await apiLoginUser(userData);
                
                if(res === null) {
                    toast.success("Welcome Back");
                    setCookie("userId", userId, day);
                    setTimeout(() => {
                        navigate("/jobs");
                    }, 2000);
                } else {
                    console.log(auth.currentUser);
                    await deleteUser(auth.currentUser);
                    toast.error("UnKnown User");
                }
            } catch (err) {
                const errorMsg = err.message.replace(/Firebase: /i, "")
                toast.error(errorMsg + "Check Your Internet Connection");
            } finally {
                setIsLoggingIn(false);
            }
        };
    };

    const handleResetPassword = (data) => {
        const formData = { ...data };
        const userEmail = formData.email;
        resetPassword(userEmail);
    }

    const cancel = (evt) => {
        evt.preventDefault();
        toggleResetPopUp();
        toast.error("Cancelled Password Reset");
    };

    const toggleResetPopUp = () => {
        setShowResetPopUp(prevState => !prevState);
    };

    return (
        <section>
            {showResetPopup && < AuthPopUp onConfirm={handleResetPassword} onCancel={cancel} text="Enter Your Email Address" email={true} />}
            <div className="flex justify-center md:justify-end border rounded-lg m-7">
                <div className="w-10/12 md:w-6/12 lg:w-5/12 p-3 md:p-10 lg:p-12">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="mb-9">
                            <img className="h-12 w-auto mb-4"
                                src={logo} alt="react logo" />
                            <h3 className="font-bold text-2xl text-slate-900 mb-2">Login in to your account</h3>
                            <p className="text-slate-6s00">Not a member? <Link className="md:mt-2 text-indigo-400 hover:text-indigo-500" to="/register">Sign Up</Link></p>
                        </div>
                        <div className="flex flex-col gap-8">
                            <TextField fullWidth error={Boolean(errors.email)} size="small" label="Email" variant="outlined" autoComplete="email" {...register("email", { required: true })} />

                            <FormControl fullWidth variant="outlined" size='small'>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    error={Boolean(errors.password)}
                                    {...register("password", { required: true })}
                                    id="password"
                                    autoComplete="current-password"
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? "hide the password" : "display the password"
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleEvtDefault}
                                                onMouseUp={handleEvtDefault}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>






                        </div>
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline mt-5"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="flex justify-between items-center mt-5">
                        <div>
                            <FormControlLabel control={<Checkbox />} className="hover:text-gray-600" label="Remember me" />
                        </div>
                        <button
                            onClick={toggleResetPopUp}
                            className="text-indigo-400 hover:text-indigo-500" >Forgot Password?</button>
                    </div>

                    <div className="mt-10 border-t font-mono">
                        <button className=" mt-3 flex items-center justify-center w-full hover:text-gray-600"
                            onClick={handleGoogleLogIn}>
                            <div className="mr-3">Sign In Using:-</div>
                            <div className="flex items-end">
                                <Google className="text-red-500" fontSize="large" />
                                <span className="text-2xl text-yellow-500">oo<span className="text-green-600 font-bold">gl<span className="text-blue-500">e</span></span></span>
                            </div>
                        </button>
                    </div>

                </div>
                <div className="bg-login-img bg-center bg-cover rounded-r-lg md:w-6/12"></div>
            </div>
        </section>
    )
}

export default LoginPage;
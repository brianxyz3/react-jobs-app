import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { logInWithEmailAndPassword, logInWithGoogle } from "../../controllers/auth";
// import { useAuth } from "../firebaseContext/authContext";

const LoginPage = ({ loginUser }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const navigate = useNavigate();



    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const day = 24 * 60 * 60 * 1000;
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEvtDefault = (evt) => {
        evt.preventDefault();
    };

    const createUserCookie = (userId) => {
        cookieStore.set({
            name: "userId",
            value: userId,
            expires: Date.now() + day,
        });
    }

    const handleLogin = async (data) => {
        try {
            if (!isLoggingIn) {
                setIsLoggingIn(true);
                const currentUser = await logInWithEmailAndPassword(data.email, data.password);
                const currentUserId = currentUser.user.uid;
                createUserCookie(currentUserId);
                toast.success("Welcome Back");
                setTimeout(() => {
                    navigate("/jobs");
                }, 2000);
            }
        } catch (err) {
            setIsLoggingIn(false);
            const errorMsg = err.message.replace(/Firebase: /i, "")
            toast.error(errorMsg + "Check Your Internet Connection");
            navigate("/login");
        }
    }



    const handleGoogleLogIn = async () => {
        if (!isLoggingIn) {
            try {
            setIsLoggingIn(true);
                const currentUser = await logInWithGoogle();
                const userId = currentUser.user.uid;
                const googleData = currentUser.user.providerData[0]
                const arr = googleData.displayName.split(" ");
                const userData = { email: googleData.email, firstName: arr[0], lastName: arr[1], userId };
                await loginUser(userData);
                createUserCookie(userId);
                setTimeout(() => {
                    navigate("/jobs");
                }, 2000);
            } catch (err) {
                setIsLoggingIn(false);
                const errorMsg = err.message.replace(/Firebase: /i, "")
                toast.error(errorMsg + "Check Your Internet Connection");
            };
        };
    };

    return (
        <section>
            <div className="flex justify-center md:justify-end border rounded-lg m-7">
                <div className="w-10/12 md:w-5/12 p-12">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="mb-9">
                            <img className="h-12 w-auto mb-4"
                                src={logo} alt="react logo" />
                            <h3 className="font-bold text-2xl text-slate-900 mb-2">Sign in to your account</h3>
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





                            <div className="flex justify-between items-center mb-5">
                                <div>
                                    <FormControlLabel control={<Checkbox />} label="Remember me" />
                                </div>
                                <a className="text-indigo-400 hover:text-indigo-500" href="">Forgot Password?</a>
                            </div>
                        </div>
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </form>


                    <div className="mt-10 border-t font-mono">
                        <button className=" mt-3 flex items-center justify-center w-full"
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
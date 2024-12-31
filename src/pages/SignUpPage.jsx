import { useState } from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../firebase.config";
// import { collection, addDoc } from "firebase/firestore";
import { signUpWithEmailAndPassword } from "../../controllers/auth";
import { useAuth } from "../firebaseContext/authContext";

const SignUpPage = ({ registerUser }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const { userLoggedIn } = useAuth();

    const day = 24 * 60 * 60 * 1000;


    const errorStyle = { color: "red" }

    const validateForm = {
        firstName: {
            required: "First Name is Required"
        },
        lastName: {
            required: "Last Name is Required"
        },
        email: {
            required: "Email is Required"
        },
        password: {
            required: "Password is Required"
        },
        confirmPassword: {
            required: "Confirm Password is Required"
        },
        matchPassword: {
            required: "Password Must Match Confirm Password"
        },
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEvtDefault = (evt) => {
        evt.preventDefault();
    };

    const handleRegister = async (data) => {
        try {
            const { email, password, confirmPassword } = data;
            if (!isSigningUp && password === confirmPassword) {
                setIsSigningUp(true);
                const newUser = await signUpWithEmailAndPassword(email, password);
                const newUserId = newUser.user.uid
                await registerUser({ ...data, userId: newUserId });
                cookieStore.set({
                    name: "userId",
                    value: newUserId,
                    expires: Date.now() + day,
                });                // if (newUser) await addDoc(collection(db, "users"), { userId: newUser.id, userEmail: email });
                setTimeout(() => {
                    navigate("/jobs");
                }, 2500);
                toast.success("User Successfully Registered, Welcome!");
            } else {
                toast.error("Password does not match");
                navigate("/register");
            }
        } catch (err) {
            setIsSigningUp(false);
            const errorMsg = err.toString().replace("FirebaseError: Firebase: ", "")
            toast.error(errorMsg);
            navigate("/register");
        }
    }

    return (
        <section>
            {userLoggedIn && navigate("/")}
            <div className="flex justify-center md:justify-end border rounded-lg m-7">
                <div className="w-10/12 md:w-5/12 p-12">
                    <form onSubmit={handleSubmit(handleRegister)} >
                        <div className="mb-9 ">
                            <img className="h-12 w-auto mb-4"
                                src={logo} alt="react logo" />
                            <h3 className="font-bold text-2xl text-slate-900 mb-2">Sign up to join us</h3>
                            <p className="text-slate-600">Already a member? <Link className="md:mt-2 text-indigo-400 hover:text-indigo-500" to="/login">Login</Link></p>
                        </div>
                        <div className="flex flex-col">
                            <TextField error={Boolean(errors.firstName)} margin="dense" fullWidth size="small" label="First Name" variant="outlined" autoComplete="current-firstName" {...register("firstName", validateForm.firstName)} />
                            {errors.firstName && <span style={errorStyle}>{validateForm.firstName.required}</span>}


                            <TextField error={Boolean(errors.lastName)} margin="dense" fullWidth size="small" label="Last Name" variant="outlined" autoComplete="current-lastName" {...register("lastName", validateForm.lastName)} />
                            {errors.lastName && <span style={errorStyle}>{validateForm.lastName.required}</span>}


                            <TextField error={Boolean(errors.email)} margin="dense" fullWidth size="small" label="Email" type="email" variant="outlined" autoComplete="current-email" {...register("email", validateForm.email)} />
                            {errors.email && <span style={errorStyle}>{validateForm.email.required}</span>}


                            <FormControl margin="dense" fullWidth variant="outlined" size="small">
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    error={Boolean(errors.password)}
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
                                    {...register("password", validateForm.password)}
                                />
                            </FormControl>
                            {errors.password && <span style={errorStyle}>{validateForm.password.required}</span>}


                            <TextField 
                                error={Boolean(errors.confirmPassword)}
                                margin="dense"
                                fullWidth
                                size="small"
                                id="confirmPassword"
                                label="Confirm Password"
                                autoComplete="current-password"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword", validateForm.confirmPassword)}
                            />
                            <div className="mb-5">
                                <FormControlLabel required control={<Checkbox />} label="Terms and Conditions" />
                            </div>
                        </div>
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
                <div className="bg-signup-img bg-center bg-cover rounded-r-lg md:w-6/12"></div>
            </div>
        </section>
    )
}

export default SignUpPage;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { toast } from "react-toastify";

const LoginPage = ({ loginUser }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEvtDefault = (evt) => {
        evt.preventDefault();
    };

    const handleLogin = async (data) => {
        const user = await loginUser(data);
        localStorage.setItem("token", user.token);
        if (user.token) {
            localStorage.setItem("token", user.token);
            navigate("/jobs");
            toast.success("Welcome Back");
        } else {
            toast.error("Incorrect Login Details");
            return navigate("/login");
        }
    }


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
                            <TextField fullWidth error={Boolean(errors.email)} size="small" label="Email" variant="outlined" autoComplete="email" {...register("username", { required: true })} />

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



                            <div className="flex justify-between mb-5">
                                <div>
                                    <FormControlLabel control={<Checkbox />} label="Remember me" />
                                </div>
                                <a className="md:mt-2 text-indigo-400 hover:text-indigo-500" href="">Forgot Password?</a>
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

export default LoginPage;
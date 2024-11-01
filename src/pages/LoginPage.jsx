import { useState } from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import logo from "../assets/images/logo.png";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEvtDefault = (evt) => {
        evt.preventDefault();
    };

    return (
        <section className="">
            <div className="flex justify-center md:justify-end border rounded-lg m-7">
                <div className="w-10/12 md:w-5/12 p-12">
                    <form >
                        <div className="mb-9 ">
                            <img className="h-12 w-auto mb-4"
                                src={logo} alt="react logo" />
                            <h3 className="font-bold text-2xl text-slate-900 mb-2">Signin to your account</h3>
                            <p className="text-slate-6s00">Not a member? <a className="md:mt-2 text-indigo-400 hover:text-indigo-500" href="">Sign Up</a></p>
                        </div>
                        <div className="flex flex-col gap-8">
                            <TextField fullWidth size="small" id="outlined-basic" label="Email" variant="outlined" />

                            <FormControl fullWidth variant="outlined" size='small'>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
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
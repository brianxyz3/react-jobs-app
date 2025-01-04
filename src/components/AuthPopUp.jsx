import { useForm } from "react-hook-form";
import { useState } from "react";
import { TextField } from "@mui/material";
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";



const AuthPopUp = ({ onCancel, onConfirm, text, email = false, password = false }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = (evt) => {
        evt.preventDefault();
        setShowPassword((show) => !show);
    };




    return (
        <section style={{ background: "rgba(0,0,0,0.8)", zIndex: "10" }} className="flex justify-center items-center fixed inset-0">
            <div className="w-[32rem] border rounded-lg mx-auto bg-blue-300">
                <div className="w-11/12 p-10 mx-auto">
                    <h2 className="text-center text-2xl font-bold font-mono">{text}</h2>
                    <form onSubmit={handleSubmit(onConfirm)}>
                        <div className="my-8">
                            {email && <TextField fullWidth error={Boolean(errors.email)} size="small" label="Email" variant="outlined" autoComplete="email" {...register("email", { required: true })} />}

                            {password && <FormControl fullWidth variant="outlined" size='small'>
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
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>}
                        </div>


                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-auto">Continue</button>
                            <button onClick={onCancel}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-auto">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>


        </section>
    )
}

export default AuthPopUp;
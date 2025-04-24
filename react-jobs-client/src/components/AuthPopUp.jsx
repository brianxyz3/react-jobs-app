// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { TextField } from "@mui/material";
// import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";



// const AuthPopUp = ({ onCancel, onConfirm, text, email = false, password = false }) => {
//     const {
//         handleSubmit,
//         register,
//         formState: { errors },
//     } = useForm({ mode: "onChange" });

//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = (evt) => {
//         evt.preventDefault();
//         setShowPassword((show) => !show);
//     };




//     return (
//         <section style={{ background: "rgba(0,0,0,0.8)", zIndex: "10" }} className="flex justify-center items-center fixed inset-0">
//             <div className="w-full sm:w-[32rem] border rounded-lg mx-auto bg-blue-300">
//                 <div className="w-11/12 py-5 sm:py-10 overflow-hidden mx-auto">
//                     <h2 className="text-center text-sm sm:text-xl font-bold font-mono ">{text}</h2>
//                     <form onSubmit={handleSubmit(onConfirm)}>
//                         <div className="my-4 sm:my-8">
//                             {email && <TextField fullWidth error={Boolean(errors.email)} size="small" label="Email" variant="outlined" autoComplete="email" {...register("email", { required: true })} />}

//                             {password && <FormControl fullWidth variant="outlined" size="small">
//                                 <InputLabel htmlFor="password">Enter Password</InputLabel>
//                                 <OutlinedInput
//                                     error={Boolean(errors.password)}
//                                     {...register("password", { required: true })}
//                                     id="password"
//                                     autoComplete="current-password"
//                                     type={showPassword ? "text" : "password"}
//                                     endAdornment={
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 aria-label={
//                                                     showPassword ? "hide the password" : "display the password"
//                                                 }
//                                                 onClick={handleClickShowPassword}
//                                                 edge="end"
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     }
//                                     label="Enter Password"
//                                 />
//                             </FormControl>}
//                         </div>


//                         <div className="mx-auto flex justify-center w-5/6 gap-3">
//                             <button
//                                 type="submit"
//                                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-1/2">Continue</button>
//                             <button onClick={onCancel}
//                                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-1/2">Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>


//         </section>
//     )
// }

// export default AuthPopUp;



import { useForm } from "react-hook-form";
import { useState } from "react";
import { TextField } from "@mui/material";
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Spinner from "./Spinner";



const AuthPopUp = ({ onCancel, onConfirm, text, email = false, password = false }) => {

    const [userInput, setUserInput] = useState({email: "", password: ""});


    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUserInput = (evt) => {
        setUserInput(currFormData => (
            {...currFormData, [evt.target.name]: evt.target.value}
        ));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        try {
            if (!isLoading) {
                setIsLoading(true);
                onConfirm(userInput);
                setUserInput({email: "", password: ""});
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClickShowPassword = (evt) => {
        evt.preventDefault();
        setShowPassword((show) => !show);
    };




    return (
        <section style={{ background: "rgba(0,0,0,0.8)", zIndex: "10" }} className="flex justify-center items-center fixed inset-0">
            {isLoading ? <Spinner loading={isLoading} size={110} />
            :<div className="border rounded-lg mx-auto bg-blue-300 p-10">
                <div className="py-5 overflow-hidden">
                    <h2 className="text-center sm:text-3xl font-bold font-mono ">{text}</h2>
                        <form>
                        <div className="my-3 sm:my-8">
                            {email && <TextField fullWidth error={!Boolean(userInput.email)} name="email" size="small" label="Email" variant="outlined" autoComplete="email" defaultValue={userInput.email} onChange={handleUserInput} required={true} />}

                            {password && <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel htmlFor="password">Enter Password</InputLabel>
                                <OutlinedInput
                                    required={true}
                                    error={!Boolean(userInput.password)}
                                    value={userInput.password}
                                    onChange={handleUserInput}
                                    // {...register("password", { required: true })}
                                    id="password"
                                    name="password"
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
                                    label="Enter Password"
                                />
                            </FormControl>}
                        </div>


                        <div className="mx-auto flex justify-center w-5/6 gap-3">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-1/2">Continue</button>
                            <button onClick={onCancel}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-1/2">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}
        </section>
    )
}

export default AuthPopUp;
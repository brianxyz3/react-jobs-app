import { useState } from "react";
import Spinner from "./Spinner";




const ConfirmPopup = ({ id, onConfirm, onCancel, text }) => {
    const [isLoading, setIsLoading] = useState(false);

        
    return (
        <div style={{ background: "rgba(0,0,0,0.8)", zIndex: "10" }} className="text-center blur-none fixed inset-0 flex justify-center items-center p-3">
            {isLoading ? <Spinner loading={isLoading} size={110}/>
            :<div className="bg-indigo-500 p-10 rounded-md">
                <h3 className="font-bold text-xl mb-2">Are You Sure You Want To {text}?</h3>
                <div className="flex justify-center gap-5">
                <button onClick={() => {
                        try {
                            if (!isLoading) {
                                setIsLoading(true);
                                onConfirm(id);
                            }
                        } catch (err) {
                            console.log(err);
                        } finally {
                            setIsLoading(false);
                        }}
                    }
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full focus:outline-none focus:shadow-outline mt-4">{text}</button>
                <button onClick={onCancel}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded-full focus:outline-none focus:shadow-outline mt-4">Cancel</button>
                </div>
            </div>}
        </div>
    )
}

export default ConfirmPopup;
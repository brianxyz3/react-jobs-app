const ConfirmPopup = ({ id, onConfirm, onCancel, text }) => {
    return (
        <div style={{ background: "rgba(0,0,0,0.8)" }} className="text-center blur-none fixed inset-0 flex justify-center items-center p-3">
            <div className="bg-indigo-500 p-10 rounded-md">
                <h3 className="font-bold text-xl mb-2">Are You Sure You Want To {text}?</h3>
                <button onClick={() => onConfirm(id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1 rounded-full focus:outline-none focus:shadow-outline mt-4 w-full md:w-auto">{text}</button>
                <button onClick={onCancel}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mx-1 rounded-full focus:outline-none focus:shadow-outline mt-4 w-full md:w-auto w-full md:w-auto">Cancel</button>
            </div>
        </div>
    )
}

export default ConfirmPopup;
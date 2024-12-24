import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import CopyrightFooter from "../components/CopyrightFooter";
import NavBar from "../components/NavBar";

const NotFoundPage = () => {
    const apiUrl = "/api/*";
    const [error, setError] = useState("")

    useEffect(() => {
        const getJobs = async () => {
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                return setError(data);
            } catch (err) {
                return console.log("Error fetching data, " + err);
            }
        }
        getJobs()
    }, [])
    return (
        <main className="flex flex-col h-screen">
            <NavBar />
            <section className="text-center flex flex-col justify-center items-center h-96 my-auto">
                {/* <i className="fas fa-exclamation-triangle text-yellow-400 fa-4x mb-4"></i> */}
                <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
                <h1 className="text-6xl font-bold mb-4">{error}</h1>
                <p className="text-xl mb-5">This page does not exist</p>
                <Link
                    to="/"
                    className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
                >Go Back
                </Link>
            </section>
            <CopyrightFooter />
        </main>
    )
}

export default NotFoundPage;
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTools } from "react-icons/fa";


const ComingSoon = () => {
    return (
        <main className="flex flex-col h-screen">
            <section className="text-center flex flex-col justify-center items-center h-96 my-auto">
                {/* <i className="fas fa-exclamation-triangle text-yellow-400 fa-4x mb-4"></i> */}
                <FaTools className="text-yellow-400 text-6xl mb-4" />
                <h1 className="text-3xl sm:text-5xl font-bold mb-4">Coming Soon</h1>
                <p className="text-base sm:text-xl mb-5">This page is under construction</p>
                <Link
                    to="/"
                    className="group text-white flex items-center gap-2 bg-indigo-700 hover:bg-indigo-900 hover:scale-105 rounded-md px-3 py-2 mt-4 duration-200"
                >Go Home
                    <span className="bg-white text-indigo-700 p-1 rounded-md group-hover:rotate-[360deg] group-hover:text-indigo-900 group-hover:scale-105 duration-700"><FaHome className=""/></span>
                </Link>
            </section>
        </main>
    )
}

export default ComingSoon;
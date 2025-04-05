const CopyrightFooter = () => {
    return (
        <div className="bg-indigo-950">
            <p className="text-slate-700 text-center whitespace-nowrap mx-7 border-t-2 border-slate-700 px-3 py-1">&copy; {new Date().getFullYear()} ReactDevJobs, Inc. <span className="sm:visible hidden">All rights reserved.</span></p>
        </div>
    )
}

export default CopyrightFooter;
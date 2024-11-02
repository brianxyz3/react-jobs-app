const CopyrightFooter = () => {
    return (
        <div className="bg-indigo-950">
            <p className="text-slate-700 text-center mx-7 border-t-2 border-slate-700 p-3">&copy; {new Date().getFullYear()} ReactDevJobs, Inc. All rights reserved.</p>
        </div>
    )
}

export default CopyrightFooter;
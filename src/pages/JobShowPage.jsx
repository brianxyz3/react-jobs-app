import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import JobInfo from "../components/JobInfo";
import CompanyInfo from "../components/CompanyInfo";


const JobShowPage = ({ deleteJob }) => {
    const job = useLoaderData();
    const navigate = useNavigate();

    const handleDelete = (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job listing?")

        if (!confirmDelete) return;
        deleteJob(jobId);
        toast.success("Job listing successfully deleted")
        navigate("/jobs")
    }

    return (
        <>
            <section>
                <div className="container m-auto py-6 px-6">
                    <Link
                        to="/jobs"
                        className="text-indigo-500 hover:text-indigo-600 flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Job Listings
                    </Link>
                </div>
            </section>

            <section className="bg-indigo-50">
                <div className="container m-auto py-10 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                        <JobInfo job={job} />
                        {/* Sidebar */}
                        <aside>
                            <CompanyInfo company={job.company} />
                            {/* Edit Job */}
                            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                                <Link
                                    to={`/edit-job/${job.id}`}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >Edit Job</Link>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                    onClick={() => handleDelete(job.id)}
                                >
                                    Delete Job
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    )
}

// getting data from api using loader from react-router-dom
const jobLoader = async ({ params }) => {
    try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const job = await res.json();
        return job;
    } catch (err) {
        return console.log(`An error occurred, ${err}`);
    }
}

export { JobShowPage as default, jobLoader };
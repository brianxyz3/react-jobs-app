import { useLoaderData, Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete"
import JobInfo from "../components/JobInfo";
import ConfirmPopup from "../components/ConfirmPopup";
import CompanyInfo from "../components/CompanyInfo";
import { useAuth } from "../firebaseContext/authContext";
import { jobApply } from "../../controllers/job";


const JobShowPage = ({ deleteJob }) => {
    const job = useLoaderData();
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const { currentUser } = useAuth();


    const handleDeleteClick = () => {
        setShowPopup(prevState => !prevState);
    }

    const confirmDelete = (jobId) => {
        deleteJob(jobId);
        setShowPopup(prevState => !prevState);
        toast.success("Job listing successfully deleted");
        navigate("/jobs");
    }

    const handleApply = async () => {
        const userId = { currentUser: currentUser.uid };
        await jobApply(id, userId);
        toast.success("Your Application has been sent to the employer")
    }

    const cancel = () => {
        setShowPopup(prevState => !prevState);
        toast.error("Delete job listing cancelled");
    }

    return (
        <>
            {showPopup && <ConfirmPopup id={job._id} onConfirm={confirmDelete} onCancel={cancel} text="Delete" />}
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
                    <div className="grid grid-cols-1 lg:grid-cols-70/30 w-full gap-6">
                        <JobInfo job={job} />
                        {/* Sidebar */}
                        <aside>
                            <CompanyInfo company={job.company} contact={job.contact} />
                            {/* Edit Job */}
                            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                {currentUser && currentUser.uid === job.postedBy ? <>
                                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                                <Link
                                    to={`/edit-job/${job._id}`}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                >Edit Job</Link>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                                    onClick={handleDeleteClick}
                                >
                                    Delete Job {<DeleteIcon />}
                                </button>
                                </>
                                    : <>
                                        <button
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full mx-auto focus:outline-none focus:shadow-outline mt-4 block duration-150 md:hover:w-[52%] hover:-translate-y-1 md:w-2/3"
                                            onClick={handleApply}
                                        >Quick Apply
                                        </button>
                                    </>
                                }
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
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
import Loader from "../components/Loader";


const JobShowPage = ({ deleteJob }) => {
    const job = useLoaderData();
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const { currentUser,  userLoggedIn } = useAuth();


    const handleDeleteClick = () => {
        setShowPopup(prevState => !prevState);
    }

    const confirmDelete = (jobId) => {
        deleteJob(jobId);
        setShowPopup(prevState => !prevState);
        toast.success("Job listing successfully deleted");
        navigate("/jobs");
    }

    const handleJobApply = async () => {
        try {
            if (!isLoading) {
                setIsLoading(true);
                const userId = { currentUser: currentUser.uid };
                const res = await jobApply(id, userId);
                if (res.success === "true") {
                    setIsDisabled(true);
                    return toast.success(res.message)
                }
                return toast.error("Something Went Wrong, Try Again")
            }
        } catch(err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
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
                            {userLoggedIn && <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                {currentUser && currentUser.uid === job.postedBy ? <>
                                    <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                                    {isLoading ? <Loader loading={isLoading} size={40} /> :
                                <><Link
                                    to={`/edit-job/${job._id}`}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block duration-200"
                                >Edit Job</Link>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block duration-200"
                                    onClick={handleDeleteClick}
                                >
                                    Delete Job {<DeleteIcon />}
                                </button></>}
                                </>
                                    : <>{isLoading ? <Loader loading={isLoading} size={30} /> :
                                        <button
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full mx-auto focus:outline-none focus:shadow-outline mt-4 block duration-200 md:hover:w-[52%] hover:-translate-y-1 md:w-2/3 disabled:bg-indigo-950 disabled:cursor-not-allowed"
                                            disabled={job.jobApplicants.some(applicants => applicants.userId == currentUser.uid) || isDisabled}
                                            onClick={handleJobApply}
                                        > Quick Apply
                                        </button>}
                                    </>
                                }
                            </div>}

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
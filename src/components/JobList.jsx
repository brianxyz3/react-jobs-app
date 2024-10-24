import { useState, useEffect } from "react";
import JobListing from "./JobListing";
import Spinner from "./Spinner";

const JobList = ({ isHome = false }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = isHome ? "http://localhost:5000/jobs?_limit=3" : "http://localhost:5000/jobs"

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                return setJobs(data);
            } catch (error) {
                return console.log("Error fetching data, " + error);
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    return (
        <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                    {isHome ? "Recent Jobs" : "Browse Jobs"}
                </h2>
                {loading ? (<Spinner loading={loading} />) :
                    (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {jobs.map((job) => {
                                return (
                                    <JobListing key={job.id} type={job.type} title={job.title} description={job.description} salary={job.salary} location={job.location} id={job.id} />
                                )
                            })}
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default JobList;
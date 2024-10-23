import jobs from "../jobs.json";
import JobListing from "./JobListing";

const JobList = () => {
    const last3Jobs = jobs.length - 3;
    const recentJobs = jobs.slice(last3Jobs, jobs.length);
    return (
        <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                    Browse Jobs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentJobs.map((job) => {
                        return (
                            <JobListing key={job.id} type={job.type} title={job.title} description={job.description} salary={job.salary} location={job.location} id={job.id} />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default JobList
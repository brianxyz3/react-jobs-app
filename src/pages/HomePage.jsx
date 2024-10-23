import Hero from "../components/Hero";
import HomeCards from "../components/HomeCards";
import JobList from "../components/JobList";
import ViewAllJobs from "../components/ViewAllJobs";

const HomePage = () => {
    return (
        <>
            <Hero />
            <HomeCards />
            <JobList />
            <ViewAllJobs />
        </>
    )
}

export default HomePage
import Hero from "../components/Hero";
import HomeCards from "../components/HomeCards";
import JobList from "../components/JobList";
import ViewAllJobs from "../components/ViewAllJobs";
import Footer from "../components/Footer";


const HomePage = () => {
    return (
        <>
            <Hero />
            <HomeCards />
            <JobList isHome={true} />
            <ViewAllJobs />
            <Footer />
        </>
    )
}

export default HomePage;
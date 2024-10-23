import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import HomeCards from "./components/HomeCards";
import JobList from "./components/JobList";
import ViewAllJobs from "./components/ViewAllJobs";

function App() {

  return (
    <>

      <NavBar />
      {/* <!-- Hero --> */}
      <Hero />

      {/* <!-- Developers and Employers --> */}
      <HomeCards />


      {/* <!-- Browse Jobs --> */}
      <JobList />

      <ViewAllJobs />
    </>
  )
}

export default App

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobShowPage, { jobLoader } from "./pages/JobShowPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";



function App() {
  const addJobSubmit = async (newJob) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newJob)
      });
      return;
    } catch (err) {
      return console.log(`An error occurred, ${err}`);
    }
  }

  const updateJobSubmit = async (job, id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(job)
      });
      return;
    } catch (err) {
      return console.log(`An error occurred, ${err}`);
    }
  }

  const deleteJob = async (id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`,
        { method: "DELETE" });
      return;
    } catch (err) {
      return console.log(`An error occurred, ${err}`);
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/add-job" element={<AddJobPage addJob={addJobSubmit} />} />
        <Route path="/jobs/:id" element={<JobShowPage deleteJob={deleteJob} />} loader={jobLoader} />
        <Route path="/edit-job/:id" element={<EditJobPage updateJob={updateJobSubmit} />} loader={jobLoader} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    ));

  return <RouterProvider router={router} />
}

export default App;
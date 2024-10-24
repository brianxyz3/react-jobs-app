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



function App() {
  const addJobSubmit = async (job) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(job)
    });
    return;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/add-job" element={<AddJobPage addJob={addJobSubmit} />} />
        <Route path="/jobs/:id" element={<JobShowPage />} loader={jobLoader} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    ));

  return <RouterProvider router={router} />
}

export default App;
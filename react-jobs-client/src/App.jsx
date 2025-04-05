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
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { addJobSubmit, updateJobSubmit, deleteJob } from "../controllers/job";
import AuthLayout from "./layouts/AuthLayout";
import SchedulePage from "./pages/SchedulePage";
import PendingApplicationPage from "./pages/PendingApplicationPage";



function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/add-job" element={<AddJobPage addJob={addJobSubmit} />} />
          <Route path="/jobs/:id" element={<JobShowPage deleteJob={deleteJob} />} loader={jobLoader} />
          <Route path="/edit-job/:id" element={<EditJobPage updateJob={updateJobSubmit} />} loader={jobLoader} />
          <Route path="/schedule" element={<SchedulePage />} loader={jobLoader} />
          <Route path="/applications" element={<PendingApplicationPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </>
    ));

  return <RouterProvider router={router} />
}

export default App;
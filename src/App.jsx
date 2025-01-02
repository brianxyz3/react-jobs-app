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
import { registerUser, loginUser } from "../controllers/user";
import { addJobSubmit, updateJobSubmit, deleteJob } from "../controllers/job";
import AuthLayout from "./layouts/AuthLayout";



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
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage loginUser={registerUser} />} />
          <Route path="/register" element={<SignUpPage registerUser={registerUser} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </>
    ));

  return <RouterProvider router={router} />
}

export default App;
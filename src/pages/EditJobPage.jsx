import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { toast } from "react-toastify";
import Footer from "../components/Footer";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const types = [
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
];

const salaries = [
    "Undisclosed",
    "Under $50K",
    "$50K - 60K",
    "$60K - 70K",
    "$70K - 80K",
    "$80K - 90K",
    "$90K - 100K",
    "$100K - 125K",
    "$125K - 150K",
    "$150K - 175K",
    "$175K - 200K",
    "Over $200K",
];
const EditJobPage = ({ updateJob }) => {
    const job = useLoaderData();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });


    const errorStyle = { color: "red" };

    const validateForm = {
        type: {
            required: "Selected the job type",
        },
        title: {
            required: "Job listing name cannot be blank",
        },
        salary: {
            required: "Select the salary range",
        },
        location: {
            required: "Location cannot be blank",
        },
        name: {
            required: "Company name cannot be blank",
        },
        email: {
            required: "Company Contact email cannot be blank",
        }
    }

    const submitEditForm = (data) => {
        if (localStorage.token) {
            const updatedJob = { ...data, token: localStorage.token };
            updateJob(updatedJob, id);
            toast.success("Job listing successfully updated");
            return navigate(`/jobs/${id}`);
        } else {
            navigate("/login");
        }
    }
    const backToJob = () => {
        return navigate(`/jobs/${id}`)
    }
    return (
        <>
        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-24">
                <div
                    className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
                >
                    <form onSubmit={handleSubmit(submitEditForm)}>
                        <h2 className="text-3xl text-center font-semibold mb-6">Edit Job</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Job Type</label>
                            <FormControl fullWidth>
                                <InputLabel id="type">Type</InputLabel>
                                <Select
                                    labelId="type"
                                    input={<OutlinedInput label="type" />}
                                    defaultValue={job.type}
                                    MenuProps={MenuProps}
                                    {...register("type")}
                                >
                                    {types.map((type) => (
                                        <MenuItem
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Job Listing Name</label>
                            <TextField
                                fullWidth
                                error={Boolean(errors.title)}
                                id="title"
                                label="Title"
                                defaultValue={job.title}
                                {...register("title", validateForm.title)}
                            />
                            {errors.title && <span style={errorStyle}>{validateForm.title.required}</span>}
                        </div>


                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Description</label>
                            <TextField
                                fullWidth
                                maxRows={4}
                                id="description"
                                label="Description"
                                defaultValue={job.description}
                                {...register("description")}
                            />
                        </div>



                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Salary</label>
                            <FormControl fullWidth>
                                <InputLabel id="salary">Salary</InputLabel>
                                <Select
                                    labelId="salary"
                                    input={<OutlinedInput label="salary" />}
                                    defaultValue={job.salary}
                                    MenuProps={MenuProps}
                                    {...register("salary")}
                                >
                                    {salaries.map((salary) => (
                                        <MenuItem
                                            key={salary}
                                            value={salary}
                                        >
                                            {salary}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>
                                Location
                            </label>
                            <TextField
                                fullWidth
                                error={Boolean(errors.location)}
                                id="location"
                                label="Location"
                                defaultValue={job.location}
                                {...register("location", validateForm.location)}
                            />
                            {errors.location && <span style={errorStyle}>{validateForm.location.required}</span>}
                        </div>

                        <h3 className="text-2xl mb-5">Company Info</h3>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Company Name</label>
                            <TextField
                                fullWidth
                                error={Boolean(errors.company)}
                                id="name"
                                label="Name"
                                defaultValue={job.company.name}
                                {...register("company.name", validateForm.name)}
                            />
                            {errors.company && <span style={errorStyle}>{validateForm.name.required}</span>}
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Company Description</label>
                            <TextField
                                fullWidth
                                id="description"
                                label="Description"
                                defaultValue={job.company.description}
                                maxRows={4}
                                {...register("company.description")}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Email</label>
                            <TextField
                                fullWidth
                                error={Boolean(errors.contact)}
                                type="email"
                                id="email"
                                label="Company Email"
                                defaultValue={job.contact.email}
                                {...register("contact.email", validateForm.email)}
                            />
                            {errors.contact && <span style={errorStyle}>{validateForm.email.required}</span>}
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Phone</label>
                            <TextField
                                fullWidth
                                id="tel"
                                label="Company Tel"
                                defaultValue={job.contact.phone}
                                {...register("contact.phone")}
                            />
                        </div>

                        <div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Edit Job
                            </button>
                        </div>
                    </form>
                    <button
                        onClick={backToJob}
                        className="bg-violet-800 hover:bg-violet-900 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-3"
                    >
                        Back to Job
                    </button>
                </div>
            </div>
            </section>
            <Footer />
        </>
    )
}

export default EditJobPage;
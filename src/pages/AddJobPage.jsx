import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';

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


const AddJobPage = ({ addJob }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });



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
            required: "Contact email cannot be blank",
        },
    }

    const submitAddForm = (data) => {
        const newJob = { ...data, id: uuid() };
        addJob(newJob);
        return navigate("/jobs");
    }

    return (
        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-24">
                <div
                    className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
                >
                    <form onSubmit={handleSubmit(submitAddForm)}>
                        <h2 className="text-3xl text-center font-semibold mb-6">Add Job</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Job Type</label>
                            <FormControl fullWidth>
                                <InputLabel id="type">Type</InputLabel>
                                <Select
                                    labelId="type"
                                    input={<OutlinedInput label="type" />}
                                    defaultValue="Full-Time"
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
                                error={errors.title ? true : false}
                                id="title"
                                label="Title"
                                placeholder="eg. Beautiful Apartment In Miami"
                                {...register("title", validateForm.title)}
                            />
                            {errors.title && <span style={{ color: "red" }}>{validateForm.title.required}</span>}
                        </div>


                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Description</label>
                            <TextField
                                fullWidth
                                error={errors.description ? true : false}
                                maxRows={4}
                                id="description"
                                label="Description"
                                placeholder="Add any job duties, expectations, requirements, etc"
                                {...register("description", validateForm.description)}
                            />
                            {errors.description && <span style={{ color: "red" }}>{validateForm.description.required}</span>}
                        </div>



                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Salary</label>
                            <FormControl fullWidth>
                                <InputLabel id="salary">Salary</InputLabel>
                                <Select
                                    labelId="salary"
                                    input={<OutlinedInput label="salary" />}
                                    defaultValue="Under $50K"
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
                                error={errors.location ? true : false}
                                id="location"
                                label="Location"
                                placeholder="Company Location"
                                {...register("location", validateForm.location)}
                            />
                            {errors.location && <span style={{ color: "red" }}>{validateForm.location.required}</span>}
                        </div>

                        <h3 className="text-2xl mb-5">Company Info</h3>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2"
                            >Company Name</label>
                            <TextField
                                fullWidth
                                error={errors.company ? true : false}
                                id="name"
                                label="Company Name"
                                placeholder="Company Name"
                                {...register("company.name", validateForm.name)}
                            />
                            {errors.company && <span style={{ color: "red" }}>{validateForm.name.required}</span>}
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Company Description</label>
                            <TextField
                                fullWidth
                                id="description"
                                label="Company Description"
                                maxRows={4}
                                placeholder="What does your company do?"
                                {...register("company.description")}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Email</label>
                            <TextField
                                fullWidth
                                type="email"
                                id="email"
                                label="Company Email"
                                placeholder="Email address for applicants"
                                {...register("company.contactEmail")}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                            >Contact Phone</label>
                            <TextField
                                fullWidth
                                id="tel"
                                label="Company Tel"
                                placeholder="Optional phone for applicants"
                                {...register("company.contactPhone")}
                            />
                        </div>

                        <div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default AddJobPage;




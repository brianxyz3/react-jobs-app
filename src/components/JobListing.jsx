import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarker } from "react-icons/fa";

const JobListing = ({ type, title, description, location, salary, id }) => {
    const [showFull, setShowFull] = useState(false);

    if (!showFull) {
        description = description.substring(0, 90) + "..."
    }
    const showFullDescription = () => {
        setShowFull((prevState) => !prevState)
    }

    return (
        <div className="bg-white rounded-xl shadow-md relative">
            <div className="p-4">
                <div className="mb-6">
                    <div className="text-gray-600 my-2">{type}</div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>

                <div className="mb-5">
                    {description}
                </div>
                <button onClick={showFullDescription} className="text-indigo-500 hover:text-indigo-600">{showFull ? "Less" : "More"}</button>

                <h3 className="text-indigo-500 mb-2">{salary}</h3>

                <div className="border border-gray-100 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="text-orange-700 mb-3">
                        <FaMapMarker className="inline text-lg mb-1 mr-1" />
                        {location}
                    </div>
                    <Link
                        to={`/job/${id}`}
                        className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default JobListing;
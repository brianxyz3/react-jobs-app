import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarker } from "react-icons/fa";
import validator from "validator";

const JobListing = ({ type, title, description, location, salary, id }) => {
    const [showFull, setShowFull] = useState(false);

    if (description) {
        if (!showFull) {
            description = description.substring(0, 90) + "..."
        }
    }
    const showFullDescription = () => {
        setShowFull((prevState) => !prevState)
    }


    return (
        <div className="bg-white rounded-xl shadow-md relative">
            <div className="flex flex-col justify-between p-4 h-[28rem] lg:h-[24rem]">
                <div>
                    <div className="text-gray-600 my-2">{validator.unescape(type)}</div>
                    <h3 className="text-xl font-bold">{validator.unescape(title)}</h3>
                </div>

                <div>
                    {validator.unescape(description)}
                </div>

                <div>
                    {description && <button onClick={showFullDescription} className="text-indigo-500 hover:text-indigo-600">{showFull ? "Less" : "More"}</button>}

                    <h3 className="text-indigo-500 mb-2">{salary}</h3>

                    <div className="border border-gray-100 mb-5"></div>

                    <div className="flex flex-col lg:flex-row justify-between mb-4">
                        <div className="text-orange-700 mb-3">
                            <FaMapMarker className="inline text-lg mb-1 mr-1" />
                            {validator.unescape(location)}
                        </div>
                        <Link
                            to={`/jobs/${id}`}
                            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                        >
                            Read More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobListing;
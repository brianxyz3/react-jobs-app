import React, { useEffect, useState } from "react";
import { getJobApplicationHistory } from "../../controllers/user";
import validator from "validator";
import { useAuth } from "../firebaseContext/authContext";

const PendingApplicationPage = () => {
    const { currentUser } = useAuth();
    const [userJobHistory, setUserJobHistory] = useState([]);

    useEffect(() => {
        const getUserDetail = async () => {
            const res = await getJobApplicationHistory(currentUser.uid);
            return setUserJobHistory(res);
        };
        getUserDetail();
    }, []);

    console.log(userJobHistory);


    return (
        <section>
            <div>
                {/* {userJobHistory} */}
                {
                    userJobHistory.map(job => (
                        <div className="group relative inline hover:cursor-pointer">
                            <h3 className="text-xl inline">{validator.unescape(job.title)}</h3>
                            <ul key={job._id} className="fixed mt-0.5 flex gap-2 text-sm w-0 text-nowrap overflow-hidden translate-x-1/4 rounded-md rounded-tl-none text-center bg-red-800 group-hover:w-28 group-hover:overflow-x-auto group-hover:p-1 duration-300">
                                <li>{job.company.name}</li>|
                                <li>{job.salary}</li>|
                                <li>{job.type}</li>|
                                <li>{job.location}</li>
                            </ul>
                        </div>
                    ))
                }
                {/* .company.name */}
            </div>
        </section>
    )
}

export default PendingApplicationPage;


{/* <ul key={job._id} className="fixed h-0 overflow-hidden bg-red-800 group-hover:h-80 group-hover:overflow-y-auto duration-300">
    <li>{job.company.name}</li>
    <li>{job.company.description}</li>
    <li>{job.contact.email}</li>
    <li>{job.contact.phone}</li>
    <li>{job.title}</li>
    <li>{job.description}</li>
    <li>{job.salary}</li>
    <li>{job.type}</li>
    <li>{job.location}</li>
</ul> */}
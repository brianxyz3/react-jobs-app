import React, { useEffect, useState } from "react";
import { getUserApiDetail } from "../../controllers/user";
import { useAuth } from "../firebaseContext/authContext";

const PendingApplicationPage = () => {
    const { currentUser } = useAuth();
    const [userApiDetail, setUserApiDetail] = useState({});

    useEffect(() => {
        const getUserDetail = async () => {
            const userDetail = await getUserApiDetail(currentUser.uid);
            return setUserApiDetail(userDetail);
        };
        getUserDetail();
    }, []);

    console.log(userApiDetail);


    return (
        <section>
            <div>
                {userApiDetail.email}
                {userApiDetail.firstName}
                {userApiDetail.lastName}
                {userApiDetail.userId}
                {console.log(userApiDetail.pendingJobApplications)}
            </div>
        </section>
    )
}

export default PendingApplicationPage;
import axios from 'axios';
import React, { useEffect } from 'react'

const PrivatePage = () => {
    const getUser = async () => {
        const config = {
            method: "GET",
            url: "/user"
        };

        try {
            const response = await axios(config);
            console.log(response, "response user");
            const value = response.data.message;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            private page
        </div>
    )
}

export default PrivatePage

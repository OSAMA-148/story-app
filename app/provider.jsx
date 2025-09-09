"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
function Provider({ children }) {
    const { user } = useUser();

    useEffect(() => {
        user && createNewUser();
    }, [user]);

    const createNewUser = async () => {
        const result = await axios.post("/api/user", {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
        });

        console.log(result.data);
    };
    return <div>{children}</div>;
}

export default Provider;

"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function StoryList() {
    const router = useRouter();
    const [stories, setStories] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        user && getStories();
    }, [user]);
    const getStories = async () => {
        const result = await axios.get("/api/my-stories");
        console.log(result.data);
        setStories(result.data);
    };

    return (
        <div>
            {stories?.length == 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <Image
                        src="/logo.png"
                        width={100}
                        height={100}
                        className="w-45 h-45"
                        alt="No stories"
                    />
                    <p className="text-gray-500">No stories found</p>
                    <Button
                        onClick={() => router.push("/dashboard/new-story")}
                        className="mt-5"
                    >
                        Create a New Story
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <Button
                        onClick={() => router.push("/dashboard/new-story")}
                        className="mt-5 text-3xl px-11! py-6! rounded-lg! shadow!"
                    >
                        My-Stories
                        </Button>
                        
                </div>
            )}
        </div>
    );
}

export default StoryList;

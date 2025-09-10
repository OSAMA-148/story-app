"use client";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function storyDetails() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestLoading, setSuggestLoading] = useState(false);

    useEffect(() => {
        async function fetchStoryDetails() {
            try {
                const res = await fetch(`/api/storyDetails?storyId=${storyId}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch story details");
                }

                const data = await res.json();
                setStory(data);
            } catch (error) {
                console.error("error fetching story", error);
            }
            setLoading(false);
        }
        fetchStoryDetails();
    }, [storyId]);

    useEffect(() => {
        if (!story?.content?.story?.type || !story?.content?.story?.ageGroup)
            return;
        async function fetchSuggestions() {
            setSuggestLoading(true);
            try {
                const res = await fetch("/api/suggesstions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        storyType: story.content.story.type,
                        ageGroup: story.content.story.ageGroup,
                    }),
                });
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            } catch (error) {
                setSuggestions([]);
            }

            setSuggestLoading(false);
        }
        fetchSuggestions();
    }, [story]);

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-20">
                <Loader2 className="animate-spin h-6 w-6 text-[#c9749d]" />
            </div>
        );
    }
    return (
        <>
            <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10 mt-10">
                <div className="md:w-1/2 flex justify-center items-start">
                    <img
                        src={story.imageURL}
                        className="rounded-lg shadow-lg object-cover w-full max-h-[500px]"
                    />
                </div>

                <div className="md:w-1/2 flex flex-col justify-start">
                    <h1 className="text-4xl font-bold text-[#c9749d] mb-6">
                        <strong>Title:</strong> {story?.content?.story?.title}
                    </h1>

                    <p className="text-lg mb-3">
                        {" "}
                        <strong>Type:</strong> {story?.content?.story?.type}
                    </p>

                    <p className="text-lg mb-3">
                        <strong>Age Group:</strong>{" "}
                        {story?.content?.story?.ageGroup}
                    </p>
                    <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                        {story?.content?.story?.description}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 px-6">
                <h2 className="text-2xl font-semibold mb-6 text-center text-[#a4597f]">
                    Story Chapters
                </h2>

                <div className="space-y-6">
                    {story?.content?.story?.pages?.map((page) => (
                        <div
                            key={page.pageNumber}
                            className="p-4 border border-purple-300 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-xl font-semibold text-[#a4597f] mb-2">
                                {" "}
                                Chapter {page.pageNumber}: {page.title}
                            </h3>
                            <p className="text-gray-700 whitespace-pre-line">
                                {page.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-12 px-6">
                <div className="bg-white rounded-lg shadow-lg p-6 ">
                    <h2 className="text-2xl font-semibold mb-6 text-[#c9749d] text-center">
                        You may also like these story ideas
                    </h2>

                    {suggestLoading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="animate-spin h-6 w-6 text-[#c9749d]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {suggestions.map((item) => (
                                <div className="border rounded-lg p-4 bg-purple-50 shadow flex flex-col">
                                    <strong className="text-lg text-[#a4597f] mb-2">
                                        {item?.title}
                                    </strong>
                                    <p className="text-gray-700 flex-1">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default storyDetails;

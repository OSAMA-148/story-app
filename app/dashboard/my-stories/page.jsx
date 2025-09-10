"use client";
import React, { useEffect, useState } from "react";
import Banner from "../_components/Banner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function MyStoriesPage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterAgeGroup, setFilterAgeGroup] = useState("");

    useEffect(() => {
        async function fetchStories() {
            try {
                const res = await fetch("/api/my-stories");
                if (!res.ok) {
                    throw new Error("Failed to fetch stories");
                }
                const data = await res.json();
                setStories(data);
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        }

        fetchStories();
    }, []);

    const filteredStories = stories.filter((story) => {
        const matchesSearch = story?.content?.story?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesType = filterType ? story.storyType === filterType : true;

        const matchesAge = filterAgeGroup
            ? story.ageGroup === filterAgeGroup
            : true;

        return matchesSearch && matchesType && matchesAge;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-20">
                <Loader2 className="animate-spin h-6 w-6 text-[#c9749d]" />
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-10">
            <Banner />

            <h1 className="p-6 text-[#c9749d] text-4xl">My Stories</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
                >
                    <option value="">All Types</option>
                    <option value="Educational">Educational</option>
                    <option value="Bed Story">Bed Story</option>
                    <option value="Story Book">Story Book</option>
                    <option value="History">History</option>
                </select>

                <select
                    value={filterAgeGroup}
                    onChange={(e) => setFilterAgeGroup(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
                >
                    <option value="">All Age Groups</option>
                    <option value="0-2 Years">0-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="6-8 Years">6-8 Years</option>
                </select>
            </div>

            <div className="grid grid-cols-1 max-w-6xl  sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredStories.length > 0 ? (
                    filteredStories.map((story) => (
                        <Link href={`/dashboard/story/${story.storyId}`}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={story.imageURL}
                                />

                                <div className="p-4">
                                    <h2 className="text-xl text-[#c9749d] font-semibold mb-2 truncate">
                                        {story?.content?.story?.title}
                                    </h2>
                                    <strong className="mt-2 text-lg">
                                        {story?.content?.story?.type}
                                    </strong>
                                    <small className="text-grey-400 block">
                                        {story?.content?.story?.ageGroup}
                                    </small>

                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-600 mt-10">
                        No stories match your search criteria.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MyStoriesPage;

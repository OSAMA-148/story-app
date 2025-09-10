"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const STORY_TYPES = [
    {id:1, title: "Story Book", image: "/storybook.png" },
    {id:2, title: "Bed Story", image: "/bedstory.png" },
    {id:3, title: "Educational", image: "/educational.png" },
    {id:4, title: "History", image: "/history.png" },
];
    
const AGE_GROUPS = ["0-2 Years", "3-5 Years", "6-8 Years"];

function StoryForm() {
    const [storySubject, setStorySubject] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [error, setError] = useState(""); 

    const router = useRouter();

    const handleSubmit = async () => {
        if (!storySubject.trim() || !selectedType || !ageGroup) {
            setError("Please fill all fields to generate your story.");
            return;
        }
        setError(""); // مسح الخطأ عند النجاح
        setLoading(true);

        try {
            const res = await fetch("/api/generate-story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    storySubject,
                    storyType: selectedType,
                    ageGroup,
                }),
            });
            if (!res.ok) throw new Error("Failed to generate story");
            router.push("/dashboard/my-stories");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again later."); // إظهار خطأ للمستخدم
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-10 bg-gray-100">
            <h1 className="text-3xl font-bold text-[#c9749d] mb-6">
                Create Your Magical Story
            </h1>

            <div className="mb-6">
                <label htmlFor="storySubject" className="block text-lg mb-2 ">
                    Write the subject of the story
                </label>
                <textarea
                    id="storySubject"
                    value={storySubject}
                    onChange={(e) => setStorySubject(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={3}
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 ">1. Story Type</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {STORY_TYPES.map((type) => (
                        <div
                            onClick={() => setSelectedType(type.title)}
                            key={type.id}
                            className={`p-4 flex flex-col items-center  ${
                                selectedType === type.title
                                    ? "grayscale-0"
                                    : "grayscale hover:grayscale-0 cursor-pointer"
                            }`}
                        >
                            <img
                                className="mb-2 "
                                src={type.image}
                                alt={`${type.title} icon`}
                            />
                            <span className="text-xl">{type.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 ">2. Age Group</h2>
                <div className="grid grid-cols-3 gap-4">
                    {AGE_GROUPS.map((age) => (
                        // --- التحسين 2: استخدام button بدلاً من div ---
                        <button
                            type="button"
                            key={age}
                            onClick={() => setAgeGroup(age)}
                            className={`p-4 rounded-lg border ${
                                ageGroup === age
                                    ? "bg-[#c9749d] text-white border-[#c9749d]"
                                    : "bg-white text-[#c9749d] border-[#c9749d]"
                            }`}
                        >
                            {age}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- التحسين 3: عرض رسالة الخطأ --- */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex items-center justify-center mt-8">
                <Button
                    className="w-full"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? "Generating..." : "Generate Story"}
                </Button>
            </div>
        </div>
    );
}

export default StoryForm;

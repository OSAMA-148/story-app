// components/RelatedStories.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useRelatedStories } from "@/hooks/useRelatedStories";

const RelatedStories = ({
    currentStoryId,
    currentStoryContent,
    onStorySelect,
}) => {
    const { relatedStories, loading, error, generateRelatedStories } =
        useRelatedStories();
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (currentStoryId || currentStoryContent) {
            generateRelatedStories(currentStoryId, currentStoryContent);
        }
    }, [currentStoryId, currentStoryContent, generateRelatedStories]);

    const handleCreateStory = async (suggestionData) => {
        try {
            // Call your existing story creation API with the suggestion data
            const response = await fetch("/api/create-story", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storySubject: suggestionData.title,
                    storyType: suggestionData.type,
                    ageGroup: suggestionData.ageGroup,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (onStorySelect) {
                    onStorySelect(result.storyId);
                }
            }
        } catch (error) {
            console.error("Error creating story from suggestion:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Generating related stories...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={() =>
                        generateRelatedStories(
                            currentStoryId,
                            currentStoryContent
                        )
                    }
                    className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!relatedStories) return null;

    return (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                    Stories You Might Also Enjoy
                </h3>
                <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
                </button>
            </div>

            {showSuggestions && (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                        Based on:{" "}
                        <span className="font-medium">
                            {relatedStories.originalStory?.title}
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {relatedStories.relatedStories?.map((story, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                        {story.title}
                                    </h4>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {story.type}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                    {story.description}
                                </p>

                                <div className="text-xs text-gray-500 mb-3">
                                    <div className="mb-1">
                                        <strong>Connection:</strong>{" "}
                                        {story.connectionToOriginal}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <strong>Themes:</strong>
                                        {story.keyThemes?.map(
                                            (theme, themeIndex) => (
                                                <span
                                                    key={themeIndex}
                                                    className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                                                >
                                                    {theme}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        {story.estimatedPages} pages •{" "}
                                        {story.ageGroup}
                                    </span>
                                    <button
                                        onClick={() => handleCreateStory(story)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Create This Story
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatedStories;

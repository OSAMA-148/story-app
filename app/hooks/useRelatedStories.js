// hooks/useRelatedStories.js

import { useState, useCallback } from "react";

export const useRelatedStories = () => {
    const [relatedStories, setRelatedStories] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateRelatedStories = useCallback(
        async (storyId, storyContent = null) => {
            setLoading(true);
            setError(null);

            try {
                const requestBody = storyContent
                    ? { originalStoryContent: storyContent }
                    : { storyId: storyId };

                const response = await fetch("/api/generate-related-stories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    setRelatedStories(result.data);
                    return result.data;
                } else {
                    throw new Error(
                        result.error || "Failed to generate related stories"
                    );
                }
            } catch (err) {
                setError(err.message);
                console.error("Error generating related stories:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchRelatedStoriesById = useCallback(async (storyId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/generate-related-stories?storyId=${storyId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setRelatedStories(result.data);
                return result.data;
            } else {
                throw new Error(
                    result.error || "Failed to fetch related stories"
                );
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching related stories:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        relatedStories,
        loading,
        error,
        generateRelatedStories,
        fetchRelatedStoriesById,
    };
};

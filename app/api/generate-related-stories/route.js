// app/api/generate-related-stories/route.js

import { db } from "@/config/db";
import { storyTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
    const { storyId, originalStoryContent } = await req.json();

    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If storyId is provided, fetch the story from database
    let storyContent = originalStoryContent;

    if (storyId && !originalStoryContent) {
        const existingStory = await db
            .select()
            .from(storyTable)
            .where(eq(storyTable.storyId, storyId))
            .limit(1);

        if (existingStory.length === 0) {
            return NextResponse.json(
                { error: "Story not found" },
                { status: 404 }
            );
        }

        storyContent = existingStory[0].content;
    }

    if (!storyContent) {
        return NextResponse.json(
            { error: "Story content is required" },
            { status: 400 }
        );
    }

    const originalStory =
        typeof storyContent === "string"
            ? JSON.parse(storyContent)
            : storyContent;

    const PROMPT = `Based on the following children's story, suggest 5 related story ideas that would appeal to the same audience:

Original Story:
- Title: ${originalStory.story?.title}
- Type: ${originalStory.story?.type}
- Age Group: ${originalStory.story?.ageGroup}
- Description: ${originalStory.story?.description}
- Main themes from the story content: Extract key themes, characters, and moral lessons

Generate 5 related story suggestions that:
1. Share similar themes, values, or educational elements
2. Are appropriate for the same age group: ${originalStory.story?.ageGroup}
3. Could be the same type (${originalStory.story?.type}) or complementary types
4. Feature similar characters, settings, or moral lessons
5. Would naturally follow as a "readers who enjoyed this might also like" recommendation

Each suggestion should be unique but connected to the original story through:
- Similar moral lessons or educational value
- Comparable character types or relationships
- Related themes or adventures
- Same reading level and engagement style

CRITICAL: Return ONLY valid JSON, no additional text or explanations.

Respond using this EXACT JSON structure:
{
  "originalStory": {
    "title": "${originalStory.story?.title}",
    "type": "${originalStory.story?.type}",
    "ageGroup": "${originalStory.story?.ageGroup}"
  },
  "relatedStories": [
    {
      "title": "Suggested story title",
      "description": "Brief description of the story concept",
      "type": "Educational/Adventure/Bed Story",
      "ageGroup": "${originalStory.story?.ageGroup}",
      "connectionToOriginal": "How this relates to the original story",
      "keyThemes": ["theme1", "theme2", "theme3"],
      "estimatedPages": 6
    }
  ]
}`;

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
        responseMimeType: "application/json",
    };

    const model = "gemini-2.5-flash-preview-05-20";
    const contents = [
        {
            role: "user",
            parts: [
                {
                    text: PROMPT,
                },
            ],
        },
    ];

    try {
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        console.log(
            "Raw response:",
            response.candidates[0].content.parts[0].text
        );

        const rawResponse = response?.candidates[0]?.content?.parts[0]?.text;
        const cleanedJSON = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const suggestionsData = JSON.parse(cleanedJSON);

        return NextResponse.json({
            success: true,
            data: suggestionsData,
        });
    } catch (error) {
        console.error("Error generating related stories:", error);
        return NextResponse.json(
            { error: "Failed to generate related stories" },
            { status: 500 }
        );
    }
}

// Alternative GET endpoint to fetch suggestions for a specific story
export async function GET(req) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get("storyId");

    if (!storyId) {
        return NextResponse.json(
            { error: "Story ID is required" },
            { status: 400 }
        );
    }

    try {
        // Fetch the original story
        const existingStory = await db
            .select()
            .from(storyTable)
            .where(eq(storyTable.storyId, storyId))
            .limit(1);

        if (existingStory.length === 0) {
            return NextResponse.json(
                { error: "Story not found" },
                { status: 404 }
            );
        }

        // Use the POST logic to generate suggestions
        const postRequest = new Request(req.url, {
            method: "POST",
            body: JSON.stringify({
                storyId: storyId,
                originalStoryContent: existingStory[0].content,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await POST(postRequest);
    } catch (error) {
        console.error("Error in GET related stories:", error);
        return NextResponse.json(
            { error: "Failed to fetch story or generate suggestions" },
            { status: 500 }
        );
    }
}

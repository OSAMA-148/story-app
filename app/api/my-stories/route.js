import { db } from "@/config/db";
import { storyTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stories = await db
        .select()
        .from(storyTable)
        .where(eq(storyTable.email, user.primaryEmailAddress.emailAddress));

    console.log(stories);

    return NextResponse.json(stories);
}

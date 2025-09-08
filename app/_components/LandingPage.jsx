import Image from "next/image";
import Link from "next/link";
import React from "react";

function LandingPage() {
    return (
        <section className="flex bg-[#efd5e2] mt-5  flex-col-reverse lg:flex-row items-center justify-between px-10 lg:px-32 py-16">
            <div className="max-w-lg space-y-6">
                <h1 className="text-4xl font-extrabold text-[#c9749d] leading-tight">
                    Generate Your Favourite Story With The Power of AI
                </h1>

                <p className="text-gray-600 text-xl">
                    Generate unique and personalized kids' stories powered by
                    AI. Make story time magical and exciting for your child.
                </p>
                <Link
                    href="dashboard/new-story"
                    className="bg-[#c9749d] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#c15b8c] transition"
                >
                    Create Story
                </Link>
            </div>

            <div className="relative w-full h-[500px]">
                <Image
                    src="/hero.png"
                    alt="Hero"
                    fill
                    className="object-contain"
                />
            </div>
        </section>
    );
}

export default LandingPage;

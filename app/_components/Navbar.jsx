import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
    return (
        <nav className="flex shadow-lg justify-between items-center px-8 py-4  text-white ">
            <h1 className="font-bold text-2xl">
                <Image
                    src="/logo.png"
                    className="w-35"
                    width={500}
                    height={500}
                    alt="Logo"
                />
            </h1>

            <div className="flex gap-6 items-center">
                <Link className="font-bold text-[#db8cb3]" href="/dashboard">
                    Home
                </Link>
                <Link className="font-bold text-[#db8cb3]" href="/create-story">
                    Create Story
                </Link>
                <Link
                    className="font-bold text-[#db8cb3]"
                    href="/explore-stories"
                >
                    Explore Stories
                </Link>
                <Link className="font-bold text-[#db8cb3]" href="/contact">
                    Contact
                </Link>
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <Link
                        className="bg-white text-[#db8cb3] px-4 py-2 rounded-md shadow font-bold p-3
            "
                        href="/sign-in"
                    >
                        Get Started
                    </Link>
                </SignedOut>
            </div>
        </nav>
    );
}

export default Navbar;

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsStars } from "react-icons/bs";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-foreground">
        <Navbar />

<div className="flex flex-col items-center justify-between px-6 sm:px-12 lg:px-24 py-16">          <div className="container mx-auto py-20 sm:py-24 lg:py-32">

            <div className="max-w-6xl mx-auto text-center">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6] px-4 py-2 text-sm text-[#8b5cf6] shadow-md">
                <BsStars />
                <span>The new standard for campus events</span>
              </div>

              {/* Heading */}
              <h1 className="mt-6 font-playfair font-extrabold leading-tight
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                xl:text-8xl">
                Discover{" "}
                <span className="text-[#8b5cf6]">
                  Events
                </span>{" "}
                That Matter
              </h1>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground">
                The intelligent ecosystem for campus life. Curate your
                schedule, connect with peers, and never miss a moment that
                defines your university experience.
              </p>

              {/* Buttons */}
           <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
  <Link href="/events" className="flex-1">
    <Button className="w-full rounded-full py-6">
      Explore Events
    </Button>
  </Link>

  <Button
    variant="outline"
    className="w-full sm:flex-1 rounded-full py-6"
  >
    Create Event
  </Button>
</div>

            </div>
          </div>
        </div>
        <Footer />
      </div>

    </>
  );
}
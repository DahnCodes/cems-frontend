"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ImLocation2 } from "react-icons/im";
import { IoCalendar } from "react-icons/io5";
import { useAuth } from "@/context/auth-context";
import { AxiosError } from "axios";

type Organizer = {
  _id: string;
  fullName: string;
  email: string;
};

type Event = {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
  capacity: number;
  coverImage?: string;
  organizerId: Organizer;
  createdAt: string;
};

type ErrorResponse = {
  message: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleViewDetails = (eventId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    router.push(`/events/${eventId}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const res = await axios.get<{ events: Event[] }>("/api/events");

        setEvents(res.data.events);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;

        const message =
          err.response?.data?.message || "Failed to load events";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">
            Upcoming Events
          </h1>

          {events.length === 0 ? (
            <div className="text-center text-gray-500">
              No events available yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
              {events.map((event) => (
              <Card
  key={event._id}
  className="flex flex-row overflow-hidden hover:shadow-lg transition w-full h-auto min-h-[140px]"
>
  {/* IMAGE SECTION */}
  <div className="relative w-28 sm:w-36 md:w-48 flex-shrink-0 bg-gray-100">
    {event.coverImage ? (
      <Image
        src={event.coverImage}
        alt={event.title}
        fill
        className="object-cover"
      />
    ) : (
      <div className="flex items-center justify-center h-full text-xs text-gray-400">
        No Image
      </div>
    )}
  </div>

  {/* CONTENT SECTION */}
  <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
    {/* TOP */}
    <div>
      <h2 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-1">
        {event.title}
      </h2>

      <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-500">
        <p className="flex items-center gap-1">
          <ImLocation2 className="shrink-0" />
          <span className="truncate">{event.venue}</span>
        </p>

        <p className="flex items-center gap-1">
          <IoCalendar className="shrink-0" />
          <span className="truncate">
            {new Date(event.eventDate).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="mt-3 flex items-center justify-between">
      <span className="text-[10px] sm:text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
        {event.category}
      </span>

      <Button
        onClick={() => handleViewDetails(event._id)}
        className="text-xs sm:text-sm px-3 py-1 h-8 bg-black text-white hover:opacity-80"
      >
        View
      </Button>
    </div>
  </div>
</Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
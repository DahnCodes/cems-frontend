"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import api from "@/lib/api";

import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";

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
  registeredCount: number;
  coverImage?: string;
  organizerId: Organizer;
  createdAt?: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  ticket: {
    id: string;
    ticketCode: string;
  };
};

export default function EventDetailsPage() {
  const params = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get<{ event: Event }>(
          `/api/events/${params.id}`
        );

        setEvent(res.data.event);
      } catch {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    void fetchEvent();
  }, [params.id]);

  const handleRegister = async () => {
    if (!event) return;

    try {
      setRegistering(true);

      const res = await api.post<RegisterResponse>(
        "/api/events/register",
        {
          eventId: event._id,
        }
      );

     toast.success(res.data.message);

router.push(`/tickets/${res.data.ticket.id}`);

      setRegistered(true);

      setEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: prev.registeredCount + 1,
            }
          : null
      );
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      toast.error(
        err.response?.data?.message ?? "Registration failed"
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          Loading event...
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-red-500">
          Event not found
        </div>
      </>
    );
  }

  const remainingSeats =
    event.capacity - event.registeredCount;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-neutral-50 p-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <Card className="p-4">
            <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden relative">

              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-400">
                  No Image Available
                </div>
              )}

            </div>
          </Card>

          {/* RIGHT SIDE */}
          <Card className="p-6 space-y-5">

            <h1 className="text-4xl font-bold">
              {event.title}
            </h1>

            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-4 border rounded-xl p-4">

              <div className="flex justify-between">
                <span className="font-medium">
                  Category
                </span>

                <span>
                  {event.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Venue
                </span>

                <span>
                  {event.venue}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Date & Time
                </span>

                <span>
                  {new Date(
                    event.eventDate
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Organizer
                </span>

                <span>
                  {event.organizerId.fullName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Capacity
                </span>

                <span>
                  {event.registeredCount}/
                  {event.capacity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Remaining Seats
                </span>

                <span>
                  {remainingSeats}
                </span>
              </div>

            </div>

            <Button
              onClick={handleRegister}
              disabled={
                registered ||
                registering ||
                remainingSeats <= 0
              }
              className="w-full rounded-4xl p-6"
            >
              {remainingSeats <= 0
                ? "Event Full"
                : registered
                ? "Registered ✓"
                : registering
                ? "Registering..."
                : "Register For Event"}
            </Button>

          </Card>
        </div>
      </div>
    </>
  );
}
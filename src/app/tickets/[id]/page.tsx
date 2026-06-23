"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TicketResponse = {
  success: boolean;
  qrCode: string;
  ticket: {
    ticketCode: string;

    eventId: {
      title: string;
      venue: string;
      eventDate: string;
    };

    userId: {
      fullName: string;
      email: string;
    };
  };
};

export default function TicketPage() {
  const params = useParams();

  const [ticket, setTicket] =
    useState<TicketResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res =
          await api.get<TicketResponse>(
            `/api/tickets/${params.id}`
          );

        setTicket(res.data);
      } finally {
        setLoading(false);
      }
    };

    void fetchTicket();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-10 text-center">
        Ticket not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <Card className="w-full max-w-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          🎟 Event Ticket
        </h1>

        <div className="flex justify-center mb-6">
          <Image
            src={ticket.qrCode}
            alt="QR Code"
            width={250}
            height={250}
          />
        </div>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-muted-foreground">
              Event
            </p>

            <p className="font-semibold text-lg">
              {ticket.ticket.eventId.title}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Registered By
            </p>

            <p className="font-semibold">
              {ticket.ticket.userId.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Ticket Code
            </p>

            <p className="font-mono font-bold">
              {ticket.ticket.ticketCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Venue
            </p>

            <p>
              {ticket.ticket.eventId.venue}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Date
            </p>

            <p>
              {new Date(
                ticket.ticket.eventId.eventDate
              ).toLocaleString()}
            </p>
          </div>

        </div>

        <Button
          className="w-full mt-6"
          onClick={() => window.print()}
        >
          Download / Print Ticket
        </Button>

      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "@/lib/api";
import ImageUpload from "@/components/Upload";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    eventDate: "",
    capacity: "",
    coverImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post("api/events/create", {
        ...form,
        capacity: Number(form.capacity),
      });

      toast.success("Event created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        venue: "",
        eventDate: "",
        capacity: "",
        coverImage: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT - COVER */}
        <Card className="p-4">
          <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
            {form.coverImage ? (
              <Image
                src={form.coverImage}
                className=""
                width={200}
                height={200}
                alt="Event Cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400">
                No cover uploaded
              </div>
            )}
          </div>

          <div className="mt-4">
            <ImageUpload
              onUpload={(url) =>
                setForm((prev) => ({ ...prev, coverImage: url }))
              }
            />
          </div>
        </Card>

        {/* RIGHT - FORM */}
        <Card className="p-6 space-y-5">

          <h1 className="text-2xl font-semibold">Create Event</h1>

          {/* TITLE */}
          <Field>
            <Label>Event Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Hackathon 2026"
            />
          </Field>

          {/* DESCRIPTION */}
          <Field>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people about your event..."
            />
          </Field>

          {/* CATEGORY */}
          <Field>
            <Label>Category</Label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Tech, Music, Sports"
            />
          </Field>

          {/* VENUE */}
          <Field>
            <Label>Venue</Label>
            <Input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="University Auditorium"
            />
          </Field>

          {/* DATE */}
          <Field>
            <Label>Event Date</Label>
            <Input
              type="datetime-local"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
            />
          </Field>

          {/* CAPACITY */}
          <Field>
            <Label>Capacity</Label>
            <Input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="200"
            />
          </Field>

          {/* SUBMIT */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Event"}
          </Button>

        </Card>
      </div>
    </div>
  );
}
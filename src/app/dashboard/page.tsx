// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";

// export default function Dashboard() {
// return(
//     <>
//     <div className="min-h-screen bg-background text-foreground bg-gradient-to-tl from-purple-50 via-white to-blue-50">
//     <Navbar/>

//     </div>
//     </>
// )
// }

'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/api'
import Navbar from '@/components/Navbar'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Image from 'next/image'
import { toast } from 'react-toastify'
import { ImLocation2 } from 'react-icons/im'
import { IoCalendar } from 'react-icons/io5'
import Link from 'next/dist/client/link'

type Organizer = {
  _id: string
  fullName: string
  email: string
}

type Event = {
  _id: string
  title: string
  description: string
  category: string
  venue: string
  eventDate: string
  capacity: number
  registeredCount: number
  coverImage?: string
  organizerId: Organizer
  createdAt: string
}

export default function DashboardPage() {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [createdEvents, setCreatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [registeredRes, createdRes] = await Promise.all([
          axios.get('/api/user/me/events'),
          axios.get('/api/user/me/created-events'),
        ])

        setRegisteredEvents(registeredRes.data.events || [])
        setCreatedEvents(createdRes.data.events || [])
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    void fetchDashboardData()
  }, [])

  const now = new Date()

  const upcomingEvents = registeredEvents.filter(
    (event) => new Date(event.eventDate) > now
  )

  const pastEvents = registeredEvents.filter(
    (event) => new Date(event.eventDate) < now
  )

  const copyLink = async (eventId: string) => {
    const link = `${window.location.origin}/events/${eventId}`

    await navigator.clipboard.writeText(link)

    toast.success('Event link copied!')
  }

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">My Dashboard</h1>

          <div className="md:hidden mb-6">
            <Button asChild className="w-full rounded-full py-6">
              <Link href="/events">Discover events</Link>
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>

              <TabsTrigger value="past">Past Events</TabsTrigger>

              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            {/* UPCOMING EVENTS */}

            <TabsContent value="upcoming">
              <EventGrid events={upcomingEvents} />
            </TabsContent>

            {/* PAST EVENTS */}

            <TabsContent value="past">
              <EventGrid events={pastEvents} />
            </TabsContent>

            {/* MANAGE */}

            <TabsContent value="manage">
              <div className="grid md:grid-cols-2 gap-4">
                {createdEvents.map((event) => (
                  <Card key={event._id} className="p-5 space-y-4">
                    <div>
                      <h2 className="font-semibold text-xl">{event.title}</h2>

                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>

                    <div className="flex justify-between">
                      <span>Registered:</span>

                      <span className="font-semibold">
                        {event.registeredCount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Capacity:</span>

                      <span className="font-semibold">{event.capacity}</span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => copyLink(event._id)}
                    >
                      Copy Event Link
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

function EventGrid({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No events found.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {events.map((event) => (
        <Card
          key={event._id}
          className="flex flex-row overflow-hidden hover:shadow-lg transition w-full h-auto min-h-[120px]"
        >
          {/* IMAGE */}
          <div className="relative w-28 sm:w-36 md:w-52 flex-shrink-0 bg-gray-100">
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

          {/* CONTENT */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold line-clamp-1">
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

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                {event.category}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

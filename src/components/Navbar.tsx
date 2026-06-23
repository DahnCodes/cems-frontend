'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { useState } from 'react'
// import Router from "next/router";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function Navbar() {
  const { user, logout, refreshUser, isAuthenticated, loading } = useAuth()
  const [loadingRole, setLoadingRole] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const router = useRouter()

  const handleBecomeOrganizer = async () => {
    try {
      setLoadingRole(true)

      await api.post('api/user/become-organizer')

      toast.success('You are now an organizer!')

      await refreshUser()
    } catch (err) {
      console.error('Failed to become organizer:', err)
    } finally {
      setLoadingRole(false)
    }
  }

  // ⛔ prevent flicker on refresh
  if (loading) {
    return (
      <nav className="border-b h-16 flex items-center px-6">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </nav>
    )
  }

  return (
    <nav className="border-b dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href={isAuthenticated ? '/dashboard' : '/'}>
            <h2 className="text-2xl font-bold">CampusLink</h2>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Discover Events
            </Link>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* AUTHENTICATED */}
            {isAuthenticated && user ? (
              <>
                {/* CREATE EVENT (ONLY ORGANIZER) */}
                {user.role === 'organizer' && (
                  <Link href="/dashboard/create">
                    <Button className="rounded-4xl w-32">Create Event</Button>
                  </Link>
                )}

                {/* BECOME ORGANIZER */}
                {user.role === 'student' && (
                  <Button
                    onClick={handleBecomeOrganizer}
                    disabled={loadingRole}
                    className="rounded-4xl w-40"
                  >
                    {loadingRole ? 'Upgrading...' : 'Become Organizer'}
                  </Button>
                )}

                {/* PROFILE DROPDOWN */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="rounded-full w-10 h-10"
                    onClick={() => setOpenProfile((prev) => !prev)}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </Button>

                  {openProfile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border p-3 z-50">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>

                      <button
                        onClick={() => {
                          logout()
                          setOpenProfile(false)
                          router.push('/login')
                        }}
                        className="mt-3 text-sm text-red-500 hover:underline"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* GUEST */
              <div className="flex gap-4">
                <Link href="/login">
                  <Button className="w-28 rounded-4xl">Sign In</Button>
                </Link>

                <Link href="/register">
                  <Button variant="outline" className="w-28 rounded-4xl">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

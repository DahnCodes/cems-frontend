'use client'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          
          <p className="font-semibold text-lg">
            CampusLink
          </p>

          <p className="text-center text-sm text-gray-500 sm:text-right">
            Copyright © 2026. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
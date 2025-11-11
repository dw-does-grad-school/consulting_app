'use client'

import { SignInButton, useUser } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Consulting App
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              Welcome to your consulting platform
            </p>
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

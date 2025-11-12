'use client'

import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* App Name */}
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity"
          >
            Consulting App
          </Link>

          {/* Navigation Menu - centered */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/chat"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 hover:underline dark:hover:bg-zinc-800  transition-colors"
                      )}
                    >
                      Chat Agent
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/pricing"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 hover:underline dark:hover:bg-zinc-800 transition-colors"
                      )}
                    >
                      Pricing
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/profile"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 hover:underline dark:hover:bg-zinc-800 transition-colors"
                      )}
                    >
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: User avatar or Sign in button */}
          <div>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


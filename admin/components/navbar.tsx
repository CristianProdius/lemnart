import React from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@/components/user-button';

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if(!session?.user) {
    redirect("/sign-in")
  }

  const stores = await prismadb?.store.findMany({
    where: {
      userId: session.user.id,
    }
  })

  return (
    <div className='border-b'>
        <div className='flex items-center h-16 px-4'>
            <StoreSwitcher items={stores} />
            <MainNav className='mx-6' />
            <div className='flex items-center ml-auto space-x-4'>
              <ThemeToggle />
              <UserButton />
            </div>
        </div>
    </div>
  )
}

export default Navbar

import { NavSecondary } from '@passport/components/nav-secondary';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@passport/components/ui/sidebar';
import { getUser } from '@passport/user';
import { PawPrint, Send, Settings } from 'lucide-react';
import { Suspense } from 'react';
import AuthButtons from './auth/auth-buttons';
import { NavUser } from './nav-user';
import { PetsNav } from './pets-nav';
import Link from 'next/link';

export async function AppSidebar() {
  const user = await getUser();
  const data = {
    navSecondary: [
      {
        title: 'Settings',
        url: '#',
        icon: Settings,
      },
      {
        title: 'Feedback',
        url: '#',
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <PawPrint size={16} />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Passport</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user ? (
          <Suspense fallback={<div>Loading...</div>}>
            <PetsNav ownerId={user.id} />
          </Suspense>
        ) : null}
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <AuthButtons />}
      </SidebarFooter>
    </Sidebar>
  );
}

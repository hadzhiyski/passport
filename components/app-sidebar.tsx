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
import { User } from '@passport/user';
import { randomUUID } from 'crypto';
import { PawPrint, Send, Settings } from 'lucide-react';
import { NavUser } from './nav-user';
import { PetsNav } from './pets-nav';

export interface AppSidebarProps {
  user: User | undefined;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const data = {
    pets: [
      {
        id: randomUUID(),
        name: 'Bella',
        url: '#',
        kind: 'dog' as const,
        items: [
          {
            title: 'Dog Food',
            url: '#',
          },
          {
            title: 'Dog Treats',
            url: '#',
          },
        ],
      },
      {
        id: randomUUID(),
        name: 'Blaze',
        url: '#',
        kind: 'dog' as const,
        items: [
          {
            title: 'Dog Food',
            url: '#',
          },
          {
            title: 'Dog Treats',
            url: '#',
          },
        ],
      },
      {
        id: randomUUID(),
        name: 'Felix',
        url: '#',
        kind: 'cat' as const,
        items: [
          {
            title: 'Cat Food',
            url: '#',
          },
          {
            title: 'Cat Treats',
            url: '#',
          },
        ],
      },
    ],
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
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <PawPrint size={16} />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Passport</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <PetsNav pets={data.pets} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>{user ? <NavUser user={user} /> : null}</SidebarFooter>
    </Sidebar>
  );
}

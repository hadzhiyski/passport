'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@passport/components/ui/sidebar';

export function PetsNav({
  pets,
}: {
  pets: {
    id: string;
    name: string;
    kind: 'dog' | 'cat';
    selected?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Pets</SidebarGroupLabel>
      <SidebarMenu className='gap-2'>
        {pets.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={`/pets/${item.id}`} className='font-medium'>
                {item.name}
              </a>
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenuSub className='ml-0 border-l-0 px-1.5'>
                {item.items.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild isActive={false}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

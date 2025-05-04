'use client';

import { BadgeCheck, Bell, LogOut, Send, Settings } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@passport/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@passport/components/ui/dropdown-menu';
import { User } from '@passport/user';
import Link from 'next/link';
import { Button } from './ui/button';

export interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <span className='hidden sm:inline pl-2'>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        align='end'
        sideOffset={4}
        className='rounded-lg z-150'
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback className='rounded-lg'>
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.name}</span>
              <span className='truncate text-xs'>{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/account'>
              <BadgeCheck className='mr-2 h-4 w-4' />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/settings'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/feedback'>
              <Send className='mr-2 h-4 w-4' />
              Feedback
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className='mr-2 h-4 w-4' />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/auth/logout'>
            <LogOut className='mr-2 h-4 w-4' />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

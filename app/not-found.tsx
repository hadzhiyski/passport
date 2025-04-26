import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@passport/components/ui/card';
import { PawPrintIcon } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center'>
      <Card className='w-full max-w-md border-0 shadow-lg rounded-xl overflow-hidden'>
        <CardHeader className='text-center p-6 pb-0'>
          <div className='mx-auto bg-blue-100 text-blue-600 p-4 rounded-full mb-4 w-fit'>
            <PawPrintIcon className='h-12 w-12' />
          </div>
          <h1 className='text-3xl font-bold mb-2'>Page Not Found</h1>
        </CardHeader>

        <CardContent className='p-6 text-center'>
          <p className='text-muted-foreground mb-8'>
            Oops! It looks like this pet has wandered off. We couldn&apos;t find
            the page you were looking for.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-6'>
            <div className='flex flex-col items-center p-4 bg-slate-50 rounded-lg'>
              <span className='text-4xl mb-2'>🐕</span>
              <span className='text-sm text-slate-600'>Searching...</span>
            </div>
            <div className='flex flex-col items-center p-4 bg-slate-50 rounded-lg'>
              <span className='text-4xl mb-2'>🐈</span>
              <span className='text-sm text-slate-600'>Not here...</span>
            </div>
            <div className='flex flex-col items-center p-4 bg-slate-50 rounded-lg'>
              <span className='text-4xl mb-2'>🦡</span>
              <span className='text-sm text-slate-600'>Looking...</span>
            </div>
          </div>

          <p className='text-slate-600 mb-6'>
            Let&apos;s get you back on track to find your furry friends.
          </p>
        </CardContent>

        <CardFooter className='p-6 pt-0 flex flex-col sm:flex-row gap-4'>
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/'>
              <PawPrintIcon className='h-5 w-5 mr-2' />
              Go Home
            </Link>
          </Button>
          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/pets'>View My Pets</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className='mt-8 text-center text-slate-500 text-sm'>
        <p>
          Error 404 - The page you&apos;re looking for doesn&apos;t exist or has
          been moved.
        </p>
      </div>
    </div>
  );
}

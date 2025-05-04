import { Card, CardContent } from '@passport/components/ui/card';

export function PetCardSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {[1, 2].map((i) => (
        <Card key={i} className='h-full border-border overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='h-16 w-16 rounded-full bg-muted animate-pulse'></div>
              <div className='flex-1'>
                <div className='h-6 bg-muted animate-pulse rounded w-24 mb-2'></div>
                <div className='h-4 bg-muted animate-pulse rounded w-32'></div>
              </div>
            </div>
            <div className='space-y-4'>
              <div className='h-20 bg-muted animate-pulse rounded'></div>
              <div className='h-20 bg-muted animate-pulse rounded'></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

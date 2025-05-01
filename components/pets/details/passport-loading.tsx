export function PassportLoadingSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-5'>
          <div className='flex items-center gap-4'>
            <div className='bg-muted h-14 w-14 rounded-lg'></div>
            <div>
              <div className='h-4 bg-muted rounded w-20 mb-2'></div>
              <div className='h-6 bg-muted rounded w-32'></div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='h-4 bg-muted rounded w-16 mb-2'></div>
              <div className='h-5 bg-muted rounded w-24'></div>
            </div>
            <div>
              <div className='h-4 bg-muted rounded w-16 mb-2'></div>
              <div className='h-5 bg-muted rounded w-24'></div>
            </div>
          </div>

          <div className='pt-2'>
            <div className='h-4 bg-muted rounded w-36 mb-2'></div>
            <div className='mt-2 space-y-1'>
              <div className='flex justify-between'>
                <div className='h-4 bg-muted rounded w-28'></div>
                <div className='h-4 bg-muted rounded w-32'></div>
              </div>
              <div className='flex justify-between'>
                <div className='h-4 bg-muted rounded w-20'></div>
                <div className='h-4 bg-muted rounded w-28'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-5'>
          <div>
            <div className='h-4 bg-muted rounded w-20 mb-3'></div>
            <div className='h-16 bg-muted rounded w-full'></div>
          </div>

          <div>
            <div className='h-4 bg-muted rounded w-32 mb-3'></div>
            <div className='space-y-3'>
              <div className='h-16 bg-muted rounded w-full'></div>
              <div className='h-16 bg-muted rounded w-full'></div>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-4 flex justify-end'>
        <div className='h-6 bg-muted rounded w-40'></div>
      </div>
    </div>
  );
}

export function ParasiteTreatmentLoadingSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center h-40 animate-pulse'>
      <div className='bg-slate-200 h-12 w-12 rounded-full mb-4'></div>
      <div className='h-5 bg-slate-200 rounded w-48 mb-2'></div>
      <div className='h-4 bg-slate-200 rounded w-64 mb-4'></div>
      <div className='h-9 bg-slate-200 rounded w-36'></div>
    </div>
  );
}

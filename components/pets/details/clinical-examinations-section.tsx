import { format } from 'date-fns';
import { PetSectionPagination } from './pagination';

export type ClinicalExaminationProps = {
  id: string;
  date: Date;
  veterinarian: string;
};

export interface ClinicalExaminationsSectionProps {
  query: Promise<{ total: number; examinations: ClinicalExaminationProps[] }>;
  currentPage?: number | 'all';
  pageSize?: number;
  paginationSearchParam?: string;
}

export async function ClinicalExaminationsSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'x',
}: ClinicalExaminationsSectionProps) {
  const { total, examinations } = await query;
  const totalPages = Math.ceil(total / pageSize);

  if (total === 0) {
    return (
      <div className='text-center py-12 text-slate-500'>
        No clinical examinations recorded.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6'>
      {examinations.map((exam, index) => (
        <div
          key={index}
          className='border border-slate-100 rounded-lg p-4 shadow-sm'
        >
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-slate-700 bg-slate-50 p-3 rounded italic text-sm md:col-span-2'>
              The animal shows no signs of diseases and is fit to be transported
              for the intended journey.
            </div>
            <div>
              <span className='text-slate-500 text-sm block'>Date</span>
              <span className='font-medium'>
                {format(exam.date, 'MMM d, yyyy')}
              </span>
            </div>
            <div>
              <span className='text-slate-500 text-sm block'>Veterinarian</span>
              <span className='font-medium'>{exam.veterinarian}</span>
            </div>
          </div>
        </div>
      ))}

      {typeof currentPage === 'number' ? (
        <PetSectionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paramName={paginationSearchParam}
          anchorId='examinations'
        />
      ) : null}
    </div>
  );
}

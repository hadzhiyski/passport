import TreatmentForm from '../treatment-form';

export default async function AddEchinococcusTreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='container py-10 flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-6'>
        Add Anti-Echinococcus Treatment
      </h1>
      <TreatmentForm petId={id} />
    </div>
  );
}

import VaccinationForm from './vaccination-form';

export default async function AddVaccinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='container py-10 flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-6'>Add Vaccination</h1>
      <VaccinationForm petId={id} />
    </div>
  );
}

import { PassportForm } from '@passport/components/passports/passport-form';

export default async function AddPassportPage(page: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await page.params;

  return <PassportForm petId={id} />;
}

import { redirect } from 'next/navigation';

export default async function FormCIndexPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/raise/${id}/form-c/issuer`);
}

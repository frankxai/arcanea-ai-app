import { redirect } from 'next/navigation';

interface Props { params: Promise<{ bookId: string }> }
export default async function SagaBookRedirect({ params }: Props) {
  const { bookId } = await params;
  redirect(`/books/${bookId}`);
}

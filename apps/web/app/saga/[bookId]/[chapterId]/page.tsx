import { redirect } from 'next/navigation';

interface Props { params: Promise<{ bookId: string; chapterId: string }> }
export default async function SagaChapterRedirect({ params }: Props) {
  const { bookId, chapterId } = await params;
  redirect(`/books/${bookId}/${chapterId}`);
}

import { redirect } from 'next/navigation';

interface Props { params: Promise<{ slug: string }> }
export default async function SagaDocRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/books/docs/${slug}`);
}

import { permanentRedirect } from 'next/navigation';
import { CINEMATIC_BOOK_ID } from '@/lib/books/cinematic-edition';

export default function BooksPage() {
  permanentRedirect(`/books/${CINEMATIC_BOOK_ID}`);
}

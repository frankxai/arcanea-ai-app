import { CursorFollower } from '@/components/motion/cursor-follower';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorFollower />
      {children}
    </>
  );
}

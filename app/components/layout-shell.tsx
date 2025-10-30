"use client";

import { usePathname } from 'next/navigation';
import BottomNavBar from './bottom-navbar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottom = pathname !== '/';
  return (
    <div>
      <main>{children}</main>
      {showBottom && <BottomNavBar />}
    </div>
  );
}

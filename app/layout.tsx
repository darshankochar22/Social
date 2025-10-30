
import { ReactNode } from 'react';
import './globals.css';
import LayoutShell from './components/layout-shell';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>
          {children}
        </LayoutShell>

      </body>
    </html>
  );
}
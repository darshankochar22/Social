
import { ReactNode } from 'react';
import './globals.css';
import Navbar from './components/navbar';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>

      </body>
    </html>
  );
}
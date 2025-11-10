import '../globals.css';
import { ReactNode } from 'react';
import Metadata from '../../components/metadata';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="font-['Geist']">
      <Metadata />
      <body>{children}</body>
    </main>
  )
}
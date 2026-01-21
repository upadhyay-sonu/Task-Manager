import type { Metadata } from 'next';
import { ToastContainer } from '@/components';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Task Management - Organize Your Work',
  description: 'A production-ready task management application with modern UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

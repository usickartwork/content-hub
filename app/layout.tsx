import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dream Field Workspace',
  description: 'Sistem Jobdesk & Estafet Konten Dream Field',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
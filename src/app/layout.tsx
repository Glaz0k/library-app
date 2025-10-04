import SessionWrapper from '@/components/SessionWrapper';
import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Library',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru">
      <body>
        <SessionWrapper session={session}>{children}</SessionWrapper>
      </body>
    </html>
  );
}

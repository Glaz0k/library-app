import SessionWrapper from '@/components/SessionWrapper';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import { authOptions } from '@/lib/auth';
import { Box, Stack } from '@mui/material';
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
      <body style={{ margin: 0 }}>
        <SessionWrapper session={session}>
          <TopBar />
          <Stack direction="row" flex={1} padding={0}>
            <SideBar />
            <Box flex={1} paddingInline={20}>
              {children}
            </Box>
          </Stack>
        </SessionWrapper>
      </body>
    </html>
  );
}

'use client';

import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';

export default function TopBar() {
  const { data } = useSession();
  const { username, role } = data!.user;

  return (
    <>
      <AppBar>
        <Toolbar>
          <Stack
            direction="row"
            flex={1}
            spacing={10}
            sx={{ alignItems: 'center' }}
          >
            <Typography variant="h4" flex={1}>
              {'Library'}
            </Typography>
            <Typography variant="h5">{`${username} | ${role}`}</Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => signOut()}
            >
              {'Sign Out'}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

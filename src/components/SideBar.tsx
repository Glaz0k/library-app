'use client';

import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const pathname = usePathname();

  return (
    <Box height="100%" width={200}>
      <List>
        <ListItemButton
          href="/journal"
          selected={pathname.startsWith('/journal') || pathname === '/'}
        >
          <ListItemText primary="Journal" />
        </ListItemButton>
        <ListItemButton
          href="/clients"
          selected={pathname.startsWith('/clients')}
        >
          <ListItemText primary="Clients" />
        </ListItemButton>
        <ListItemButton href="/books" selected={pathname.startsWith('/books')}>
          <ListItemText primary="Books" />
        </ListItemButton>
        <ListItemButton
          href="/book-types"
          selected={pathname.startsWith('/book-types')}
        >
          <ListItemText primary="Book Types" />
        </ListItemButton>
      </List>
    </Box>
  );
}

import { clients, db } from '@/db';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default async function Home() {
  const allClients = await db.select().from(clients);

  return (
    <>
      <Typography variant="h3">{'Список клиентов'}</Typography>
      <List>
        {allClients.map((client) => (
          <ListItem key={client.id}>
            <ListItemText primary={`${client.lastName} ${client.firstName}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

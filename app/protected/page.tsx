// protected.tsx
import { getUserInfo, getSession } from '@/lib/client/supabase';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email'; // For representing email
import PersonIcon from '@mui/icons-material/Person'; // For representing the user's name
import LocationOnIcon from '@mui/icons-material/LocationOn'; // For representing location
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // For representing the join date
import InfoIcon from '@mui/icons-material/Info'; // For representing additional info or bio

// Sample function to format dates
const formatDate = (dateString: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('da-DK', options); // Added 'da-DK' locale for Danish formatting
};

//import { redirect } from 'next/navigation';

// Revalidation period set to 3600 seconds (1 hour) for data
// Note: For server components, direct management of caching and re-fetching is within your data fetching utilities.
// This serves as a conceptual application; adjust based on actual data management needs.
// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating

export const revalidate = 3600;

export default async function ProtectedPage() {
  const session = await getSession();

  // Optional: Redirect if no session is found
  // Uncomment the next line to enable redirecting to the login page if the user is not logged in
  // This can also be chcked in the edge middleware.
  // if (!session) return redirect('/login');

  if (!session) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          You must be logged in to view this page.
        </Typography>
      </Container>
    );
  }

  const userInfo = await getUserInfo(session.user.id);

  if (!userInfo) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
          Error fetching user information.
        </Typography>
      </Container>
    );
  }

  // Hypothetical user attributes (example)
  // In a real application, this information would be retrieved from a Supabase schema
  // along with other user details. Here, it's included as a static example.

  const userAttributes = {
    location: 'Copenhagen, Denmark',
    joinDate: formatDate(new Date()),
    bio: 'Developer with a passion for web technologies and open source. Loves exploring new techniques and collaborating on global projects.'
  };

  return (
    <Container>
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar
                sx={{ bgcolor: 'secondary.main', mb: 2, width: 56, height: 56 }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome, {userInfo.full_name}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary={userInfo.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={userAttributes.location} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Joined: ${formatDate(new Date() as Date)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary={userAttributes.bio} />
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

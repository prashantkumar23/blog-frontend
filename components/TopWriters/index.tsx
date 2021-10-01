import Link from "next/link";
import { Typography } from "@mui/material";
import Image from "next/image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

interface TopWritersProps {
  listOfUsers: any;
}

export const TopWriters: React.FC<TopWritersProps> = ({ listOfUsers }) => {
  return (
    <div>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        subheader={<Typography variant="h5">Outstanding writers 😎</Typography>}
      >
        {listOfUsers &&
          listOfUsers.users.map((user: any) => {
            return (
              <Link href={`/${user.name}`} passHref key={user.id}>
                <ListItem sx={{ cursor: "pointer" }}>
                  <ListItemAvatar>
                    <Avatar>
                      <Image src={user.image} layout="fill" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary="75 blogs" />
                </ListItem>
              </Link>
            );
          })}
      </List>
    </div>
  );
};

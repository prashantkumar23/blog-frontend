import { useQuery } from "react-query";
import Link from "next/link";
import { Typography, Skeleton } from "@mui/material";
import Image from "next/image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import getListOfUsers from "../../graphql/queries/user/getListOfUsers";

export default function TopWriters() {
  const {
    data: ListOfUsers,
    isLoading,
    isSuccess,
  } = useQuery("listOfUsers", getListOfUsers);

  return (
    <div>
      {isLoading && <Skeleton variant="rectangular" />}
      {!isLoading && isSuccess && (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          subheader={
            <Typography variant="h5">Outstanding writers 😎</Typography>
          }
        >
          {ListOfUsers &&
            ListOfUsers.users.map((user: any) => {
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
      )}
    </div>
  );
}

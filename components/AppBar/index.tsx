import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Stack,
  IconButton,
  Menu,
  Avatar,
  MenuItem,
  Divider,
  Tooltip,
  styled,
} from "@mui/material";
import NextNprogress from "nextjs-progressbar";
import Image from "next/image";
import { signIn, signOut } from "next-auth/client";
import Logout from "@mui/icons-material/Logout";
import { createStyles, makeStyles } from "@mui/styles";
import ListItemIcon from "@mui/material/ListItemIcon";
import Link from "next/link";

import { useSession } from "../../next-react-query";
import AutocompleteSearch from "../AutocompleteSearch";
import { CustomButton } from "../Button";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  // Override media queries injected by theme.mixins.toolbar
  "@media all": {
    minHeight: 100,
  },
}));

const SearchAvatarContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const useStyles = makeStyles(() =>
  createStyles({
    appBarLayout: {
      flexGrow: 1,
      minHeight: "100vh",
    },
    avatar: {
      width: "2rem",
      height: "2rem",
    },
  })
);

export const AppBarLayout = () => {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "3rem" }}>
      <AppBar position="static" elevation={0}>
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <StyledToolbar>
          <Link href="/" passHref>
            <Avatar
              variant="square"
              sx={{
                width: "13rem",
                height: "5rem",
                paddingTop: 0,
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <Image src="/logo.png" layout="fill" />
            </Avatar>
          </Link>
        </StyledToolbar>
        <SearchAvatarContainer
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <AutocompleteSearch />
          {!loading && !session && (
            <CustomButton
              disableFocusRipple
              disableTouchRipple
              disableRipple
              onClick={(e) => {
                e.preventDefault();
                signIn("google");
              }}
              disableElevation
            >
              Login
            </CustomButton>
          )}
          {session && (
            <Tooltip title="Account settings">
              <IconButton
                aria-label="profile pic"
                edge="end"
                color="inherit"
                onClick={handleClick}
              >
                <Avatar className={classes.avatar}>
                  <Image src={session.user.image} width="100%" height="100%" />
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </SearchAvatarContainer>
      </AppBar>
      {session && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              borderRadius: "0.8rem",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: "10rem",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {session && (
            <div>
              <Link href={"/profile"} passHref>
                <MenuItem>My account</MenuItem>
              </Link>
              <Link href={"/write"} passHref>
                <MenuItem>Write a Blog</MenuItem>
              </Link>
            </div>
          )}

          <Divider />
          {session && (
            <Link href="/api/auth/signout" passHref>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Link>
          )}
        </Menu>
      )}
    </Box>
  );
};

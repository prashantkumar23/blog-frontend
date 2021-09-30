import { makeStyles, createStyles } from "@mui/styles";
import { Paper, Container } from "@mui/material";
import React from "react";

import { AppBarLayout } from "../../components/AppBar";

const useStyles = makeStyles(() =>
  createStyles({
    appBarLayout: {
      flexGrow: 1,
      minHeight: "100vh",
    },
  })
);

export const AppLayout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.appBarLayout}>
      <Container maxWidth="lg">
        <AppBarLayout />
        {children}
      </Container>
    </Paper>
  );
};

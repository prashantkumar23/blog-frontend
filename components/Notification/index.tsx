import React from "react";
import { Snackbar, Alert, AlertColor, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: "0.75rem",
    borderStyle: "solid",
    borderColor: "transparent",
    borderWidth: "0.05rem",
  },
}));

interface NotificationProps {
  notify: {
    isOpen: boolean;
    message: string;
    type: AlertColor | undefined;
  };
  setNotify: (notify: any) => void;
}

const Notification: React.FC<NotificationProps> = ({ notify, setNotify }) => {
  const { isOpen, message, type } = notify;
  const classes = useStyles();

  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };

  function TransitionDown(props: TransitionProps) {
    return <Slide {...props} direction="down" timeout={100} />;
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      TransitionComponent={TransitionDown}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert severity={type} onClose={handleClose} className={classes.root}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

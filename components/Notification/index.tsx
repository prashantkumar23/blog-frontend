import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   root: {},
// }));

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
  //   const classes = useStyles();

  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert severity={type} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

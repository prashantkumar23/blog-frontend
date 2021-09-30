import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    dialog: {
      padding: "2rem",
      position: "absolute",
      top: "13rem",
      backgroundColor: "background.default",
    },
    dialogTitle: {
      textAlign: "center",
    },
    dialogContent: {
      textAlign: "center",
    },
    dialogAction: {
      justifyContent: "center",
    },
    titleIcon: {
      backgroundColor: "background.default",
      color: "background.paper",
      "&:hover": {
        backgroundColor: "background.default",
        cursor: "default",
      },
      "& .MuiSvgIcon-root": {
        fontSize: "8rem",
      },
    },
  })
);

export interface ConfirmDialogProps {
  confirmDialog: {
    isOpen: boolean;
    title: string;
    subtitle: string;
    onConfirm?: () => void;
  };
  setConfirmDialog: (confirmDialog: any) => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmDialog,
  setConfirmDialog,
  loading,
}) => {
  const { isOpen, title, subtitle, onConfirm } = confirmDialog;
  const classes = useStyles();

  return (
    <Dialog open={isOpen} classes={{ paper: classes.dialog }}>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6" color="secondary">
          {title}
        </Typography>
        <Typography variant="caption" color="secondary">
          {subtitle}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          disabled={loading}
        >
          No
        </Button>
        <Button onClick={onConfirm} disabled={loading}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { CustomButton } from "../Button";

const useStyles = makeStyles(() =>
  createStyles({
    dialog: {
      padding: "2rem",
      position: "absolute",
      top: "13rem",
      backgroundColor: "background.default",
      borderRadius: "1rem",
      borderStyle: "solid",
      borderColor: "transparent",
      borderWidth: "0.05rem",
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
  })
);

export interface ConfirmDialogProps {
  confirmDialog: {
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    noButtonText: string;
    yesButtonText: string;
    loading?: boolean;
    onConfirm: () => void;
  };
  setConfirmDialog: (confirmDialog: any) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmDialog,
  setConfirmDialog,
}) => {
  const {
    isOpen,
    title,
    subtitle,
    onConfirm,
    yesButtonText,
    noButtonText,
    loading,
  } = confirmDialog;
  const classes = useStyles();

  return (
    <Dialog open={isOpen} classes={{ paper: classes.dialog }} maxWidth="xs">
      <DialogContent className={classes.dialogContent}>
        <Typography variant="body1" color="secondary">
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "#aaa" }}>
          {subtitle}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <CustomButton
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          disabled={loading}
        >
          {noButtonText}
        </CustomButton>
        <CustomButton onClick={onConfirm} disabled={loading}>
          {yesButtonText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

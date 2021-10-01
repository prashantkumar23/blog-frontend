import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

export const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "background.default",
  "&:hover": {
    backgroundColor: "black",
    color: "white",
  },
  [theme.breakpoints.only("xs")]: {
    minWidth: "4rem",
    fontSize: "0.8rem",
  },
  minWidth: "6rem",
  height: "2rem",
  color: "black",
  padding: ".15rem 1rem",
  borderRadius: "0.5rem",
  borderStyle: "solid",
  borderColor: "black",
  borderWidth: "0.05rem",
  textTransform: "none",
}));

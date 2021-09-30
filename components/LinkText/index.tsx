import { Typography, TypographyProps } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import Link from "next/link";

interface LinkTextProps {
  href?: string;
  variantText?: TypographyProps;
  linkText: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    linkText: {
      cursor: "pointer",
      margin: "1rem",
    },
  })
);

export const LinkText: React.FC<LinkTextProps> = ({ href = "#", linkText }) => {
  const classes = useStyles();

  return (
    <Link href={href} passHref>
      <Typography variant="h6" className={classes.linkText}>
        {linkText}
      </Typography>
    </Link>
  );
};

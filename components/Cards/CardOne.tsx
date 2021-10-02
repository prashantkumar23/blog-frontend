import Box from "@mui/material/Box";
import Link from "next/link";
import Image from "next/image";
import { Paper, Typography, Avatar, Stack, Chip } from "@mui/material";

import { TOPICS } from "../../utils/topics";
// import useMediaQuery from "@mui/material/useMediaQuery";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CardOne {
  blogId: string;
  blogTitle: string;
  blogImageUrl: string;
  tags: string[];
  createdAt: string;
  userId?: string;
  name?: string;
  image?: string;
  minWidth?: number;
  maxWidth?: number;
}

const truncate = (input: string, length: number) => {
  return input.length > 5 ? `${input.substring(0, length)}...` : input;
};

export const CardOne: React.FC<CardOne> = ({
  blogId,
  blogTitle,
  blogImageUrl,
  tags,
  createdAt,
  // userId = "",
  name = "",
  image = undefined,
}) => {
  // const matches = useMediaQuery("(min-width:600px)");

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderRadius: "0.5rem",
        width: { xs: 380, sm: 500 },
        borderColor: "#99a3a4",
        borderWidth: "0.05rem",
        borderStyle: "solid",
        cursor: "pointer",
      }}
    >
      {/*  */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          m: 1,
          minWidth: { xs: "55%", sm: "70%" },
        }}
      >
        {/* *******************HEADER******************* */}
        <Box
          sx={{
            fontSize: "0.9rem",
            width: "100%",
          }}
        >
          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Link href={`${name}`} passHref>
              <Stack flexDirection="row" columnGap={1}>
                {image ? (
                  <Avatar sx={{ width: 20, height: 20 }}>
                    <Image src={image} layout="fill" />
                  </Avatar>
                ) : null}
                <Typography color="secondary" sx={{ fontSize: "0.8rem" }}>
                  {name}
                </Typography>
              </Stack>
            </Link>
          </Stack>
        </Box>

        {/* *****************BODY***************************** */}
        <Link href={`blog/${blogId}`} passHref>
          <Box
            sx={{
              fontSize: { xs: "0.9rem", sm: "1.3rem" },
              mt: 1,
              fontWeight: "bold",
              width: "100%",
            }}
          >
            {truncate(`${blogTitle}`, 25)}
          </Box>
        </Link>

        {/* ************** FOOTER ******************* */}
        <Stack
          flexDirection="row"
          columnGap={2}
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Box
            component="span"
            sx={{
              mt: 1,
            }}
          >
            <Typography color="secondary" sx={{ fontSize: "0.8rem" }}>
              {`${new Date(createdAt).getDate()} ${
                months[new Date(createdAt).getMonth()]
              }`}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" columnGap={1}>
            {tags.slice(0, 2).map((tag, index) => {
              const color = TOPICS.find(
                (topic) => topic.topicName === tag
              )?.topicColorCode;

              return (
                <Link href={`/topics/${tag}`} key={index}>
                  <Chip
                    label={tag}
                    clickable
                    sx={{
                      fontSize: "0.6rem",
                      backgroundColor: color ? color : "background.default",
                    }}
                    size="small"
                  />
                </Link>
              );
            })}
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          objectPosition: "bottom",
          height: "auto",
          width: "100%",
          m: 1,
          borderRadius: "0.25rem",
          overflow: "hidden",
        }}
      >
        <Image
          layout="responsive"
          src={blogImageUrl}
          height="auto"
          width="100%"
          objectFit="cover"
        />
      </Box>
    </Paper>
  );
};

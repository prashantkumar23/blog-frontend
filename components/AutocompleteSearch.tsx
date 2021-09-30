import { useState, useMemo, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import throttle from "lodash/throttle";
import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { Typography, Paper } from "@mui/material";
import Link from "next/link";

import { client } from "../pages";

interface BlogType {
  _id: string;
  title: string;
}

function useSearch(term: string) {
  return useQuery(
    "searchResult",
    async () => {
      const data = await client.request(
        gql`
          query Query($searchCreateBlogInput: SearchInput!) {
            search(createBlogInput: $searchCreateBlogInput) {
              result {
                _id
                title
              }
            }
          }
        `,
        {
          searchCreateBlogInput: {
            term,
          },
        }
      );
      return data.search.result;
    },
    {
      enabled: false,
    }
  );
}

export default function AutocompleteSearch() {
  const [value, setValue] = useState<BlogType | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly BlogType[]>([]);
  const [open, setOpen] = useState(false);

  const { refetch } = useSearch(inputValue);

  const fetch = useMemo(
    () =>
      throttle(async (_, callback: (results?: readonly BlogType[]) => void) => {
        refetch().then((res) => {
          callback(res.data);
        });
      }, 2000),
    []
  );

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly BlogType[]) => {
      if (active) {
        let newOptions: readonly BlogType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      getOptionLabel={(option) => option.title}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      size="small"
      includeInputInList
      filterSelectedOptions
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      PaperComponent={(props) => (
        <Paper
          {...props}
          elevation={0}
          sx={{
            // borderRadius: "0.25rem",
            borderWidth: "0 0.05rem 0.05rem 0.05rem",
            borderStyle: "solid",
            borderTopColor: "transparent",
          }}
        />
      )}
      value={value}
      sx={{
        maxWidth: 400,
        minWidth: 300,
      }}
      onChange={(_, newValue: BlogType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      popupIcon={null}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          variant="standard"
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
            style: {
              fontSize: "1.5rem",
            },
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
          placeholder="Search blogs"
        />
      )}
      renderOption={(props, option) => {
        return (
          <Link
            href={`/blog/${option._id}`}
            passHref
            key={option._id + Math.random()}
          >
            <li {...props}>
              <Typography>{option.title}</Typography>
            </li>
          </Link>
        );
      }}
    />
  );
}

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { createEditor, Descendant, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import escapeHtml from "escape-html";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { withHistory } from "slate-history";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "../../next-react-query";
import { getSession, GetSessionOptions } from "next-auth/client";
import {
  Container,
  Stack,
  IconButton,
  Autocomplete,
  Paper,
  Button,
  InputBase,
  AlertColor,
  Chip,
  Checkbox,
  TextField,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import PublishIcon from "@mui/icons-material/Publish";
import ClearIcon from "@mui/icons-material/Clear";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/Dialog";
import { CodeElement } from "../../components/Editor/CodeElement";
import { CustomEditor } from "../../components/Editor";
import { DefaultElement } from "../../components/Editor/DefaultElement";
import { Image } from "../../components/Editor/plugins/withImages";
import { withLinks } from "../../components/Editor/plugins/withLinks";
import Toolbar from "../../components/Editor/components/Toolbar";
import createBlog from "../../graphql/mutations/blog/createBlog";
import { withImages } from "../../components/Editor/plugins/withImages";
import uploadBlogCover from "../../graphql/mutations/blog/uploadBlogCover";
import { validateCreateBlogInputs } from "../../utils/validation";
import { TOPICS } from "../../utils/topics";

const useStyles = makeStyles(() =>
  createStyles({
    appBarLayout: {
      flexGrow: 1,
      minHeight: "100vh",
    },
    paper: {
      border: "5px solid black",
    },
    tag: {
      border: "5px solid black",
    },
  })
);

const serialize = (node: any): any => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }

    if (node.italic) {
      string = `<em>${string}</em>`;
    }

    if (node.underline) {
      string = `<p style={text-decoration: "underline"}>${string}</p>`;
    }
    return string;
  }

  const children = node.children.map((n: Node) => serialize(n)).join("");

  switch (node.type) {
    case "block-quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    case "image":
      return ` <img
          src={${node.url}}
          width="100%"
          height="100%"
        />`;
    case "code":
      return `<pre>
          <code>${children}</code>
        </pre>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    default:
      return children;
  }
};

export default function CustomEditorPage() {
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  const [notify, setNotify] = useState<{
    isOpen: boolean;
    message: string;
    type: AlertColor | undefined;
  }>({
    isOpen: false,
    message: "",
    type: undefined,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    onConfirm: () => console.log(""),
  });

  const editor = useMemo(
    () => withImages(withLinks(withHistory(withReact(createEditor())))),
    []
  );

  const router = useRouter();
  const [session] = useSession();
  const classes = useStyles();

  const [blogData, setBlogData] = useState<{
    title: string;
    body: string;
    tags: string[];
    blogImageUrl: string;
  }>({
    title: "",
    body: JSON.stringify(initialValue),
    tags: [],
    blogImageUrl: "",
  });

  const [images, setImages] = React.useState([]);

  const uploadMutation = useMutation((picString: string) =>
    uploadBlogCover(picString)
  );

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (uploadMutation.isSuccess) {
      const imageUrl = uploadMutation.data.url;

      setBlogData((prevState: any) => {
        return {
          ...prevState,
          blogImageUrl: imageUrl,
        };
      });
    }
  }, [uploadMutation.isSuccess]);

  const onChange = (
    imageList: ImageListType
    // addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
    if (imageList.length > 0 && imageList[0].dataURL) {
      uploadMutation.mutate(imageList[0].dataURL);
      // compressImage(imageList[0].file!).then((picString) => {

      // });
    }
  };

  const createBlogMutation = useMutation(createBlog);

  const [search, setSearch] = useState<string | undefined>("");

  if (createBlogMutation.isSuccess) {
    router.push("/");
  }

  const handlePublish = () => {
    const obj = {
      ...blogData,
      userId: session.user.id,
      body: serialize({ children: JSON.parse(blogData.body) }),
    };
    console.log(obj);
    validateCreateBlogInputs(obj)
      ? createBlogMutation.mutate(obj)
      : setNotify({
          isOpen: true,
          message: "Fill up your inputs correctly",
          type: "info",
        });
  };

  const decorate = useCallback(
    ([node, path]) => {
      const ranges: any = [];

      if (search && Text.isText(node)) {
        const { text } = node;
        const parts = text.split(search);
        let offset = 0;

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            });
          }

          offset = offset + part.length + search.length;
        });
      }

      return ranges;
    },
    [search]
  );

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "block-quote":
        return (
          <blockquote
            {...props.attributes}
            style={{
              background: "#f9f9f9",
              borderLeft: "10px solid #ccc",
              margin: "1.5em 10px",
              padding: "0.5em 10px",
              quotes: '"“" "”" "‘" "’"',
              "&:before": {
                color: "#ccc",
                content: "open-quote",
                fontSize: "4em",
                lineHeight: "0.1em",
                marginRight: "0.25em",
                verticalAlign: "-0.4em",
              },
              "> p": {
                display: "inline",
              },
            }}
          >
            <p>{props.children}</p>
          </blockquote>
        );
      case "code":
        return <CodeElement {...props} />;
      case "heading-one":
        return <h1 {...props.attributes}>{props.children}</h1>;
      case "heading-two":
        return <h2 {...props.attributes}>{props.children}</h2>;
      case "list-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "image":
        return <Image {...props} />;
      case "numbered-list":
        return (
          <ol {...props.attributes} type="1">
            {props.children}
          </ol>
        );
      case "link":
        return (
          <a {...props.attributes} href={props.element.url}>
            {props.children}
          </a>
        );
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.code) {
      children = <code>{children}</code>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return (
      <span
        {...attributes}
        {...(leaf.highlight && { "data-cy": "search-highlighted" })}
        style={{
          fontWeight: `${leaf.bold && "bold"}`,
          backgroundColor: `${leaf.highlight && "#ffeeba"}`,
        }}
      >
        {children}
      </span>
    );
  }, []);

  return (
    <Paper elevation={0} className={classes.appBarLayout}>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        loading={false}
      />
      <Container maxWidth="md" sx={{ paddingTop: "3rem" }}>
        <Stack rowGap={2} flexDirection="column">
          {/* PUBLISH AND CANCEL BUTTON */}
          <Stack flexDirection="row" justifyContent="space-between">
            <IconButton
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Are you sure to stop writing this blog",
                  subtitle: "",
                  onConfirm: () => {
                    router.push("/");
                  },
                });
              }}
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Are you sure to publish this blog",
                  subtitle: "",
                  onConfirm: () => {
                    handlePublish();
                  },
                });
              }}
            >
              <PublishIcon />
            </IconButton>
          </Stack>

          <Stack flexDirection="column" justifyContent="flex-start">
            {/* ADD COVER IMAGE */}
            <div>
              <ImageUploading value={images} onChange={onChange}>
                {({
                  imageList,
                  onImageUpload,
                  onImageUpdate,
                  onImageRemove,
                  dragProps,
                }) => (
                  <div>
                    {imageList.length > 0 ? null : (
                      <Button
                        disableElevation
                        style={{
                          textTransform: "none",
                        }}
                        onClick={onImageUpload}
                        {...dragProps}
                        variant="outlined"
                      >
                        Add a cover image
                      </Button>
                    )}

                    {imageList.map((image, index) => (
                      <div key={index}>
                        {image.dataURL ? (
                          <img
                            src={image.dataURL}
                            alt=""
                            style={{
                              borderRadius: "0.5rem",
                              marginTop: "1rem",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        ) : null}

                        <div>
                          <Button
                            onClick={() => onImageUpdate(index)}
                            sx={{ textTransform: "none" }}
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => onImageRemove(index)}
                            sx={{ textTransform: "none" }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading>
            </div>
            {/* BLOG TITLE INPUT */}
            <InputBase
              fullWidth
              placeholder="Enter the Title"
              onChange={(e) => {
                setBlogData({ ...blogData, title: e.target.value });
              }}
              size="small"
              style={{
                marginTop: "2rem",
                fontSize: "2.5rem",
                color: "primary.text",
              }}
            />
          </Stack>
          {/* BLOG TOPICS INPUT */}
          <Stack flexDirection="row" justifyContent="flex-start">
            <Autocomplete
              fullWidth
              multiple
              open={open}
              onChange={(_, v) => {
                setBlogData({ ...blogData, tags: v.map((a) => a.topicName) });
              }}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    sx={{
                      backgroundColor: option.topicColorCode,
                    }}
                    variant="outlined"
                    label={option.topicName}
                    {...getTagProps({ index })}
                  />
                ))
              }
              size="small"
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={(option) => option.topicName}
              getOptionDisabled={() =>
                blogData.tags.length >= 2 ? true : false
              }
              options={TOPICS}
              disableCloseOnSelect
              limitTags={3}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    sx={{
                      marginRight: 2,
                    }}
                    checked={selected}
                  />
                  {option.topicName}
                </li>
              )}
              popupIcon={null}
              PaperComponent={(props) => <Paper {...props} elevation={0} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="select upto two topics"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </Stack>
        {/* BLOG BODY */}
        <Slate
          editor={editor}
          value={JSON.parse(blogData.body)}
          onChange={(value) => {
            setBlogData({ ...blogData, body: JSON.stringify(value) });

            // const isAstChange = editor.operations.some(
            //   (op) => "set_selection" !== op.type
            // );
            // if (isAstChange) {
            //   // Save the value to Local Storage.
            //   const content = JSON.stringify(value);
            //   localStorage.setItem("content", content);
            // }
          }}
        >
          <Stack
            flexDirection="column"
            justifyContent="flex-start"
            rowGap={2}
            sx={{ mt: "1rem" }}
          >
            <Stack flexDirection="row" justifyContent="space-between">
              <Toolbar />
              <InputBase
                type="search"
                placeholder="Search the text..."
                onChange={(e) => setSearch(e.target.value)}
                size="small"
              />
            </Stack>

            <Editable
              spellCheck={false}
              renderElement={renderElement}
              placeholder="Write something awesome!!"
              style={{
                // borderColor: "transparent",
                // borderWidth: "0.025rem",
                // borderStyle: "solid",
                height: "70vh",
                padding: "1rem",
              }}
              // onDOMBeforeInput={(event: InputEvent) => {
              //   event.preventDefault();
              //   switch (event.inputType) {
              //     case "formatBold":
              //       return toggleFormat(editor, "bold");
              //     case "formatItalic":
              //       return toggleFormat(editor, "italic");
              //     case "formatUnderline":
              //       return toggleFormat(editor, "underlined");
              //   }
              // }}
              renderLeaf={renderLeaf}
              decorate={decorate}
              onKeyDown={(event) => {
                if (!event.ctrlKey) {
                  return;
                }

                switch (event.key) {
                  case "`": {
                    event.preventDefault();
                    CustomEditor.toggleBlock(editor, "code");
                    break;
                  }

                  case "b": {
                    event.preventDefault();
                    CustomEditor.toggleBoldMark(editor);
                    break;
                  }

                  case "u": {
                    event.preventDefault();
                    CustomEditor.toggleUnderlineMark(editor);
                    break;
                  }

                  case "i": {
                    event.preventDefault();
                    CustomEditor.toggleItalicMark(editor);
                    break;
                  }

                  default:
                    break;
                }
              }}
            />
          </Stack>
        </Slate>
      </Container>
    </Paper>
  );
}

export async function getServerSideProps(
  context: GetSessionOptions | undefined
) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=http://localhost:3000/write",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

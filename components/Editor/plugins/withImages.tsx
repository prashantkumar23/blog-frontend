import isUrl from "is-url";
import imageExtensions from "image-extensions";
import { Transforms, BaseEditor } from "slate";
import {
  useSelected,
  useFocused,
  ReactEditor,
  useSlateStatic,
} from "slate-react";
import { HistoryEditor } from "slate-history";
import React from "react";
import ImageIcon from "@mui/icons-material/Image";
import { ImageElement } from "..";
import { IconButton } from "@material-ui/core";

export const withImages = (
  editor: BaseEditor & ReactEditor & HistoryEditor
) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url as any);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const Image = ({ attributes, children, element }: any) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "20em",
            boxShadow: `${selected && focused ? "0 0 0 2px blue" : "none"}`,
          }}
        />
      </div>
      {children}
    </div>
  );
};

export const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <IconButton
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        insertImage(editor, url as string);
      }}
    >
      <ImageIcon />
    </IconButton>
  );
};

const isImageUrl = (url: any) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext!);
};

const insertImage = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  url: string
) => {
  const text = { text: "" };
  const image: ImageElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

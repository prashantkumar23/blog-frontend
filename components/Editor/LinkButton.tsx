// import { Link } from "./components";
import React from "react";
import { BaseEditor, Transforms, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";
import { isLinkActive, unwrapLink } from "./plugins/withLinks";
import { Button } from "@mui/material";

type Link = {
  type: "link";
  url: string;
  children: { text: string }[];
};

export const wrapLink = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  url: string
) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: Link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const insertLink = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  url: string
) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const LinkButton = () => {
  const editor = useSlate();
  return (
    <Button
      disabled={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the link:");
        if (!url) return;
        insertLink(editor, url);
      }}
    >
      j
    </Button>
  );
};

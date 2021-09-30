import { ReactEditor, useSlate } from "slate-react";
import { isLinkActive, unwrapLink } from "../plugins/withLinks";
import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { wrapLink } from "../LinkButton";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { IconButton } from "@mui/material";

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
    <IconButton
      onMouseDown={(event: any) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the link:");
        if (!url) return;
        insertLink(editor, url);
      }}
      sx={{
        color: isLinkActive(editor) ? "black" : "#aaa",
      }}
    >
      <AddLinkIcon />
    </IconButton>
  );
};

export const RemoveLinkButton = () => {
  const editor = useSlate();

  return (
    <IconButton
      onMouseDown={() => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}
      sx={{
        color: isLinkActive(editor) ? "black" : "#aaa",
      }}
    >
      <LinkOffIcon />
    </IconButton>
  );
};

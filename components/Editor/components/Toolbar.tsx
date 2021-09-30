import { CustomEditor } from "..";
import { BaseEditor, Editor, Element as SlateElement } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { IconButton, Typography } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import { LinkButton, RemoveLinkButton } from ".";
import { InsertImageButton } from "../plugins/withImages";
import { HistoryEditor } from "slate-history";

export const isBlockActive = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  format: string
) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

export const isMarkActive = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  format: string | number
) => {
  const marks = Editor.marks(editor);
  //@ts-ignore
  return marks ? marks[format] === true : false;
};

export default function Toolbar() {
  const editor = useSlate();

  return (
    <div>
      {/* BOLD */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
        sx={{
          color: isMarkActive(editor, "bold") ? "black" : "#aaa",
        }}
      >
        <FormatBoldIcon />
      </IconButton>
      {/* ITALIC */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
        sx={{
          color: isMarkActive(editor, "italic") ? "black" : "#aaa",
        }}
      >
        <FormatItalicIcon />
      </IconButton>
      {/* UNDERLINE */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
        }}
        sx={{
          color: isMarkActive(editor, "underline") ? "black" : "#aaa",
        }}
      >
        <FormatUnderlinedIcon />
      </IconButton>
      {/* LIST ITEM */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "list-item");
        }}
        sx={{
          color: isBlockActive(editor, "list-item") ? "black" : "#aaa",
        }}
      >
        <FormatListBulletedIcon />
      </IconButton>
      {/* NUMBERED LIST */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "numbered-list");
        }}
        sx={{
          color: isBlockActive(editor, "numbered-list") ? "black" : "#aaa",
        }}
      >
        <FormatListNumberedIcon />
      </IconButton>
      {/* CODE BLOCK */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "code");
        }}
        sx={{
          color: isBlockActive(editor, "code") ? "black" : "#aaa",
        }}
      >
        <CodeIcon />
      </IconButton>
      {/* HEADING ONE */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "heading-one");
        }}
        sx={{
          color: isBlockActive(editor, "heading-one") ? "black" : "#aaa",
        }}
      >
        <Typography>H1</Typography>
      </IconButton>
      {/* HEADING TWO */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "heading-two");
        }}
        sx={{
          color: isBlockActive(editor, "heading-two") ? "black" : "#aaa",
        }}
      >
        <Typography>H2</Typography>
      </IconButton>
      {/* BLOCK-QUOTE */}
      <IconButton
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, "block-quote");
        }}
        sx={{
          color: isBlockActive(editor, "block-quote") ? "black" : "#aaa",
        }}
      >
        <FormatQuoteIcon />
      </IconButton>
      <InsertImageButton />
      <LinkButton />
      <RemoveLinkButton />
    </div>
  );
}

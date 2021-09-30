import React from "react";
import { BaseEditor, Transforms, Editor, Element } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";

import { Button } from "./components";

const isLinkActive = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
  return !!link;
};

const unwrapLink = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
};

export const RemoveLinkButton = () => {
  const editor = useSlate();

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={() => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}
    ></Button>
  );
};

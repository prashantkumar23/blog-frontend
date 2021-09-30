import {
  BaseEditor,
  Transforms,
  Editor,
  Text,
  Element as SlateElement
} from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { isBlockActive, isMarkActive } from "./components/Toolbar";


type Paragraph = {
  type: "paragraph";
  children: CustomText[];
};

type HeadingOne = {
  type: "heading-one";
  children: CustomText[];
};
type HeadingTwo = {
  type: "heading-two";
  children: CustomText[];
};

type ListItem = {
  type: "list-item";
  children: CustomText[];
};
type NumberedList = {
  type: "numbered-list";
  children: CustomText[];
};

type Code = {
  type: "code";
  childern: { text: string };
};

export type Link = {
  type: "link";
  url: string;
  children: CustomText[];
};

type BlockQuote = {
  type: "block-quote";
  children: { text: string };
};

export type ImageElement = {
  type: "image",
  url: string,
  children: { text: string }[];
}

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element:
    | Paragraph
    | Code
    | Link
    | BlockQuote
    | HeadingOne
    | HeadingTwo
    | ListItem
    | NumberedList
    | MentionElement
    | ImageElement;
    Text: CustomText;
  }
}
const LIST_TYPES = ['numbered-list', 'list-item']

export const CustomEditor = {
  toggleBoldMark(editor: BaseEditor & ReactEditor & HistoryEditor) {
    const isActive = isMarkActive(editor, "bold");
    Transforms.setNodes(
      editor,
      { bold: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleItalicMark(editor: BaseEditor & ReactEditor & HistoryEditor) {
    const isActive = isMarkActive(editor, "italic");
    Transforms.setNodes(
      editor,
      { italic: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleUnderlineMark(editor: BaseEditor & ReactEditor & HistoryEditor) {
    const isActive = isMarkActive(editor, "underline");
    Transforms.setNodes(
      editor,
      { underline: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },


  //Custom toggle for Heading-one Heading-two blockquote list-item numbered-list
  toggleBlock(editor: BaseEditor & ReactEditor & HistoryEditor, format: any) {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
      match: n =>
        LIST_TYPES.includes(
          //@ts-ignore
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
        ),
      split: true,
    })
    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  },

};

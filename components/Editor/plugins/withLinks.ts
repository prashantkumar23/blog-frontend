import isUrl from "is-url";
import { BaseEditor, Element, Editor, Range, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { Link } from "../types";

export const unwrapLink = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
    });
};



export const isLinkActive = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const [link] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
    });
    return !!link;
};

const wrapLink = (
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

export const withLinks = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = (element) => {
        return element.type === "link" ? true : isInline(element);
    };

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData("text/plain");

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};
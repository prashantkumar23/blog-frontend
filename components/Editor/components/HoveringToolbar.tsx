import React, { useRef, useEffect, Ref, PropsWithChildren } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, Transforms } from "slate";
import ReactDOM from "react-dom";
import { IconButton } from "@material-ui/core";
import { CustomEditor } from "..";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

// interface BaseProps {
//   className: string;
//   [key: string]: unknown;
// }
// type OrNull<T> = T | null;

export const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection!.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <div
        ref={ref}
        // className={css`
        //   padding: 8px 7px 6px;
        //   position: absolute;
        //   z-index: 1;
        //   top: -10000px;
        //   left: -10000px;
        //   margin-top: -6px;
        //   opacity: 0;
        //   background-color: #222;
        //   border-radius: 4px;
        //   transition: opacity 0.75s;
        // `}
      >
        {/* <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" /> */}
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          <FormatBoldIcon />
        </IconButton>
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleItalicMark(editor);
          }}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleUnderlineMark(editor);
          }}
        >
          <FormatUnderlinedIcon />
        </IconButton>
      </div>
    </Portal>
  );
};

// const FormatButton = ({ format }: any) => {
//   const editor = useSlate();
//   return (
//     <Button
//       reversed
//       active={isFormatActive(editor, format)}
//       onMouseDown={(event: any) => {
//         event.preventDefault();
//         toggleFormat(editor, format);
//       }}
//     >
//       H
//     </Button>
//   );
// };

// export const Button = React.forwardRef(
//   (
//     {
//       className,
//       active,
//       reversed,
//       ...props
//     }: PropsWithChildren<
//       {
//         active: boolean;
//         reversed: boolean;
//       } & BaseProps
//     >,
//     ref: Ref<OrNull<HTMLSpanElement>>
//   ) => <span {...props} ref={ref} />
// );

export const toggleFormat = (editor: any, format: any) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  return !!match;
};

// const Leaf = ({ attributes, children, leaf }: any) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>;
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>;
//   }

//   if (leaf.underlined) {
//     children = <u>{children}</u>;
//   }

//   return <span {...attributes}>{children}</span>;
// };

// export const Menu = React.forwardRef(
//   (
//     { className, ...props }: PropsWithChildren<BaseProps>,
//     ref: Ref<OrNull<HTMLDivElement>>
//   ) => <div {...props} ref={ref} />
// );

export const Portal = ({ children }: any) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

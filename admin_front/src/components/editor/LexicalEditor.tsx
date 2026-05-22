import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { $generateHtmlFromNodes } from "@lexical/html";
import type { EditorState, LexicalEditor as LexicalEditorType } from "lexical";
import { createContext } from "react";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import ImageUploadPlugin from "./plugins/ImageUploadPlugin";
import InitialContentPlugin from "./plugins/InitialContentPlugin";
import { ImageNode } from "./nodes/ImageNode";

import "./styles/editor.css";

export const ImageUploadDirectoryContext = createContext<string>('editor/images');

const theme = {
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    code: "editor-text-code",
  },
  link: "editor-link",
  code: "editor-code",
};

function onError(error: Error) {
  console.error(error);
}

interface LexicalEditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
  imageUploadDirectory?: string;
}

export default function LexicalEditor({ onChange, initialContent, imageUploadDirectory = 'editor/images' }: LexicalEditorProps) {
  const initialConfig = {
    namespace: "LexicalEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      CodeNode,
      LinkNode,
      ImageNode,
    ],
  };

  // Editor state change handler
  const handleChange = (editorState: EditorState, editor: LexicalEditorType) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange?.(htmlString);
    });
  };

  return (
    <ImageUploadDirectoryContext.Provider value={imageUploadDirectory}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" />
              }
              placeholder={
                <div className="editor-placeholder">Enter your content here...</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ImagesPlugin />
            <ImageUploadPlugin />
            <InitialContentPlugin initialContent={initialContent} />
            <DraggableBlockPlugin />
            <FloatingLinkEditorPlugin />
          </div>
        </div>
      </LexicalComposer>
    </ImageUploadDirectoryContext.Provider>
  );
}

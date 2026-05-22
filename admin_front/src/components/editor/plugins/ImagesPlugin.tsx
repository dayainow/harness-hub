"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  $isParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect, type JSX } from "react";

import { $createImageNode, ImageNode } from "../nodes/ImageNode";

export type InsertImagePayload = {
  altText: string;
  src: string;
  addNewLine?: boolean;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const selection = $getSelection();
        const imageNode = $createImageNode(payload);

        // If the current selection is a range selection
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const paragraph = $findMatchingParent(anchorNode, $isParagraphNode);

          // If paragraph exists and has content, create a new paragraph and insert image
          if (paragraph && paragraph.getTextContent().trim() !== "") {
            const imageParagraph = $createParagraphNode();
            imageParagraph.append(imageNode);
            paragraph.insertAfter(imageParagraph);

            // Add a new paragraph after the image (only on initial insertion)
            if (payload.addNewLine !== false) {
              const newParagraph = $createParagraphNode();
              imageParagraph.insertAfter(newParagraph);
              newParagraph.select();
            } else {
              imageParagraph.selectEnd();
            }

            return true;
          }
        }

        // Default behavior: insert at current position
        $insertNodes([imageNode]);
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }

        // Add a new paragraph after the image (only on initial insertion)
        if (payload.addNewLine !== false) {
          const newParagraph = $createParagraphNode();
          imageNode.getParentOrThrow().insertAfter(newParagraph);
          newParagraph.select();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

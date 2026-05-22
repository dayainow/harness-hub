"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $createParagraphNode,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_HIGH,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
} from "lexical";
import { $wrapNodeInElement } from "@lexical/utils";
import { $createImageNode, $isImageNode } from "../nodes/ImageNode";

const DRAG_DATA_FORMAT = "application/x-lexical-drag";

export default function DraggableBlockPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      DRAGOVER_COMMAND,
      (event: DragEvent) => {
        event.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      DROP_COMMAND,
      (event: DragEvent) => {
        const dragData = event.dataTransfer?.getData(DRAG_DATA_FORMAT);
        if (!dragData) {
          return false;
        }

        event.preventDefault();

        const { type, data } = JSON.parse(dragData);

        if (type !== 'image') {
          return false;
        }

        const target = event.target;
        if (!target || !(target instanceof HTMLElement)) {
          return false;
        }

        editor.update(() => {
          const targetNode = $getNearestNodeFromDOMNode(target);
          if (!targetNode) {
            return;
          }

          const draggedNode = $getNodeByKey(data.key);
          if (!draggedNode || !$isImageNode(draggedNode)) {
            return;
          }

          // Get the target element to insert after
          const targetElement = targetNode.getTopLevelElement();
          if (!targetElement) {
            return;
          }

          // Don't do anything if dropping on itself
          const draggedParent = draggedNode.getParent();
          if (draggedParent === targetElement) {
            return;
          }

          // Create a new image node with the same data
          const newImageNode = $createImageNode({
            src: data.src,
            altText: data.altText,
            width: data.width,
            height: data.height,
          });

          const oldParent = draggedNode.getParent();
          draggedNode.remove();

          if (oldParent && oldParent.getChildrenSize() === 0) {
            oldParent.remove();
          }

          targetElement.insertAfter(newImageNode);

          if ($isRootOrShadowRoot(newImageNode.getParentOrThrow())) {
            $wrapNodeInElement(newImageNode, $createParagraphNode).selectEnd();
          }
        });

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}

"use client";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import type React from 'react';
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  DRAGSTART_COMMAND,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
} from "lexical";

export interface ImagePayload {
  altText: string;
  key?: NodeKey;
  src: string;
  width?: number;
  height?: number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src } = domNode;
    const node = $createImageNode({ altText, src });
    return { node };
  }
  return null;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    src: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

function ImageComponent({
  src,
  altText,
  width,
  height,
  nodeKey,
}: {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [selection, setSelection] = useState<any>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [imageWidth, setImageWidth] = useState<number | undefined>(width);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        payload.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const onDragStart = useCallback(
    (event: DragEvent) => {
      const node = $getNodeByKey(nodeKey);
      if (!node || !isSelected) {
        return false;
      }
      const dataTransfer = event.dataTransfer;
      if (!dataTransfer) {
        return false;
      }
      dataTransfer.setData('text/plain', '_');
      dataTransfer.setData(
        'application/x-lexical-drag',
        JSON.stringify({
          type: 'image',
          data: {
            key: nodeKey,
            src,
            altText,
            width,
            height,
          },
        })
      );
      return true;
    },
    [nodeKey, isSelected, src, altText, width, height]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    if (containerRef.current && containerRef.current.contains(event.target as Node)) {
      event.preventDefault();
      return true;
    }
    return false;
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    return true;
  }, []);

  const onResizeStart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);

    const startX = event.clientX;
    const startWidth = imageRef.current?.offsetWidth || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.max(150, Math.min(startWidth + diff, window.innerWidth - 40));
      setImageWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);

      if (imageRef.current && imageWidth !== undefined) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node && node instanceof ImageNode) {
            const naturalHeight = imageRef.current!.naturalHeight;
            const naturalWidth = imageRef.current!.naturalWidth;
            const aspectRatio = naturalHeight / naturalWidth;
            const newHeight = Math.round(imageWidth * aspectRatio);
            node.setWidthAndHeight(imageWidth, newHeight);
          }
        });
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [editor, nodeKey, imageWidth]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload: MouseEvent) => {
          if (payload.target === imageRef.current) {
            if (!payload.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        onDragStart,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        onDragOver,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        onDrop,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected, onDragStart, onDragOver, onDrop]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: isSelected && !isResizing ? 'grab' : 'default',
        maxWidth: '100%',
      }}
      draggable={isSelected && !isResizing}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        style={{
          width: imageWidth ? `${imageWidth}px` : '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          cursor: 'default',
        }}
        draggable={false}
      />
      {isSelected && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px solid #1d4ed8',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: -6,
              width: 10,
              height: 10,
              backgroundColor: '#1d4ed8',
              border: '2px solid white',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 10,
              height: 10,
              backgroundColor: '#1d4ed8',
              border: '2px solid white',
              cursor: 'ew-resize',
              pointerEvents: 'auto',
            }}
            onMouseDown={onResizeStart}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: -6,
              width: 10,
              height: 10,
              backgroundColor: '#1d4ed8',
              border: '2px solid white',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              width: 10,
              height: 10,
              backgroundColor: '#1d4ed8',
              border: '2px solid white',
              cursor: 'ew-resize',
              pointerEvents: 'auto',
            }}
            onMouseDown={onResizeStart}
          />
        </>
      )}
    </div>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, src, width, height } = serializedNode;
    const node = $createImageNode({
      altText,
      src,
      width,
      height,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__width) {
      element.setAttribute("width", this.__width.toString());
    }
    if (this.__height) {
      element.setAttribute("height", this.__height.toString());
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      src: this.getSrc(),
      width: this.__width,
      height: this.__height,
      type: "image",
      version: 1,
    };
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createImageNode({
  altText,
  src,
  width,
  height,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, width, height, key)
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { $isImageNode } from "../nodes/ImageNode";
import { useUploadStore } from "@/stores/upload_store";
import { getUUID } from "@/lib/uuid";
import { toast } from "sonner";
import { ImageUploadDirectoryContext } from "../LexicalEditor";

const LowPriority = 1;

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { postPresignedUrl, confirmUpload } = useUploadStore();
  const directory = useContext(ImageUploadDirectoryContext);
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    } else if ($isNodeSelection(selection)) {
      // When an image is selected
      const nodes = selection.getNodes();
      if (nodes.length === 1) {
        const node = nodes[0];
        if ($isImageNode(node)) {
          const parent = node.getParent();
          if ($isLinkNode(parent)) {
            setIsLink(true);
          } else {
            setIsLink(false);
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    console.log('[Heading Button Clicked]', {
      requestedHeading: headingSize,
      currentBlockType: blockType,
      willApply: blockType !== headingSize
    });

    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        console.log('[Heading] Selection:', {
          isRangeSelection: $isRangeSelection(selection),
          selection
        });

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
          console.log('[Heading] Applied heading:', headingSize);
        } else {
          console.log('[Heading] Selection is not RangeSelection, heading not applied');
        }
      });
    } else {
      console.log('[Heading] Same heading as current, skipped');
    }
  };

  const insertLink = useCallback(() => {
    console.log('[Link Button Clicked]', {
      currentIsLink: isLink,
      action: !isLink ? 'Creating link' : 'Removing link'
    });

    editor.update(() => {
      const selection = $getSelection();
      console.log('[Link] Selection:', {
        isRangeSelection: $isRangeSelection(selection),
        isNodeSelection: $isNodeSelection(selection),
        selection
      });

      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        console.log('[Link] Selected text:', selectedText);
      }
    });

    if (!isLink) {
      console.log('[Link] Dispatching TOGGLE_LINK_COMMAND with "https://"');
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      console.log('[Link] Dispatching TOGGLE_LINK_COMMAND with null (removing link)');
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (supportedImageTypes.includes(file.type)) {
        try {
          // Extract file extension
          const extension = file.name.split('.').pop();
          // Generate UUID filename
          const filename = `${getUUID()}.${extension}`;
          // Request presigned URL
          const presignedData = await postPresignedUrl({
            directory,
            filename
          });

          if (!presignedData) {
            toast.error('Failed to prepare image upload.');
            e.target.value = '';
            return;
          }

          // Upload directly to S3
          const uploadResponse = await fetch(presignedData.presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type
            }
          });

          if (uploadResponse.ok) {
            // Request confirmation from backend after successful S3 upload
            const confirmed = await confirmUpload(Number(presignedData.id));

            if (confirmed) {
              // Insert image into the editor
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                src: presignedData.publicUrl,
                altText: file.name,
              });
              toast.success('Image uploaded successfully.');
            }
            // If confirmUpload fails, it already displays an error toast
          } else {
            toast.error('Failed to upload image.');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          toast.error('An error occurred during image upload.');
        }
      } else {
        toast.error("Unsupported image format. Only JPG, PNG, and GIF uploads are allowed.");
      }
    }
    // Reset input (to allow re-selecting the same file)
    e.target.value = '';
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => formatHeading("h1")}
        className={"toolbar-item spaced " + (blockType === "h1" ? "active" : "")}
        aria-label="Heading 1"
      >
        <i className="format h1" />
      </button>
      <button
        onClick={() => formatHeading("h2")}
        className={"toolbar-item spaced " + (blockType === "h2" ? "active" : "")}
        aria-label="Heading 2"
      >
        <i className="format h2" />
      </button>
      <button
        onClick={() => formatHeading("h3")}
        className={"toolbar-item spaced " + (blockType === "h3" ? "active" : "")}
        aria-label="Heading 3"
      >
        <i className="format h3" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <Divider />
      <button
        onClick={insertLink}
        className={"toolbar-item spaced " + (isLink ? "active" : "")}
        aria-label="Insert Link"
      >
        <i className="format link" />
      </button>
      <Divider />
      <label className="toolbar-item spaced" style={{ cursor: "pointer" }}>
        <i className="format image" />
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif, image/webp"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </label>
    </div>
  );
}

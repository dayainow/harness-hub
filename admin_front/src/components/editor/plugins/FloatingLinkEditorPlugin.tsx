"use client";

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { $isImageNode } from "../nodes/ImageNode";

function FloatingLinkEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<Selection | null>(null);
  const shouldHideRef = useRef(false);

  const updateLinkEditor = useCallback(() => {
    if (shouldHideRef.current) {
      return true;
    }

    const selection = $getSelection();
    let hasLink = false;

    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        hasLink = true;
        const url = linkParent.getURL();

        setLinkUrl(url);

        if (url === "https://") {
          setIsEditMode(true);
          setEditedLinkUrl(url);
        }
      } else {
        hasLink = false;
        setLinkUrl("");
      }
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length === 1) {
        const node = nodes[0];
        if ($isImageNode(node)) {
          const parent = node.getParent();
          if ($isLinkNode(parent)) {
            hasLink = true;
            const url = parent.getURL();
            setLinkUrl(url);

            if (url === "https://") {
              setIsEditMode(true);
              setEditedLinkUrl(url);
            }
          } else {
            hasLink = false;
            setLinkUrl("");
          }
        }
      }
    }

    const nativeSelection = window.getSelection();
    const rootElement = editor.getRootElement();

    if (hasLink && selection !== null && rootElement !== null) {
      let rect: DOMRect | null = null;

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length === 1 && $isImageNode(nodes[0])) {
          const imageNode = nodes[0];
          const domNode = editor.getElementByKey(imageNode.getKey());
          if (domNode) {
            rect = domNode.getBoundingClientRect();
          }
        }
      }
  
      else if ($isRangeSelection(selection) && nativeSelection && rootElement.contains(nativeSelection.anchorNode)) {
        const domRange = nativeSelection.getRangeAt(0);
        rect = domRange.getBoundingClientRect();
      }

      const editorRect = rootElement.getBoundingClientRect();

      if (rect && editorRef.current) {
    
        const editorWidth = editorRect.width;
        const padding = 20; 
        editorRef.current.style.maxWidth = `${editorWidth - padding}px`;

        let left = rect.left + window.scrollX - editorRef.current.offsetWidth / 2 + rect.width / 2;

        const minLeft = editorRect.left + window.scrollX + padding / 2;
        if (left < minLeft) {
          left = minLeft;
        }

        const maxLeft = editorRect.right + window.scrollX - editorRef.current.offsetWidth - padding / 2;
        if (left > maxLeft) {
          left = maxLeft;
        }

        editorRef.current.style.opacity = "1";
        editorRef.current.style.top = `${rect.bottom + window.scrollY + 10}px`;
        editorRef.current.style.left = `${left}px`;
      }
      setLastSelection(nativeSelection);
    } else {
      if (editorRef.current) {
        editorRef.current.style.opacity = "0";
        editorRef.current.style.top = "-10000px";
        editorRef.current.style.left = "-10000px";
      }
      setLastSelection(null);
      setLinkUrl("");
      setEditedLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    const scrollerElem = editor.getRootElement()?.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (linkUrl !== "") {
            setLinkUrl("");
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, updateLinkEditor, linkUrl]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rootElement = editor.getRootElement();

      if (editorRef.current && editorRef.current.contains(event.target as Node)) {
        return;
      }

      if (rootElement && rootElement.contains(event.target as Node)) {
        if (isEditMode) {
          if (linkUrl === "https://" || linkUrl === "") {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          } else {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const node = selection.anchor.getNode();
                const linkParent = $findMatchingParent(node, $isLinkNode);
                if (linkParent) {
                  const nextSibling = linkParent.getNextSibling();
                  if (nextSibling) {
                    nextSibling.selectStart();
                  } else {
                    const parent = linkParent.getParent();
                    if (parent) {
                      parent.selectEnd();
                    }
                  }
                }
              }
            });
          }
          setIsEditMode(false);
          setEditedLinkUrl("");
          return;
        }

        let isLinkElement = false;
        let targetElement = event.target as HTMLElement;

        for (let i = 0; i < 5 && targetElement && targetElement !== rootElement; i++) {
          if (targetElement.tagName === 'A' || targetElement.classList.contains('editor-link')) {
            isLinkElement = true;
            break;
          }
          targetElement = targetElement.parentElement as HTMLElement;
        }

        if (isLinkElement) {
          shouldHideRef.current = false;
        } else {
          if (linkUrl !== "") {
            shouldHideRef.current = true;
            if (editorRef.current) {
              editorRef.current.style.opacity = "0";
              editorRef.current.style.top = "-10000px";
              editorRef.current.style.left = "-10000px";
            }
            setLinkUrl("");
            setLastSelection(null);
          }
        }
        return;
      }

      if (isEditMode) {
          if (linkUrl === "https://" || linkUrl === "") {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          } else {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const node = selection.anchor.getNode();
                const linkParent = $findMatchingParent(node, $isLinkNode);
                if (linkParent) {
                  const nextSibling = linkParent.getNextSibling();
                  if (nextSibling) {
                    nextSibling.selectStart();
                  } else {
                    const parent = linkParent.getParent();
                    if (parent) {
                      parent.selectEnd();
                    }
                  }
                }
              }
            });
          }
          setIsEditMode(false);
          setEditedLinkUrl("");
      } else if (linkUrl !== "") {
          shouldHideRef.current = true;

          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  const node = selection.anchor.getNode();
                  const linkParent = $findMatchingParent(node, $isLinkNode);
                  if (linkParent) {
                      const nextSibling = linkParent.getNextSibling();
                      if (nextSibling) {
                          nextSibling.selectStart();
                      } else {
                          const parent = linkParent.getParent();
                          if (parent) {
                              parent.selectEnd();
                          }
                      }
                  }
              }
          });

          if (editorRef.current) {
              editorRef.current.style.opacity = "0";
              editorRef.current.style.top = "10000px";
              editorRef.current.style.left = "-10000px";
          }
          setLinkUrl("");
          setLastSelection(null);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [linkUrl, editor, isEditMode]);

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (editedLinkUrl !== "" && editedLinkUrl !== "https://") {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const linkParent = $findMatchingParent(node, $isLinkNode);

            if (linkParent) {
              linkParent.setURL(editedLinkUrl);

              const nextSibling = linkParent.getNextSibling();
              if (nextSibling) {
                nextSibling.selectStart();
              } else {
                const parent = linkParent.getParent();
                if (parent) {
                  parent.selectEnd();
                }
              }
            } else {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, editedLinkUrl);
            }
          } else if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isImageNode(nodes[0])) {
              const imageNode = nodes[0];
              const parent = imageNode.getParent();

              if ($isLinkNode(parent)) {
                parent.setURL(editedLinkUrl);
              }

              // Maintain image selection - prevent screen scrolling
            }
          }
        });
      } else {
        editor.update(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        });
      }
      setEditedLinkUrl("");
      setIsEditMode(false);
    }
  };

  const handleLinkEdit = () => {
    setEditedLinkUrl(linkUrl);
    setIsEditMode(true);
  };

  const handleLinkDelete = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length === 1 && $isImageNode(nodes[0])) {
          const imageNode = nodes[0];
          const parent = imageNode.getParent();

          if ($isLinkNode(parent)) {
            const children = parent.getChildren();
            children.forEach((child) => {
              parent.insertBefore(child);
            });
            parent.remove();
          }
        }
      }
    });
    setEditedLinkUrl("");
  };

  return (
    <div ref={editorRef} className="link-editor">
      {!isEditMode && linkUrl && (
        <div className="link-view">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkUrl}
          </a>
          <button
            className="link-edit"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleLinkEdit}
          >
            <i className="format edit" />
          </button>
          <button
            className="link-trash"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleLinkDelete}
          >
            <i className="format trash" />
          </button>
        </div>
      )}
      {isEditMode && (
        <>
          <input
            ref={inputRef}
            className="link-input"
            value={editedLinkUrl}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleLinkSubmission();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setIsEditMode(false);
                setEditedLinkUrl("");
              }
            }}
          />
          <button
            className="link-confirm"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleLinkSubmission}
          >
            <i className="format confirm" />
          </button>
          <button
            className="link-cancel"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (linkUrl === "https://" || linkUrl === "") {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              } else {
                editor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    const linkParent = $findMatchingParent(node, $isLinkNode);
                    if (linkParent) {
                      const nextSibling = linkParent.getNextSibling();
                      if (nextSibling) {
                        nextSibling.selectStart();
                      } else {
                        const parent = linkParent.getParent();
                        if (parent) {
                          parent.selectEnd();
                        }
                      }
                    }
                  }
                });
              }
              setIsEditMode(false);
              setEditedLinkUrl("");
            }}
          >
            <i className="format cancel" />
          </button>
        </>
      )}
    </div>
  );
}

export default function FloatingLinkEditorPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasLink = false;

          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const linkParent = $findMatchingParent(node, $isLinkNode);
            hasLink = !!linkParent;
          } else if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isImageNode(nodes[0])) {
              const parent = nodes[0].getParent();
              hasLink = !!($isLinkNode(parent));
            }
          }

          setIsLink(hasLink);
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          let hasLink = false;

          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const linkParent = $findMatchingParent(node, $isLinkNode);
            hasLink = !!linkParent;
          } else if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isImageNode(nodes[0])) {
              const parent = nodes[0].getParent();
              hasLink = !!($isLinkNode(parent));
            }
          }

          setIsLink(hasLink);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return createPortal(
    isLink ? <FloatingLinkEditor /> : null,
    document.body
  );
}
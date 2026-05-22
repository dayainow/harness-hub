"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect, useRef } from "react";

interface InitialContentPluginProps {
  initialContent?: string;
}

export default function InitialContentPlugin({ initialContent }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Run only once on initial load (prevents Korean character composition interruption)
    if (!initialContent || isInitialized.current) return;

    isInitialized.current = true;

    // Load initial content into the editor
    editor.update(() => {
      // Remove existing content
      const root = $getRoot();
      root.clear();

      // Parse HTML into DOM
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialContent, "text/html");

      // Convert DOM to Lexical nodes
      const nodes = $generateNodesFromDOM(editor, dom);

      // Insert nodes into the editor
      $insertNodes(nodes);
    });
  }, [editor]);

  return null;
}
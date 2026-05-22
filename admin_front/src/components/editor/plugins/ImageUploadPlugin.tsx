"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND, DROP_COMMAND } from "lexical";
import { useEffect, useContext } from "react";
import { useUploadStore } from "@/stores/upload_store";
import { getUUID } from "@/lib/uuid";
import { toast } from "sonner";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { ImageUploadDirectoryContext } from "../LexicalEditor";

export default function ImageUploadPlugin() {
  const [editor] = useLexicalComposerContext();
  const { postPresignedUrl, confirmUpload } = useUploadStore();
  const directory = useContext(ImageUploadDirectoryContext);

  useEffect(() => {
    // Image file upload handler function
    const uploadImage = async (file: File): Promise<string | null> => {
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
          console.error('[Image Upload] Presigned URL request failed.');
          toast.error('Failed to prepare image upload.');
          return null;
        }

        // Upload directly to S3
        const uploadResponse = await fetch(presignedData.presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        console.log('[Image Upload] Upload response:', uploadResponse);
        if (uploadResponse.ok) {
          // Request confirmation from backend after successful S3 upload
          const confirmed = await confirmUpload(Number(presignedData.id));

          if (confirmed) {
            toast.success('Image uploaded successfully.');
            return presignedData.publicUrl;
          } else {
            // confirmUpload already displays an error toast
            return null;
          }
        } else {
          toast.error('Failed to upload image.');
          return null;
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('An error occurred during image upload.');
        return null;
      }
    };

    // Image file filtering and processing function
    const processImageFiles = async (files: FileList | File[]): Promise<void> => {
      const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) return;

      // Upload each image file and insert into the editor
      for (const file of imageFiles) {
        const imageUrl = await uploadImage(file);

        if (imageUrl) {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: imageUrl,
            altText: file.name,
          });
        }
      }
    };

    // Paste event handler
    const handlePaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;

        if (clipboardData && clipboardData.files.length > 0) {
          const hasImageFiles = Array.from(clipboardData.files).some(file =>
            file.type.startsWith('image/')
          );

          if (hasImageFiles) {
            event.preventDefault();
            processImageFiles(clipboardData.files);
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    // Drop event handler
    const handleDrop = editor.registerCommand(
      DROP_COMMAND,
      (event: DragEvent) => {
        const dataTransfer = event.dataTransfer;

        if (dataTransfer && dataTransfer.files.length > 0) {
          const hasImageFiles = Array.from(dataTransfer.files).some(file =>
            file.type.startsWith('image/')
          );

          if (hasImageFiles) {
            event.preventDefault();
            processImageFiles(dataTransfer.files);
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      handlePaste();
      handleDrop();
    };
  }, [editor, postPresignedUrl, confirmUpload, directory]);

  return null;
}
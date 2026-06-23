"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (url: string) => void;
};

export default function ImageUpload({ onUpload }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="campuslink_uploads"
      onSuccess={(result) => {
        const info = result.info;

        if (
          typeof info === "object" &&
          info !== null &&
          "secure_url" in info
        ) {
          onUpload(String(info.secure_url));
        }
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
        >
          Upload Cover Image
        </Button>
      )}
    </CldUploadWidget>
  );
}
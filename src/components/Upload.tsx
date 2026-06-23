"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

type Props = {
  onUploadAction?: (url: string) => void;
};

export default function ImageUpload({ onUploadAction }: Props) {
  const safeCallback =
    typeof onUploadAction === "function" ? onUploadAction : () => {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return (
      <p className="text-red-500 text-sm">
        Cloudinary not configured
      </p>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset="campuslink_uploads"
      options={{ cloudName }}
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        const info = result.info;

        if (
          typeof info === "object" &&
          info &&
          "secure_url" in info
        ) {
          safeCallback((info as any).secure_url);
        }
      }}
    >
      {(cloudinary) => {
        const open = cloudinary?.open;

        return (
          <Button
            type="button"
            onClick={() => open?.()}
          >
            Upload Cover Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
import React from "react";
import { Image } from "@/components/ui/image";
import useSignedFile from "@/hooks/useSignedFile";

export default function FileImage({ fileUri, alt = "", className = "" }) {
  const url = useSignedFile(fileUri);

  if (!url) {
    return <div className={`${className} animate-pulse bg-white/[0.04]`} aria-hidden="true" />;
  }

  return <Image src={url} alt={alt} className={className} fittingType="fill" loading="lazy" />;
}
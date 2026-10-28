import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const cache = new Map();

export default function useSignedFile(fileUri) {
  const [url, setUrl] = useState(() => (fileUri && cache.get(fileUri)) || null);

  useEffect(() => {
    if (!fileUri) {
      setUrl(null);
      return;
    }
    const cached = cache.get(fileUri);
    if (cached) {
      setUrl(cached);
      return;
    }
    let active = true;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 3600 })
      .then((res) => {
        const signed = res?.signed_url;
        if (!signed) return;
        cache.set(fileUri, signed);
        if (active) setUrl(signed);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [fileUri]);

  return url;
}
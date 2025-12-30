import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

export function useMediaLibrary() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    async function init() {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPermission();
        if (status !== "granted") {
          return;
        }
      }

      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: ["photo"],
        sortBy: ["creationTime"],
      });

      setPhotos(assets.assets);
    }

    init();
  }, [permissionResponse, requestPermission]);

  return { photos, hasPermission: permissionResponse?.status === "granted" };
}

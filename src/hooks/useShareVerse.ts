import { useRef, useCallback } from 'react';
import { View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { cacheDirectory, copyAsync } from 'expo-file-system/legacy';

export function useShareVerse() {
  const viewShotRef = useRef<ViewShot>(null);

  const shareAsImage = useCallback(async () => {
    if (!viewShotRef.current?.capture) return;

    const uri = await viewShotRef.current.capture();

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) return;

    // Copia para um path persistente com nome legível antes de compartilhar
    const dest = `${cacheDirectory}versa-verse.png`;
    await copyAsync({ from: uri, to: dest });

    await Sharing.shareAsync(dest, {
      mimeType: 'image/png',
      dialogTitle: 'Compartilhar versículo',
    });
  }, []);

  const shareAsText = useCallback(
    async (text: string, reference: string, textEn?: string, referenceEn?: string) => {
      const { Share } = await import('react-native');
      const msg = textEn
        ? `"${text}"\n— ${reference}\n\n"${textEn}"\n— ${referenceEn}\n\nvia Versa`
        : `"${text}"\n— ${reference}\n\nvia Versa`;
      await Share.share({ message: msg });
    },
    [],
  );

  return { viewShotRef, shareAsImage, shareAsText };
}

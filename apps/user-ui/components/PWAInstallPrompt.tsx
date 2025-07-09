'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Text, Group, Stack } from '@mantine/core';
import { IconDownload, IconX } from '@tabler/icons-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: 400,
        margin: '0 auto'
      }}
    >
      <Stack gap="sm">
        <Text size="lg" fw={500}>
          Install Wine Memo
        </Text>
        <Text size="sm" c="dimmed">
          Install this app on your device for quick and easy access when you&apos;re on the go.
        </Text>
        <Group justify="space-between">
          <Button
            variant="light"
            leftSection={<IconX size={16} />}
            onClick={handleDismiss}
          >
            Not now
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={handleInstallClick}
          >
            Install
          </Button>
        </Group>
      </Stack>
    </Card>
  );
} 
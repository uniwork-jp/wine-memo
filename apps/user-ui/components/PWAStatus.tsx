'use client';

import { useEffect, useState } from 'react';
import { Badge, Group } from '@mantine/core';
import { IconWifi, IconWifiOff, IconDownload } from '@tabler/icons-react';

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is installed
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkInstallation();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isInstalled) return null;

  return (
    <Group gap="xs" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      {isInstalled && (
        <Badge 
          color="green" 
          variant="light" 
          leftSection={<IconDownload size={12} />}
        >
          Installed
        </Badge>
      )}
      <Badge 
        color={isOnline ? "green" : "red"} 
        variant="light"
        leftSection={isOnline ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
      >
        {isOnline ? "Online" : "Offline"}
      </Badge>
    </Group>
  );
} 
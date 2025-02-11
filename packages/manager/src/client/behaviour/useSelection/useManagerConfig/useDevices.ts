import { assertNotEmpty, Device } from '@storyshots/core';
import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

/**
 * Retrieves current defined devices. Ensures referential equality in context with a hook instance.
 */
export function useDevices(): Device[] {
  const [params] = useSearchParams();
  const devices = params.get('devices');

  assertNotEmpty(devices);

  return useMemo(() => JSON.parse(devices) as Device[], [devices]);
}

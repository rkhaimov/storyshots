import { useDevices } from './useDevices';
import { useEmulated } from './useEmulated';
import { usePoolSize } from './usePoolSize';
import { useDevice } from './useDevice';

/**
 * Manages current manager configuration including selected device and emulating parameter.
 */
export function useManagerConfig() {
  const devices = useDevices();
  const size = usePoolSize();
  const { emulated, setEmulated } = useEmulated();
  const { device, setDevice } = useDevice(devices, emulated);

  return {
    device,
    size,
    devices,
    emulated,
    setDevice,
    setEmulated,
  };
}

export type ManagerConfig = ReturnType<typeof useManagerConfig>;

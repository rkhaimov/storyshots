import { assertNotEmpty, Device, isNil } from '@storyshots/core';
import { useSearchParams } from 'wouter';

export function useDevice(devices: Device[], emulated: boolean) {
  const [params, setParams] = useSearchParams();
  const selected = useSelectedDevice();

  return {
    device: {
      // Selected device by the user
      selected,
      // Active device, that is used on preview
      preview: emulated ? selected : devices[0],
    },
    setDevice,
  };

  function setDevice(device: Device) {
    setParams((prev) => {
      prev.set('device', JSON.stringify(device));

      return prev;
    });
  }

  function useSelectedDevice() {
    const query = params.get('device');

    if (isNil(query)) {
      return devices[0];
    }

    const _device = JSON.parse(query) as Device;
    const device = devices.find((it) => it.name === _device.name);

    assertNotEmpty(
      device,
      'Manager state is not compatible with defined configuration',
    );

    return device;
  }
}

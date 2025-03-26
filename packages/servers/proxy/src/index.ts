import { IPreviewServer } from '@storyshots/core/manager';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createProxyServer(to: string): IPreviewServer {
  return {
    handler: createProxyMiddleware({
      target: to,
      changeOrigin: true,
    }),
    cleanup: async () => {},
    // Update events are not possible by definition
    onUpdate: () => {},
  };
}

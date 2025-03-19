import { PreviewServer } from '@storyshots/manager';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createProxyBundler(to: string): PreviewServer {
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

import { PreviewServe } from '@storyshots/manager';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createProxyBundler(to: string): PreviewServe {
  return {
    handler: createProxyMiddleware({
      target: to,
      changeOrigin: true,
      pathFilter: '**',
    }),
    // Update events are not possible by definition
    onUpdate: () => {},
  };
}

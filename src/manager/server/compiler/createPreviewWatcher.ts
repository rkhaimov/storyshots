import wsify, { WebsocketRequestHandler } from 'express-ws';
import { Compiler } from 'webpack';

export function createPreviewWatcher(
  app: wsify.Application,
  preview: Compiler,
) {
  let clients: Parameters<WebsocketRequestHandler>[0][] = [];

  preview.hooks.done.tap('PreviewUpdate', (stats) =>
    clients.forEach((it) => it.send(stats.hash)),
  );

  app.ws('/', (ws) => {
    clients.push(ws);

    ws.on('close', () => (clients = clients.filter((it) => it !== ws)));
  });
}

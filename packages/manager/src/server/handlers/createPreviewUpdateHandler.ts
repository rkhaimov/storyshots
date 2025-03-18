import wsify, { WebsocketRequestHandler } from 'express-ws';
import { PreviewServer } from '../types';

export function createPreviewUpdateHandler(
  app: wsify.Application,
  preview: PreviewServer,
) {
  let clients: Parameters<WebsocketRequestHandler>[0][] = [];

  preview.onUpdate((hash) => clients.forEach((it) => it.send(hash)));

  app.ws('/', (ws) => {
    clients.push(ws);

    ws.on('close', () => (clients = clients.filter((it) => it !== ws)));
  });
}

import { Router as WSRouter, WebsocketRequestHandler } from 'express-ws';
import { IPreviewServer } from '../types';

export function createPreviewUpdateNotifier(
  router: WSRouter,
  preview: IPreviewServer,
) {
  let clients: Parameters<WebsocketRequestHandler>[0][] = [];

  preview.onUpdate((hash) => clients.forEach((it) => it.send(hash)));

  router.ws('/', (ws) => {
    clients.push(ws);

    ws.on('close', () => (clients = clients.filter((it) => it !== ws)));
  });
}

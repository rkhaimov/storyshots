import wsify, { WebsocketRequestHandler } from 'express-ws';
import { Compiler } from '../reusables/types';

export function createPreviewWatcher(
  app: wsify.Application,
  preview: Compiler,
) {
  let clients: Parameters<WebsocketRequestHandler>[0][] = [];

  preview.onUpdate((hash) => clients.forEach((it) => it.send(hash)));

  app.ws('/', (ws) => {
    clients.push(ws);

    ws.on('close', () => (clients = clients.filter((it) => it !== ws)));
  });
}

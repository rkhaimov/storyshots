import wsify, { WebsocketRequestHandler } from 'express-ws';

export function createPreviewWatcher(app: wsify.Application) {
  const clients: Parameters<WebsocketRequestHandler>[0][] = [];

  app.ws('/', (ws) => {
    clients.push(ws);

    ws.on('close', () => clients.filter((it) => it !== ws));
  });

  return function onPreviewHashUpdated(hash: string) {
    clients.forEach((it) => it.send(hash));
  };
}

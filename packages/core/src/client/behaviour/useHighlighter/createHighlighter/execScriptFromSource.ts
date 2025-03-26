export function execScriptFromSource(
  frame: Window,
  source: string,
): Promise<ModuleExport> {
  const script = frame.document.createElement('script');

  script.textContent = `
    (() => {
      const module = {};
    
      ${source}
    
      window.onScriptExecuted(module.exports);
    })()
  `;

  return new Promise<ModuleExport>((resolve) => {
    frame.onScriptExecuted = resolve;

    frame.document.body.appendChild(script);
  }).finally(() => frame.document.body.removeChild(script));
}

declare global {
  interface Window {
    onScriptExecuted(exports: ModuleExport): void;
  }
}

type ModuleExport = Record<string, unknown>;

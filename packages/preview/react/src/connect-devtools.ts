const _parent = window.top as unknown as Record<string, unknown>;
const _current = window as unknown as Record<string, unknown>;

if (_parent !== _current) {
  _current.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    _parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

export {};

// Runs src/keyframes.genexpr outside Max, so the code that ships in the device
// can be tested. The file is written in a subset of GenExpr that is also
// JavaScript; this strips the declarations and supplies the gen~ built-ins.
//
// It is stricter than gen~ on purpose: reading a variable before assigning it
// in the same sample, assigning a Param, or reading a History after writing it
// all throw, because gen~'s behaviour in those cases is easy to get wrong.
'use strict';

const KEYWORDS = new Set(['if', 'for', 'while', 'else', 'return', 'function']);

function load(source, samplerate) {
  const lines = source.split('\n');
  const params = {};
  const histories = {};
  const datas = {};
  const out = [];
  for (const line of lines) {
    const decl = line.match(/^(Param|History|Buffer|Data)\s+(\w+)\s*\((.*)\);\s*$/);
    if (decl) {
      const [, kind, name, args] = decl;
      if (kind === 'Param') params[name] = parseFloat(args);
      else if (kind === 'History') histories[name] = parseFloat(args);
      else if (kind === 'Data') datas[name] = new Float64Array(parseInt(args, 10));
      else datas[name] = new Float64Array(4096);
      out.push('');
      continue;
    }
    const fn = line.match(/^(\w+)\(([^)]*)\)\s*\{\s*$/);
    if (fn && !KEYWORDS.has(fn[1])) {
      out.push('function ' + line);
      continue;
    }
    out.push(line);
  }
  // Function definitions come first in the file; everything from the first
  // top-level statement on is the per-sample body.
  let split = 0;
  let depth = 0;
  for (let i = 0; i < out.length; i++) {
    const line = out[i];
    if (depth === 0 && line.trim() !== '' && !line.startsWith('//') &&
        !line.startsWith('function ')) {
      split = i;
      break;
    }
    for (const ch of line.replace(/\/\/.*$/, '')) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
  }
  const functions = out.slice(0, split).join('\n');
  const body = out.slice(split).join('\n');

  const fixed = {
    floor: Math.floor, min: Math.min, max: Math.max, abs: Math.abs,
    pow: Math.pow, exp: Math.exp, log: Math.log, sin: Math.sin, cos: Math.cos,
    clamp: (x, lo, hi) => Math.min(Math.max(x, lo), hi),
    pi: Math.PI,
    samplerate,
    peek: (arr, i) => {
      i = Math.floor(i);
      return i >= 0 && i < arr.length ? arr[i] : 0;
    },
    poke: (arr, v, i) => {
      i = Math.floor(i);
      if (!Number.isFinite(v)) throw new Error('poke of non-finite value');
      if (i >= 0 && i < arr.length) arr[i] = v;
    },
    ...datas,
  };
  const locals = {};
  const pending = {};
  const scope = new Proxy({}, {
    has: (_, key) => typeof key === 'string',
    get: (_, key) => {
      if (typeof key !== 'string') return undefined;
      if (key in fixed) return fixed[key];
      if (key in params) return params[key];
      if (key in histories) {
        if (key in pending) throw new Error('History ' + key + ' read after write');
        return histories[key];
      }
      if (key in locals) return locals[key];
      throw new ReferenceError(key + ' read before it was assigned');
    },
    set: (_, key, value) => {
      if (key in fixed || key in params) throw new Error('assignment to ' + key);
      if (key in histories) pending[key] = value;
      else locals[key] = value;
      return true;
    },
  });
  // eslint-disable-next-line no-new-func
  const tick = new Function('S', 'with (S) {\n' + functions +
      '\nreturn function () {\n' + body + '\n};\n}')(scope);

  return {
    params,
    datas,
    set(name, value) {
      if (!(name in params)) throw new Error('no Param ' + name);
      params[name] = value;
    },
    tick(ins) {
      for (const k of Object.keys(locals)) delete locals[k];
      for (let i = 0; i < 11; i++) locals['in' + (i + 1)] = (ins && ins[i]) || 0;
      tick();
      for (const k of Object.keys(pending)) {
        histories[k] = pending[k];
        delete pending[k];
      }
      const outs = [];
      for (let i = 1; ('out' + i) in locals; i++) {
        if (!Number.isFinite(locals['out' + i])) throw new Error('out' + i + ' is not finite');
        outs.push(locals['out' + i]);
      }
      return outs;
    },
  };
}

module.exports = { load };

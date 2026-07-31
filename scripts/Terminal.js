document.getElementById("terminalWindow").addEventListener("click", () => {ensureBooted(); document.getElementById("terminalInput").focus();
     document.getElementById("caret").style.animation = "blink 1.5s step-end infinite";})
document.getElementById("terminalInput").addEventListener("blur", () => {document.getElementById("caret").style.animation = "none"});

const outputEl = document.getElementById("terminalOutput");
const inputEl = document.getElementById("terminalInput");
const promptEl = document.getElementById("inputThing");

let pyodide;
let buffer = [];
let history = [];
let historyIndex = -1;
let bootStarted = false;

function loadPyodideScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v314.0.3/full/pyodide.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function print(text, cls) {
  const line = document.createElement('div');
  if (cls) line.className = cls;
  line.textContent = text;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
}

async function runBlock(code) {
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined && result !== null) {
      print(String(result));
    }
  } catch (err) {
    print(String(err.message || err).trim(), 'error');
  }
}

async function boot() {
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v314.0.3/full/'
  });

  // routes python's print()/stderr into your terminal
  pyodide.setStdout({ batched: (msg) => print(msg) });
  pyodide.setStderr({ batched: (msg) => print(msg, 'error') });

  inputEl.disabled = false;
  inputEl.focus();
}

function echo(promptText, code) {
  print(promptText + ' ' + code, 'echo');
}

inputEl.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const line = inputEl.value;
    inputEl.value = '';

    const continuing = buffer.length > 0;
    echo(continuing ? '...' : '>>>', line);

    if (continuing) {
      if (line.trim() === '') {
        const code = buffer.join('\n');
        buffer = [];
        if (promptEl) promptEl.textContent = '>>>';
        history.push(code);
        historyIndex = history.length;
        await runBlock(code);
      } else {
        buffer.push(line);
      }
      return;
    }

    if (line.trim() === '') return;

    if (/:\s*$/.test(line.trim())) {
      buffer.push(line);
      if (promptEl) promptEl.textContent = '...';
      return;
    }

    history.push(line);
    historyIndex = history.length;
    await runBlock(line);

  } else if (e.key === 'ArrowUp') {
    if (!history.length) return;
    e.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    inputEl.value = history[historyIndex] || '';

  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    inputEl.value = history[historyIndex] || '';

  } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && buffer.length) {
    e.preventDefault();
    buffer = [];
    if (promptEl) promptEl.textContent = '>>>';
    print('KeyboardInterrupt', 'error');
  }
});

async function boot() {
  print('Loading pyodide...', 'echo');

  await loadPyodideScript();
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v314.0.3/full/'
  });

  pyodide.setStdout({ batched: (msg) => print(msg) });
  pyodide.setStderr({ batched: (msg) => print(msg, 'error') });

  inputEl.disabled = false;
  inputEl.focus();
}

function ensureBooted() {
  if (!bootStarted) {
    bootStarted = true;
    boot();
  }
}
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { CONFIG_DIR, CONFIG_PATH } = require('../config');
const { MARKER_START, MARKER_END, getShellTargets } = require('../shell');

function buildBashFunction(pushingtagBin) {
  return `
${MARKER_START}
function git() {
  command git "$@"
  local code=$?
  if [ "$1" = "push" ] && [ $code -eq 0 ]; then
    ( "${pushingtagBin}" play > /dev/null 2>&1 & )
  fi
  return $code
}
${MARKER_END}`;
}

function buildPowerShellFunction(pushingtagBin) {
  const escaped = pushingtagBin.replace(/'/g, "''");
  return `
${MARKER_START}
function global:git {
  $gitExe = (Get-Command git.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1).Source
  if (-not $gitExe) { Write-Error 'git.exe not found'; return }
  & $gitExe @args
  $code = $LASTEXITCODE
  if ($args.Count -gt 0 -and $args[0] -eq 'push' -and $code -eq 0) {
    Start-Process -FilePath '${escaped}' -ArgumentList 'play' -WindowStyle Hidden -ErrorAction SilentlyContinue | Out-Null
  }
  $global:LASTEXITCODE = $code
}
${MARKER_END}`;
}

function resolvePushingtagBin() {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  try {
    const out = execFileSync(lookup, ['pushingtag'], { encoding: 'utf8' }).trim();
    const first = out.split(/\r?\n/).find(Boolean);
    return first || 'pushingtag';
  } catch {
    return 'pushingtag';
  }
}

function setup() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
  }

  const pushingtagBin = resolvePushingtagBin();
  const installed = [];

  for (const target of getShellTargets()) {
    const exists = fs.existsSync(target.path);

    if (!exists && target.type !== 'powershell') continue;

    if (!exists) {
      fs.mkdirSync(path.dirname(target.path), { recursive: true });
      fs.writeFileSync(target.path, '');
    }

    const contents = fs.readFileSync(target.path, 'utf8');
    if (contents.includes(MARKER_START)) {
      console.log(`Already installed in ${target.path} — skipping.`);
      continue;
    }

    const fn = target.type === 'powershell'
      ? buildPowerShellFunction(pushingtagBin)
      : buildBashFunction(pushingtagBin);

    fs.appendFileSync(target.path, fn + '\n');
    console.log(`Installed shell wrapper in ${target.path}.`);
    installed.push(target);
  }

  if (installed.length) {
    console.log('Done. Open a new terminal for pushingtag to take effect.');
  } else {
    console.log('Done.');
  }
}

module.exports = setup;

#!/usr/bin/env bash
# Sets up Dylan for Claude Code on macOS or Linux. In a terminal:
#
#   curl -fsSL https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.sh | bash
#
# Installs what is missing (git, Node 24, Claude Code), then Dylan's plugin, puts the dylan command
# on the PATH and, in a terminal, signs it in through the browser. Every step checks first, so
# running it again only finishes what is left.
set -euo pipefail

marketplace=$HOME/.claude/plugins/marketplaces/dylan
own_path=$PATH
export PATH=$HOME/.local/bin:$PATH

step() { printf '\033[36m==> %s\033[0m\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }
fail() {
  printf 'install: %s\n' "$1" >&2
  exit 1
}
# Node's version as major*100+minor (22.18 is 2218), 0 without Node.
node_version() {
  have node || {
    echo 0
    return
  }
  node -p 'const [a, b] = process.versions.node.split(".").map(Number); a * 100 + b'
}

step 'git'
if ! have git; then
  case $(uname -s) in
  Darwin)
    xcode-select --install || true
    fail 'a system dialog installs git: click Install, wait for it to finish, then run this again'
    ;;
  *)
    have apt-get || fail 'install git with your package manager, then run this again'
    sudo apt-get update && sudo apt-get install -y git
    ;;
  esac
fi

step 'Node.js 22.18 or newer'
if [ "$(node_version)" -lt 2218 ]; then
  if have brew; then
    brew install node
  else
    export NVM_DIR=$HOME/.nvm
    [ -s "$NVM_DIR/nvm.sh" ] || curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    set +eu
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    nvm install 24 && nvm alias default 24
    set -eu
  fi
fi
[ "$(node_version)" -ge 2218 ] || fail "node on the PATH is still $(node -v): which -a node shows which one comes first"

step 'Claude Code'
have claude || curl -fsSL https://claude.ai/install.sh | bash
have claude || fail 'claude is not on the PATH: open a new terminal and run this again'

step "Dylan's plugin"
if [ -d "$marketplace" ]; then
  claude plugin marketplace update dylan
else
  claude plugin marketplace add Belkins-Inc/dylan-plugin
fi
claude plugin install dylan@dylan
[ -x "$marketplace/plugin/bin/dylan" ] || fail "the plugin did not install: no $marketplace/plugin/bin/dylan"

step 'The dylan command on the PATH'
mkdir -p "$HOME/.local/bin"
ln -sf "$marketplace/plugin/bin/dylan" "$HOME/.local/bin/dylan"
case ":$own_path:" in
*":$HOME/.local/bin:"*) ;;
*) echo "Add $HOME/.local/bin to your PATH to run dylan from your own terminal." ;;
esac

step 'Sign in to Dylan'
if dylan whoami >/dev/null 2>&1; then
  echo 'Already signed in.'
elif [ -t 1 ]; then
  dylan login || fail 'dylan login did not finish: run "dylan login" again'
else
  echo 'Run "dylan login" to sign in.'
fi

printf '\n\033[32mDone. Open Claude Code and say: "Let'\''s work on my Dylan project".\033[0m\n'

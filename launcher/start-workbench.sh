#!/bin/zsh
set -eu
WORKBENCH_ROOT="${WORKBENCH_PROJECT_ROOT:-${0:A:h:h}}"
if [[ ! -f "$WORKBENCH_ROOT/prototype/workflow/server.mjs" ]]; then
  print -u2 "找不到工作台项目：$WORKBENCH_ROOT"
  exit 1
fi
WORKBENCH_PORT=4180
WORKBENCH_URL="http://127.0.0.1:${WORKBENCH_PORT}/index.html"
WORKBENCH_RUNTIME="$WORKBENCH_ROOT/.runtime"
mkdir -p "$WORKBENCH_RUNTIME"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"
WORKBENCH_NODE="$(command -v node || true)"
if [[ -z "$WORKBENCH_NODE" ]]; then
  print -u2 '未找到 Node.js，无法启动动效工作台。'
  exit 1
fi
healthy() {
  /usr/bin/curl --noproxy '*' --max-time 2 -fsS "http://127.0.0.1:$WORKBENCH_PORT/api/workflow" 2>/dev/null |
    "$WORKBENCH_NODE" -e 'let s="";process.stdin.on("data",x=>s+=x);process.stdin.on("end",()=>{try{const d=JSON.parse(s);process.exit(Array.isArray(d.projects)&&Array.isArray(d.assets)?0:1)}catch{process.exit(1)}});'
}
if ! healthy; then
  if /usr/sbin/lsof -nP -iTCP:$WORKBENCH_PORT -sTCP:LISTEN >/dev/null 2>&1; then
    print -u2 "端口 $WORKBENCH_PORT 被其他服务占用。请关闭该服务后重试。"
    exit 1
  fi
  cd "$WORKBENCH_ROOT"
  PORT="$WORKBENCH_PORT" /usr/bin/nohup "$WORKBENCH_NODE" "$WORKBENCH_ROOT/prototype/workflow/server.mjs" >"$WORKBENCH_RUNTIME/server.log" 2>&1 < /dev/null &
  print $! > "$WORKBENCH_RUNTIME/server.pid"
  for WORKBENCH_ATTEMPT in {1..40}; do
    if healthy; then break; fi
    /bin/sleep 0.25
  done
  if ! healthy; then
    print -u2 "启动失败，请查看日志：$WORKBENCH_RUNTIME/server.log"
    exit 1
  fi
fi
if [[ "${1:-}" != '--no-open' ]]; then
  /usr/bin/open "$WORKBENCH_URL"
fi
print "动效工作台已就绪：$WORKBENCH_URL"

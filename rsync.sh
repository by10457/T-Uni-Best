#!/usr/bin/env sh
#
# 将 WSL 环境中编译得到的微信小程序项目同步到 Windows 目录。
# 解决微信开发者工具无法检测到 WSL 内 mp-weixin 输出目录变化，导致项目不能自动刷新显示最新编译结果的问题。
#
# 使用方法：
# 1. 在 WSL 中先启动小程序编译，例如：pnpm dev:mp-weixin。
# 2. 另开一个 WSL 终端，在项目根目录执行：sh ./rsync.sh。
# 3. 脚本会监听 dist/dev/mp-weixin，并同步到 Windows 桌面的 mp/<项目名>-mp-weixin 目录。
# 4. 微信开发者工具导入桌面 mp 目录下同步出来的小程序项目，并保持此脚本运行即可。

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
PROJECT_DIR="$SCRIPT_DIR"
PROJECT_NAME=$(basename -- "$PROJECT_DIR")
WSL_OUT="$PROJECT_DIR/dist/dev/mp-weixin"

get_windows_desktop_dir() {
  if ! command -v powershell.exe >/dev/null 2>&1; then
    echo "缺少命令：powershell.exe"
    echo "请确认当前是在 WSL 中运行，并且可以访问 Windows PowerShell。"
    exit 1
  fi

  if ! command -v wslpath >/dev/null 2>&1; then
    echo "缺少命令：wslpath"
    echo "请确认当前是在 WSL 中运行。"
    exit 1
  fi

  desktop_win=$(powershell.exe -NoProfile -Command '[Environment]::GetFolderPath("Desktop")' | tr -d '\r')
  if [ -z "$desktop_win" ]; then
    echo "无法获取 Windows 桌面路径。"
    exit 1
  fi

  wslpath -u "$desktop_win"
}

WIN_BASE="$(get_windows_desktop_dir)/mp"
WIN_OUT="$WIN_BASE/${PROJECT_NAME}-mp-weixin"

need_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "缺少命令：$1"
    echo "请先执行：sudo apt update && sudo apt install -y rsync inotify-tools"
    exit 1
  fi
}

sync_once() {
  mkdir -p "$WIN_OUT"
  rsync -a --delete "$WSL_OUT/" "$WIN_OUT/"
  echo "已同步到 Windows：$WIN_OUT ($(date '+%H:%M:%S'))"
}

need_command rsync
need_command inotifywait

echo "WSL 输出目录：$WSL_OUT"
echo "Windows 同步目录：$WIN_OUT"
echo

echo "等待 uni-app 生成 mp-weixin 输出目录..."
while [ ! -d "$WSL_OUT" ]; do
  sleep 1
done

echo "开始首次同步..."
sync_once

echo
echo "开始监听编译输出变化。保持此终端运行即可，按 Ctrl+C 停止。"
while true; do
  inotifywait -r -e close_write,create,delete,move "$WSL_OUT" >/dev/null 2>&1
  sync_once
done

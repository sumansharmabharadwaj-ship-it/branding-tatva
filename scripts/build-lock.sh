#!/bin/sh
# Serialise `next build` across every checkout on this machine.
#
# This Mac has 8GB of RAM. One Next.js production build uses most of it, so
# two concurrent builds reliably get one killed by the OS with no error: the
# log simply stops at "Creating an optimized production build ...", BUILD_ID
# is never written, and anything waiting on it misreads the silence as done.
# Isolated worktrees fixed the shared-.next clobbering and moved the fight to
# RAM instead — on 18 Sep there were three builds running from three sessions
# at once, with 58MB free.
#
# mkdir is atomic, so the lock directory is the queue. A lock whose recorded
# pid is no longer alive is treated as stale and taken over, so a crashed or
# killed build can never wedge everyone behind it.
#
# Usage, from any checkout:   sh scripts/build-lock.sh
LOCK=/tmp/branding-tatva-build.lock
waited=0
while ! mkdir "$LOCK" 2>/dev/null; do
  holder=$(cat "$LOCK/pid" 2>/dev/null)
  if [ -n "$holder" ] && ! kill -0 "$holder" 2>/dev/null; then
    echo "build-lock: removing stale lock held by dead pid $holder"
    rm -rf "$LOCK"
    continue
  fi
  if [ $waited -eq 0 ]; then
    echo "build-lock: waiting — build running for $(cat "$LOCK/where" 2>/dev/null) (pid $holder)"
  fi
  waited=$((waited + 1))
  sleep 10
done
echo $$ > "$LOCK/pid"
pwd > "$LOCK/where"
trap 'rm -rf "$LOCK"' EXIT INT TERM
echo "build-lock: acquired after ~$((waited * 10))s, building $(pwd)"
./node_modules/.bin/next build
status=$?
if [ $status -eq 0 ] && [ ! -f .next/BUILD_ID ]; then
  echo "build-lock: next build exited 0 but wrote no BUILD_ID — treating as failed"
  exit 1
fi
exit $status

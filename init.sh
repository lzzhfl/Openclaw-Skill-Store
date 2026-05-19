#!/bin/bash
# ============================================================
# OpenClaw Skill Store - One-Click Startup Script
# From Anthropic "Effective Harnesses" pattern: eliminiates
# the need for each agent session to figure out how to run
# the project from scratch.
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "=== OpenClaw Skill Store ==="
echo "Project: $PROJECT_DIR"

# --- Backend ---
echo ""
echo "[1/2] Starting backend (Spring Boot)..."
cd "$PROJECT_DIR/backend"

export JAVA_HOME="${JAVA_HOME:-C:/Program Files/Java/jdk-17}"
echo "  JAVA_HOME=$JAVA_HOME"

mvn spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "  Waiting for API..."
for i in $(seq 1 60); do
  if curl -s http://localhost:8080/api/v1/health > /dev/null 2>&1; then
    echo "  Backend ready! (http://localhost:8080)"
    break
  fi
  sleep 2
done

# --- Frontend ---
echo ""
echo "[2/2] Starting frontend (Vite)..."
cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies..."
  npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"
echo "  Frontend ready at http://localhost:5173"

echo ""
echo "=== All services started ==="
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:8080"
echo "  H2 Console: http://localhost:8080/h2-console"
echo "  Health   : http://localhost:8080/api/v1/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped.'" EXIT

wait

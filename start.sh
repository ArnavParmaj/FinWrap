#!/bin/bash
# start.sh - Start the FinWrap application

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================"
echo "Starting FinWrap Development Environment"
echo "======================================"

# 1. Setup Python Virtual Environment
echo "Setting up Python virtual environment..."
cd "$DIR" || exit 1

if [ ! -d "venv" ]; then
    echo "Creating new virtual environment (venv)..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate
echo "Virtual environment activated."

# Optional: Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# 2. Start Web App
echo "Starting web app (Vite React)..."
cd "$DIR/web" || { echo "Error: web directory not found."; exit 1; }

# Install deps if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "First time setup: Installing web dependencies..."
    npm install --legacy-peer-deps
fi

# Run detached, saving logs to web.log
nohup npm run dev > "$DIR/web.log" 2>&1 &
WEB_PID=$!
echo $WEB_PID > "$DIR/web.pid"

echo "Web app started (PID from npm run: $WEB_PID). "
echo "Please wait a few seconds for Vite to compile."
echo ""
echo "-> Web UI is typically available at http://localhost:5173"
echo "-> You can view logs by running: tail -f web.log"
echo "======================================"

#!/bin/bash
# stop.sh - Stop the FinWrap application

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================"
echo "Stopping FinWrap Development Environment"
echo "======================================"

# Use pkill to forcefully kill vite / node instances related to our web folder
echo "Killing Vite & Node processes..."
if pkill -f "vite"; then
    echo "Web app processes terminated successfully."
else
    echo "No Vite processes were running."
fi

echo "Killing any background Python processes..."
if pkill -f "python.*FinWrap"; then
    echo "Python processes terminated."
fi

# Clean up pid file if it exists
if [ -f "$DIR/web.pid" ]; then
    rm "$DIR/web.pid"
    echo "Removed web.pid tracker."
fi

echo "======================================"
echo "All local FinWrap services stopped."

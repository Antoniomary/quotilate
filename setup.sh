#!/bin/bash

# Exit on errors
set -e

echo "Starting setup for Quotilate App..."

# 1. Install Node.js dependencies for backend
echo "Installing dependencies..."
npm install
echo "Dependencies installed."

# 2. Start MongoDB
echo "Starting MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Starting MongoDB..."
    sudo service mongod start
    echo "MongoDB started."
else
    echo "MongoDB is already running."
fi

# 3. Set up Redis
REDIS_DIR="./redis-7.0.15"
REDIS_TAR="./redis-7.0.15.tar.gz"
if [ -d "$REDIS_DIR" ]; then
    echo "Redis directory not found. Checking for $REDIS_TAR..."
    if [ -f "$REDIS_TAR" ]; then
        echo "Extracting $REDIS_TAR..."
        tar -xzf "$REDIS_TAR"
        echo "Building Redis..."
    else
        echo "Redis tar.gz file not found. Please ensure $REDIS_TAR is in the current directory."
        exit 1
    fi
else
    echo "Redis directory already exists. Skipping extraction."
fi

# 4. Start Redis-server
echo "Starting Redis server..."
if ! pgrep -x "redis-server" > /dev/null; then
    "$REDIS_DIR/src/redis-server" > /dev/null 2>&1 &
    echo "Redis server started."
else
    echo "Redis server is already running."
fi

# 5. Set up environment variables
PORT=5000
NODE_ENV=production

# 6. Start the backend server
echo "Starting the backend server..."
npm run start-server &

echo "Quotilate App setup is complete!"
echo "Backend is running at http://localhost:5000"

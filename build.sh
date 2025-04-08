#!/usr/bin/env bash

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cd frontend
npm install
npm run build

#!/usr/bin/env bash

pip install -r requirements.txt

cd frontend
npm install
npm run build

#!/usr/bin/env bash

cd frontend
npm install
npm run build

cd ..
pip install -r requirements.txt


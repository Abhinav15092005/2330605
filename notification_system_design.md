# Notification System Design

## Overview
REST API notification system with logging middleware for Affordmed assessment.

## Architecture
- Backend: Express.js (Node.js)
- Frontend: React + Vite
- Logging: Custom middleware sending logs to test server

## API Endpoints
- GET /api/health - Health check endpoint
- POST /api/notifications - Create new notification

## Logging Implementation
The Log(stack, level, package, message) function sends logs to:
http://4.224.186.213/evaluation-service/logs

## Author
Roll Number: 2330605 

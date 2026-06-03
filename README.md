# 🏆 Campus Notification System - Afford Medical Technologies

## 📋 Candidate Information
| Field | Value |
|-------|-------|
| **Name** | Abhinav Pandey |
| **Roll Number** | 2330605 |
| **College** | CGC University, Mohali |
| **GitHub** | [Abhinav15092005](https://github.com/Abhinav15092005) |
| **Track** | Full Stack Developer |

---

## 🚀 Project Overview

A production-ready **Notification Management System** with Priority Inbox that displays notifications ranked by:
- **Priority Weight:** Placement (3) > Result (2) > Event (1)
- **Recency:** Newer notifications get higher priority within same type

---

## 📁 Project Structure

2330605/
├── 📄 README.md # Project documentation
├── 📄 .gitignore # Git ignore file
├── 📁 logging_middleware/ # Reusable logging middleware
│ └── logger.js # Log() function for API calls
├── 📁 notification_app_be/ # Backend Express application
│ ├── server.js # Express server with API endpoints
│ └── package.json # Backend dependencies
├── 📁 notification_app_fe/ # Frontend React application
│ ├── src/App.jsx # Main React component
│ └── package.json # Frontend dependencies
├── 📄 notification_system_design.md # Complete documentation (Stages 1-5)
├── 📄 priority_inbox.js # Stage 6 - Priority algorithm
└── 📸 priority_output.png # Screenshot of priority inbox output

---

## ⚙️ Priority Algorithm

### Formula

Priority Score = (Type Weight × 1,000,000,000,000) + Timestamp (milliseconds)


### Type Weights
| Type | Weight | Priority |
|------|--------|----------|
| Placement | 3 | 🔥 HIGHEST |
| Result | 2 | 📘 MEDIUM |
| Event | 1 | 📌 LOW |

### Sorting Logic
1. **Primary Sort:** Type Weight (descending)
2. **Secondary Sort:** Timestamp (newest first)

---

## 🚀 How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm

### Run Priority Inbox (Stage 6)
```bash
node priority_inbox.js
# Stage 1

## Overview

The Campus Notification Priority Inbox fetches notifications from a protected external API and surfaces the top 10 most important unread notifications to users. Priority is determined by notification type and recency, ensuring that users always see the most critical and recent alerts first.

---

## Priority Logic

Notifications are ranked using a weighted priority scheme:

| Type      | Priority Weight |
|-----------|----------------|
| Placement | 3 (Highest)    |
| Result    | 2              |
| Event     | 1 (Lowest)     |

**Primary sort:** Priority weight (descending)  
**Secondary sort (tiebreaker):** Timestamp (most recent first)

This means a Placement notification will always appear above a Result, which always appears above an Event — regardless of timestamp. Among notifications of the same type, the most recent one appears first.

---

## Data Structure — Min-Heap

A **Min-Heap of fixed size N (default 10)** is used to efficiently maintain the top N notifications.

### Why a Min-Heap?

The heap root always holds the **lowest-priority element** currently in the top-N set. This allows O(log N) insertion with an O(1) eviction check:

- If the heap has fewer than N elements → push directly.
- If the new notification's priority > heap root's priority → evict the root and push the new one.
- Otherwise → discard the new notification (it doesn't belong in the top N).

### Complexity

| Operation               | Complexity   |
|-------------------------|-------------|
| Insert new notification | O(log N)    |
| Fetch top N             | O(1)        |
| Build from M items      | O(M log N)  |

Since N = 10 is constant, `log 10 ≈ 3.32`, making every insert effectively **O(1)** in practice.

---

## Sorting

The heap produces the top-N set. Before returning the result to the client, a final sort is applied:

1. **Primary:** Priority weight — descending (Placement → Result → Event)
2. **Secondary:** Timestamp — descending (newest first)

---

## Handling Future Notifications (Streaming Updates)

As new notifications arrive continuously, the system remains efficient:

1. A new notification arrives.
2. Compare its priority with the **heap root** (the current minimum of the top-N set).
3. **If higher priority (or same priority but newer timestamp):** Replace the root with the new notification and re-heapify down → O(log N).
4. **If lower priority:** Discard immediately → O(1).

This guarantees that the top-N set is always maintained efficiently without re-sorting the full dataset on every new notification.

---

## API Endpoints

The server exposes the following endpoints:

### `GET /api/notifications`
Returns all raw notifications fetched from the external evaluation API.

**Response:**
```json
{
  "success": true,
  "count": 20,
  "notifications": [ ... ]
}
```

### `GET /api/notifications/priority?limit=10`
Returns the top N notifications ranked by priority and recency.

**Query Parameters:**
- `limit` (optional, default: 10) — number of top notifications to return

**Response:**
```json
{
  "success": true,
  "count": 10,
  "limit": 10,
  "notifications": [
    {
      "ID": "...",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22 17:51:20"
    },
    ...
  ]
}
```

---

## Architecture

```
External API (protected, Bearer token)
        │
        ▼
notificationService.js    ← fetches raw notifications with auth header
        │
        ▼
priorityQueue.js          ← Min-Heap: extracts top N by priority + recency
        │
        ▼
notificationController.js ← business logic layer
        │
        ▼
notificationRoutes.js     ← Express router: /api/notifications, /api/notifications/priority
        │
        ▼
server.js                 ← Express app entry point (port 5000)
```

### Standalone Script

Run `npm run stage1` (executes `node index.js`) to print the top 10 priority notifications directly to the terminal as a formatted table — useful for quick verification and screenshots.

---

## External API

- **URL:** `http://4.224.186.213/evaluation-service/notifications`
- **Method:** GET
- **Auth:** Bearer token (stored in `.env` as `TOKEN`)
- **Note:** No data is stored in any database. All filtering/ranking is done in-memory.
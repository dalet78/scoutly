CREATE TABLE leads (
 request_id TEXT PRIMARY KEY,
 payload_hash TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 received_at INTEGER NOT NULL,
 workflow_status TEXT NOT NULL DEFAULT 'new' CHECK(workflow_status IN ('new','contacted','appointment','closed'))
) STRICT;
CREATE TABLE notifications (
 id TEXT PRIMARY KEY,
 request_id TEXT NOT NULL REFERENCES leads(request_id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('email','telegram')),
 target_json TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','sent','simulated','failed')),
 attempts INTEGER NOT NULL DEFAULT 0,
 next_attempt_at INTEGER NOT NULL,
 lease_until INTEGER,
 lease_token TEXT,
 last_error TEXT,
 provider_id TEXT,
 created_at INTEGER NOT NULL,
 UNIQUE(request_id,channel)
) STRICT;
CREATE INDEX notifications_due ON notifications(status,next_attempt_at);
CREATE TABLE rate_limits (
 key TEXT PRIMARY KEY,
 window_start INTEGER NOT NULL,
 hits INTEGER NOT NULL
) STRICT;
PRAGMA user_version = 1;

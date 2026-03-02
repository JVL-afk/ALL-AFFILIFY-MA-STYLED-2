# AFFILIFY Email Marketing - Deployment Checklist

## Pre-Deployment Validation

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No `any` types used (strict mode enabled)
- [ ] All async functions have proper error handling
- [ ] No console.log statements (use structured logging)
- [ ] All external inputs validated with Zod schemas
- [ ] All database queries include tenant filter (userId)

### Testing
- [ ] Unit tests pass: `npm test`
- [ ] Integration tests pass
- [ ] Load testing completed (quota enforcement under concurrency)
- [ ] Circuit breaker tested with simulated failures
- [ ] Retry logic tested with exponential backoff
- [ ] Multi-tenant isolation verified

### Security
- [ ] SendGrid API key stored in environment variables
- [ ] No hardcoded credentials in code
- [ ] JWT token validation enforced on all endpoints
- [ ] Rate limiting configured (via quota service)
- [ ] CORS headers configured correctly
- [ ] Input validation prevents injection attacks

### Database
- [ ] MongoDB connection string configured
- [ ] Collections created: `email_campaigns`, `email_jobs`, `user_quotas`, `email_events`, `metrics`, `error_events`
- [ ] Indexes created:
  - [ ] `email_campaigns`: `userId`, `status`, `createdAt`
  - [ ] `email_jobs`: `status`, `userId`, `idempotencyKey`
  - [ ] `user_quotas`: `userId`
  - [ ] `email_events`: `campaignId`, `userId`, `timestamp`
- [ ] TTL index on `email_events` (30 days)
- [ ] Backup strategy configured

### Environment
- [ ] `SENDGRID_API_KEY` set
- [ ] `SENDGRID_FROM_EMAIL` set
- [ ] `MONGODB_URI` set
- [ ] `NODE_ENV` set to `production`
- [ ] Log level configured
- [ ] Error tracking service configured (optional)

## Deployment Steps

### 1. Pre-Deployment
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build project
npm run build

# Verify no errors
npm run lint
```

### 2. Database Setup
```bash
# Connect to MongoDB
mongosh $MONGODB_URI

# Create collections
db.createCollection("email_campaigns")
db.createCollection("email_jobs")
db.createCollection("user_quotas")
db.createCollection("email_events")
db.createCollection("metrics")
db.createCollection("error_events")

# Create indexes
db.email_campaigns.createIndex({ userId: 1, status: 1 })
db.email_campaigns.createIndex({ createdAt: -1 })
db.email_jobs.createIndex({ status: 1, userId: 1 })
db.email_jobs.createIndex({ idempotencyKey: 1 }, { unique: true })
db.user_quotas.createIndex({ userId: 1 }, { unique: true })
db.email_events.createIndex({ campaignId: 1, userId: 1 })
db.email_events.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 })
```

### 3. Application Deployment
```bash
# Deploy to production
npm run deploy

# Verify deployment
curl https://api.affilify.com/api/health

# Expected response:
# {
#   "status": "healthy",
#   "details": { ... }
# }
```

### 4. Worker Deployment
```bash
# Start email worker (use process manager like PM2)
pm2 start src/workers/email-worker.ts --name "email-worker"

# Verify worker is running
pm2 logs email-worker

# Monitor worker
pm2 monit
```

### 5. Monitoring Setup
- [ ] Set up alerts for circuit breaker state changes
- [ ] Set up alerts for DLQ job accumulation
- [ ] Set up alerts for quota enforcement failures
- [ ] Set up alerts for error rate > 5%
- [ ] Configure log aggregation (ELK, Datadog, etc.)
- [ ] Set up health check monitoring (every 5 minutes)

## Post-Deployment Verification

### Smoke Tests
```bash
# Test campaign creation
curl -X POST https://api.affilify.com/api/email-marketing/campaigns \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "subject": "Test",
    "type": "promotional"
  }'

# Test campaign send
curl -X POST https://api.affilify.com/api/email-marketing/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "...",
    "recipients": ["test@example.com"]
  }'

# Test health check
curl https://api.affilify.com/api/health
```

### Monitoring Checks
- [ ] No errors in application logs
- [ ] Circuit breaker is CLOSED
- [ ] Job queue is processing jobs
- [ ] Quota enforcement is working
- [ ] Metrics are being collected
- [ ] Health check returns "healthy"

### Performance Checks
- [ ] Campaign creation latency < 100ms
- [ ] Send request latency < 500ms
- [ ] Job processing latency < 30 seconds
- [ ] Database query latency < 50ms
- [ ] No memory leaks in worker process

## Rollback Plan

If issues occur, follow this rollback procedure:

### Immediate Rollback
```bash
# Stop email worker
pm2 stop email-worker

# Revert application code
git revert HEAD

# Restart application
npm run deploy

# Verify health
curl https://api.affilify.com/api/health
```

### Data Recovery
```bash
# If data corruption occurred, restore from backup
mongorestore --uri=$MONGODB_URI /path/to/backup

# Verify data integrity
db.email_campaigns.countDocuments()
db.email_jobs.countDocuments()
```

## Post-Rollback Actions
- [ ] Investigate root cause
- [ ] Fix issues in development
- [ ] Run full test suite
- [ ] Deploy again with confidence

## Maintenance Tasks

### Daily
- [ ] Check health endpoint
- [ ] Monitor error rate
- [ ] Check DLQ job count

### Weekly
- [ ] Review error logs
- [ ] Check quota enforcement metrics
- [ ] Verify circuit breaker state

### Monthly
- [ ] Analyze performance metrics
- [ ] Review and optimize slow queries
- [ ] Backup database
- [ ] Update dependencies

## Troubleshooting

### Circuit Breaker is OPEN
```bash
# Check SendGrid status
curl https://status.sendgrid.com/api/v2/status.json

# Wait 1 minute for recovery
sleep 60

# If still open, manually reset (admin only)
# Contact support or use admin API
```

### Jobs in DLQ
```bash
# Check DLQ jobs
db.email_jobs.find({ status: "DLQ" }).limit(10)

# Review error messages
db.email_jobs.find({ status: "DLQ" }).projection({ lastError: 1 })

# Retry specific job
# Use admin API or manual update
```

### Quota Exceeded
```bash
# Check user quota
db.user_quotas.findOne({ userId: ObjectId("...") })

# Reset quota (admin only)
db.user_quotas.updateOne(
  { userId: ObjectId("...") },
  { $set: { emailsSentThisMonth: 0, emailsSentToday: 0 } }
)
```

## Sign-Off

- [ ] Development Lead: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] DevOps Lead: _________________ Date: _______
- [ ] Product Manager: _________________ Date: _______

## Notes

_Use this section for any additional notes or observations during deployment._

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Environment:** _______________

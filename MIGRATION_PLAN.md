# 🔄 Migration Plan: Supabase → Local MariaDB + Express + Socket.IO

## 📊 Executive Summary

**Objective**: Migrate from Supabase cloud to local XAMPP (MariaDB) with Express.js backend and Socket.IO for real-time updates.

**Timeline**: 6 weeks  
**Risk Level**: Medium  
**Downtime**: Zero (parallel deployment strategy)

---

## 🎯 Benefits of Migration

### Cost Savings
- **Current**: Supabase paid tier ($25-100/month)
- **Target**: Free (local infrastructure)
- **5-Year Savings**: $1,500 - $6,000

### Performance Improvements
- **Latency**: 50-200ms → 1-10ms (LAN)
- **Real-time**: Faster Socket.IO vs Supabase Realtime
- **Throughput**: No external API limits

### Control & Scalability
- Full database control
- No vendor lock-in
- Scales with local hardware
- Offline capability

---

## 🏗️ Architecture Comparison

### Current Architecture
```
┌─────────────┐
│   Next.js   │
│  (Frontend) │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼──────┐   ┌──────▼──────────┐
│  Supabase   │   │   Supabase      │
│  PostgreSQL │   │   Realtime      │
└─────────────┘   └─────────────────┘
```

### Target Architecture
```
┌─────────────┐
│   Next.js   │
│  (Frontend) │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
┌──────▼──────┐   ┌──────▼──────┐   ┌─────▼─────┐
│  Express.js │   │  Socket.IO  │   │  MariaDB  │
│  REST API   │   │  Real-time  │   │  (XAMPP)  │
└─────────────┘   └─────────────┘   └───────────┘
```

---

## 📅 Phase-by-Phase Plan

### **PHASE 1: Setup & Preparation** (Week 1)

#### 1.1 Environment Setup
- [ ] Install/verify XAMPP with MariaDB
- [ ] Create project database
- [ ] Set up phpMyAdmin access
- [ ] Configure MariaDB for optimal performance

#### 1.2 Project Structure
```
naga-queue/
├── client_app/          # Next.js frontend (existing)
├── server/              # NEW: Express.js backend
│   ├── src/
│   │   ├── config/      # Database, Socket.IO config
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth, validation
│   │   ├── services/    # Queue logic, real-time
│   │   ├── utils/       # Helpers
│   │   └── socket/      # Socket.IO handlers
│   ├── package.json
│   └── server.js
└── migration/           # Migration scripts
    ├── schema/          # SQL files
    ├── data/            # Data export/import
    └── scripts/         # Migration utilities
```

#### 1.3 Dependencies Installation
```bash
# Backend dependencies
npm init -y
npm install express mysql2 socket.io cors dotenv
npm install bcryptjs jsonwebtoken express-session
npm install express-validator morgan helmet
npm install -D nodemon
```

---

### **PHASE 2: Database Migration** (Week 2)

#### 2.1 Export Supabase Schema
- [ ] Export current database schema
- [ ] Export all data (tickets, users, services, etc.)
- [ ] Document custom functions and triggers

#### 2.2 Convert PostgreSQL → MariaDB
- [ ] Convert data types (uuid → CHAR(36), etc.)
- [ ] Recreate tables in MariaDB
- [ ] Convert RPC functions to stored procedures
- [ ] Set up foreign keys and indexes

#### 2.3 Data Migration
- [ ] Import branches
- [ ] Import users (hash passwords with bcrypt)
- [ ] Import services
- [ ] Import counters
- [ ] Import historical tickets
- [ ] Verify data integrity

---

### **PHASE 3: Backend API Development** (Week 3)

#### 3.1 Core API Routes
- [ ] Authentication (login, register, logout)
- [ ] Tickets CRUD
- [ ] Services CRUD
- [ ] Counters CRUD
- [ ] Users CRUD
- [ ] Queue operations (call next, update status)
- [ ] Reports & analytics

#### 3.2 Business Logic Migration
- [ ] Ticket number generation
- [ ] Queue priority algorithm
- [ ] Wait time calculation
- [ ] Transfer logic
- [ ] Statistics calculation

#### 3.3 Authentication System
- [ ] JWT token generation
- [ ] Session management
- [ ] Role-based middleware
- [ ] Password hashing (bcrypt)

---

### **PHASE 4: Real-time Migration** (Week 4)

#### 4.1 Socket.IO Setup
- [ ] Initialize Socket.IO server
- [ ] Create event handlers
- [ ] Implement room-based broadcasting
- [ ] Add authentication to sockets

#### 4.2 Real-time Events
- [ ] `ticket:created` - New ticket
- [ ] `ticket:updated` - Status change
- [ ] `ticket:called` - Ticket called
- [ ] `counter:updated` - Counter status
- [ ] `announcement:new` - New announcement

#### 4.3 Client Integration
- [ ] Create Socket.IO client wrapper
- [ ] Replace Supabase Realtime hooks
- [ ] Test real-time updates

---

### **PHASE 5: Frontend Migration** (Week 5)

#### 5.1 API Client Layer
- [ ] Create API client (axios/fetch wrapper)
- [ ] Replace Supabase client calls
- [ ] Update authentication flow
- [ ] Handle JWT tokens

#### 5.2 Service Layer Updates
- [ ] Update queue-service.ts
- [ ] Update counter-service.ts
- [ ] Update printer-service.ts
- [ ] Update settings-service.ts
- [ ] Update reports-service.ts

#### 5.3 Hooks Migration
- [ ] Replace useRealtimeTickets
- [ ] Replace useRealtimeCounters
- [ ] Replace useAuth
- [ ] Update all custom hooks

---

### **PHASE 6: Testing & Deployment** (Week 6)

#### 6.1 Testing
- [ ] Unit tests (backend)
- [ ] Integration tests (API)
- [ ] E2E tests (full workflow)
- [ ] Load testing (concurrent users)
- [ ] Real-time performance tests

#### 6.2 Deployment Strategy
- [ ] Parallel deployment (old + new)
- [ ] Gradual migration (branch by branch)
- [ ] Rollback plan
- [ ] Final cutover

#### 6.3 Documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Training materials

---

## 🔧 Technical Details

### Database Schema Conversion

#### PostgreSQL → MariaDB Type Mapping
```sql
-- PostgreSQL          →  MariaDB
uuid                   →  CHAR(36)
text                   →  TEXT / VARCHAR
timestamp with tz      →  DATETIME
jsonb                  →  JSON
boolean                →  TINYINT(1)
serial                 →  AUTO_INCREMENT
```

### Authentication Migration

#### Supabase Auth → JWT
```javascript
// Before (Supabase)
const { data: { user } } = await supabase.auth.getUser()

// After (JWT)
const user = req.user // From JWT middleware
```

### Real-time Migration

#### Supabase Realtime → Socket.IO
```javascript
// Before (Supabase)
supabase
  .channel('tickets')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, 
    (payload) => { /* handle */ }
  )
  .subscribe()

// After (Socket.IO)
socket.on('ticket:updated', (ticket) => {
  // handle update
})
```

---

## 🚨 Risk Mitigation

### Identified Risks

1. **Data Loss**
   - Mitigation: Full backup before migration
   - Rollback: Keep Supabase active during transition

2. **Downtime**
   - Mitigation: Parallel deployment
   - Rollback: DNS/proxy switch back

3. **Real-time Lag**
   - Mitigation: Socket.IO connection pooling
   - Monitoring: Real-time latency tracking

4. **Authentication Issues**
   - Mitigation: Thorough testing
   - Rollback: Dual auth support temporarily

---

## 📊 Success Metrics

### Performance Targets
- API Response Time: < 50ms (LAN)
- Real-time Latency: < 10ms
- Database Query Time: < 20ms
- Concurrent Users: 100+

### Migration Criteria
- [ ] 100% feature parity
- [ ] Zero data loss
- [ ] < 1 hour total downtime
- [ ] All tests passing
- [ ] User acceptance complete

---

## 🔄 Rollback Plan

### If Migration Fails
1. Stop new backend server
2. Revert DNS/proxy to Supabase
3. Restore database from backup
4. Investigate issues
5. Fix and retry

### Rollback Triggers
- Data integrity issues
- Critical bugs in production
- Performance degradation
- User complaints > threshold

---

## 📞 Support & Resources

### Team Responsibilities
- **Database Admin**: Schema migration, optimization
- **Backend Dev**: Express API, Socket.IO
- **Frontend Dev**: Client integration
- **QA**: Testing, validation
- **DevOps**: Deployment, monitoring

### External Resources
- MariaDB Documentation
- Express.js Best Practices
- Socket.IO Guide
- JWT Authentication Guide

---

## ✅ Pre-Migration Checklist

- [ ] Full Supabase backup completed
- [ ] XAMPP installed and configured
- [ ] MariaDB optimized for production
- [ ] Express server tested locally
- [ ] Socket.IO working on LAN
- [ ] All team members trained
- [ ] Rollback plan documented
- [ ] Monitoring tools ready

---

## 📈 Post-Migration Tasks

### Week 1 After Migration
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Fix any minor bugs
- [ ] Optimize slow queries

### Month 1 After Migration
- [ ] Performance tuning
- [ ] Database optimization
- [ ] Documentation updates
- [ ] Training sessions

### Quarter 1 After Migration
- [ ] Decommission Supabase
- [ ] Final cost analysis
- [ ] Lessons learned document
- [ ] Future roadmap planning

---

**Last Updated**: December 10, 2025  
**Version**: 1.0  
**Status**: Planning Phase

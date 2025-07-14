# 12. Performance Considerations

## 12.1 Database Optimization

```sql
-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_watched_at ON watch_history(watched_at);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_movie_id ON favorites(movie_id);
```

## 12.2 Connection Pooling

```typescript
// Database connection pool
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  extra: {
    max: 20,          // Maximum connections
    min: 5,           // Minimum connections
    idle: 10000,      // Close connections after 10 seconds
    acquire: 30000,   // Acquire timeout
    evict: 1000,      // Evict connection every 1 second
  },
});
```

---

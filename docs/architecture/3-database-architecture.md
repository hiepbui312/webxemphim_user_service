# 3. Database Architecture

## 3.1 Entity Relationship Diagram

```mermaid
erDiagram
    User {
        uuid id PK
        string email UK
        string username
        string firstName
        string lastName
        string avatar
        date dateOfBirth
        enum gender
        json preferences
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    
    Profile {
        uuid id PK
        uuid userId FK
        string bio
        string country
        string language
        json settings
        timestamp createdAt
        timestamp updatedAt
    }
    
    WatchHistory {
        uuid id PK
        uuid userId FK
        uuid movieId
        integer watchProgress
        integer duration
        timestamp watchedAt
        timestamp createdAt
        timestamp updatedAt
    }
    
    Favorite {
        uuid id PK
        uuid userId FK
        uuid movieId
        timestamp createdAt
        timestamp updatedAt
    }
    
    UserStatistics {
        uuid id PK
        uuid userId FK
        integer totalWatchTime
        integer totalMoviesWatched
        json genrePreferences
        timestamp calculatedAt
        timestamp createdAt
        timestamp updatedAt
    }
    
    User ||--|| Profile : has
    User ||--o{ WatchHistory : watches
    User ||--o{ Favorite : favorites
    User ||--|| UserStatistics : has
```

## 3.2 Database Configuration

```typescript
// database.config.ts
export const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production',
  extra: {
    connectionLimit: 10,
    acquireTimeoutMillis: 60000,
    timeout: 60000
  }
};
```

---

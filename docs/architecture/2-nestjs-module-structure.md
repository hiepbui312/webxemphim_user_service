# 2. NestJS Module Structure

## 2.1 Core Modules

```
src/
├── app.module.ts                    # Root module
├── main.ts                          # Application entry point
├── common/                          # Shared utilities
│   ├── constants/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
├── config/                          # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── rabbitmq.config.ts
│   └── app.config.ts
├── modules/                         # Business modules
│   ├── user/
│   ├── profile/
│   ├── favorites/
│   ├── watch-history/
│   ├── statistics/
│   └── events/
└── shared/                          # Shared services
    ├── database/
    ├── cache/
    └── messaging/
```

## 2.2 Module Dependencies

```mermaid
graph TD
    A[AppModule] --> B[UserModule]
    A --> C[ProfileModule]
    A --> D[FavoritesModule]
    A --> E[WatchHistoryModule]
    A --> F[StatisticsModule]
    A --> G[EventsModule]
    
    B --> H[DatabaseModule]
    C --> H
    D --> H
    E --> H
    F --> H
    G --> H
    
    A --> I[CacheModule]
    A --> J[MessagingModule]
    A --> K[ConfigModule]
    
    style A fill:#e1f5fe
    style H fill:#fff3e0
    style I fill:#f3e5f5
    style J fill:#e8f5e8
```

---

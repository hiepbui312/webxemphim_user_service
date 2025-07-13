# C4-Model: Component Diagrams – Movie Streaming Platform

This document drills down into each micro-service container to illustrate its internal components and their interactions.

---

## 1. API Gateway
```mermaid
    graph TB
        subgraph "API Gateway (Node.js / Express / TS)"
            IngressCtl[Ingress Controller]
            AuthMW[Authentication Middleware]
            RateLimitMW[Rate-Limiter]
            ServiceRouter[Service Router]
        end

        WebApp[Web Front-End]
        AdminPortal[Admin Portal]

        %% Flows
        WebApp -->|REST/GraphQL| IngressCtl
        AdminPortal -->|REST/GraphQL| IngressCtl
        IngressCtl --> AuthMW
        AuthMW --> RateLimitMW
        RateLimitMW --> ServiceRouter
        ServiceRouter -->|HTTP| AuthAPI[Auth Service API]
        ServiceRouter -->|HTTP| UserAPI[User Service API]
        ServiceRouter -->|HTTP| FilmAPI[Film Catalog API]
        ServiceRouter -->|HTTP| BillingAPI[Billing API]
        ServiceRouter -->|HTTP| PlaybackAPI[Playback API]

        style IngressCtl fill:#fffde7,stroke:#fdd835
        style AuthMW fill:#fffde7,stroke:#fdd835
        style RateLimitMW fill:#fffde7,stroke:#fdd835
        style ServiceRouter fill:#fffde7,stroke:#fdd835
```

---

## 2. Auth Service
```mermaid
graph TB
    subgraph "Auth Service (Node.js / Express / TS)"
        AuthCtl[AuthController]
        TokenCtl[TokenController]
        AuthSvc[AuthService]
        TokenManager[TokenManager]
        AuthDAO[(AuthDAO – PostgreSQL)]
        EventPubAuth[Event Publisher]
    end

    APIGW[API Gateway]
    RabbitMQ[🐰 RabbitMQ]
    Postgres[(PostgreSQL)]

    APIGW -->|REST| AuthCtl
    APIGW -->|REST| TokenCtl
    AuthCtl --> AuthSvc
    TokenCtl --> TokenManager
    AuthSvc --> AuthDAO
    TokenManager --> AuthDAO
    AuthSvc --> EventPubAuth
    EventPubAuth -- publish --> RabbitMQ
    AuthDAO --> Postgres

    style AuthCtl fill:#d1c4e9
    style TokenCtl fill:#d1c4e9
    style AuthSvc fill:#d1c4e9
    style TokenManager fill:#d1c4e9
    style AuthDAO fill:#d1c4e9
    style EventPubAuth fill:#d1c4e9
```

---

## 3. User Service
```mermaid
graph TB
    subgraph "User Service (Node.js / Express / TS)"
        ProfileCtl[ProfileController]
        ProfileSvc[ProfileService]
        UserDAO[(UserDAO – PostgreSQL)]
        EventPub[Event Publisher]
    end

    APIGW[API Gateway]
    RabbitMQ[🐰 RabbitMQ]
    Postgres[(PostgreSQL)]

    APIGW -->|REST| ProfileCtl
    ProfileCtl --> ProfileSvc
    ProfileSvc --> UserDAO
    ProfileSvc --> EventPub
    EventPub -- publish --> RabbitMQ
    UserDAO --> Postgres

    style ProfileCtl fill:#e1bee7
    style ProfileSvc fill:#e1bee7
    style UserDAO fill:#e1bee7
    style EventPub fill:#e1bee7
```

---

## 4. Film Catalog Service
```mermaid
graph TB
    subgraph "Film Catalog Service (Node.js / Express / TS)"
        CatalogCtl[CatalogController]
        SearchCtl[SearchController]
        CatalogSvc[CatalogService]
        SearchSvc[SearchService]
        FilmDAO[(FilmDAO – MongoDB)]
        EventPubFC[Event Publisher]
    end

    APIGW[API Gateway]
    RabbitMQ[🐰 RabbitMQ]
    MongoDB[(MongoDB)]

    APIGW -->|REST| CatalogCtl
    APIGW -->|REST| SearchCtl
    CatalogCtl --> CatalogSvc
    SearchCtl --> SearchSvc
    CatalogSvc --> FilmDAO
    SearchSvc --> FilmDAO
    CatalogSvc --> EventPubFC
    EventPubFC -- publish --> RabbitMQ
    FilmDAO --> MongoDB

    style CatalogCtl fill:#c8e6c9
    style SearchCtl fill:#c8e6c9
    style CatalogSvc fill:#c8e6c9
    style SearchSvc fill:#c8e6c9
    style FilmDAO fill:#c8e6c9
    style EventPubFC fill:#c8e6c9
```

---

## 5. Billing Service
```mermaid
graph TB
    subgraph "Billing Service (Node.js / Express / TS)"
        CheckoutCtl[CheckoutController]
        TokenCtl[TokenController]
        CheckoutSvc[CheckoutService]
        TokenSvc[TokenService]
        BillingDAO[(BillingDAO – PostgreSQL)]
        GatewayClient[Gateway Adapter]
        EventPubBL[Event Publisher]
    end

    APIGW[API Gateway]
    RabbitMQ[🐰 RabbitMQ]
    Postgres[(PostgreSQL)]
    PaymentGW[Payment Gateway]

    APIGW -->|REST| CheckoutCtl
    APIGW -->|REST| TokenCtl
    CheckoutCtl --> CheckoutSvc
    TokenCtl --> TokenSvc
    CheckoutSvc --> BillingDAO
    TokenSvc --> BillingDAO
    CheckoutSvc --> GatewayClient
    GatewayClient -->|HTTPS| PaymentGW
    CheckoutSvc --> EventPubBL
    EventPubBL -- publish --> RabbitMQ
    BillingDAO --> Postgres

    style CheckoutCtl fill:#ffe0b2
    style TokenCtl fill:#ffe0b2
    style CheckoutSvc fill:#ffe0b2
    style TokenSvc fill:#ffe0b2
    style BillingDAO fill:#ffe0b2
    style GatewayClient fill:#ffe0b2
    style EventPubBL fill:#ffe0b2
```

---

## 6. Playback Service
```mermaid
graph TB
    subgraph "Playback Service (Node.js / Express / TS)"
        StreamCtl[StreamController]
        QualityCtl[QualityController]
        StreamSvc[StreamService]
        QualitySvc[QualityService]
        HLSMgr[HLS Manager]
    end

    APIGW[API Gateway]
    S3[(S3 / MinIO)]
    MongoDB[(MongoDB)]

    APIGW -->|REST| StreamCtl
    APIGW -->|REST| QualityCtl
    StreamCtl --> StreamSvc
    QualityCtl --> QualitySvc
    StreamSvc --> HLSMgr
    HLSMgr -- "GET /m3u8/ts" --> S3
    StreamSvc --> MongoDB

    style StreamCtl fill:#f8bbd0
    style QualityCtl fill:#f8bbd0
    style StreamSvc fill:#f8bbd0
    style QualitySvc fill:#f8bbd0
    style HLSMgr fill:#f8bbd0
```

---

## 7. Notification Service
```mermaid
graph TB
    subgraph "Notification Service (Node.js / Express / TS)"
        EventConsumer[Event Consumer]
        TplEngine[Template Engine]
        EmailGate[Email Gateway]
        SmsGate[SMS Gateway]
    end

    RabbitMQ[🐰 RabbitMQ]
    EmailProv[Email Provider]
    SmsProv[SMS Provider]

    RabbitMQ -- "UserCreated, PaymentDone" --> EventConsumer
    EventConsumer --> TplEngine
    TplEngine --> EmailGate
    TplEngine --> SmsGate
    EmailGate -->|SMTP| EmailProv
    SmsGate -->|HTTP API| SmsProv

    style EventConsumer fill:#f0f4c3
    style TplEngine fill:#f0f4c3
    style EmailGate fill:#f0f4c3
    style SmsGate fill:#f0f4c3
```

---

## 8. Transcoder Service
```mermaid
graph TB
    subgraph "Transcoder Service (Node.js / Worker / TS)"
        EncodeWorker[Encode Worker]
        FFmpegAdapter[FFmpeg Adapter]
        HlsSegmenter[HLS Segmenter]
    end

    RabbitMQ[🐰 RabbitMQ]
    ObjectStore[(S3 / MinIO)]

    RabbitMQ -- "UploadQueued" --> EncodeWorker
    EncodeWorker --> FFmpegAdapter
    FFmpegAdapter --> HlsSegmenter
    HlsSegmenter -->|PUT| ObjectStore

    style EncodeWorker fill:#fff9c4
    style FFmpegAdapter fill:#fff9c4
    style HlsSegmenter fill:#fff9c4
``` 
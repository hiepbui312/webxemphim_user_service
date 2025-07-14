# 10. Monitoring & Observability

## 10.1 Metrics Collection

```typescript
// Custom metrics
@Injectable()
export class MetricsService {
  private readonly userRegistrations = new Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
  });

  private readonly apiRequests = new Histogram({
    name: 'api_request_duration_seconds',
    help: 'Duration of API requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  recordUserRegistration() {
    this.userRegistrations.inc();
  }

  recordApiRequest(method: string, route: string, statusCode: number, duration: number) {
    this.apiRequests.observe({ method, route, status_code: statusCode }, duration);
  }
}
```

## 10.2 Health Checks

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
```

---

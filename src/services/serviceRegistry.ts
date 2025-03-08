'use client';

export class ServiceRegistry {
  private static instance: ServiceRegistry | null = null;
  private services: Map<string, any> = new Map();
  private initializing: Set<string> = new Set();
  private isDisabled: boolean = false;

  private constructor() {
    // Check if services should be disabled
    if (typeof window !== 'undefined') {
      this.isDisabled = window.__NEXT_DATA__?.props?.pageProps?.__N_SSG || 
                       process.env.NEXT_PUBLIC_DISABLE_SERVICES === 'true';
    } else {
      this.isDisabled = true; // Disable services during SSR/SSG
    }
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  register<T>(key: string, service: T): void {
    if (this.isDisabled) {
      return;
    }

    // If service is already registered, return
    if (this.services.has(key)) {
      return;
    }

    // If service is being initialized, we have a circular dependency
    if (this.initializing.has(key)) {
      console.warn(`Circular dependency detected for service: ${key}`);
      return;
    }

    try {
      this.initializing.add(key);
      this.services.set(key, service);
    } finally {
      this.initializing.delete(key);
    }
  }

  get<T>(key: string): T | null {
    if (this.isDisabled) {
      return null;
    }
    return this.services.get(key) || null;
  }

  clear(): void {
    this.services.clear();
    this.initializing.clear();
  }
}

export default ServiceRegistry; 
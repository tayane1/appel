import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface ResourceMetrics {
  name: string;
  size: number;
  loadTime: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private performanceMetricsSubject = new BehaviorSubject<PerformanceMetrics | null>(null);
  private resourceMetricsSubject = new BehaviorSubject<ResourceMetrics[]>([]);
  private isMonitoring = false;

  constructor(private ngZone: NgZone) {}

  /**
   * Démarrer le monitoring des performances
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.ngZone.runOutsideAngular(() => {
      this.observePerformanceMetrics();
      this.observeResourceMetrics();
    });
  }

  /**
   * Arrêter le monitoring des performances
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Observer les métriques de performance Web Vitals
   */
  private observePerformanceMetrics(): void {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      this.observeFirstContentfulPaint();
      
      // Largest Contentful Paint
      this.observeLargestContentfulPaint();
      
      // Cumulative Layout Shift
      this.observeCumulativeLayoutShift();
      
      // First Input Delay
      this.observeFirstInputDelay();
    }

    // Time to Interactive (approximation)
    this.measureTimeToInteractive();
  }

  /**
   * Observer le First Contentful Paint
   */
  private observeFirstContentfulPaint(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        this.ngZone.run(() => {
          const metrics = this.performanceMetricsSubject.value || this.getDefaultMetrics();
          metrics.firstContentfulPaint = fcpEntry.startTime;
          this.performanceMetricsSubject.next(metrics);
        });
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  /**
   * Observer le Largest Contentful Paint
   */
  private observeLargestContentfulPaint(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1]; // Le dernier est le plus grand
      
      if (lcpEntry) {
        this.ngZone.run(() => {
          const metrics = this.performanceMetricsSubject.value || this.getDefaultMetrics();
          metrics.largestContentfulPaint = lcpEntry.startTime;
          this.performanceMetricsSubject.next(metrics);
        });
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * Observer le Cumulative Layout Shift
   */
  private observeCumulativeLayoutShift(): void {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.ngZone.run(() => {
        const metrics = this.performanceMetricsSubject.value || this.getDefaultMetrics();
        metrics.cumulativeLayoutShift = clsValue;
        this.performanceMetricsSubject.next(metrics);
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Observer le First Input Delay
   */
  private observeFirstInputDelay(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;
          
          this.ngZone.run(() => {
            const metrics = this.performanceMetricsSubject.value || this.getDefaultMetrics();
            metrics.firstInputDelay = fid;
            this.performanceMetricsSubject.next(metrics);
          });
        }
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  /**
   * Mesurer le Time to Interactive (approximation)
   */
  private measureTimeToInteractive(): void {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      const tti = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
      
      this.ngZone.run(() => {
        const metrics = this.performanceMetricsSubject.value || this.getDefaultMetrics();
        metrics.timeToInteractive = tti;
        this.performanceMetricsSubject.next(metrics);
      });
    }
  }

  /**
   * Observer les métriques des ressources
   */
  private observeResourceMetrics(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const resourceMetrics: ResourceMetrics[] = [];

      entries.forEach((entry: any) => {
        if (entry.entryType === 'resource') {
          resourceMetrics.push({
            name: entry.name,
            size: entry.transferSize || 0,
            loadTime: entry.duration,
            type: entry.initiatorType
          });
        }
      });

      this.ngZone.run(() => {
        this.resourceMetricsSubject.next(resourceMetrics);
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Obtenir les métriques de performance actuelles
   */
  getPerformanceMetrics(): Observable<PerformanceMetrics | null> {
    return this.performanceMetricsSubject.asObservable();
  }

  /**
   * Obtenir les métriques des ressources
   */
  getResourceMetrics(): Observable<ResourceMetrics[]> {
    return this.resourceMetricsSubject.asObservable();
  }

  /**
   * Mesurer le temps de chargement d'une page
   */
  measurePageLoadTime(): number {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.fetchStart : 0;
  }

  /**
   * Analyser les performances d'une fonction
   */
  measureFunctionPerformance<T>(fn: () => T, name: string): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    console.log(`Performance [${name}]: ${endTime - startTime}ms`);
    return result;
  }

  /**
   * Analyser les performances d'une fonction asynchrone
   */
  async measureAsyncFunctionPerformance<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    console.log(`Performance [${name}]: ${endTime - startTime}ms`);
    return result;
  }

  /**
   * Optimiser les images
   */
  optimizeImages(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Lazy loading
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // Responsive images
      if (!img.sizes) {
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
      }
    });
  }

  /**
   * Précharger les ressources critiques
   */
  preloadCriticalResources(resources: string[]): void {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = this.getResourceType(resource);
      document.head.appendChild(link);
    });
  }

  /**
   * Déterminer le type de ressource
   */
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'css':
        return 'style';
      case 'js':
        return 'script';
      case 'woff':
      case 'woff2':
        return 'font';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return 'image';
      default:
        return 'fetch';
    }
  }

  /**
   * Obtenir les métriques par défaut
   */
  private getDefaultMetrics(): PerformanceMetrics {
    return {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      timeToInteractive: 0
    };
  }

  /**
   * Générer un rapport de performance
   */
  generatePerformanceReport(): any {
    const metrics = this.performanceMetricsSubject.value;
    const resources = this.resourceMetricsSubject.value;
    
    return {
      timestamp: new Date().toISOString(),
      metrics,
      resources: {
        total: resources.length,
        totalSize: resources.reduce((sum, resource) => sum + resource.size, 0),
        averageLoadTime: resources.reduce((sum, resource) => sum + resource.loadTime, 0) / resources.length,
        byType: this.groupResourcesByType(resources)
      },
      recommendations: this.generateRecommendations(metrics, resources)
    };
  }

  /**
   * Grouper les ressources par type
   */
  private groupResourcesByType(resources: ResourceMetrics[]): any {
    return resources.reduce((groups, resource) => {
      if (!groups[resource.type]) {
        groups[resource.type] = [];
      }
      groups[resource.type].push(resource);
      return groups;
    }, {} as any);
  }

  /**
   * Générer des recommandations d'optimisation
   */
  private generateRecommendations(metrics: PerformanceMetrics | null, resources: ResourceMetrics[]): string[] {
    const recommendations: string[] = [];

    if (metrics) {
      if (metrics.firstContentfulPaint > 2000) {
        recommendations.push('Optimiser le First Contentful Paint (< 2s)');
      }
      
      if (metrics.largestContentfulPaint > 2500) {
        recommendations.push('Optimiser le Largest Contentful Paint (< 2.5s)');
      }
      
      if (metrics.cumulativeLayoutShift > 0.1) {
        recommendations.push('Réduire le Cumulative Layout Shift (< 0.1)');
      }
      
      if (metrics.firstInputDelay > 100) {
        recommendations.push('Optimiser le First Input Delay (< 100ms)');
      }
    }

    const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
    if (totalSize > 1024 * 1024) { // 1MB
      recommendations.push('Réduire la taille totale des ressources (< 1MB)');
    }

    const slowResources = resources.filter(r => r.loadTime > 1000);
    if (slowResources.length > 0) {
      recommendations.push(`Optimiser ${slowResources.length} ressource(s) lente(s)`);
    }

    return recommendations;
  }
} 
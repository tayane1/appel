import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { PerformanceService, PerformanceMetrics } from '../optimization/performance.service';

export interface UserSession {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  actions: UserAction[];
  performance: PerformanceMetrics | null;
}

export interface UserAction {
  type: 'page_view' | 'button_click' | 'form_submit' | 'search' | 'filter' | 'download' | 'error';
  timestamp: Date;
  details: any;
  page: string;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  topActions: Array<{ action: string; count: number }>;
  errors: ErrorLog[];
  performance: {
    averageLoadTime: number;
    averageFCP: number;
    averageLCP: number;
    averageCLS: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private sessionSubject = new BehaviorSubject<UserSession | null>(null);
  private analyticsSubject = new BehaviorSubject<AnalyticsData | null>(null);
  private errorLogsSubject = new BehaviorSubject<ErrorLog[]>([]);
  
  private sessionId: string;
  private isMonitoring = false;
  private heartbeatInterval: any;

  constructor(
    private ngZone: NgZone,
    private performanceService: PerformanceService
  ) {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  /**
   * Démarrer le monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.performanceService.startMonitoring();
    this.startHeartbeat();
    this.setupErrorHandling();
    this.trackPageViews();
    this.trackUserActions();
  }

  /**
   * Arrêter le monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.performanceService.stopMonitoring();
    this.stopHeartbeat();
  }

  /**
   * Initialiser la session utilisateur
   */
  private initializeSession(): void {
    const session: UserSession = {
      sessionId: this.sessionId,
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 0,
      actions: [],
      performance: null
    };

    this.sessionSubject.next(session);
  }

  /**
   * Générer un ID de session unique
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Démarrer le heartbeat pour maintenir la session active
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = interval(30000).subscribe(() => {
      this.updateLastActivity();
    });
  }

  /**
   * Arrêter le heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      this.heartbeatInterval.unsubscribe();
    }
  }

  /**
   * Mettre à jour la dernière activité
   */
  private updateLastActivity(): void {
    const session = this.sessionSubject.value;
    if (session) {
      session.lastActivity = new Date();
      this.sessionSubject.next(session);
    }
  }

  /**
   * Configurer la gestion des erreurs
   */
  private setupErrorHandling(): void {
    // Intercepter les erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Intercepter les erreurs de promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  /**
   * Suivre les vues de pages
   */
  private trackPageViews(): void {
    // Utiliser l'API History pour détecter les changements de page
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.recordPageView();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.recordPageView();
    };

    // Écouter les événements popstate
    window.addEventListener('popstate', () => {
      this.recordPageView();
    });

    // Enregistrer la vue initiale
    this.recordPageView();
  }

  /**
   * Enregistrer une vue de page
   */
  private recordPageView(): void {
    const session = this.sessionSubject.value;
    if (session) {
      session.pageViews++;
      session.lastActivity = new Date();
      
      this.recordAction({
        type: 'page_view',
        timestamp: new Date(),
        details: { url: window.location.href, title: document.title },
        page: window.location.pathname
      });

      this.sessionSubject.next(session);
    }
  }

  /**
   * Suivre les actions utilisateur
   */
  private trackUserActions(): void {
    // Suivre les clics sur les boutons
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        this.recordAction({
          type: 'button_click',
          timestamp: new Date(),
          details: { 
            buttonText: target.textContent?.trim(),
            buttonId: target.id,
            buttonClass: target.className
          },
          page: window.location.pathname
        });
      }
    });

    // Suivre les soumissions de formulaires
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.recordAction({
        type: 'form_submit',
        timestamp: new Date(),
        details: { 
          formId: form.id,
          formAction: form.action,
          formMethod: form.method
        },
        page: window.location.pathname
      });
    });

    // Suivre les recherches
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'search' || target.placeholder?.toLowerCase().includes('search')) {
        this.recordAction({
          type: 'search',
          timestamp: new Date(),
          details: { 
            searchTerm: target.value,
            searchField: target.id || target.name
          },
          page: window.location.pathname
        });
      }
    });
  }

  /**
   * Enregistrer une action utilisateur
   */
  recordAction(action: UserAction): void {
    const session = this.sessionSubject.value;
    if (session) {
      session.actions.push(action);
      session.lastActivity = new Date();
      this.sessionSubject.next(session);
    }
  }

  /**
   * Enregistrer une erreur
   */
  logError(error: ErrorLog): void {
    const currentErrors = this.errorLogsSubject.value;
    const updatedErrors = [...currentErrors, error];
    this.errorLogsSubject.next(updatedErrors);

    // Envoyer l'erreur au serveur de monitoring
    this.sendErrorToServer(error);
  }

  /**
   * Envoyer une erreur au serveur de monitoring
   */
  private sendErrorToServer(error: ErrorLog): void {
    // Implémentation pour envoyer l'erreur à un service externe
    // Par exemple: Sentry, LogRocket, etc.
    console.error('Error logged:', error);
    
    // Exemple d'envoi à un endpoint API
    fetch('/api/monitoring/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(error)
    }).catch(err => {
      console.error('Failed to send error to server:', err);
    });
  }

  /**
   * Obtenir les données de session actuelles
   */
  getCurrentSession(): Observable<UserSession | null> {
    return this.sessionSubject.asObservable();
  }

  /**
   * Obtenir les données d'analytics
   */
  getAnalyticsData(): Observable<AnalyticsData | null> {
    return this.analyticsSubject.asObservable();
  }

  /**
   * Obtenir les logs d'erreurs
   */
  getErrorLogs(): Observable<ErrorLog[]> {
    return this.errorLogsSubject.asObservable();
  }

  /**
   * Générer un rapport d'analytics
   */
  generateAnalyticsReport(): AnalyticsData {
    const session = this.sessionSubject.value;
    const errors = this.errorLogsSubject.value;
    const performance = this.performanceService.generatePerformanceReport();

    // Calculer les statistiques de base
    const pageViews = session?.pageViews || 0;
    const uniqueUsers = 1; // Simplifié pour cet exemple
    const sessionDuration = session ? 
      (session.lastActivity.getTime() - session.startTime.getTime()) / 1000 : 0;
    const bounceRate = session && session.pageViews <= 1 ? 100 : 0;

    // Analyser les pages les plus visitées
    const pageViewsMap = new Map<string, number>();
    session?.actions
      .filter(action => action.type === 'page_view')
      .forEach(action => {
        const page = action.details.url;
        pageViewsMap.set(page, (pageViewsMap.get(page) || 0) + 1);
      });

    const topPages = Array.from(pageViewsMap.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Analyser les actions les plus fréquentes
    const actionCounts = new Map<string, number>();
    session?.actions.forEach(action => {
      const key = `${action.type}:${action.details.buttonText || action.details.searchTerm || 'unknown'}`;
      actionCounts.set(key, (actionCounts.get(key) || 0) + 1);
    });

    const topActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculer les métriques de performance moyennes
    const performanceMetrics = performance.metrics;
    const avgLoadTime = performanceMetrics?.pageLoadTime || 0;
    const avgFCP = performanceMetrics?.firstContentfulPaint || 0;
    const avgLCP = performanceMetrics?.largestContentfulPaint || 0;
    const avgCLS = performanceMetrics?.cumulativeLayoutShift || 0;

    const analyticsData: AnalyticsData = {
      pageViews,
      uniqueUsers,
      averageSessionDuration: sessionDuration,
      bounceRate,
      topPages,
      topActions,
      errors,
      performance: {
        averageLoadTime: avgLoadTime,
        averageFCP: avgFCP,
        averageLCP: avgLCP,
        averageCLS: avgCLS
      }
    };

    this.analyticsSubject.next(analyticsData);
    return analyticsData;
  }

  /**
   * Envoyer les données d'analytics au serveur
   */
  sendAnalyticsToServer(): void {
    const analyticsData = this.generateAnalyticsReport();
    
    fetch('/api/monitoring/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsData)
    }).catch(err => {
      console.error('Failed to send analytics to server:', err);
    });
  }

  /**
   * Nettoyer les données de session
   */
  clearSession(): void {
    this.sessionSubject.next(null);
    this.errorLogsSubject.next([]);
    this.analyticsSubject.next(null);
  }

  /**
   * Obtenir la durée de session actuelle
   */
  getSessionDuration(): Observable<number> {
    return this.sessionSubject.pipe(
      filter(session => session !== null),
      map(session => {
        if (!session) return 0;
        return (session.lastActivity.getTime() - session.startTime.getTime()) / 1000;
      })
    );
  }

  /**
   * Vérifier si la session est active
   */
  isSessionActive(): Observable<boolean> {
    return this.sessionSubject.pipe(
      map(session => {
        if (!session) return false;
        const now = new Date();
        const lastActivity = session.lastActivity;
        const inactiveThreshold = 30 * 60 * 1000; // 30 minutes
        return (now.getTime() - lastActivity.getTime()) < inactiveThreshold;
      })
    );
  }
} 
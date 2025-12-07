
import { trackingEvents } from '@/components/tracking/GTMManager';

export interface UserFunnelStep {
  step: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserAnalytics {
  userId: string;
  sessionId: string;
  funnelSteps: UserFunnelStep[];
  pageViews: { page: string; timestamp: Date }[];
  interactions: { type: string; target: string; timestamp: Date }[];
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private analytics: UserAnalytics;

  constructor() {
    this.analytics = {
      userId: '',
      sessionId: this.generateSessionId(),
      funnelSteps: [],
      pageViews: [],
      interactions: []
    };
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUser(userId: string) {
    this.analytics.userId = userId;
  }

  // Funnel tracking
  trackFunnelStep(step: string, metadata?: Record<string, any>) {
    const funnelStep: UserFunnelStep = {
      step,
      timestamp: new Date(),
      metadata
    };
    
    this.analytics.funnelSteps.push(funnelStep);
    
    // Also send to GTM
    trackingEvents.pageView(step);
    
    console.log('Funnel step tracked:', funnelStep);
  }

  // Page view tracking
  trackPageView(page: string) {
    this.analytics.pageViews.push({
      page,
      timestamp: new Date()
    });
    
    trackingEvents.pageView(page);
  }

  // Interaction tracking
  trackInteraction(type: string, target: string) {
    this.analytics.interactions.push({
      type,
      target,
      timestamp: new Date()
    });
  }

  // Predefined funnel steps for e-regulariza
  trackRegistrationStart() {
    this.trackFunnelStep('registration_start');
  }

  trackRegistrationComplete() {
    this.trackFunnelStep('registration_complete');
  }

  trackFirstLogin() {
    this.trackFunnelStep('first_login');
  }

  trackProcessInitiation(processType: string) {
    this.trackFunnelStep('process_initiation', { processType });
    trackingEvents.processStart(processType);
  }

  trackDocumentUpload(documentType: string) {
    this.trackFunnelStep('document_upload', { documentType });
    trackingEvents.documentUpload(documentType);
  }

  trackProcessStageComplete(processId: string, stage: string) {
    this.trackFunnelStep('process_stage_complete', { processId, stage });
    trackingEvents.processStageComplete(processId, stage);
  }

  trackProcessComplete(processId: string, processType: string) {
    this.trackFunnelStep('process_complete', { processId, processType });
    trackingEvents.processComplete(processId, processType);
  }

  // Get analytics summary
  getAnalyticsSummary() {
    return {
      userId: this.analytics.userId,
      sessionId: this.analytics.sessionId,
      totalPageViews: this.analytics.pageViews.length,
      totalInteractions: this.analytics.interactions.length,
      funnelProgress: this.analytics.funnelSteps.length,
      lastActivity: Math.max(
        ...this.analytics.pageViews.map(pv => pv.timestamp.getTime()),
        ...this.analytics.interactions.map(i => i.timestamp.getTime()),
        ...this.analytics.funnelSteps.map(fs => fs.timestamp.getTime())
      )
    };
  }

  // Export data for analysis
  exportAnalytics() {
    return JSON.stringify(this.analytics, null, 2);
  }
}

// Global analytics instance
export const analytics = AnalyticsService.getInstance();

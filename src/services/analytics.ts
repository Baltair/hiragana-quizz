import { QuizMode } from '../types';

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      action: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export interface QuizStartAnalyticsParams {
  quiz_mode: QuizMode;
  choices_count: number;
  rounds_planned: number;
  is_infinite_mode: boolean;
  is_drill_mode: boolean;
  pool_size: number;
  include_dakuten: boolean;
  include_combination: boolean;
}

export interface QuizCompleteAnalyticsParams {
  total_answered: number;
  total_correct: number;
  accuracy: number;
  max_streak: number;
  duration_seconds: number;
  quiz_mode: QuizMode;
  choices_count: number;
  rounds_planned: number;
  is_drill_mode: boolean;
  missed_kana_count: number;
  perfect_kana_count: number;
  completed_naturally: boolean;
}

function sendEvent(eventName: string, params: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    // Non-blocking: analytics errors should never break user experience
    console.debug(`[Analytics] Failed to send ${eventName}:`, err);
  }
}

export function trackQuizStart(params: QuizStartAnalyticsParams): void {
  sendEvent('quiz_start', params as unknown as Record<string, unknown>);
}

export function trackQuizComplete(params: QuizCompleteAnalyticsParams): void {
  sendEvent('quiz_complete', params as unknown as Record<string, unknown>);
}

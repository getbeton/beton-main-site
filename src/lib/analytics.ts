/**
 * dataLayer push helper for GTM
 * Mirrors the pattern from getbeton/inspector src/lib/analytics/gtm.ts
 */

interface DataLayerEvent {
  event: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  event_value?: number;
  page_path?: string;
  page_title?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export function pushToDataLayer(event: DataLayerEvent): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

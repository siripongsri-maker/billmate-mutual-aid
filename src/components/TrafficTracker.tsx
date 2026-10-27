import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

export function TrafficTracker() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  useEffect(() => {
    if (!document.querySelector('script[data-traffic]')) {
      const script = document.createElement('script');
      script.type = 'module'; script.src = '/traffic.js'; script.dataset.traffic = 'true';
      document.head.appendChild(script);
    }
    window.dispatchEvent(new Event('traffic-route'));
  }, [pathname]);
  return null;
}
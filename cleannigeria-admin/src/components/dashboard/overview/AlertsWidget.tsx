import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStats } from '@/hooks/useAdminUsers';

export function AlertsWidget() {
  const { data: stats } = useAdminStats();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (stats) {
      const newAlerts = [];
      let idCounter = 1;

      if (stats.pendingPayments > 0) {
        newAlerts.push({
          id: idCounter++,
          message: `${stats.pendingPayments} pending payments need attention.`,
          type: 'warning'
        });
      }

      if (stats.openComplaints > 0) {
        newAlerts.push({
          id: idCounter++,
          message: `${stats.openComplaints} unresolved complaints require action.`,
          type: 'error'
        });
      }

      setAlerts(newAlerts);
    }
  }, [stats]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-6">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              alert.type === 'error' 
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300' 
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
            <button onClick={() => dismissAlert(alert.id)} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

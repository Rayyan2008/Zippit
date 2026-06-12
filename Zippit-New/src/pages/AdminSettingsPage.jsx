import React from 'react';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-md text-ink mb-1">Settings</h1>
        <p className="eyebrow text-ink/60">Manage your admin preferences</p>
      </div>

      {/* Settings Content */}
      <div className="border border-ink/10 bg-white p-8">
        <div className="flex items-start gap-4">
          <SettingsIcon className="h-6 w-6 text-rouge flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-lg text-ink mb-2">Coming Soon</h2>
            <p className="text-sm text-ink/60 max-w-md">
              Admin settings will be available soon. This section will include preferences, notifications, security settings, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

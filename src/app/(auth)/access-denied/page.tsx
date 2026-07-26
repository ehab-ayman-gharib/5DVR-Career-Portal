import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-slate-900/90 border border-red-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Your Google account email is not on the pre-approved access whitelist for this platform.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left mb-8">
          <p className="font-semibold text-slate-300 mb-1">What can you do?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure you signed in with your official registered email.</li>
            <li>Contact an administrator to add your email to the whitelist.</li>
          </ul>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Try Another Account</span>
        </Link>
      </div>
    </div>
  );
}

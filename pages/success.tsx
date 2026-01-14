import { CheckCircle, Key, Copy, Check as CheckIcon } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useEffect, useState } from 'react';

export default function Success() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('session_id');
    setSessionId(sid);

    if (!sid) {
      setLoading(false);
      setError('No session ID found. Please check your email for your license key.');
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // 60 seconds max wait time (increased for local dev latency)
    let intervalId: NodeJS.Timeout;

    const fetchLicense = async () => {
      try {
        const res = await fetch(`/api/stripe/license?session_id=${sid}`);

        // If 404, it might just not be ready yet
        if (res.status === 404) {
          return false;
        }

        const data = await res.json();

        if (data.success && data.licenseKey) {
          setLicenseKey(data.licenseKey);
          setLoading(false);
          return true; // Stop polling
        }
      } catch (err) {
        console.error('License fetch error:', err);
      }
      return false; // Keep polling
    };

    const startPolling = async () => {
      // Try immediately
      if (await fetchLicense()) return;

      // Then poll
      intervalId = setInterval(async () => {
        attempts++;
        const found = await fetchLicense();

        if (found) {
          clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setLoading(false);
          setError('We couldn\'t retrieve your key instantly, but don\'t worry! It has been sent to your email and Discord DM.');
        }
      }, 2000);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const copyToClipboard = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-trilo-bg text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
          Payment Successful!
        </h1>

        <p className="text-xl text-gray-300 text-center mb-8">
          Your Trilo license is ready to activate.
        </p>

        {/* License Key Notice */}
        <div className="bg-trilo-orange/10 border border-trilo-orange/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-trilo-orange/20 flex items-center justify-center">
              <Key size={20} className="text-trilo-orange" />
            </div>
            <h2 className="text-xl font-heading font-bold">Your License Key</h2>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trilo-orange mx-auto"></div>
              <p className="text-gray-400 text-sm mt-2">Retrieving your license key...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {licenseKey && (
            <>
              <div className="bg-trilo-bg border border-white/10 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <code className="text-lg font-mono text-trilo-orange font-bold flex-1">
                  {licenseKey}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 p-2 bg-trilo-orange/20 hover:bg-trilo-orange/30 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckIcon size={20} className="text-green-400" /> : <Copy size={20} className="text-trilo-orange" />}
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Your license key has also been sent to your Discord DM and email.
              </p>
            </>
          )}

          <p className="text-trilo-orange text-sm font-semibold">
            ✨ One license works on up to 3 Discord servers
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-trilo-elevated/40 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            How to Activate
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Check Your Email</h3>
                <p className="text-gray-400 text-sm">
                  Your license key has been sent to the email you used at checkout. Check your inbox (and spam folder).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Activate in Discord</h3>
                <p className="text-gray-400 text-sm">
                  Go to your Discord server and run <code className="bg-white/10 px-2 py-1 rounded">/admin activate TRILO-XXXX-XXXX-XXXX</code> with your license key.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Start Using Trilo</h3>
                <p className="text-gray-400 text-sm">
                  All commands are now unlocked! Try <code className="bg-white/10 px-2 py-1 rounded">/matchups create</code> or <code className="bg-white/10 px-2 py-1 rounded">/teams assign-user</code> to get started.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">
                💡
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Use on Multiple Servers</h3>
                <p className="text-gray-400 text-sm">
                  Your license works on up to 3 servers. Just run <code className="bg-white/10 px-2 py-1 rounded">/admin activate</code> in any other server to use it there too!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <p className="text-blue-200 text-sm text-center">
            📧 A receipt and your license key have been sent to your email. You can check your activation status anytime with <code className="bg-white/10 px-2 py-1 rounded">/admin license-info</code>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </a>

          <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="w-full sm:w-auto">
              Open Discord
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

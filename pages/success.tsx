import { CheckCircle, Key, Copy, Check as CheckIcon, ExternalLink, Terminal } from 'lucide-react';
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
    <div className="min-h-screen field-grid text-white flex items-center justify-center px-4 pt-36 pb-20">
      <div className="noise-bg fixed inset-0 z-[-1]" />
      
      <div className="max-w-2xl w-full relative z-10">
        
        {/* Stadium Gate pass verified label */}
        <div className="flex justify-center mb-6">
          <div className="border-2 border-[#2dc770] bg-[#2dc770]/10 px-5 py-1.5 flex items-center gap-2">
            <CheckCircle size={14} className="text-[#2dc770] animate-pulse" />
            <span className="font-heading font-extrabold text-[#2dc770] text-xs tracking-widest uppercase">GATE PASS VERIFIED</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-center uppercase tracking-tight text-white mb-2 leading-none athletic-tracking">
          PAYMENT SUCCESSFUL
        </h1>

        <p className="text-xs text-gray-400 text-center mb-12 uppercase tracking-widest font-heading font-semibold">
          Your Trilo license is active and ready to deploy.
        </p>

        {/* Stadium Ticket Pass - License Key */}
        <div className="relative bg-[#181a1c] border-2 border-trilo-orange/30 p-6 lg:p-8 mb-12 shadow-2xl relative overflow-hidden">
          {/* Perforated circular ticket punches */}
          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-10 rounded-r-full bg-[#111315] border-r-2 border-y-2 border-trilo-orange/30 z-10" />
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-10 rounded-l-full bg-[#111315] border-l-2 border-y-2 border-trilo-orange/30 z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/5 relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-trilo-orange/10 border border-trilo-orange/30 flex items-center justify-center text-trilo-orange flex-shrink-0">
                <Key size={18} />
              </div>
              <div>
                <span className="text-[9px] font-mono text-trilo-orange uppercase tracking-widest block font-bold">REGISTRY TICKET</span>
                <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider">YOUR LICENSE KEY</h2>
              </div>
            </div>

            {/* Barcode styling */}
            <div className="opacity-60 flex-shrink-0">
              <svg className="w-24 h-8 fill-current text-gray-500" viewBox="0 0 100 30">
                <rect x="0" width="3" height="30" />
                <rect x="5" width="1" height="30" />
                <rect x="8" width="2" height="30" />
                <rect x="12" width="4" height="30" />
                <rect x="18" width="1" height="30" />
                <rect x="21" width="3" height="30" />
                <rect x="26" width="2" height="30" />
                <rect x="30" width="1" height="30" />
                <rect x="33" width="4" height="30" />
                <rect x="39" width="2" height="30" />
                <rect x="43" width="1" height="30" />
                <rect x="46" width="3" height="30" />
                <rect x="51" width="2" height="30" />
                <rect x="55" width="1" height="30" />
                <rect x="58" width="4" height="30" />
                <rect x="64" width="2" height="30" />
                <rect x="68" width="3" height="30" />
                <rect x="73" width="1" height="30" />
                <rect x="76" width="2" height="30" />
                <rect x="80" width="4" height="30" />
                <rect x="86" width="1" height="30" />
                <rect x="89" width="3" height="30" />
                <rect x="94" width="2" height="30" />
                <rect x="98" width="2" height="30" />
              </svg>
              <div className="text-[8px] font-mono text-gray-500 text-center tracking-widest mt-1">SEC: COMMISH | ACTIVE</div>
            </div>
          </div>

          <div className="relative z-20">
            {loading && (
              <div className="text-center py-6">
                <div className="animate-pulse font-mono text-xs text-trilo-yellow uppercase tracking-widest">
                  [ BLINKING SIGNAL... FETCHING KEY ]
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 p-4 mb-4">
                <p className="text-red-400 font-mono text-xs uppercase tracking-wide">{error}</p>
              </div>
            )}

            {licenseKey && (
              <>
                <div className="bg-[#0a0c0e] border border-white/10 p-4 mb-4 flex items-center justify-between gap-4">
                  <code className="text-lg lg:text-xl font-mono text-trilo-yellow font-extrabold tracking-widest flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {licenseKey}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 p-2.5 bg-trilo-orange/10 border border-trilo-orange/30 hover:bg-trilo-orange text-trilo-orange hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckIcon size={16} className="text-[#2dc770]" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-gray-400 text-xs font-sans leading-relaxed mb-4">
                  Your license key has also been dispatched to your Discord DM. Save this key in a secure location.
                </p>
              </>
            )}

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-trilo-orange font-bold uppercase tracking-widest">
              <span>LIMIT: 1 DISCORD SERVER</span>
              <span className="animate-pulse text-[#2dc770]">★ ACTIVE STADIUM TICKET</span>
            </div>
          </div>
        </div>

        {/* Clipboard Manual Checklist */}
        <div className="relative bg-[#181a1c] border-2 border-white/10 p-8 mb-12 shadow-xl">
          {/* Clipboard metal clamp */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#27292c] border-b border-l border-r border-white/10" />

          <h2 className="text-2xl font-heading font-extrabold text-white text-center uppercase tracking-wider mb-8 mt-2">
            ACTIVATION PLAYBOOK
          </h2>

          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "Verify Roster Receipt",
                desc: "Stripe sends a detailed payment confirmation to your checkout email address."
              },
              {
                num: "02",
                title: "Run Activation Command",
                desc: "Execute the server command inside your target Discord server to bind registration:",
                code: `/admin activate key: ${licenseKey || 'TRILO-XXXX-XXXX-XXXX'}`
              },
              {
                num: "03",
                title: "Deploy Matchups",
                desc: "All dynasty commands are now unlocked. Try uploading screenshots to test OCR matchups:",
                code: "/matchups create-from-image"
              },
              {
                num: "04",
                title: "Transfer Server License",
                desc: "Need to reallocate your league license? Run the deactivation command first in the old server:",
                code: "/admin deactivate"
              }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-7 h-7 border border-trilo-orange/30 bg-trilo-orange/5 text-trilo-orange font-heading font-extrabold text-xs flex items-center justify-center">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-extrabold text-white text-base uppercase tracking-wider mb-1 leading-none">{step.title}</h3>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed mb-2">
                    {step.desc}
                  </p>
                  {step.code && (
                    <div className="bg-[#0a0c0e] border border-white/5 px-3 py-1.5 font-mono text-[10px] text-trilo-yellow w-fit">
                      {step.code}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full uppercase tracking-wider text-xs font-heading font-bold">
              Back to Home
            </Button>
          </a>

          <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full uppercase tracking-wider text-xs font-heading font-bold flex items-center justify-center gap-2">
              Open Discord <ExternalLink size={12} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

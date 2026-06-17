import React, { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, KeyRound, RefreshCw, ShieldCheck, Server, Wallet } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DiscordIcon } from '../components/Layout/Header';
import { useDiscordUser } from '../contexts/DiscordContext';
import { BOT_INVITE_URL, DISCORD_SUPPORT_URL } from '../constants';

interface TriloSubscription {
  id: number;
  status: string;
  billing_interval?: string | null;
  plan_type?: string | null;
  current_period_end?: string | null;
  subscription_end_date?: string | null;
}

interface TriloActivation {
  id: number;
  server_id: string;
  status: string;
  created_at?: string | null;
  deactivated_at?: string | null;
}

interface TriloLicense {
  id: number;
  license_key: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
  subscriptions: TriloSubscription[];
  activations: TriloActivation[];
}

const statusStyles: Record<string, string> = {
  active: 'border-green-400/30 bg-green-400/10 text-green-300',
  pending_activation: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200',
  inactive: 'border-red-400/30 bg-red-400/10 text-red-300',
  canceled: 'border-red-400/30 bg-red-400/10 text-red-300',
};

function formatStatus(status?: string | null) {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function planLabel(subscription?: TriloSubscription) {
  if (!subscription) return 'No subscription';
  const interval = subscription.billing_interval === 'year' ? 'Annual' : 'Monthly';
  return `${interval} ${subscription.plan_type || 'Trilo'}`;
}

export const Account: React.FC = () => {
  const { discordUser, isLoading, login, logout, manageSubscription } = useDiscordUser();
  const [licenses, setLicenses] = useState<TriloLicense[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeLicenseCount = useMemo(
    () => licenses.filter((license) => license.status === 'active' || license.status === 'pending_activation').length,
    [licenses]
  );

  useEffect(() => {
    if (!discordUser) {
      setLicenses([]);
      return;
    }

    setIsLoadingLicenses(true);
    setError(null);

    fetch('/api/licenses/me')
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to load licenses');
        return data;
      })
      .then((data) => setLicenses(data.licenses || []))
      .catch((err) => setError(err.message || 'Failed to load licenses'))
      .finally(() => setIsLoadingLicenses(false));
  }, [discordUser]);

  const copyLicense = async (licenseKey: string) => {
    await navigator.clipboard.writeText(licenseKey);
    setCopiedKey(licenseKey);
    window.setTimeout(() => setCopiedKey(null), 1400);
  };

  return (
    <div className="pt-32 pb-20 bg-[#111315] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 border border-trilo-orange/30 bg-trilo-orange/10 text-trilo-orange px-3 py-1 text-xs uppercase tracking-widest font-heading font-bold mb-4">
              <ShieldCheck size={14} />
              Discord Account
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold uppercase tracking-wide text-white">
              Your Trilo Licenses
            </h1>
            <p className="text-gray-400 max-w-2xl mt-4">
              View your active access, license keys, billing period, and Discord server activation from one place.
            </p>
          </div>

          {discordUser && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" onClick={manageSubscription}>
                <Wallet size={16} className="mr-2" />
                Manage Billing
              </Button>
              <Button variant="ghost" onClick={logout}>
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <Card hover={false} className="text-center">
            <RefreshCw className="w-8 h-8 text-trilo-orange animate-spin mx-auto mb-4" />
            <p className="text-gray-300 font-heading uppercase tracking-wider">Checking Discord session...</p>
          </Card>
        ) : !discordUser ? (
          <Card hover={false} className="max-w-2xl">
            <h2 className="text-2xl font-heading font-extrabold uppercase text-white mb-3">Sign in with Discord</h2>
            <p className="text-gray-400 mb-6">
              Trilo licenses are tied to your Discord account. Sign in to view your license keys, subscription status,
              and server activation.
            </p>
            <Button variant="discord" onClick={login}>
              <DiscordIcon />
              Sign In With Discord
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card hover={false}>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-heading font-bold mb-2">Signed In</p>
                <p className="text-white font-heading font-bold text-xl">{discordUser.username}</p>
              </Card>
              <Card hover={false}>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-heading font-bold mb-2">Licenses</p>
                <p className="text-white font-heading font-bold text-xl">{licenses.length}</p>
              </Card>
              <Card hover={false}>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-heading font-bold mb-2">Usable Access</p>
                <p className="text-white font-heading font-bold text-xl">{activeLicenseCount}</p>
              </Card>
            </div>

            {isLoadingLicenses && (
              <Card hover={false} className="text-center">
                <RefreshCw className="w-8 h-8 text-trilo-orange animate-spin mx-auto mb-4" />
                <p className="text-gray-300 font-heading uppercase tracking-wider">Loading licenses...</p>
              </Card>
            )}

            {error && (
              <Card hover={false} className="border-red-400/30 bg-red-500/5">
                <p className="text-red-300 font-heading font-bold uppercase">Could not load licenses</p>
                <p className="text-gray-400 mt-2">{error}</p>
              </Card>
            )}

            {!isLoadingLicenses && !error && licenses.length === 0 && (
              <Card hover={false}>
                <h2 className="text-2xl font-heading font-extrabold uppercase text-white mb-3">No licenses yet</h2>
                <p className="text-gray-400 mb-6">
                  Purchase Trilo access while signed in with this Discord account and your license will appear here.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" onClick={() => window.location.href = '/pricing'}>
                    View Pricing
                  </Button>
                  <Button variant="secondary" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
                    Support Discord
                    <ExternalLink size={14} className="ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid gap-5">
              {licenses.map((license) => {
                const subscription = license.subscriptions[0];
                const activeActivation = license.activations.find((activation) => activation.status === 'active');
                const statusClass = statusStyles[license.status] || 'border-white/20 bg-white/5 text-gray-300';

                return (
                  <Card key={license.id} hover={false}>
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`border px-3 py-1 text-xs uppercase tracking-widest font-heading font-bold ${statusClass}`}>
                            {formatStatus(license.status)}
                          </span>
                          <span className="text-gray-500 text-xs uppercase tracking-widest font-heading font-bold">
                            {planLabel(subscription)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                          <KeyRound className="text-trilo-orange shrink-0" size={22} />
                          <code className="text-white text-lg md:text-2xl font-mono break-all">{license.license_key}</code>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="border border-white/10 p-4">
                            <p className="text-gray-500 uppercase tracking-widest font-heading font-bold text-xs mb-1">Subscription</p>
                            <p className="text-white">{formatStatus(subscription?.status)}</p>
                          </div>
                          <div className="border border-white/10 p-4">
                            <p className="text-gray-500 uppercase tracking-widest font-heading font-bold text-xs mb-1">Renews / Ends</p>
                            <p className="text-white">{formatDate(subscription?.current_period_end || subscription?.subscription_end_date)}</p>
                          </div>
                          <div className="border border-white/10 p-4">
                            <p className="text-gray-500 uppercase tracking-widest font-heading font-bold text-xs mb-1">Activated Server</p>
                            <p className="text-white break-all">{activeActivation?.server_id || 'Not activated'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:min-w-52">
                        <Button variant="secondary" onClick={() => copyLicense(license.license_key)}>
                          <Copy size={16} className="mr-2" />
                          {copiedKey === license.license_key ? 'Copied' : 'Copy Key'}
                        </Button>
                        <Button variant="primary" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
                          <Server size={16} className="mr-2" />
                          Add Bot
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

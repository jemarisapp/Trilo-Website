
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Setup } from './pages/Setup';
import { Legal } from './pages/Legal';
import Success from './pages/success';
import { DiscordProvider } from './contexts/DiscordContext';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <DiscordProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-trilo-dark selection:bg-trilo-orange/30 selection:text-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/success" element={<Success />} />
              <Route path="/auth/callback" element={<Pricing />} />
              <Route
                path="/privacy"
                element={
                  <Legal title="Privacy Policy">
                    <section>
                      <h2 className="text-xl font-heading font-bold text-white mb-2">1. Data Collection</h2>
                      <p>We collect minimal data required for bot functionality: Discord User IDs, Server IDs, and Channel IDs. We do not store personal identifiable information like emails or real names.</p>
                    </section>
                    <section>
                      <h2 className="text-xl font-heading font-bold text-white mb-2">2. Usage</h2>
                      <p>Your data is used solely to provide and improve Trilo services, such as tracking team ownership and managing matchups.</p>
                    </section>
                    <section>
                      <h2 className="text-xl font-heading font-bold text-white mb-2">3. Third Parties</h2>
                      <p>We do not sell your data. We may use third-party processors like Stripe for billing purposes if you choose to subscribe.</p>
                    </section>
                  </Legal>
                }
              />
              <Route
                path="/terms"
                element={
                  <Legal title="Terms of Service">
                    <p>By adding Trilo to your server, you agree to these terms.</p>
                    <section>
                      <h2 className="text-xl font-heading font-bold text-white mb-2">1. License</h2>
                      <p>We grant you a limited, non-exclusive license to use Trilo for personal or community entertainment purposes.</p>
                    </section>
                    <section>
                      <h2 className="text-xl font-heading font-bold text-white mb-2">2. Prohibited Conduct</h2>
                      <p>Users may not attempt to reverse engineer the bot, bypass payment gateways, or use the bot for illegal activities.</p>
                    </section>
                  </Legal>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </DiscordProvider>
    </Router>
  );
};

export default App;

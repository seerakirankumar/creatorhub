import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { fetchBookings } from '../services/api.js';
import { UserCheck, Briefcase, RefreshCw, ChevronDown, Check, User } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    role,
    setRole,
    activeCreator,
    setActiveCreator,
    creators,
    activeClientName,
    setActiveClientName,
    handleResetDemoData,
    navigate,
    currentPath,
  } = useApp();

  const [creatorDropdownOpen, setCreatorDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [realClients, setRealClients] = useState<string[]>([]);

  // Dynamically load real client names who have booked gigs
  useEffect(() => {
    async function loadRealClients() {
      try {
        const bookings = await fetchBookings();
        const names = Array.from(new Set(bookings.map((b) => b.clientName.trim()))).filter(Boolean);
        setRealClients(names);
      } catch {
        // Ignore
      }
    }
    loadRealClients();
  }, [currentPath]);

  const handleReset = async () => {
    setIsResetting(true);
    await handleResetDemoData();
    setIsResetting(false);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher Control */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Persona:</span>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => {
                setRole('CLIENT');
                if (currentPath === '/creator-dashboard') {
                  navigate('/my-bookings');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                role === 'CLIENT'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Client Mode</span>
            </button>

            <button
              onClick={() => {
                setRole('CREATOR');
                if (currentPath === '/my-bookings') {
                  navigate('/creator-dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                role === 'CREATOR'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Creator Mode</span>
            </button>
          </div>

          {/* Contextual Active Persona Dropdown */}
          {role === 'CREATOR' ? (
            <div className="relative">
              <button
                onClick={() => setCreatorDropdownOpen(!creatorDropdownOpen)}
                className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/80 text-slate-200 transition-colors"
                title="Select active creator identity"
              >
                {activeCreator?.avatar && (
                  <img
                    src={activeCreator.avatar}
                    alt={activeCreator.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-slate-200">
                  Creator: <span className="text-indigo-400">{activeCreator?.name || 'Select Creator'}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {creatorDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCreatorDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Select Creator Account
                    </div>
                    {creators.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCreator(c);
                          setCreatorDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 text-xs transition-colors ${
                          activeCreator?.id === c.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-medium truncate">{c.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{c.title || 'Creator'}</div>
                          </div>
                        </div>
                        {activeCreator?.id === c.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-700/80 text-slate-200">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Client:</span>
                <input
                  type="text"
                  value={activeClientName}
                  onChange={(e) => setActiveClientName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-transparent border-none text-indigo-300 font-semibold focus:outline-none w-28 placeholder-slate-600"
                />
              </div>

              {realClients.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                    className="p-1 bg-slate-950 hover:bg-slate-800 rounded-md border border-slate-700/80 text-slate-300"
                    title="Select from clients who booked"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {clientDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setClientDropdownOpen(false)}
                      />
                      <div className="absolute left-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 py-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          Clients With Bookings
                        </div>
                        {realClients.map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              setActiveClientName(name);
                              setClientDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-slate-800 text-xs transition-colors ${
                              activeClientName === name ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                            }`}
                          >
                            <span>{name}</span>
                            {activeClientName === name && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Reset Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
            title="Reset platform database back to fresh default state"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>Reset Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};

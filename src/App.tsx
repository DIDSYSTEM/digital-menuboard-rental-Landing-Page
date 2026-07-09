import React, { useState, useEffect } from 'react';
import { InstallationCase, RentalInquiry, HardwareItem } from './types';
import { INITIAL_CASES, INITIAL_HARDWARE, INITIAL_INQUIRIES } from './data';
import ClientHome from './components/ClientHome';
import AdminDashboard from './components/AdminDashboard';

const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[LocalStorage Error] Failed to write key "${key}" to localStorage (likely due to storage quota limits for base64 images). Writing will bypass localStorage, but state and server database persistence will still succeed normally.`, e);
  }
};

export default function App() {
  // Navigation State: 'client' (Landing) or 'admin' (Dashboard)
  const [currentView, setCurrentView] = useState<'client' | 'admin'>(() => {
    const saved = localStorage.getItem('luminous_last_view');
    return saved === 'admin' ? 'admin' : 'client';
  });

  // State engines with local storage fallback
  const [cases, setCases] = useState<InstallationCase[]>(() => {
    const saved = localStorage.getItem('luminous_cases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cases', e);
      }
    }
    return INITIAL_CASES;
  });

  const [inquiries, setInquiries] = useState<RentalInquiry[]>(() => {
    const saved = localStorage.getItem('luminous_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inquiries', e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  const [hardware, setHardware] = useState<HardwareItem[]>(() => {
    const saved = localStorage.getItem('luminous_hardware');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse hardware', e);
      }
    }
    return INITIAL_HARDWARE;
  });

  // Fetch initial data from server-side store on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data.cases) {
          setCases(data.cases);
          safeSetLocalStorage('luminous_cases', JSON.stringify(data.cases));
        }
        if (data.inquiries) {
          setInquiries(data.inquiries);
          safeSetLocalStorage('luminous_inquiries', JSON.stringify(data.inquiries));
        }
        if (data.hardware) {
          setHardware(data.hardware);
          safeSetLocalStorage('luminous_hardware', JSON.stringify(data.hardware));
        }
      })
      .catch(err => {
        console.warn('Could not sync with server-side store, falling back to localStorage:', err);
      });
  }, []);

  // Helper to persist state to the server database
  const saveToServer = (updatedCases: InstallationCase[], updatedInquiries: RentalInquiry[], updatedHardware: HardwareItem[]) => {
    fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cases: updatedCases,
        inquiries: updatedInquiries,
        hardware: updatedHardware,
      }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save to server');
      return res.json();
    })
    .then(data => {
      console.log('Successfully saved to server-side store:', data);
    })
    .catch(err => {
      console.error('Error saving data to server-side store:', err);
    });
  };

  // Navigation handlers
  const navigateToAdmin = () => {
    setCurrentView('admin');
    localStorage.setItem('luminous_last_view', 'admin');
  };

  const navigateToClient = () => {
    setCurrentView('client');
    localStorage.setItem('luminous_last_view', 'client');
  };

  // State modifiers & localStorage/server syncer
  const handleAddCase = (newCase: Omit<InstallationCase, 'id' | 'createdAt'>) => {
    const created: InstallationCase = {
      ...newCase,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [created, ...cases];
    setCases(updated);
    safeSetLocalStorage('luminous_cases', JSON.stringify(updated));
    saveToServer(updated, inquiries, hardware);
  };

  const handleUpdateCase = (updatedCase: InstallationCase) => {
    const updated = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updated);
    safeSetLocalStorage('luminous_cases', JSON.stringify(updated));
    saveToServer(updated, inquiries, hardware);
  };

  const handleDeleteCase = (id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    safeSetLocalStorage('luminous_cases', JSON.stringify(updated));
    saveToServer(updated, inquiries, hardware);
  };

  const handleAddInquiry = (inquiryData: Omit<RentalInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInq: RentalInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    safeSetLocalStorage('luminous_inquiries', JSON.stringify(updated));
    saveToServer(cases, updated, hardware);
  };

  const handleUpdateInquiryStatus = (id: string, status: RentalInquiry['status']) => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    setInquiries(updated);
    safeSetLocalStorage('luminous_inquiries', JSON.stringify(updated));
    saveToServer(cases, updated, hardware);
  };

  const handleUpdateHardwareStock = (id: string, delta: number) => {
    const updated = hardware.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, item.stock + delta);
        const nextStatus = nextStock === 0 ? 'Out of Stock' : nextStock <= 3 ? 'Low Stock' : 'In Stock';
        return {
          ...item,
          stock: nextStock,
          status: nextStatus as HardwareItem['status']
        };
      }
      return item;
    });
    setHardware(updated);
    safeSetLocalStorage('luminous_hardware', JSON.stringify(updated));
    saveToServer(cases, inquiries, updated);
  };

  const handleResetToDefault = () => {
    setCases(INITIAL_CASES);
    setInquiries(INITIAL_INQUIRIES);
    setHardware(INITIAL_HARDWARE);
    safeSetLocalStorage('luminous_cases', JSON.stringify(INITIAL_CASES));
    safeSetLocalStorage('luminous_inquiries', JSON.stringify(INITIAL_INQUIRIES));
    safeSetLocalStorage('luminous_hardware', JSON.stringify(INITIAL_HARDWARE));
    saveToServer(INITIAL_CASES, INITIAL_INQUIRIES, INITIAL_HARDWARE);
  };

  const handleClearAll = () => {
    setCases([]);
    setInquiries([]);
    setHardware([]);
    safeSetLocalStorage('luminous_cases', JSON.stringify([]));
    safeSetLocalStorage('luminous_inquiries', JSON.stringify([]));
    safeSetLocalStorage('luminous_hardware', JSON.stringify([]));
    saveToServer([], [], []);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#111416] text-[#e1e2e6] font-sans antialiased">
      {currentView === 'client' ? (
        <ClientHome 
          cases={cases}
          onAddInquiry={handleAddInquiry}
          onNavigateToAdmin={navigateToAdmin}
        />
      ) : (
        <AdminDashboard 
          cases={cases}
          onAddCase={handleAddCase}
          onUpdateCase={handleUpdateCase}
          onDeleteCase={handleDeleteCase}
          inquiries={inquiries}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          hardware={hardware}
          onUpdateHardwareStock={handleUpdateHardwareStock}
          onResetToDefault={handleResetToDefault}
          onClearAll={handleClearAll}
          onLogout={navigateToClient}
        />
      )}
    </div>
  );
}

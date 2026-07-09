import React, { useState } from 'react';
import { InstallationCase, RentalInquiry, HardwareItem } from './types';
import { INITIAL_CASES, INITIAL_HARDWARE, INITIAL_INQUIRIES } from './data';
import ClientHome from './components/ClientHome';
import AdminDashboard from './components/AdminDashboard';

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

  // Navigation handlers
  const navigateToAdmin = () => {
    setCurrentView('admin');
    localStorage.setItem('luminous_last_view', 'admin');
  };

  const navigateToClient = () => {
    setCurrentView('client');
    localStorage.setItem('luminous_last_view', 'client');
  };

  // State modifiers & localStorage syncer
  const handleAddCase = (newCase: Omit<InstallationCase, 'id' | 'createdAt'>) => {
    const created: InstallationCase = {
      ...newCase,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [created, ...cases];
    setCases(updated);
    localStorage.setItem('luminous_cases', JSON.stringify(updated));
  };

  const handleUpdateCase = (updatedCase: InstallationCase) => {
    const updated = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updated);
    localStorage.setItem('luminous_cases', JSON.stringify(updated));
  };

  const handleDeleteCase = (id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    localStorage.setItem('luminous_cases', JSON.stringify(updated));
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
    localStorage.setItem('luminous_inquiries', JSON.stringify(updated));
  };

  const handleUpdateInquiryStatus = (id: string, status: RentalInquiry['status']) => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    setInquiries(updated);
    localStorage.setItem('luminous_inquiries', JSON.stringify(updated));
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
    localStorage.setItem('luminous_hardware', JSON.stringify(updated));
  };

  const handleResetToDefault = () => {
    setCases(INITIAL_CASES);
    setInquiries(INITIAL_INQUIRIES);
    setHardware(INITIAL_HARDWARE);
    localStorage.setItem('luminous_cases', JSON.stringify(INITIAL_CASES));
    localStorage.setItem('luminous_inquiries', JSON.stringify(INITIAL_INQUIRIES));
    localStorage.setItem('luminous_hardware', JSON.stringify(INITIAL_HARDWARE));
  };

  const handleClearAll = () => {
    setCases([]);
    setInquiries([]);
    setHardware([]);
    localStorage.setItem('luminous_cases', JSON.stringify([]));
    localStorage.setItem('luminous_inquiries', JSON.stringify([]));
    localStorage.setItem('luminous_hardware', JSON.stringify([]));
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

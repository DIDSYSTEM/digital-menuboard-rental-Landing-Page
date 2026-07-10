import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  LayoutDashboard,
  Cpu,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  HelpCircle,
  LogOut,
  Search,
  Trash2,
  Edit,
  CloudUpload,
  CheckCircle,
  FileText,
  Check,
  AlertCircle,
  Sliders,
  Image as ImageIcon,
  FileImage,
  X
} from 'lucide-react';
import { InstallationCase, HardwareItem, RentalInquiry } from '../types';
import { compressImage } from '../utils';

interface AdminDashboardProps {
  cases: InstallationCase[];
  onAddCase: (newCase: Omit<InstallationCase, 'id' | 'createdAt'>) => void;
  onUpdateCase: (updatedCase: InstallationCase) => void;
  onDeleteCase: (id: string) => void;
  inquiries: RentalInquiry[];
  onUpdateInquiryStatus: (id: string, status: RentalInquiry['status']) => void;
  hardware: HardwareItem[];
  onUpdateHardwareStock: (id: string, delta: number) => void;
  onResetToDefault: () => void;
  onClearAll: () => void;
  onLogout: () => void;
}

type TabType = 'installations' | 'dashboard' | 'analytics' | 'settings' | 'inquiries';

export default function AdminDashboard({
  cases,
  onAddCase,
  onUpdateCase,
  onDeleteCase,
  inquiries,
  onUpdateInquiryStatus,
  hardware,
  onUpdateHardwareStock,
  onResetToDefault,
  onClearAll,
  onLogout
}: AdminDashboardProps) {
  
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('installations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiryImage, setSelectedInquiryImage] = useState<string | null>(null);

  // Analytics Timeframe: 'year' | 'month' | 'day'
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'year' | 'month' | 'day'>('month');

  // Analytical Dataset States
  const [yearlyData, setYearlyData] = useState([
    { label: '2024년', val: '112건', h: '45%' },
    { label: '2025년', val: '245건', h: '75%' },
    { label: '2026년', val: '320건', h: '95%', cur: true }
  ]);
  const [monthlyData, setMonthlyData] = useState([
    { label: '2월', val: '14건', h: '35%' },
    { label: '3월', val: '19건', h: '48%' },
    { label: '4월', val: '28건', h: '65%' },
    { label: '5월', val: '32건', h: '72%' },
    { label: '6월', val: '45건', h: '88%' },
    { label: '7월', val: '52건', h: '95%', cur: true }
  ]);
  const [dailyData, setDailyData] = useState([
    { label: '7/1 (월)', val: '2건', h: '25%' },
    { label: '7/2 (화)', val: '3건', h: '38%' },
    { label: '7/3 (수)', val: '5건', h: '55%' },
    { label: '7/4 (목)', val: '4건', h: '48%' },
    { label: '7/5 (금)', val: '6건', h: '70%' },
    { label: '7/6 (토)', val: '9건', h: '95%', cur: true }
  ]);

  const handleResetStatistics = () => {
    if (confirm('통계 분석 데이터(방문 및 전환 이력)를 초기화하시겠습니까?')) {
      setYearlyData([
        { label: '2024년', val: '0건', h: '1%' },
        { label: '2025년', val: '0건', h: '1%' },
        { label: '2026년', val: '0건', h: '1%', cur: true }
      ]);
      setMonthlyData([
        { label: '2월', val: '0건', h: '1%' },
        { label: '3월', val: '0건', h: '1%' },
        { label: '4월', val: '0건', h: '1%' },
        { label: '5월', val: '0건', h: '1%' },
        { label: '6월', val: '0건', h: '1%' },
        { label: '7월', val: '0건', h: '1%', cur: true }
      ]);
      setDailyData([
        { label: '7/1 (월)', val: '0건', h: '1%' },
        { label: '7/2 (화)', val: '0건', h: '1%' },
        { label: '7/3 (수)', val: '0건', h: '1%' },
        { label: '7/4 (목)', val: '0건', h: '1%' },
        { label: '7/5 (금)', val: '0건', h: '1%' },
        { label: '7/6 (토)', val: '0건', h: '1%', cur: true }
      ]);
      triggerNotification('통계 그래프 및 기록이 초기화되었습니다.', 'success');
    }
  };

  const handleRestoreStatistics = () => {
    setYearlyData([
      { label: '2024년', val: '112건', h: '45%' },
      { label: '2025년', val: '245', h: '75%' },
      { label: '2026년', val: '320건', h: '95%', cur: true }
    ]);
    setMonthlyData([
      { label: '2월', val: '14건', h: '35%' },
      { label: '3월', val: '19건', h: '48%' },
      { label: '4월', val: '28건', h: '65%' },
      { label: '5월', val: '32건', h: '72%' },
      { label: '6월', val: '45건', h: '88%' },
      { label: '7월', val: '52건', h: '95%', cur: true }
    ]);
    setDailyData([
      { label: '7/1 (월)', val: '2건', h: '25%' },
      { label: '7/2 (화)', val: '3건', h: '38%' },
      { label: '7/3 (수)', val: '5건', h: '55%' },
      { label: '7/4 (목)', val: '4건', h: '48%' },
      { label: '7/5 (금)', val: '6건', h: '70%' },
      { label: '7/6 (토)', val: '9건', h: '95%', cur: true }
    ]);
    triggerNotification('통계 분석 데이터가 기본 샘플 값으로 복원되었습니다.', 'success');
  };

  // KakaoTalk Alert Settings State (Stored in localStorage or local state)
  const [isKakaoEnabled, setIsKakaoEnabled] = useState(() => {
    return localStorage.getItem('did_kakao_enabled') === 'true';
  });
  const [kakaoSenderKey, setKakaoSenderKey] = useState(() => {
    return localStorage.getItem('did_kakao_sender_key') || 'DIDSYS-2026-KEY';
  });
  const [kakaoTemplateId, setKakaoTemplateId] = useState(() => {
    return localStorage.getItem('did_kakao_template_id') || 'tmpl_new_inquiry_alert_01';
  });
  const [kakaoAdminPhone, setKakaoAdminPhone] = useState(() => {
    return localStorage.getItem('did_kakao_admin_phone') || '010-4567-8910';
  });
  const [kakaoTestSending, setKakaoTestSending] = useState(false);

  // Register New Case Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formEngDesc, setFormEngDesc] = useState('');
  const [formImgUrl, setFormImgUrl] = useState('');
  const [formStatus, setFormStatus] = useState<InstallationCase['status']>('Online');
  const [formCategory, setFormCategory] = useState('Cafe');
  const [formSpecs, setFormSpecs] = useState('');
  const [formLocation, setFormLocation] = useState('');
  
  // Edit Mode state
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  
  // Search state inside installations
  const [installationSearch, setInstallationSearch] = useState('');

  // Alert message
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form Ref to scroll
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawBase64 = event.target.result as string;
          const compressed = await compressImage(rawBase64);
          setFormImgUrl(compressed);
          triggerNotification('내 PC에서 이미지를 성공적으로 불러와 최적화(압축)했습니다.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawBase64 = event.target.result as string;
          const compressed = await compressImage(rawBase64);
          setFormImgUrl(compressed);
          triggerNotification('드롭한 이미지를 성공적으로 최적화(압축)하여 불러왔습니다.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-configured image presets for ease of entry
  const imagePresets = [
    {
      name: 'Cafe Setup',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBge6vq3gTUv6zjnkueNn4WLWyAAxqfWjgq3_dBHpnQo3udmDfCkn8mWbANGszFTNCAjkBJVGtqImGE8GnrXSWySTaxrSrs97snRn3VTXHdx-u42D5377O8jYH8jJu2AJN4-tGW5pCj8ePEPq67WyGUR_Voi_iV32_uQal7BKrvVT0QA6235LKT9c2i2jcnOT9w3-L3gxSS6wMPaObh8BmXNb7oydcky-_t2r3t3vAASQsO4461MTb8'
    },
    {
      name: 'Corporate Lobby',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO4Y2hWJubl8YZg3xHqYm_2Ja4uqAu9w5SW_ALxeU4_7Nix0aFu8Jz38bAi4yFsoFpusxt1xwMQac2Ai5x1yWiGJauID-MI_E0kDJWkWFlBdBsGNgnAYEWnyzCBSBUMiNDF0GOwRLNHHRPD9wchZSTKK-2qaxQ-5z0BgFdaz6XGQw0Y7KjRN0xOQZQxGf8KRdz0KoGyiOZTsRL_uY0QbXYsnK8PkqEnC9z6v_ztFufFEQR0Nu_8jd3'
    },
    {
      name: 'Stand Kiosk',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyInaQH2li3_eXoenC3bVjIcfOEmiZjKkNjYZwWmE4mtWE41QGRVX9NS7nqQEpMbXIQZgISKkaQq6AgVOvxnVCwD5dxxHgE1y75geyhiLS33NXapa3tQ17dz9zTblNZTXFrAYT69EA3Owd88jLY5DSMLh0QyxuoSXdhYyBb33CBpzzwKIuCF903qaqERcjCmLIGOAqi6lpPhuqr4aAWCaDPSnPN-_SWrN1pXVIuaO7BIyss-yfrL68'
    }
  ];

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleEditClick = (item: InstallationCase) => {
    setEditingCaseId(item.id);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormEngDesc(item.englishDescription || '');
    setFormImgUrl(item.imageUrl);
    setFormStatus(item.status);
    setFormCategory(item.category);
    setFormSpecs(item.specs || '');
    setFormLocation(item.location || '');
    
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    triggerNotification('사례 정보를 양식에 불러왔습니다. 수정 후 저장해 주세요.', 'success');
  };

  const handleCancelEdit = () => {
    setEditingCaseId(null);
    setFormTitle('');
    setFormDesc('');
    setFormEngDesc('');
    setFormImgUrl('');
    setFormStatus('Online');
    setFormCategory('Cafe');
    setFormSpecs('');
    setFormLocation('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc) {
      triggerNotification('제목과 상세 설명은 필수 입력 사항입니다.', 'error');
      return;
    }

    const finalImgUrl = formImgUrl || imagePresets[0].url; // default fallback

    if (editingCaseId) {
      // Edit existing
      const existing = cases.find(c => c.id === editingCaseId);
      if (existing) {
        onUpdateCase({
          ...existing,
          title: formTitle,
          description: formDesc,
          englishDescription: formEngDesc,
          imageUrl: finalImgUrl,
          status: formStatus,
          category: formCategory,
          specs: formSpecs,
          location: formLocation
        });
        triggerNotification('설치 사례가 성공적으로 수정되었습니다.');
      }
      setEditingCaseId(null);
    } else {
      // Add new
      onAddCase({
        title: formTitle,
        description: formDesc,
        englishDescription: formEngDesc,
        imageUrl: finalImgUrl,
        status: formStatus,
        category: formCategory,
        specs: formSpecs,
        location: formLocation
      });
      triggerNotification('새 설치 사례가 등록되었습니다.', 'success');
      setInstallationSearch(''); // Clear search query so the new case is visible immediately!
    }

    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormEngDesc('');
    setFormImgUrl('');
    setFormStatus('Online');
    setFormCategory('Cafe');
    setFormSpecs('');
    setFormLocation('');
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('정말로 이 설치 사례를 삭제하시겠습니까?')) {
      onDeleteCase(id);
      triggerNotification('설치 사례가 삭제되었습니다.', 'success');
    }
  };

  const handleSaveKakaoSettings = () => {
    localStorage.setItem('did_kakao_enabled', isKakaoEnabled ? 'true' : 'false');
    localStorage.setItem('did_kakao_sender_key', kakaoSenderKey);
    localStorage.setItem('did_kakao_template_id', kakaoTemplateId);
    localStorage.setItem('did_kakao_admin_phone', kakaoAdminPhone);
    triggerNotification('카카오톡 알림톡 연동 설정이 성공적으로 보존되었습니다.', 'success');
  };

  const handleSendTestKakao = () => {
    if (!kakaoAdminPhone) {
      triggerNotification('수신할 관리자 전화번호를 입력해 주세요.', 'error');
      return;
    }
    setKakaoTestSending(true);
    setTimeout(() => {
      setKakaoTestSending(false);
      triggerNotification(`[카카오 알림톡 발송 완료] ${kakaoAdminPhone} 번호로 시뮬레이션 알림톡이 성공적으로 발송되었습니다!`, 'success');
    }, 1200);
  };

  const handleResetDataClick = () => {
    if (confirm('모든 데이터를 시스템 초기 공공 템플릿 기본값으로 복원하시겠습니까?\n(설치 사례, 상담 신청, 재고 수량이 최초 상태로 재생성됩니다)')) {
      onResetToDefault();
      triggerNotification('전체 데이터가 기본 템플릿으로 복원되었습니다.', 'success');
    }
  };

  const handleClearAllDataClick = () => {
    if (confirm('경고: 복구가 불가능합니다.\n정말로 모든 설치 사례, 고객 상담 신청 목록, 기기 목록을 영구적으로 완전히 삭제하시겠습니까?')) {
      onClearAll();
      triggerNotification('모든 데이터베이스가 깨끗하게 초기화되었습니다.', 'success');
    }
  };

  const selectPresetImage = (url: string) => {
    setFormImgUrl(url);
    triggerNotification('프리셋 이미지가 자동 선택되었습니다.');
  };

  const handleAddCaseSidebarClick = () => {
    setActiveTab('installations');
    handleCancelEdit(); // Clear fields and cancel editing state
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filter cases based on search
  const filteredCases = cases.filter(item => {
    const query = installationSearch.toLowerCase();
    return item.title.toLowerCase().includes(query) || 
           item.description.toLowerCase().includes(query) ||
           (item.category && item.category.toLowerCase().includes(query));
  });

  return (
    <div className="bg-[#111416] text-[#e1e2e6] min-h-screen flex font-sans relative overflow-x-hidden">
      {/* Light leak glow */}
      <div className="bg-leak" />

      {/* Sidebar navigation */}
      <aside className="bg-[#111416]/90 backdrop-blur-xl border-r border-[#40484e]/30 shadow-2xl fixed left-0 top-0 h-full w-64 flex flex-col py-6 z-50">
        <div className="px-6 mb-8 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center neon-glow">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-sm text-primary neon-text-glow leading-tight">디지털 메뉴보드<br/>렌탈 상담관리</h1>
          </div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant font-mono mt-1">DIDSYSTEM ADMIN</p>
        </div>

        {/* Navigation list */}
        <div className="flex-1 flex flex-col gap-1 px-3">
          <button 
            id="nav_dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left ${activeTab === 'dashboard' ? 'bg-primary-container/10 text-secondary-fixed-dim font-bold border-r-4 border-secondary-fixed-dim' : 'text-on-surface-variant hover:text-white hover:bg-primary-container/5'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>대시보드 (Dashboard)</span>
          </button>

          <button 
            id="nav_installations"
            onClick={() => setActiveTab('installations')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left ${activeTab === 'installations' ? 'bg-primary-container/10 text-secondary-fixed-dim font-bold border-r-4 border-secondary-fixed-dim' : 'text-on-surface-variant hover:text-white hover:bg-primary-container/5'}`}
          >
            <Monitor className="w-4 h-4" />
            <span>설치 사례 관리 (Cases)</span>
          </button>

          <button 
            id="nav_inquiries"
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left relative ${activeTab === 'inquiries' ? 'bg-primary-container/10 text-secondary-fixed-dim font-bold border-r-4 border-secondary-fixed-dim' : 'text-on-surface-variant hover:text-white hover:bg-primary-container/5'}`}
          >
            <FileText className="w-4 h-4" />
            <span>상담 신청 관리 (Leads)</span>
            {inquiries.filter(i => i.status === 'Pending').length > 0 && (
              <span className="absolute right-3 bg-secondary-fixed text-black text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                {inquiries.filter(i => i.status === 'Pending').length}
              </span>
            )}
          </button>

          <button 
            id="nav_analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left ${activeTab === 'analytics' ? 'bg-primary-container/10 text-secondary-fixed-dim font-bold border-r-4 border-secondary-fixed-dim' : 'text-on-surface-variant hover:text-white hover:bg-primary-container/5'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>통계 분석 (Analytics)</span>
          </button>

          <button 
            id="nav_settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer text-left ${activeTab === 'settings' ? 'bg-primary-container/10 text-secondary-fixed-dim font-bold border-r-4 border-secondary-fixed-dim' : 'text-on-surface-variant hover:text-white hover:bg-primary-container/5'}`}
          >
            <Sliders className="w-4 h-4" />
            <span>시스템 설정 (Settings)</span>
          </button>
        </div>

        {/* Quick CTA */}
        <div className="px-4 mb-4">
          <button 
            onClick={handleAddCaseSidebarClick}
            className="w-full py-3 rounded-lg border border-secondary-fixed text-secondary-fixed text-xs font-bold hover:bg-secondary-fixed/10 transition-all flex justify-center items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            새 사례 추가 (New Case)
          </button>
        </div>

        {/* Support & Logout at bottom */}
        <div className="mt-auto px-3 pt-4 border-t border-[#40484e]/30 flex flex-col gap-1">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); triggerNotification('Support team notified. We will reach you soon.'); }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-white hover:bg-primary-container/5 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>고객 지원 (Support)</span>
          </a>
          <button 
            id="btn_admin_to_client"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:text-white hover:bg-primary-container/5 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>사용자 홈으로 (Client Home)</span>
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="ml-64 flex-1 flex flex-col relative z-10 w-[calc(100%-16rem)] min-h-screen">
        
        {/* Top bar app header */}
        <header className="sticky top-0 w-full bg-[#111416]/75 backdrop-blur-md border-b border-[#40484e]/20 flex justify-between items-center px-8 h-20 z-40">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight">
              디지털 메뉴보드 렌탈 상담관리
              <span className="text-xs text-on-surface-variant font-normal ml-3 hidden md:inline">
                {activeTab === 'installations' && '| 갤러리 및 컨텐츠 관리'}
                {activeTab === 'dashboard' && '| 운영 종합 대시보드'}
                {activeTab === 'inquiries' && '| 상담 신청 리드 관리'}
                {activeTab === 'analytics' && '| 시스템 운영 통계 및 유입 분석'}
                {activeTab === 'settings' && '| DIDSYSTEM ADMIN 설정'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-5">
            {/* Profile Avatar removed, Quick Status removed, Admin notifications removed */}
          </div>
        </header>

        {/* Global Notifications Panel */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-6 left-1/2 z-50 px-6 py-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 min-w-[300px] text-sm font-semibold ${notification.type === 'error' ? 'bg-red-950/90 border-red-800 text-red-200' : 'bg-surface-container-high/90 border-secondary-fixed/50 text-white'}`}
            >
              {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-secondary-fixed-dim" />}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page canvas block */}
        <main className="p-8 flex-1 flex flex-col gap-8">
          
          {/* TAB 1: INSTALLATIONS (Image 1 replica) */}
          {activeTab === 'installations' && (
            <>
              {/* Header section */}
              <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#40484e]/30 pb-6">
                <div>
                  <p className="text-secondary-fixed font-semibold text-xs tracking-widest uppercase mb-1">DID SYSTEM</p>
                  <h1 className="text-3xl font-extrabold text-white">설치 사례 관리</h1>
                  <p className="text-on-surface-variant text-sm mt-1 max-w-xl">
                    웹사이트 메인에 전시되는 전국 실시간 렌탈 설치 사례를 수정, 추가, 삭제 제어합니다.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="w-4 h-4 absolute left-3 top-3.5 text-on-surface-variant" />
                    <input 
                      type="text"
                      value={installationSearch}
                      onChange={(e) => setInstallationSearch(e.target.value)}
                      placeholder="사례 검색 (제목, 업종...)"
                      className="w-full lg:w-60 pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs text-white focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      handleCancelEdit();
                      formRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-gradient shrink-0 px-5 py-2.5 rounded-lg text-black font-bold text-xs flex items-center gap-1.5 neon-glow hover:scale-105 transition-transform duration-200"
                  >
                    <Plus className="w-4 h-4" /> 새 사례 추가
                  </button>
                </div>
              </section>

              {/* Case Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-panel rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="h-48 relative overflow-hidden bg-surface-container-highest">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-surface-dim/80 backdrop-blur-md px-3 py-1 rounded-full border border-secondary-fixed/30 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Online' ? 'bg-secondary-fixed animate-pulse' : 'bg-orange-400'}`}></div>
                        <span className="text-[11px] font-semibold text-white tracking-wide">{item.status}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/30 mt-auto">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="flex-1 py-2 rounded border border-outline-variant hover:text-primary hover:border-primary transition-colors text-xs font-bold flex justify-center items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> 수정 (Edit)
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item.id)}
                          className="flex-1 py-2 rounded border border-outline-variant hover:text-red-400 hover:border-red-400 transition-colors text-xs font-bold flex justify-center items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> 삭제 (Delete)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCases.length === 0 && (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-xl">
                    <p className="text-on-surface-variant text-sm">일치하는 설치 사례 데이터가 존재하지 않습니다.</p>
                  </div>
                )}
              </section>

              {/* Upload Form Area */}
              <section id="form-section" ref={formRef} className="mt-8">
                <div className="glass-panel rounded-xl p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-secondary-fixed to-transparent opacity-50"></div>
                  
                  <div className="lg:w-1/3 flex flex-col gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                      {editingCaseId ? '설치 사례 수정' : '새 사례 등록'}<br/>
                      <span className="text-secondary-fixed text-xs font-normal tracking-wide font-mono">({editingCaseId ? 'Edit Installation Case' : 'Register New Case'})</span>
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Luminous 고화질 DID 기기 설치가 완료된 공간의 고화질 현장 사진 프리셋을 선택하거나 세부 스펙을 입력하여 아카이브에 기입해 주세요. 해당 정보는 고객용 메인 페이지에 실시간 반영됩니다.
                    </p>

                    {/* Pre-fill Quick Presets helper */}
                    <div className="mt-4 pt-4 border-t border-[#40484e]/30">
                      <p className="text-xs font-bold text-white mb-2 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-secondary-fixed-dim" /> 프리셋 이미지 빠른 선택
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {imagePresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => selectPresetImage(preset.url)}
                            className="p-1 rounded bg-surface-container-high hover:border-primary border border-transparent transition-colors text-[10px] text-center truncate text-on-surface-variant hover:text-white cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                   <div className="lg:w-2/3 flex flex-col md:flex-row gap-6">
                    {/* Drag & Drop Visual Box */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 border-2 border-dashed border-outline-variant hover:border-secondary-fixed bg-surface-container-lowest/50 rounded-xl flex flex-col items-center justify-center p-6 transition-colors cursor-pointer group min-h-[220px] relative text-center"
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {formImgUrl ? (
                        <div className="absolute inset-0 p-2 rounded-xl">
                          <img 
                            src={formImgUrl} 
                            alt="Selected preview" 
                            className="w-full h-full object-cover rounded-lg opacity-80"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <span className="text-xs text-white bg-black/80 px-2.5 py-1.5 rounded-md">내 PC 이미지 또는 프리셋 변경 (클릭)</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary-container/20 transition-all duration-300">
                            <CloudUpload className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-fixed" />
                          </div>
                          <p className="text-xs font-bold text-white mb-1">내 PC 이미지 업로드 (드래그 & 드롭 또는 클릭)</p>
                          <p className="text-[11px] text-on-surface-variant">클릭하여 이미지 파일을 첨부하거나 프리셋을 선택하세요</p>
                        </>
                      )}
                    </div>

                    {/* Form Inputs */}
                    <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface tracking-wider uppercase">사례 제목 (Title)</label>
                        <input 
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="예: 카페 A사 (3대 설치)"
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-on-surface tracking-wider uppercase">분류 카테고리</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none h-[40px]"
                          >
                            <option value="Cafe">카페 (Cafe)</option>
                            <option value="Lobby">로비 / 비디오월 (Lobby)</option>
                            <option value="Retail">리테일 / 키오스크 (Retail)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-on-surface tracking-wider uppercase">기기 작동 상태</label>
                          <select
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as InstallationCase['status'])}
                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none h-[40px]"
                          >
                            <option value="Online">가동중 (Online)</option>
                            <option value="Maintenance">정기 관리 (Maintenance)</option>
                            <option value="Offline">작동 안함 (Offline)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-on-surface tracking-wider uppercase">설치 지역</label>
                          <input 
                            type="text"
                            value={formLocation}
                            onChange={(e) => setFormLocation(e.target.value)}
                            placeholder="예: 서울 강남구"
                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-on-surface tracking-wider uppercase">하드웨어 사양 요약</label>
                          <input 
                            type="text"
                            value={formSpecs}
                            onChange={(e) => setFormSpecs(e.target.value)}
                            placeholder="예: 55인치 DID 3대"
                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface tracking-wider uppercase">상세 설명 (Description)</label>
                        <textarea 
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          placeholder="매장 및 설치 세부 사항, 제공된 컨텐츠 디자인 특색을 적어주세요..."
                          className="w-full min-h-[90px] bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-4 py-2.5 rounded-lg text-xs transition-all resize-none focus:outline-none"
                          required
                        />
                      </div>

                      {/* Image URL display helper */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface tracking-wider uppercase">이미지 소스 주소 (URL)</label>
                        <input 
                          type="text"
                          value={formImgUrl}
                          onChange={(e) => setFormImgUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed text-on-surface px-3 py-1.5 rounded-lg text-xs focus:outline-none text-on-surface-variant font-mono"
                        />
                      </div>

                      <div className="flex justify-end gap-3 mt-2">
                        {editingCaseId && (
                          <button 
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-5 py-2.5 rounded-lg border border-outline-variant text-xs font-bold hover:bg-surface-variant text-white cursor-pointer"
                          >
                            취소 (Cancel)
                          </button>
                        )}
                        <button 
                          type="submit"
                          className="btn-gradient px-7 py-2.5 rounded-lg text-black font-extrabold text-xs flex items-center gap-1.5 neon-glow cursor-pointer active:scale-95"
                        >
                          <CheckCircle className="w-4 h-4" /> 
                          {editingCaseId ? '수정 완료 (Update)' : '등록 완료 (Submit)'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Quick statistics layout widgets */}
              <div className="grid grid-cols-1 gap-6">
                <div className="glass-panel p-6 rounded-xl flex flex-col relative overflow-hidden max-w-sm">
                  <span className="absolute top-0 right-0 bg-secondary-fixed-dim text-black font-black px-3 py-1 rounded-bl text-[9px] uppercase font-mono tracking-widest animate-pulse">
                    Urgently Pending
                  </span>
                  <p className="text-xs text-on-surface-variant font-semibold">미처리 상담 리드</p>
                  <span className="text-4xl font-extrabold mt-3 mb-1 text-tertiary-fixed-dim">
                    {inquiries.filter(i => i.status === 'Pending').length} 건
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1 font-mono">새로운 렌탈 상담 접수 건수</p>
                </div>
              </div>

              {/* Lower dynamic sections: Lead Management and recent lead activity list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Pending inquiries overview */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
                    <h3 className="font-bold text-lg text-white">신규 렌탈 상담 신청 목록</h3>
                    <button 
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-primary hover:underline"
                    >
                      상담관리 바로가기 &rarr;
                    </button>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
                    {inquiries.map((lead) => (
                      <div key={lead.id} className="p-4 rounded-lg bg-surface-container-low/40 border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-sm text-white">{lead.name}</span>
                            <span className="text-xs text-on-surface-variant">|</span>
                            <span className="text-xs text-secondary-fixed-dim font-bold">{lead.company}</span>
                            <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full font-mono">
                              {lead.quantity}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant line-clamp-2 italic leading-relaxed">
                            &ldquo;{lead.message}&rdquo;
                          </p>
                          {lead.storeImages && lead.storeImages.length > 0 && (
                            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                              {lead.storeImages.map((img, i) => (
                                <img 
                                  key={i} 
                                  src={img} 
                                  alt="매장사진" 
                                  className="w-10 h-8 object-cover rounded border border-outline-variant hover:scale-105 hover:border-secondary-fixed cursor-pointer transition-all shrink-0" 
                                  onClick={() => setSelectedInquiryImage(img)}
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                          )}
                          <span className="text-[10px] text-on-surface-variant mt-2 block font-mono">{lead.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded font-mono uppercase ${lead.status === 'Pending' ? 'bg-amber-900/60 text-amber-200 border border-amber-800' : lead.status === 'Contacted' ? 'bg-blue-950/60 text-blue-200 border border-blue-800' : 'bg-green-950/60 text-green-200 border border-green-800'}`}>
                            {lead.status === 'Pending' ? '신규 접수' : lead.status === 'Contacted' ? '상담 대기' : '상담 완료'}
                          </span>
                          
                          {lead.status === 'Pending' && (
                            <button 
                              onClick={() => { onUpdateInquiryStatus(lead.id, 'Contacted'); triggerNotification('상담 대기 상태로 이관되었습니다.'); }}
                              className="px-2.5 py-1 bg-secondary-fixed-dim text-black text-[11px] font-bold rounded hover:opacity-90 transition-all cursor-pointer"
                            >
                              수락
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {inquiries.length === 0 && (
                      <p className="text-center text-xs text-on-surface-variant py-8">접수된 렌탈 문의가 없습니다.</p>
                    )}
                  </div>
                </div>

                {/* Operations Checklist panel */}
                <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
                  <h3 className="font-bold text-lg text-white pb-4 border-b border-outline-variant/30 mb-4">관리자 오늘의 할 일</h3>
                  
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px]">
                    {inquiries.filter(i => i.status !== 'Completed').map((lead) => (
                      <div key={lead.id} className="flex items-start gap-3 group">
                        <button 
                          onClick={() => {
                            onUpdateInquiryStatus(lead.id, 'Completed');
                            triggerNotification(`상담 건이 완료로 처리되었습니다.`);
                          }}
                          className="w-5 h-5 rounded border border-outline-variant hover:border-secondary-fixed-dim hover:bg-secondary-fixed-dim/10 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors text-transparent hover:text-secondary-fixed-dim"
                          title="상담 완료 마크"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-xs text-white font-semibold">
                            {lead.company} ({lead.name}) 렌탈 상담하기
                          </span>
                          <span className="text-[10px] text-on-surface-variant mt-0.5">
                            상태: <span className={lead.status === 'Pending' ? 'text-amber-400 font-bold' : 'text-blue-400'}>{lead.status === 'Pending' ? '신규 접수' : '연락 대기'}</span> | {lead.phone}
                          </span>
                        </div>
                      </div>
                    ))}

                    {inquiries.filter(i => i.status !== 'Completed').length === 0 && (
                      <div className="text-center py-8 text-xs text-on-surface-variant flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-secondary-fixed-dim" />
                        <p>미완료된 상담 예약 건이 없습니다!</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: RENTAL INQUIRIES LEADS */}
          {activeTab === 'inquiries' && (
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-outline-variant/30 mb-6 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-white">렌탈 무료 견적 상담 고객 목록</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    클라이언트가 웹사이트 무료 상담 신청 폼을 통해 기재한 소중한 영업 리드 관리 솔루션입니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-surface-container-high px-3 py-1.5 rounded-lg text-on-surface-variant font-bold font-mono">
                    Total Leads: {inquiries.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-on-surface border-collapse">
                  <thead>
                    <tr className="border-b border-[#40484e]/40 text-on-surface-variant text-xs uppercase tracking-wider bg-surface-container-low/30">
                      <th className="py-3 px-4">고객명</th>
                      <th className="py-3 px-4">매장/상호</th>
                      <th className="py-3 px-4">연락처</th>
                      <th className="py-3 px-4">의뢰 수량</th>
                      <th className="py-3 px-4">희망 시기</th>
                      <th className="py-3 px-4">상담 신청 내용</th>
                      <th className="py-3 px-4">신청 시각</th>
                      <th className="py-3 px-4 text-center">진행 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#40484e]/20">
                    {inquiries.map((lead) => (
                      <tr key={lead.id} className="hover:bg-surface-container-low/10 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                          <div>{lead.name}</div>
                          {lead.storeImages && lead.storeImages.length > 0 && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold bg-secondary-fixed-dim/20 text-secondary-fixed-dim px-1.5 py-0.5 rounded border border-secondary-fixed-dim/30">
                              <FileImage className="w-3 h-3" />
                              사진 {lead.storeImages.length}장
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-secondary-fixed-dim whitespace-nowrap">{lead.company}</td>
                        <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">{lead.phone}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                            {lead.quantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">{lead.installationTime}</td>
                        <td className="py-3.5 px-4 text-xs max-w-xs text-on-surface-variant">
                          <div className="flex flex-col gap-1.5">
                            <span className="truncate max-w-[200px]" title={lead.message}>{lead.message || '-'}</span>
                            {lead.storeImages && lead.storeImages.length > 0 && (
                              <div className="flex gap-1.5 overflow-x-auto max-w-[240px] pb-1">
                                {lead.storeImages.map((img, i) => (
                                  <img 
                                    key={i} 
                                    src={img} 
                                    alt="매장사진" 
                                    className="w-11 h-9 object-cover rounded border border-outline-variant hover:scale-110 hover:border-secondary-fixed cursor-pointer transition-all shrink-0" 
                                    onClick={() => setSelectedInquiryImage(img)}
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] font-mono whitespace-nowrap text-on-surface-variant">{lead.createdAt}</td>
                        <td className="py-3.5 px-4 text-center">
                          <select 
                            value={lead.status}
                            onChange={(e) => { onUpdateInquiryStatus(lead.id, e.target.value as RentalInquiry['status']); triggerNotification(`상태가 [${e.target.value}]로 변경되었습니다.`); }}
                            className="bg-surface-container-low border border-outline-variant/40 rounded px-2 py-1 text-xs text-white focus:outline-none"
                          >
                            <option value="Pending">신규 접수 (Pending)</option>
                            <option value="Contacted">연락 대기 (Contacted)</option>
                            <option value="Completed">상담 완료 (Completed)</option>
                          </select>
                        </td>
                      </tr>
                    ))}

                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-on-surface-variant">
                          아직 신청 목록이 없습니다. 사용자 모드로 가셔서 새로운 렌탈 상담 예약을 테스트해보세요!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="max-w-3xl flex flex-col gap-6">
                
                {/* Header & Control Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-xl text-white">렌탈 통계 및 전환 분석</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      년도별, 월별, 일별 스케일로 필터링하여 무료 견적 신청 전환 건수의 흐름을 정밀 추적합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn_reset_stats"
                      onClick={handleResetStatistics}
                      className="px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      통계 초기화
                    </button>
                    <button
                      id="btn_restore_stats"
                      onClick={handleRestoreStatistics}
                      className="px-3 py-1.5 rounded bg-surface-container border border-outline-variant/40 hover:border-primary text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      기본 샘플 복원
                    </button>
                  </div>
                </div>

                {/* Lead conversions chart card */}
                <div className="glass-panel p-6 rounded-xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fbba68] to-transparent opacity-40"></div>
                  
                  {/* Scale selection tabs */}
                  <div className="flex items-center justify-between border-b border-[#40484e]/30 pb-4 mb-6">
                    <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                      <button
                        id="scale_year"
                        onClick={() => setAnalyticsTimeframe('year')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${analyticsTimeframe === 'year' ? 'bg-[#fbba68] text-black shadow-sm' : 'text-on-surface-variant hover:text-white'}`}
                      >
                        년도별 (Yearly)
                      </button>
                      <button
                        id="scale_month"
                        onClick={() => setAnalyticsTimeframe('month')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${analyticsTimeframe === 'month' ? 'bg-[#fbba68] text-black shadow-sm' : 'text-on-surface-variant hover:text-white'}`}
                      >
                        월별 (Monthly)
                      </button>
                      <button
                        id="scale_day"
                        onClick={() => setAnalyticsTimeframe('day')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${analyticsTimeframe === 'day' ? 'bg-[#fbba68] text-black shadow-sm' : 'text-on-surface-variant hover:text-white'}`}
                      >
                        일별 (Daily)
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-on-surface-variant">Active Series Scale</span>
                      <p className="text-xs font-bold text-white">
                        {analyticsTimeframe === 'year' && '2024년 - 2026년 누계'}
                        {analyticsTimeframe === 'month' && '최근 6개월 월간 전환 추이'}
                        {analyticsTimeframe === 'day' && '최근 6일간 일별 실시간 리드'}
                      </p>
                    </div>
                  </div>
                  
                  {/* custom vector graph columns */}
                  <div className="h-64 flex items-end justify-between w-full font-mono text-[10px] text-on-surface-variant gap-4 pt-4 relative">
                    <div className="absolute left-0 right-0 top-1/4 border-b border-[#40484e]/10 h-0" />
                    <div className="absolute left-0 right-0 top-2/4 border-b border-[#40484e]/10 h-0" />
                    <div className="absolute left-0 right-0 top-3/4 border-b border-[#40484e]/10 h-0" />

                    {(analyticsTimeframe === 'year' ? yearlyData : analyticsTimeframe === 'month' ? monthlyData : dailyData).map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group z-10">
                        <span className={`opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded text-[9px] text-white mb-2 font-bold ${bar.cur ? 'opacity-100 text-[#fbba68]' : ''}`}>
                          {bar.val}
                        </span>
                        <div 
                          style={{ height: bar.h }} 
                          className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${bar.cur ? 'bg-[#fbba68] shadow-[0_0_15px_rgba(251,186,104,0.3)]' : 'bg-surface-container-highest hover:bg-[#fbba68]/50'}`} 
                        />
                        <span className="mt-3 font-semibold text-center whitespace-nowrap text-[9px] md:text-[10px]">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informative Stats Summary card */}
                <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex items-center gap-4 bg-surface-container-low/20">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">종합 데이터 요약</span>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      현재 기준 가장 활발한 상담 문의 유입 경로는 <span className="text-secondary-fixed font-bold">오가닉 랜딩페이지 검색(72.4%)</span>이며, 
                      {analyticsTimeframe === 'year' && ' 2026년 상담 완료율은 89%로 전년 대비 14% 상승하였습니다.'}
                      {analyticsTimeframe === 'month' && ' 최근 7월 문의는 전월 대비 약 15% 성장 가속화를 보이고 있습니다.'}
                      {analyticsTimeframe === 'day' && ' 금일 현재 시뮬레이션 및 실제 상담 유입은 실시간으로 그래프에 기록 중입니다.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn max-w-2xl">
              
              {/* 1. KAKAO TALK INTEGRATION SETTINGS */}
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#fbba68] opacity-50"></div>
                <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/30 mb-6">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold">talk</div>
                  <div>
                    <h3 className="font-bold text-lg text-white">카카오톡 비즈니스 알림톡 연동 설정</h3>
                    <p className="text-xs text-on-surface-variant">고객이 신규 렌탈 문의를 접수하면 관리자의 카카오톡으로 실시간 알림이 발송됩니다.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Toggle */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#40484e]/20">
                    <div>
                      <h4 className="font-bold text-sm text-white mb-1">실시간 카카오 알림 활성화</h4>
                      <p className="text-xs text-on-surface-variant">상담이 접수되는 즉시 설정된 관리자 연락처로 비즈니스 알림 전송</p>
                    </div>
                    
                    <button 
                      type="button"
                      id="btn_toggle_kakao"
                      onClick={() => {
                        const nextVal = !isKakaoEnabled;
                        setIsKakaoEnabled(nextVal);
                        localStorage.setItem('did_kakao_enabled', nextVal ? 'true' : 'false');
                        triggerNotification(`카카오 알림 기능이 ${nextVal ? '활성화' : '비활성화'}되었습니다.`, 'success');
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${isKakaoEnabled ? 'bg-yellow-500 flex justify-end' : 'bg-surface-container-highest flex justify-start'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-black block shadow" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">발신 프로필 키 (Sender Profile Key)</label>
                      <input 
                        type="text"
                        value={kakaoSenderKey}
                        onChange={(e) => setKakaoSenderKey(e.target.value)}
                        placeholder="예: DIDSYS-2026-KEY"
                        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-yellow-500 text-on-surface px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                        disabled={!isKakaoEnabled}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">알림톡 템플릿 코드 (Template Code)</label>
                      <input 
                        type="text"
                        value={kakaoTemplateId}
                        onChange={(e) => setKakaoTemplateId(e.target.value)}
                        placeholder="예: tmpl_new_inquiry_alert_01"
                        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-yellow-500 text-on-surface px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                        disabled={!isKakaoEnabled}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">알림 수신 관리자 휴대폰 번호</label>
                    <input 
                      type="text"
                      value={kakaoAdminPhone}
                      onChange={(e) => setKakaoAdminPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-yellow-500 text-on-surface px-3 py-2 rounded-lg text-xs font-mono focus:outline-none"
                      disabled={!isKakaoEnabled}
                    />
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#40484e]/20">
                    <span className="text-[11px] text-on-surface-variant italic">
                      {isKakaoEnabled ? '● Kakao Biz-Alimtalk module loaded (Sandbox active)' : 'KakaoTalk notification is disabled.'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="btn_test_kakao"
                        onClick={handleSendTestKakao}
                        disabled={!isKakaoEnabled || kakaoTestSending}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${isKakaoEnabled ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10' : 'border-outline-variant/20 text-on-surface-variant cursor-not-allowed'}`}
                      >
                        {kakaoTestSending ? '전송중...' : '시뮬레이션 테스트 발송'}
                      </button>
                      <button
                        type="button"
                        id="btn_save_kakao"
                        onClick={handleSaveKakaoSettings}
                        disabled={!isKakaoEnabled}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${isKakaoEnabled ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'}`}
                      >
                        설정 저장
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. DATABASE INITIALIZATION CARD */}
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden border border-red-950/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-800 opacity-40"></div>
                
                <div className="pb-4 border-b border-outline-variant/30 mb-6">
                  <h3 className="font-bold text-lg text-red-400">데이터베이스 시스템 초기화</h3>
                  <p className="text-xs text-on-surface-variant">설치 사례 및 렌탈 신청 데이터를 리셋하거나, 전체 깨끗하게 포맷팅할 수 있습니다.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-sm text-white">데이터 보존 및 공공 템플릿 리셋</h4>
                    <p className="text-xs text-on-surface-variant max-w-md mt-1">
                      테스트를 위해 설치 사례와 고객 무료 상담 목록을 고화질 미디어가 포함된 데모 데이터로 복원합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    id="btn_reset_default_data"
                    onClick={handleResetDataClick}
                    className="shrink-0 px-4 py-2 border border-outline-variant hover:border-[#fbba68] hover:text-[#fbba68] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    기본값 복원 (Restore)
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-6 pt-6 border-t border-[#40484e]/20">
                  <div>
                    <h4 className="font-bold text-sm text-red-400">모든 데이터 완전 삭제 (초기화)</h4>
                    <p className="text-xs text-on-surface-variant max-w-md mt-1">
                      모든 설치 목록 및 고객 상담 신청(leads) 내역을 완전히 삭제하고 완전 무 상태의 데이터베이스로 초기 가동합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    id="btn_clear_all_data"
                    onClick={handleClearAllDataClick}
                    className="shrink-0 px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    전체 데이터 삭제 (Clear All)
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Fullscreen Inquiry Store Photo Lightbox Preview */}
      <AnimatePresence>
        {selectedInquiryImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[100] p-4 cursor-zoom-out"
            onClick={() => setSelectedInquiryImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-5xl max-h-[85vh] bg-surface-container rounded-2xl p-2 border border-outline-variant shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedInquiryImage} 
                alt="매장 사진 원본" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <button 
                type="button"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                onClick={() => setSelectedInquiryImage(null)}
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

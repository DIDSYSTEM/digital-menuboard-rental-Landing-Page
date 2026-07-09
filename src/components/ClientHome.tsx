import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Star, 
  CheckCircle,
  HelpCircle,
  User,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  ChevronLeft,
  ChevronUp,
  Upload,
  X,
  FileImage
} from 'lucide-react';
import { InstallationCase, RentalInquiry } from '../types';
// @ts-ignore
import cafeHeroImg from '../assets/images/cafe_digital_menu_1783333360370.jpg';

interface ClientHomeProps {
  cases: InstallationCase[];
  onAddInquiry: (inquiry: Omit<RentalInquiry, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToAdmin: () => void;
}

export default function ClientHome({ cases, onAddInquiry, onNavigateToAdmin }: ClientHomeProps) {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState('1대');
  const [installationTime, setInstallationTime] = useState('1주일 이내');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visibleCasesCount, setVisibleCasesCount] = useState(3);
  const [storeImages, setStoreImages] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isKakaoActive, setIsKakaoActive] = useState(false);
  const [kakaoRecipient, setKakaoRecipient] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Showcase Slider States
  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isHoveringShowcase, setIsHoveringShowcase] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const nextSlide = () => {
    if (cases.length <= visibleCount) return;
    setSlideIndex(prev => {
      if (prev >= cases.length - visibleCount) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    if (cases.length <= visibleCount) return;
    setSlideIndex(prev => {
      if (prev <= 0) {
        return cases.length - visibleCount;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (isHoveringShowcase) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slideIndex, visibleCount, cases.length, isHoveringShowcase]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      if (storeImages.length + filesArray.length > 5) {
        alert('매장 사진은 최대 5장까지만 첨부할 수 있습니다.');
        return;
      }

      filesArray.forEach(file => {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 첨부할 수 있습니다.');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('5MB 이하의 이미지만 첨부할 수 있습니다.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setStoreImages(prev => [...prev, event.target!.result as string].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setStoreImages(prev => prev.filter((_, i) => i !== index));
  };

  // Password Prompt State
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !company || !agree) {
      alert('이름, 연락처, 매장명 입력 및 개인정보 수집 동의는 필수입니다.');
      return;
    }

    const kakaoEnabled = localStorage.getItem('did_kakao_enabled') === 'true';
    const kakaoPhone = localStorage.getItem('did_kakao_admin_phone') || '010-4567-8910';
    setIsKakaoActive(kakaoEnabled);
    setKakaoRecipient(kakaoPhone);

    onAddInquiry({
      name,
      phone,
      company,
      quantity,
      installationTime,
      message,
      storeImages
    });

    setFormSubmitted(true);
    // Reset Form
    setName('');
    setPhone('');
    setCompany('');
    setQuantity('1대');
    setInstallationTime('1주일 이내');
    setMessage('');
    setAgree(false);
    setStoreImages([]);

    setTimeout(() => {
      setFormSubmitted(false);
    }, 7000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5 Pain Points
  const painPoints = [
    {
      icon: <DollarSign className="w-6 h-6 text-secondary-fixed-dim" />,
      title: '비용 부담',
      desc: '매번 신메뉴 출시나 가격 변동 등 메뉴판 변경 시 발생하는 디자인 및 고가의 인쇄 비용'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-secondary-fixed-dim" />,
      title: '분위기 저하',
      desc: '낡고 찢어지거나 빛바랜 종이 메뉴판, 가독성 떨어지는 손글씨로 인한 매장 인테리어 훼손'
    },
    {
      icon: <Clock className="w-6 h-6 text-secondary-fixed-dim" />,
      title: '업데이트 지연',
      desc: '시즌별 신메뉴, 조기 품절 메뉴, 프로모션 정보 등을 매장 전체에 실시간 반영하기의 불가능함'
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-secondary-fixed-dim" />,
      title: '관리의 어려움',
      desc: '물기가 많은 주방이나 서빙 동선에서 종이가 훼손, 찢어짐, 오염 등에 상시 노출되어 취약한 관리'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-secondary-fixed-dim" />,
      title: '초기 투자 비용',
      desc: '고성능 DID 패널과 거치 마운트, 재생 솔루션을 한 번에 구매할 때 발생하는 큰 목돈 부담'
    }
  ];

  // Reviews (13 reviews for seamless marquee)
  const reviews = [
    {
      name: '김OO 사장님',
      role: '브런치 카페 운영',
      stars: 5,
      content: '메뉴 변경이 너무 간편해져서 이벤트 홍보가 훨씬 쉬워졌어요! 전에는 신메뉴 낼 때마다 인쇄소랑 디자인 시안 주고받으며 인쇄 기다리는 게 정말 스트레스였는데 이제는 브라우저에서 1분이면 전체 매장 메뉴판이 싹 바뀝니다.'
    },
    {
      name: '이OO 점주님',
      role: '프랜차이즈 가맹점',
      stars: 5,
      content: '초기 기기 구입 비용 부담이 전혀 없어서 렌탈로 가벼운 마음에 시작했는데 가성비가 최고입니다! 화질도 엄청나게 쨍하고, 가독성이 좋아져서 손님들도 메뉴판이 예쁘다며 칭찬하시고 매장 분위기가 확 살았습니다.'
    },
    {
      name: '박OO 대표님',
      role: '다이닝 레스토랑 운영',
      stars: 5,
      content: '렌탈 서비스를 이용하니 정기 원격 관리와 무상 AS가 확실해서 기계치인 저도 전혀 걱정 없이 쓰고 있어요. 전용 디자이너 콘텐츠 세팅까지 함께 진행해 주셔서 첫 매장 오픈 때부터 완벽하게 어필할 수 있었습니다.'
    },
    {
      name: '최OO 사장님',
      role: '이자카야 주점 운영',
      stars: 5,
      content: '요즘 트렌드에 맞는 감성 주점에 필수적인 요소입니다. 신메뉴나 추천 안주를 매일 기분 따라 동영상으로 띄울 수 있어서 매출 상승에 확실한 몫을 하고 있습니다. 적극 추천해요!'
    },
    {
      name: '정OO 원장님',
      role: '치과의원 원장',
      stars: 5,
      content: '대기실 벽면에 비디오월로 설치했는데, 치료 정보와 병원 홍보 영상을 아주 고해상도로 송출할 수 있어 환자분들의 대기 지루함이 많이 줄었습니다. 정기 점검도 제때 알아서 다 해줍니다.'
    },
    {
      name: '한OO 대표님',
      role: '베이커리 카페 대표',
      stars: 5,
      content: '빵이 갓 구워져 나오는 시간대별로 추천 메뉴판을 다르게 보여주니 골든 타임 매출이 훨씬 늘었습니다. 무선 네트워크로 이미지를 손쉽게 변경할 수 있어 매장 효율이 최고입니다.'
    },
    {
      name: '강OO 점주님',
      role: '스시/일식 전문점',
      stars: 5,
      content: '바테이블 쪽에 2대를 나란히 연동 설치했는데 고급스럽고 아주 깔끔합니다. 손님들도 모던한 매장 인테리어와 선명한 스크린이 잘 매칭된다고 아주 만족하십니다.'
    },
    {
      name: '윤OO 사장님',
      role: '무인 코인빨래방',
      stars: 5,
      content: '무인 점포의 특성상 멀리서도 직관적으로 사용법을 볼 수 있는 화면이 필요했는데, 천장 마운트형 DID 덕분에 설명서 붙일 공간도 아끼고 원격으로 모니터링도 되어 아주 안심하고 운영 중입니다.'
    },
    {
      name: '임OO 원장님',
      role: '기구 필라테스 센터',
      stars: 5,
      content: '이달의 강사진 소개와 시간표 안내를 스마트하게 보여주고 있습니다. 종이 안내판을 전면 대체하니 인테리어가 깔끔하고 고급스러운 느낌을 한층 살려줍니다.'
    },
    {
      name: '신OO 점주님',
      role: '숯불갈비 전문 가맹점',
      stars: 5,
      content: '고깃집이라 연기나 기름기 때문에 하드웨어 관리가 늘 걱정이었는데 본사 무상 A/S 정책 덕분에 안심하고 사용 중입니다. 화면이 선명하니 점심 특선 메뉴 주문율이 전보다 눈에 띄게 올랐어요.'
    },
    {
      name: '고OO 대표님',
      role: '실내 스크린 골프 클럽',
      stars: 5,
      content: '프런트 뒤편 패널에서 실시간 예약 현황과 이벤트 팝업을 연동해서 보여주니까 회원분들이 굳이 카운터에 문의하지 않아도 되어 리셉션 동선이 훨씬 여유로워졌습니다.'
    },
    {
      name: '배OO 사장님',
      role: '프리미엄 수제버거샵',
      stars: 5,
      content: '미국식 힙한 수제버거집에 어울리는 감각적인 메뉴 애니메이션을 제작해주셨어요. 눈길을 사로잡는 선명한 패널 덕분에 사이드 메뉴 업셀링 비중이 30% 이상 확대되는 효과를 누렸습니다.'
    },
    {
      name: '오OO 점주님',
      role: '테이크아웃 에스프레소 바',
      stars: 5,
      content: '작은 매장이라 공간이 아주 협소했는데 카운터 상단 거치형 1대로 미려한 디지털 메뉴 구성을 완성했습니다. 종이 한 장 인쇄하지 않고도 항상 최신의 시즌별 원두 정보를 제공할 수 있어 감격스럽습니다.'
    }
  ];

  const handleShowMoreCases = () => {
    if (visibleCasesCount >= cases.length) {
      setVisibleCasesCount(3);
    } else {
      setVisibleCasesCount(prev => prev + 3);
    }
  };

  return (
    <div className="bg-[#111416] text-[#e1e2e6] min-h-screen relative font-sans overflow-x-hidden selection:bg-secondary-fixed-dim selection:text-black">
      {/* Background Leak Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(68,214,255,0.04)_0%,rgba(17,20,22,0)_70%)] pointer-events-none z-0" />
      <div className="absolute top-[1200px] left-[-200px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(85,151,195,0.03)_0%,rgba(17,20,22,0)_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-[400px] right-[-100px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(68,214,255,0.03)_0%,rgba(17,20,22,0)_70%)] pointer-events-none z-0" />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#111416]/80 backdrop-blur-md border-b border-[#40484e]/20 px-4 md:px-8 h-16 flex items-center justify-between">
        {/* 상단 왼쪽 로고 링크 수정 가이드: 나중에 외부 링크로 바꾸려면 href="#" 대신 "https://example.com"을 넣으세요. */}
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center neon-glow">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-primary tracking-tight neon-text-glow font-mono">DID SYSTEM</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors cursor-pointer">서비스 소개</button>
          <button onClick={() => scrollToSection('showcase')} className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors cursor-pointer">설치 사례</button>
          <button onClick={() => scrollToSection('reviews')} className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors cursor-pointer">고객 후기</button>
          <button onClick={() => scrollToSection('process')} className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors cursor-pointer">이용 안내</button>
          <button onClick={() => scrollToSection('inquiry')} className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors cursor-pointer">상담 신청</button>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scrollToSection('inquiry')} 
            className="px-4 py-1.5 rounded-lg bg-secondary-fixed-dim text-black text-xs font-bold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            상담 신청
          </button>

          {/* Admin Switcher */}
          <button 
            id="btn_client_to_admin"
            onClick={() => {
              setShowPasswordPrompt(true);
              setEnteredPassword('');
              setPasswordError(false);
            }} 
            className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>관리자</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full py-16 md:py-24 flex items-center justify-center min-h-[85vh] z-10 overflow-hidden border-b border-[#40484e]/10">
        {/* Full-screen background image of actual digital menuboard in cafe */}
        <div className="absolute inset-0 z-0">
          <img 
            src={cafeHeroImg} 
            alt="Cafe with Digital Menuboards" 
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90 scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Layered luxury overlay to maintain superb readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111416]/95 via-[#111416]/75 to-[#111416]/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111416]/50 via-transparent to-[#111416]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center justify-center">
          <div className="glass-panel rounded-2xl w-full p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col items-center text-center">
            {/* Ambient accent light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,214,255,0.06)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="px-3.5 py-1 rounded-full bg-secondary-fixed-dim/15 border border-secondary-fixed-dim/30 text-secondary-fixed-dim text-xs font-semibold tracking-wider uppercase mb-6"
              >
                PREMIUM DIGITAL MENUBOARD RENTAL SERVICE
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight font-sans"
              >
                디지털 메뉴보드,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-fixed-dim">구매하지 말고 렌탈</span>로 시작하세요.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-on-surface-variant text-base md:text-lg lg:text-xl mt-6 max-w-2xl leading-relaxed"
              >
                카페·음식점·프랜차이즈 매장에 맞춰 디지털 메뉴보드 설치부터 디자인 콘텐츠 세팅, 원격 통합 관리까지 한 번에 전문적으로 지원합니다.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full justify-center"
              >
                <button 
                  onClick={() => scrollToSection('inquiry')}
                  className="btn-gradient w-full sm:w-auto px-8 py-4 rounded-xl text-black font-bold text-base hover:scale-105 transition-transform duration-200 cursor-pointer shadow-lg neon-glow flex items-center justify-center gap-2"
                >
                  렌탈 상담 신청 <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollToSection('showcase')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container-high border border-outline-variant hover:bg-surface-variant transition-colors text-white font-bold text-base cursor-pointer flex items-center justify-center"
                >
                  설치사례 보기
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Pain Points / Value Proposition */}
      <section id="about" className="py-20 px-4 md:px-8 max-w-7xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <p className="text-secondary-fixed-dim font-mono text-xs tracking-wider uppercase mb-2">THE PROBLEM</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              아직도 메뉴판 수정할 때마다<br className="sm:hidden"/> 다시 디자인하고 출력하시나요?
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-4 max-w-2xl mx-auto">
              매일 인쇄하고 번거롭게 붙이는 종이 메뉴판의 한계를 뛰어넘어 스마트하고 세련된 매장 운영의 지름길을 제안합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {painPoints.map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -6 }}
                className="bg-surface-container-low/50 border border-outline-variant/30 rounded-xl p-6 flex flex-col items-center text-center hover:border-secondary-fixed/50 transition-all duration-300 relative group"
              >
                {/* Outer glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-secondary-fixed-dim/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Case Showcase */}
      <section id="showcase" className="py-20 px-4 md:px-8 max-w-7xl mx-auto z-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => setIsHoveringShowcase(true)}
          onMouseLeave={() => setIsHoveringShowcase(false)}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-secondary-fixed-dim font-mono text-xs tracking-wider uppercase mb-2">PORTFOLIO</p>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                실제 매장에 설치된 디지털 메뉴보드
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-3 max-w-xl">
                고객 매장에 딱 맞춰 완벽하게 세팅된 DIDSYSTEM 하드웨어와 디자인 조화를 직접 감상해 보세요.
              </p>
            </div>
            
            {/* Slider Controls */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 rounded-lg border border-[#40484e]/60 bg-surface-container-high/40 hover:bg-surface-variant flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
                title="이전 슬라이드"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 rounded-lg border border-[#40484e]/60 bg-surface-container-high/40 hover:bg-surface-variant flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
                title="다음 슬라이드"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden w-full px-1 py-4">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                width: '100%',
                transform: `translateX(calc(-${slideIndex} * (((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount}) + 24px)))`
              }}
            >
              {cases.map((item) => (
                <div 
                  key={item.id} 
                  className="glass-panel rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1.5 transition-all duration-300 shrink-0"
                  style={{
                    width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`
                  }}
                >
                  {/* Image box with status badge */}
                  <div className="h-56 relative overflow-hidden bg-surface-container-highest">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-surface-dim/80 backdrop-blur-md px-3 py-1 rounded-full border border-secondary-fixed/30 flex items-center gap-1.5 shadow">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'Online' ? 'bg-secondary-fixed animate-pulse' : 'bg-tertiary-fixed-dim'}`}></span>
                      <span className="text-[11px] font-bold text-white tracking-wide">
                        {item.status}
                      </span>
                    </div>
                    {item.category && (
                      <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-secondary-fixed-dim">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    {item.specs && (
                      <div className="mt-2 pt-4 border-t border-outline-variant/30 text-xs text-on-surface-variant flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-secondary-fixed-dim shrink-0" />
                        <span className="truncate">{item.specs}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators (Dots) */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.max(1, cases.length - visibleCount + 1) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${slideIndex === i ? 'w-6 bg-secondary-fixed-dim' : 'bg-[#40484e]/60 hover:bg-[#40484e]'}`}
                title={`${i + 1}번 슬라이드`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust & Process Guide */}
      <section id="process" className="py-20 bg-surface-container-lowest/40 border-y border-[#40484e]/10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 md:px-8"
        >
          <div className="text-center mb-16">
            <p className="text-secondary-fixed-dim font-mono text-xs tracking-wider uppercase mb-2">SERVICE STEPS</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              간편하고 체계적인 4단계 서비스 프로세스
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-4 max-w-2xl mx-auto">
              신청부터 디자인 세팅, 사후 관리까지 전문가가 한 번에 케어해 드리므로 걱정하실 부분이 없습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '맞춤형 무료 상담', desc: '매장 환경, 업종, 필요 대수와 디자인 요구 사양을 상세히 확인하고 최적의 렌탈 구성을 설계합니다.' },
              { step: '02', title: '컨텐츠 디자인 및 구성', desc: '전문 그래픽 디자이너가 매장 브랜드 아이덴티티에 꼭 맞춘 고품격 맞춤형 메뉴판 화면을 세팅해 드립니다.' },
              { step: '03', title: '정밀 하드웨어 설치', desc: '본사 소속 전문 엔지니어가 가시성이 가장 돋보이는 위치에 튼튼하고 깔끔하게 벽면 고정 및 케이블 매립 설치를 완료합니다.' },
              { step: '04', title: '원격 통합 관리 및 무상 A/S', desc: '인터넷 브라우저 하나로 실시간 원격 제어가 가능하며, 약정 기간 내 기기 이상 발생 시 신속한 무상 무제한 기술 지원을 보장합니다.' }
            ].map((p, idx) => (
              <div key={idx} className="relative p-6 rounded-xl bg-surface-container-low/30 border border-outline-variant/10">
                <span className="text-4xl font-black text-secondary-fixed-dim/25 absolute top-4 right-6 font-mono">{p.step}</span>
                <h3 className="text-lg font-bold text-white mb-3 mt-2">{p.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="py-20 z-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-16">
            <p className="text-secondary-fixed-dim font-mono text-xs tracking-wider uppercase mb-2">REVIEWS</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              전국 사장님들이 신뢰하고 추천하는 서비스
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-4 max-w-2xl mx-auto">
              수백 개의 실고객 매장에서 DIDSYSTEM 디지털 메뉴판 렌탈을 통해 매장 가치와 매출 상승을 체감하고 있습니다.
            </p>
          </div>

          {/* Scrolling Marquee Slider Container (우 -> 좌) */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Blending Gradient Overlays for realistic high-end design */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#111416] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#111416] to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee flex gap-6">
              {reviews.map((rev, index) => (
                <div key={`rev1-${index}`} className="glass-panel p-6 rounded-xl flex flex-col justify-between w-[320px] md:w-[380px] shrink-0 hover:border-secondary-fixed-dim/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-4 text-secondary-fixed">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-secondary-fixed-dim" />
                      ))}
                    </div>
                    <p className="text-[#e1e2e6] text-xs md:text-sm leading-relaxed italic mb-6">
                      &ldquo;{rev.content}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary-container">
                      <User className="w-5 h-5 text-[#8dcefc]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                      <p className="text-xs text-on-surface-variant">{rev.role}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate the items for seamless loop */}
              {reviews.map((rev, index) => (
                <div key={`rev2-${index}`} className="glass-panel p-6 rounded-xl flex flex-col justify-between w-[320px] md:w-[380px] shrink-0 hover:border-secondary-fixed-dim/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-4 text-secondary-fixed">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-secondary-fixed-dim" />
                      ))}
                    </div>
                    <p className="text-[#e1e2e6] text-xs md:text-sm leading-relaxed italic mb-6">
                      &ldquo;{rev.content}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary-container">
                      <User className="w-5 h-5 text-[#8dcefc]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                      <p className="text-xs text-on-surface-variant">{rev.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Rental Inquiry Form */}
      <section id="inquiry" className="py-20 px-4 md:px-8 max-w-4xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-2xl p-8 md:p-12 border border-[#40484e]/40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              우리 매장에 맞는 디지털 메뉴보드 렌탈 견적
            </h2>
            <p className="text-on-surface-variant text-sm md:text-base mt-2">
              정보를 입력해 주시면 최적의 수량 설계 및 정밀 견적 무료 제안서를 빠르게 전송해 드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">이름 (Name) <span className="text-secondary-fixed-dim">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:shadow-[0_0_15px_rgba(68,214,255,0.15)] focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all" 
                  placeholder="예: 홍길동 사장님"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">연락처 (Phone) <span className="text-secondary-fixed-dim">*</span></label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:shadow-[0_0_15px_rgba(68,214,255,0.15)] focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all" 
                  placeholder="010-0000-0000"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">매장명/상호 (Brand) <span className="text-secondary-fixed-dim">*</span></label>
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:shadow-[0_0_15px_rgba(68,214,255,0.15)] focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all" 
                placeholder="예: Luminous 커피 강남점"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">도입 수량</label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all h-[46px]"
                >
                  <option value="1대">1대</option>
                  <option value="2대">2대</option>
                  <option value="3대">3대 (추천)</option>
                  <option value="4대">4대</option>
                  <option value="5대 이상">5대 이상 (대형 비디오월)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">설치 희망 시기</label>
                <select 
                  value={installationTime}
                  onChange={(e) => setInstallationTime(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all h-[46px]"
                >
                  <option value="1주일 이내">1주일 이내 (긴급)</option>
                  <option value="1개월 이내">1개월 이내 (오픈 예정)</option>
                  <option value="3개월 이내">3개월 이내</option>
                  <option value="미정 / 단순 견적">미정 / 단순 견적 문의</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">상담 내용 (Details)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 bg-surface-container-lowest border border-outline-variant focus:border-secondary-fixed focus:shadow-[0_0_15px_rgba(68,214,255,0.15)] focus:outline-none text-on-surface px-4 py-3 rounded-lg text-sm transition-all resize-none" 
                placeholder="매장 벽면 마운트 상태, 업종, 또는 희망하시는 사이즈 등을 자유롭게 적어주세요."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">매장 사진 첨부 (Store Photos) - 최대 5장</label>
              <p className="text-xs text-on-surface-variant mb-1">
                매장 전면이나 메뉴판이 설치될 벽면 사진을 첨부해 주시면 더욱 정확하고 상세한 가상 시뮬레이션 시안 제안이 가능합니다.
              </p>
              
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files) {
                    const filesArray = Array.from(e.dataTransfer.files) as File[];
                    if (storeImages.length + filesArray.length > 5) {
                      alert('매장 사진은 최대 5장까지만 첨부할 수 있습니다.');
                      return;
                    }
                    filesArray.forEach(file => {
                      if (!file.type.startsWith('image/')) {
                        alert('이미지 파일만 첨부할 수 있습니다.');
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        alert('5MB 이하의 이미지만 첨부할 수 있습니다.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setStoreImages(prev => [...prev, event.target!.result as string].slice(0, 5));
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
                className="border border-dashed border-outline-variant/60 hover:border-secondary-fixed-dim/80 bg-surface-container-low/20 rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative group"
                onClick={() => document.getElementById('store-image-uploader')?.click()}
              >
                <input 
                  type="file" 
                  id="store-image-uploader" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                
                <Upload className="w-8 h-8 text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors mb-3" />
                <p className="text-sm font-semibold text-[#e1e2e6] group-hover:text-white transition-colors mb-1">
                  클릭하거나 여기에 이미지 드래그 & 드롭
                </p>
                <p className="text-xs text-on-surface-variant">
                  최대 5장 첨부 가능 (각 이미지 5MB 이내)
                </p>
              </div>

              {/* Thumbnail Previews */}
              {storeImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-3">
                  {storeImages.map((imgSrc, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant group bg-surface-container-highest">
                      <img 
                        src={imgSrc} 
                        alt={`매장 사진 ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow"
                        title="이미지 삭제"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 text-center">
                        <span className="text-[10px] text-white font-semibold">사진 {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input 
                id="check_agree"
                type="checkbox" 
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-[#0066cc] focus:ring-[#0066cc] mt-1 cursor-pointer"
                required
              />
              <label htmlFor="check_agree" className="text-xs text-[#a3a6ad] leading-relaxed select-none cursor-pointer">
                개인정보 수집 및 이용 동의 <span className="text-secondary-fixed-dim">*</span> (렌탈 상담 목적 외에 제3자에게 절대 제공되지 않습니다.)
              </label>
            </div>

            <button 
              type="submit"
              className="w-full btn-gradient py-4 rounded-xl text-black font-extrabold text-base tracking-wider hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer shadow-lg mt-4"
            >
              무료 정밀 견적 신청하기
            </button>
          </form>

        <AnimatePresence>
          {formSubmitted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-[#111416]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-20"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center mb-6 neon-glow">
                <UserCheck className="w-8 h-8 text-secondary-fixed-dim" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">상담 예약 신청 완료!</h3>
              <p className="text-on-surface-variant max-w-sm text-sm leading-relaxed mb-6">
                입력해 주신 정보가 안전하게 전달되었습니다. 본사 담당 플래너가 영업시간 기준 24시간 내로 유선 전화를 드려 상세 견적서 안내와 일정 조율을 도와드리겠습니다.
              </p>
              {isKakaoActive && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-lg p-3.5 max-w-sm mb-6 text-xs text-left flex items-start gap-2.5">
                  <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono mt-0.5 shrink-0">TALK</span>
                  <div>
                    <p className="font-bold text-yellow-400">실시간 관리자 카카오 알림톡 전송 완료</p>
                    <p className="text-[#a3a6ad] mt-0.5 leading-relaxed">
                      신규 견적 의뢰가 관리자({kakaoRecipient}) 스마트폰으로 실시간 발송되었습니다. 신속히 대답해 드리겠습니다.
                    </p>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setFormSubmitted(false)}
                className="px-6 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-xs font-bold text-white transition-colors cursor-pointer"
              >
                확인 (Close)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </section>

    {/* Footer */}
    <footer className="bg-[#0b0d0e] py-12 px-6 md:px-12 border-t border-[#40484e]/20 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Logo */}
        {/* 하단 로고 링크 수정 가이드: 나중에 외부 링크로 바꾸려면 href="#" 대신 "https://example.com"을 넣으세요. */}
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 opacity-95 w-fit select-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_10px_rgba(68,214,255,0.15)]">
            <Monitor className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-wider font-sans">DID SYSTEM</span>
        </a>
        
        {/* Business Info Details */}
        <div className="space-y-2 text-xs md:text-[13px] text-on-surface-variant leading-relaxed font-normal">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>회사명 : 디아이디 시스템</span>
            <span className="text-[#40484e]/60 hidden sm:inline">|</span>
            <span>대표 : 김도형</span>
            <span className="text-[#40484e]/60 hidden sm:inline">|</span>
            <span>사업자 등록번호 : 130-24-97156</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>통신판매업 신고번호 : 제2008-427호</span>
            <span className="text-[#40484e]/60 hidden sm:inline">|</span>
            <span>주소 : 14558 경기도 부천시 조마루로385번길 92 부천테크노밸리U1center 506호</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>이메일 : do4989@hanmail.net</span>
            <span className="text-[#40484e]/60 hidden sm:inline">|</span>
            <span>개인정보보호책임자 : 김도형</span>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-on-surface-variant/60 font-mono mt-4 border-t border-[#40484e]/10 pt-4">
          COPYRIGHT © 2024 디아이디시스템. All rights reserved.
        </p>
      </div>
    </footer>

      {/* Password Prompt Modal */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111416] border border-[#40484e]/60 rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white mb-2">관리자 인증</h3>
              <p className="text-xs text-on-surface-variant mb-4">관리자 페이지 진입을 위해 비밀번호를 입력해 주세요.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (enteredPassword === '4989444') {
                  setShowPasswordPrompt(false);
                  onNavigateToAdmin();
                } else {
                  setPasswordError(true);
                }
              }} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <input 
                    type="password" 
                    value={enteredPassword}
                    onChange={(e) => {
                      setEnteredPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    className={`w-full bg-surface-container-lowest border ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-secondary-fixed'} focus:outline-none text-on-surface px-3 py-2.5 rounded-lg text-sm transition-all text-center tracking-widest`}
                    placeholder="비밀번호 입력"
                    autoFocus
                  />
                  {passwordError && (
                    <span className="text-[11px] text-red-400 text-center">비밀번호가 일치하지 않습니다.</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordPrompt(false)}
                    className="flex-1 py-2 rounded bg-surface-container-high hover:bg-surface-variant text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 btn-gradient text-black text-xs font-bold rounded hover:opacity-90 transition-all cursor-pointer"
                  >
                    확인
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll to Top [TOP] Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass-panel backdrop-blur-lg bg-surface-container-high/80 border border-[#40484e]/60 text-[#e1e2e6] hover:bg-[#40484e] hover:text-white transition-all flex flex-col items-center justify-center shadow-2xl active:scale-90 cursor-pointer group"
            title="맨 위로 가기"
          >
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[9px] font-extrabold tracking-widest leading-none mt-0.5">TOP</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

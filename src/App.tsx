/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, 
  Search, 
  Users, 
  BookOpen, 
  Archive, 
  MessageSquare,
  ChevronRight,
  X,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Send,
  Heart,
  Book
} from 'lucide-react';
import Hls from 'hls.js';
import axios from 'axios';

// --- 通用交互组件 ---
interface InteractiveWrapperProps {
  children: React.ReactNode;
  sensitivity?: number;
  className?: string;
}

const InteractiveWrapper: React.FC<InteractiveWrapperProps> = ({ children, sensitivity = 20, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [sensitivity / 2, -sensitivity / 2]);
  const rotateY = useTransform(springX, [-300, 300], [-sensitivity / 2, sensitivity / 2]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }} className={className}
    >{children}</motion.div>
  );
};

// --- 评论组件 ---
const CommentSection = () => {
  const [comments, setComments] = useState([
    { id: 1, user: "航油小李", text: "这篇文章分析得很透彻，数字化确实是基层提效的关键。", date: "2小时前", likes: 12 },
    { id: 2, user: "智青春观察员", text: "建议可以增加更多关于传感器部署的细节分享。", date: "5小时前", likes: 8 },
  ]);
  const [newComment, setNewComment] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([{ id: Date.now(), user: "我", text: newComment, date: "刚刚", likes: 0 }, ...comments]);
    setNewComment("");
  };
  return (
    <div className="mt-16 pt-16 border-t border-white/10">
      <h3 className="text-2xl font-heading italic text-white mb-8">观点交流</h3>
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="liquid-glass rounded-3xl p-6 mb-4">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="写下你的看法..." className="w-full bg-transparent border-none outline-none text-white font-body text-lg resize-none min-h-[100px]" />
        </div>
        <div className="flex justify-end"><button type="submit" className="bg-white text-black px-8 py-3 rounded-full font-body font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-xl">发表评论 <Send size={16} /></button></div>
      </form>
      <div className="space-y-6">
        {comments.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="liquid-glass rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10"><UserIcon size={14} className="text-white/40" /></div>
                <div><div className="text-white font-body font-medium text-sm">{c.user}</div><div className="text-white/30 text-[10px] uppercase tracking-wider">{c.date}</div></div>
              </div>
              <button className="flex items-center gap-1.5 text-white/30 hover:text-red-400 transition-colors"><Heart size={14} /><span className="text-xs">{c.likes}</span></button>
            </div>
            <p className="text-white/70 font-body text-base leading-relaxed pl-11">{c.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- 模块页面 ---

const ForumPage = () => {
  const [selected, setSelected] = useState<any>(null);
  const items = Array.from({ length: 9 }, (_, i) => ({
    id: i, title: `航油保障效率探讨 #${i + 1}`, author: "青年先锋 @ 航油枢纽", date: "2024-03-20", excerpt: "关于数字化转型在基层场站的深度应用探讨与实践心得...",
    content: "在当前民航业快速发展的背景下，航油保障的智慧化升级已成为不可逆转的趋势。通过引入 AI 预测算法和 IoT 设备，我们成功将单次加油周转时间缩短了 15%。本文将详细阐述这一过程中的技术难点与突破口，分享来自一线场站的真实优化案例。"
  }));
  return (
    <div className="relative h-screen w-full pt-32 px-12 overflow-y-auto no-scrollbar pb-32">
      <AnimatePresence mode='wait'>
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-3 mb-8"><h2 className="text-5xl font-heading italic text-white mb-2 drop-shadow-lg">分享论坛</h2><p className="text-white/60 font-body">灵感碰撞，共话未来</p></div>
            {items.map(item => (
              <InteractiveWrapper key={item.id} sensitivity={10}><motion.div onClick={() => setSelected(item)} className="liquid-glass rounded-3xl p-8 hover:bg-white/10 transition-colors cursor-pointer group h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6"><MessageSquare className="text-white/40 group-hover:text-white/80 transition-colors" size={24} /><ArrowUpRight className="text-white/20 group-hover:text-white" size={16} /></div>
                <h4 className="text-xl font-heading italic text-white mb-2">{item.title}</h4>
                <p className="text-sm text-white/50 font-body leading-relaxed">{item.excerpt}</p>
              </motion.div></InteractiveWrapper>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="max-w-4xl mx-auto w-full">
            <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors"><ArrowLeft size={20} /> 返回列表</button>
            <div className="liquid-glass rounded-[3rem] p-12 backdrop-blur-xl border border-white/20">
               <h2 className="text-5xl font-heading italic text-white mb-6 leading-tight">{selected.title}</h2>
               <div className="flex items-center gap-6 text-white/40 text-sm mb-12 font-body border-b border-white/5 pb-8"><span className="flex items-center gap-2"><UserIcon size={14} /> {selected.author}</span><span className="flex items-center gap-2"><Calendar size={14} /> {selected.date}</span></div>
               <div className="text-white/80 font-body text-xl leading-relaxed space-y-8"><p>{selected.content}</p></div>
               <CommentSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PortraitPage = () => {
  const [activeStat, setActiveStat] = useState<any>(null);
  const stats = [
    { label: "平均年龄", val: "28", unit: "岁", detail: "团队整体呈现年轻化趋势，充满活力与创新精神。" },
    { label: "专业覆盖", val: "12", unit: "类", detail: "涵盖油料工程、机械自动化、数字化管理等多元领域。" },
    { label: "技术骨干", val: "65", unit: "%", detail: "核心技术岗位由青年人才挑大梁，展现专业实力。" },
    { label: "活跃度", val: "92", unit: "%", detail: "在论坛、知识库等平台的参与度极高，形成积极反馈。" }
  ];
  return (
    <div className="relative h-screen w-full pt-32 px-12 overflow-y-auto no-scrollbar flex flex-col items-center pb-32">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-6xl font-heading italic text-white mb-16 drop-shadow-lg">青年画像</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <InteractiveWrapper key={i} sensitivity={20}>
              <button onClick={() => setActiveStat(stat)} className="flex flex-col items-center">
                <div className={`w-24 h-24 liquid-glass rounded-full flex items-center justify-center mb-6 shadow-2xl border transition-all duration-500 ${activeStat?.label === stat.label ? 'border-white scale-110' : 'border-white/20'}`}>
                   <Users className="text-white/60" size={32} />
                </div>
                <span className="text-4xl font-heading italic text-white">{stat.val}<small className="text-sm ml-1 text-white/40">{stat.unit}</small></span>
                <span className="text-xs text-white/50 uppercase tracking-widest mt-2">{stat.label}</span>
              </button>
            </InteractiveWrapper>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeStat && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="liquid-glass rounded-3xl p-8 backdrop-blur-md border border-white/20 mb-12 text-left">
              <h4 className="text-white font-heading italic text-2xl mb-4">{activeStat.label}深度解析</h4>
              <p className="text-white/60 font-body text-lg leading-relaxed">{activeStat.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
          {[1, 2].map(i => (
            <div key={i} className="liquid-glass rounded-3xl p-8 border border-white/10">
              <h4 className="text-white font-heading italic text-xl mb-4">核心动力指数模型 #{i}</h4>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: i === 1 ? "85%" : "70%" }} transition={{ duration: 1.5, delay: 0.5 }} className="bg-cyan-400/60 h-full" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArchivePage = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const years = Array.from({ length: 2026 - 2010 + 1 }, (_, i) => 2026 - i);

  return (
    <div className="relative h-screen w-full pt-32 px-12 overflow-y-auto no-scrollbar pb-32">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedYear ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-5xl font-heading italic text-white mb-12 drop-shadow-lg">航油档案馆</h2>
              <div className="space-y-4">
                {years.map((year) => (
                  <InteractiveWrapper key={year} sensitivity={5}>
                    <div onClick={() => setSelectedYear(year)} className="liquid-glass rounded-2xl p-6 flex items-center justify-between hover:bg-white/10 cursor-pointer group">
                      <div className="flex items-center gap-8">
                        <span className="font-heading italic text-3xl text-white/30 group-hover:text-white transition-colors">{year}</span>
                        <span className="text-white font-body tracking-wide">年度里程碑记录 - 第 {year - 2010 + 1} 卷</span>
                      </div>
                      <Archive size={20} className="text-white/20 group-hover:text-white" />
                    </div>
                  </InteractiveWrapper>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="w-full">
              <button onClick={() => setSelectedYear(null)} className="flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors font-body"><ArrowLeft size={20} /> 返回馆藏列表</button>
              <div className="liquid-glass rounded-[2rem] p-12">
                <span className="text-white/20 font-heading italic text-8xl block mb-6">{selectedYear}</span>
                <h3 className="text-4xl font-heading italic text-white mb-8 border-b border-white/5 pb-4">重点卷宗检索</h3>
                <div className="grid grid-cols-1 gap-4 font-body">{["基础设施扩容报告", "航空加油站标准化手册", "青年突击队先进事迹摘要"].map(doc => (
                  <div key={doc} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 cursor-pointer transition-all"><span className="text-white/80">{doc}</span><Search size={18} className="text-white/30" /></div>
                ))}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const KnowledgeBasePage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const tags = ["业务技能", "组织建设", "先锋榜样", "规章制度", "安全生产", "技术创新"];
  return (
    <div className="relative h-screen w-full pt-32 px-12 overflow-y-auto no-scrollbar flex flex-col items-center pb-32">
      <div className="max-w-4xl w-full text-center">
        <AnimatePresence mode="wait">
          {!selectedTag ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-5xl font-heading italic text-white mb-8 drop-shadow-lg">团青知识库</h2>
              <div className="liquid-glass rounded-full px-8 py-4 flex items-center gap-4 mb-12 border border-white/20"><Search className="text-white/40" size={20} /><input placeholder="搜索知识点..." className="bg-transparent border-none outline-none text-white w-full font-body placeholder:text-white/20" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tags.map((tag) => (
                  <InteractiveWrapper key={tag} sensitivity={8}>
                    <div onClick={() => setSelectedTag(tag)} className="liquid-glass rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-4"><BookOpen size={18} className="text-white/40 group-hover:text-white" /><span className="text-white font-body">{tag}</span></div>
                      <ChevronRight size={16} className="text-white/20" />
                    </div>
                  </InteractiveWrapper>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
               <button onClick={() => setSelectedTag(null)} className="flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-colors mx-auto"><X size={20} /> 关闭当前分类</button>
              <div className="liquid-glass rounded-[2.5rem] p-16 text-center backdrop-blur-xl border border-white/20 shadow-2xl">
                 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10"><BookOpen className="text-white/40" size={40} /></div>
                 <h2 className="text-4xl font-heading italic text-white mb-4">{selectedTag}</h2>
                 <p className="text-white/40 font-body mb-12 max-w-md mx-auto">该分类下共有 128 个专业文档与精选案例，点击下方按钮进入沉浸式阅读模式。</p>
                 <button 
                  onClick={() => window.open('https://cnaf-test-3.netlify.app/', '_blank')}
                  className="bg-white text-black px-12 py-4 rounded-full font-body font-semibold hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 mx-auto"
                 >
                   在线阅读 <Book size={18}/>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 机器人组件 ---

const RobotCharacter = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div 
      className="relative w-32 h-32 cursor-grab active:cursor-grabbing robot-glow"
      whileHover={{ scale: 1.1 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      onClick={onClick}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="55" cy="45" r="8" fill="#A5F3FC" />
        <path d="M55 45L75 75" stroke="#71B4E1" strokeWidth="6" strokeLinecap="round" />
        <circle cx="145" cy="45" r="8" fill="#A5F3FC" />
        <path d="M145 45L125 75" stroke="#71B4E1" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="110" r="82" fill="url(#bodyGrad)" stroke="#71B4E1" strokeWidth="3" />
        <path d="M45 75C65 65 135 65 155 75" stroke="white" strokeOpacity="0.15" strokeWidth="2" />
        <circle cx="100" cy="105" r="45" fill="#1A2B48" stroke="#71B4E1" strokeWidth="4" />
        <circle cx="100" cy="105" r="38" fill="url(#eyeGrad)" />
        <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
          <path d="M115 85L118 91L124 94L118 97L115 103L112 97L106 94L112 91L115 85Z" fill="white" />
          <path d="M85 118L87 122L91 124L87 126L85 130L83 126L79 124L83 122L85 118Z" fill="white" fillOpacity="0.7" />
        </motion.g>
        <rect x="70" y="160" width="60" height="24" rx="5" fill="#2D4D7F" />
        <text x="100" y="177" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">CNAF</text>
        <defs>
          <linearGradient id="bodyGrad" x1="100" y1="30" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8FC7E8" /><stop offset="100%" stopColor="#3E6B99" />
          </linearGradient>
          <radialGradient id="eyeGrad" cx="100" cy="105" r="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1425" /><stop offset="75%" stopColor="#1E3A5F" /><stop offset="100%" stopColor="#0A1220" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// --- 视频与主程序 ---

const BackgroundVideo = ({ src, className, opacity = 1 }: { src: string, className?: string, opacity?: number }) => {
  return (
    <video 
      src={src} 
      className={className} 
      style={{ opacity }} 
      autoPlay 
      loop 
      muted 
      playsInline 
    />
  );
};

const HomePage = () => (
  <div className="relative h-screen w-full overflow-hidden">
    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-[100px] md:left-[140px] top-[28%] max-w-[600px] text-left z-10"
    >
      <h1 className="font-heading italic leading-[1.1] tracking-[2px] mb-4 flex flex-col items-start" style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
        <span className="text-[56px] md:text-[64px] font-medium opacity-90">青年与企业</span>
        <span className="text-[64px] md:text-[76px] font-semibold text-white">同频共振</span>
      </h1>
      <p className="font-body text-[18px] md:text-[21px] leading-[1.7] mb-6 font-normal tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>积极打造航空能源产业链链长<br />为建设世界一流航空能源供应商接续奋斗</p>
      <div className="w-[60px] h-[1px] mt-2" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0))' }} />
    </motion.div>
    <div className="absolute bottom-[80px] left-0 right-0 z-10 text-center px-4"><p className="font-body text-[14px] tracking-[0.2em] font-light inline-block" style={{ color: 'rgba(255,255,255,0.6)' }}>让每一份青春力量，成为企业发展的动能</p></div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState("首页");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
    { role: 'bot', text: '你好！我是航油助理。有什么我可以帮您的吗？' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCnafChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();
    
    // 1. 先把用户的消息放进对话框
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText("");
    setIsTyping(true);

    try {
      // 2. 发送到后端
      const response = await axios.post('http://localhost:5001/api/chat', {
        message: userMessage
      });

      // 3. 拿到后端的回复
      const botReply = response.data.reply;

      // 4. 把机器人的回复放进对话框 (这里用 'bot' 角色)
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (error) {
      console.error("连接大脑失败:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "连接失败，请检查后端窗口。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "分享论坛": return <ForumPage />;
      case "青年画像": return <PortraitPage />;
      case "航油档案馆": return <ArchivePage />;
      case "团青知识库": return <KnowledgeBasePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="bg-black text-white h-screen w-full overflow-hidden selection:bg-white selection:text-black font-body">
      <div className="fixed inset-0 z-0">
        <BackgroundVideo src="https://res.cloudinary.com/dzq7cuwf6/video/upload/v1774077539/kling_20260319_%E4%BD%9C%E5%93%81_fixed_came_5031_0_mdplfc.mp4" className="absolute inset-0 w-full h-full object-cover" opacity={0.8} />
        <div className="absolute inset-0 bg-black/10 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 z-[2] h-[300px] bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <nav className="fixed top-6 left-0 right-0 z-50 px-8">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-start gap-12">
          <InteractiveWrapper sensitivity={10}><button onClick={() => setCurrentPage("首页")} className="flex flex-col text-left hover:opacity-80 transition-opacity"><span className="font-heading italic text-3xl text-white tracking-tight drop-shadow-sm">智慧青春</span></button></InteractiveWrapper>
          <div className="hidden md:flex liquid-glass rounded-full py-3 px-20 items-center gap-16">
            {["首页", "分享论坛", "青年画像", "航油档案馆", "团青知识库"].map((item) => (
              <button key={item} onClick={() => setCurrentPage(item)} className={`text-sm font-medium transition-all font-body tracking-[0.1em] whitespace-nowrap hover:scale-105 ${currentPage === item ? "text-white scale-110" : "text-white/50 hover:text-white/80"}`}>{item}</button>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="relative z-10 h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.4 }} className="h-full w-full">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <motion.div drag dragMomentum={false} className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4" style={{ touchAction: "none" }}>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div onPointerDown={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[350px] h-[480px] liquid-glass rounded-[2.5rem] flex flex-col shadow-2xl border border-cyan-400/20 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="font-heading italic text-xl">航油助理</span></div><button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button></div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 text-white border border-cyan-400/30' : 'bg-white/5 text-white/80'}`}>{msg.text}</div></div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 text-white/40 p-3 rounded-2xl text-xs animate-pulse">助理正在思考...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form className="p-4 border-t border-white/5 flex gap-2" onSubmit={handleCnafChat}>
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="键入指令..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-body px-2" 
                  disabled={isTyping}
                />
                <button type="submit" className={`p-2 transition-transform ${isTyping ? 'text-white/20' : 'text-cyan-400 hover:scale-110'}`} disabled={isTyping}>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <RobotCharacter onClick={() => setIsChatOpen(!isChatOpen)} />
      </motion.div>
    </div>
  );
}

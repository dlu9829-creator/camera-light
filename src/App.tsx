/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Plus, Minus, Trash2, Camera, Zap, 
  Copy, Check, Calendar, X, ChevronRight, Wand2, 
  RefreshCw, Send, Clapperboard, Sparkles, Volume2, 
  Lightbulb, BrainCircuit, PlayCircle, Layers, ClipboardCheck, Circle, CheckCircle2, AlertCircle, Tag
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 資料設定 (Inventory Data)
// -----------------------------------------------------------------------------

const INVENTORY = [
  // --- 燈光器材 ---
  { id: 'l1', name: 'Amaran 300X', category: 'light', type: 'single', price: 800, desc: '雙色溫 LED 持續燈，出力大，適合主燈' },
  { id: 'l2', name: 'Godox ML100Bi', category: 'light', type: 'single', price: 300, desc: '輕便手持補光燈，機動性強' },
  { id: 'l3', name: 'Godox ML100R', category: 'light', type: 'single', price: 400, desc: 'RGB 彩色補光燈，營造氛圍首選' },
  { id: 'l4', name: 'Godox LC500R mini', category: 'light', type: 'single', price: 400, desc: '光棒 / 冰燈，適合勾勒輪廓' },
  { id: 'l9', name: 'SL50 燈棒 (兩根一組)', category: 'light', type: 'single', price: 200, desc: '高機動性補光神器。一次出兩根，不分開租借', restricted: true },
  { id: 'l5', name: '一般小型燈架 (基礎)', category: 'light', type: 'single', price: 100, desc: '小型燈架，輕便好攜帶' },
  { id: 'l6', name: '一般小型燈架 (進階)', category: 'light', type: 'single', price: 150, desc: '進階款，穩定度較佳' },
  { id: 'l7', name: '一般小型橫桿', category: 'light', type: 'single', price: 100, desc: '燈架擴充橫桿，適合俯拍' },
  { id: 'l8', name: '小型支架（室內）', category: 'light', type: 'single', price: 50, desc: '超小型支架，限室內輕型燈具' },

  // --- 攝影機身 ---
  { id: 'c1', name: 'Sony A7C2', category: 'camera', type: 'body', price: 1400, desc: '全片幅機身 (可免費任選一顆鏡頭)' },
  { id: 'c2', name: 'Sony FX30', category: 'camera', type: 'body', price: 1400, desc: '電影感機身 (可免費任選一顆鏡頭)' },
  
  // --- 鏡頭清單 ---
  { id: 'lens4', name: 'SONY PZ 18-105mm F4 G', category: 'camera', type: 'lens', price: 400, desc: '電動變焦 G 鏡，錄影必備神器' },
  { id: 'lens3', name: 'Sigma 適馬 65mm F2.0 DG DN', category: 'camera', type: 'lens', price: 350, desc: '高畫質人像特寫，電影感散景' },
  { id: 'lens1', name: 'Sigma 適馬 17mm F4 DG DN', category: 'camera', type: 'lens', price: 300, desc: '超廣角定焦，適合 Vlog/建築' },
  { id: 'lens2', name: 'Sigma 適馬 45mm F2.8 DG', category: 'camera', type: 'lens', price: 300, desc: '人文焦段，極致輕便' },

  // --- 其他攝影配件 ---
  { id: 'c11', name: 'it32 閃光燈', category: 'camera', type: 'single', price: 250, desc: '外接式閃光燈，支援 TTL 與高速同步' },
  { id: 'c3', name: 'SmallRig AD-01 腳架', category: 'camera', type: 'single', price: 200, desc: '液壓雲台腳架' },
  { id: 'c4', name: 'DJI RS3 穩定器', category: 'camera', type: 'single', price: 800, desc: '三軸穩定器，動態拍攝必備' },
  { id: 'c5', name: 'DJI Mic 麥克風', category: 'camera', type: 'single', price: 300, desc: '無線收音系統' },
  { id: 'c6', name: 'VB99-LITE 電池', category: 'camera', type: 'single', price: 100, desc: 'V-mount 鋰電池' },
  { id: 'c7', name: 'X-AIRFLY Mono 專業單腳架', category: 'camera', type: 'single', price: 300, desc: '扳扣式腳踏款' },
  { id: 'c8', name: 'FX30 兔籠', category: 'camera', type: 'single', price: 200, desc: '專用擴充兔籠 (不單租)', restricted: true },
  { id: 'c9', name: '72mm 1/4 黑柔濾鏡', category: 'camera', type: 'single', price: 200, desc: '細膩柔化高光' },
  { id: 'c10', name: '72mm 1-8檔可調 ND 鏡', category: 'camera', type: 'single', price: 200, desc: '強光下控制曝光' },

  // --- 組合優惠 ---
  { id: 'cc1', name: '完整攝影大全套', category: 'camera', type: 'combo', price: 2600, desc: '機身 + 鏡頭 + 腳架 + 麥克風 + 穩定器', isDeal: true },
  { id: 'lc1', name: '全套燈光組合', category: 'light', type: 'combo', price: 1900, desc: '300X + 三盞神牛' },
];

// -----------------------------------------------------------------------------
// 工具函式 (Helper Functions)
// -----------------------------------------------------------------------------

const copyTextToClipboard = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try { document.execCommand('copy'); } catch (err) {}
  document.body.removeChild(textArea);
};

const fetchWithRetry = async (url: string, options: any, retries = 3) => {
  const apiKey = process.env.GEMINI_API_KEY; 
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
  }
  const finalUrl = url.includes('?') ? `${url}&key=${apiKey}` : `${url}?key=${apiKey}`;
  const delays = [1000, 2000, 4000];
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(finalUrl, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
};

const pcmToWav = (pcmBase64: string, sampleRate = 24000) => {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  const buffer = new ArrayBuffer(44 + bytes.length);
  const view = new DataView(buffer);
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + bytes.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, bytes.length, true);
  const dataView = new Uint8Array(buffer, 44);
  dataView.set(bytes);
  return new Blob([buffer], { type: 'audio/wav' });
};

// -----------------------------------------------------------------------------
// 子元件
// -----------------------------------------------------------------------------

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-white"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl w-full flex flex-col items-center text-center space-y-12"
      >
        {/* Logo Placeholder - In a real app, this would be the uploaded logo.png */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white flex items-center justify-center">
              <Camera className="text-black" size={32} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-tighter leading-none">PHOTODIARY</h1>
              <p className="text-xs font-mono tracking-[0.3em] opacity-50">._.THOMAS</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight">
            PRO 器材服務助手
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed font-medium">
            專業攝影與燈光器材租借管理工具，內建 AI 腳本生成、智能推薦與語音朗讀功能。
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-12 py-4 bg-white text-black font-black text-lg rounded-full overflow-hidden transition-all"
        >
          <span className="relative z-10 flex items-center gap-2">
            進入系統 <ChevronRight size={20} />
          </span>
          <motion.div 
            className="absolute inset-0 bg-slate-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          />
        </motion.button>

        <div className="pt-12 grid grid-cols-3 gap-8 opacity-30 grayscale">
          <div className="flex flex-col items-center gap-2">
            <Zap size={24} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Speed</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BrainCircuit size={24} />
            <span className="text-[10px] font-mono uppercase tracking-widest">AI Power</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Layers size={24} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Pro Tools</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ScriptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [desc, setDesc] = useState('');
  const [tone, setTone] = useState('黑科技感');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any[]>([]); 
  const [selectedIdx, setSelectedIdx] = useState(0); 
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateScripts = async () => {
    if (!topic || !desc) return;
    setLoading(true);
    setScripts([]);
    setError(null);

    const systemPrompt = `你是一位專業的短影音導演。生成 3 個不同切入點的爆款腳本。請務必以繁體中文回答。`;
    const userQuery = `【主題】：${topic}\n【說明】：${desc}\n【語氣】：${tone}`;

    try {
      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { 
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  scripts: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        versionTitle: { type: "STRING" },
                        title: { type: "STRING" },
                        sections: {
                          type: "ARRAY",
                          items: {
                            type: "OBJECT",
                            properties: {
                              type: { type: "STRING" },
                              visual: { type: "STRING" },
                              audio: { type: "STRING" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })
        }
      );
      const data = JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
      setScripts(data.scripts || []);
    } catch (err: any) { 
      setError(err.message || "生成失敗"); 
    } finally { 
      setLoading(false); 
    }
  };

  const playTTS = async (text: string, index: number) => {
    setPlayingIdx(index);
    try {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `朗讀：${text}` }] }],
            generationConfig: { 
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } } 
            }
          })
        }
      );
      const audioData = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
      if (audioData) {
        const wavBlob = pcmToWav(audioData);
        const audio = new Audio(URL.createObjectURL(wavBlob));
        audio.onended = () => setPlayingIdx(null);
        audio.play();
      } else {
        setPlayingIdx(null);
      }
    } catch (err) { 
      setPlayingIdx(null); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-sm p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter"><Clapperboard className="text-black" /> AI 爆款腳本助手</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">主題 Topic</label>
            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-black transition-colors" placeholder="輸入影片主題..." value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">說明 Description</label>
            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none h-24 focus:border-black transition-colors" placeholder="描述你的內容需求..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>}
          <button onClick={generateScripts} disabled={loading} className="w-full py-4 bg-black text-white rounded-sm font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "生成中..." : "生成 3 個版本"}
          </button>
        </div>
      </div>
      {scripts.length > 0 && (
        <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-slate-200">
          <div className="flex bg-slate-50 p-1">
            {scripts.map((_, i) => (
              <button key={i} onClick={() => setSelectedIdx(i)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-black rounded-sm transition-all ${selectedIdx === i ? 'bg-black text-white shadow-sm' : 'text-slate-400'}`}>版本 {i+1}</button>
            ))}
          </div>
          <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
            {scripts[selectedIdx]?.sections.map((sec: any, i: number) => (
              <div key={i} className="border-l-2 border-black pl-6 relative group">
                <button onClick={() => playTTS(sec.audio, i)} className={`absolute right-0 top-0 p-2 transition-colors ${playingIdx === i ? 'text-black' : 'text-slate-300 hover:text-black'}`}>
                  {playingIdx === i ? <RefreshCw className="animate-spin" size={16}/> : <Volume2 size={16}/>}
                </button>
                <span className="text-[8px] font-black text-black uppercase tracking-[0.2em] mb-2 block">{sec.type}</span>
                <div className="space-y-2">
                  <p className="text-xs leading-relaxed"><span className="font-black uppercase tracking-tighter mr-2">畫面 Visual:</span>{sec.visual}</p>
                  <p className="text-xs text-slate-500 italic leading-relaxed"><span className="font-black uppercase tracking-tighter mr-2 not-italic">旁白 Audio:</span>「{sec.audio}」</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SmartAssistant = ({ onAddRecommended }: { onAddRecommended: (item: any) => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const askAssistant = async () => {
    if (!query) return;
    setLoading(true);
    const inventoryStr = INVENTORY.map(i => `${i.name}(${i.id}): ${i.desc}`).join('\n');
    const systemPrompt = `你是專業器材顧問。根據使用者場景推薦清單器材。請務必以繁體中文回答。格式：{ "reason": "理由", "recommendedIds": ["id1"] }`;
    try {
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      setRecommendation(JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text || "{}"));
    } catch (err) {} finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-sm p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter"><BrainCircuit /> ✨ AI 智能推薦顧問</h2>
          <div className="relative">
            <input className="w-full px-6 py-4 bg-white/10 backdrop-blur-md rounded-sm text-white outline-none placeholder:text-white/30 border border-white/10 focus:border-white/50 transition-all" placeholder="描述你的拍攝場景 (例如：室內人像、動態追蹤)..." value={query} onChange={e => setQuery(e.target.value)} />
            <button onClick={askAssistant} className="absolute right-2 top-2 p-2 bg-white text-black rounded-sm hover:bg-slate-200 transition-colors">{loading ? <RefreshCw className="animate-spin" /> : <Send size={20}/>}</button>
          </div>
        </div>
      </div>
      {recommendation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-sm p-6 shadow-sm border border-slate-200"
        >
          <h3 className="font-black uppercase tracking-widest text-[10px] flex items-center gap-2 text-black mb-4"><Lightbulb size={14} /> 專業推薦方案 Recommendation</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">{recommendation.reason}</p>
          <div className="grid grid-cols-1 gap-2">
            {recommendation.recommendedIds.map((id: string) => {
              const item = INVENTORY.find(i => i.id === id);
              return item ? (
                <div key={id} className="flex justify-between items-center p-3 bg-slate-50 rounded-sm border border-slate-100 group hover:border-black transition-all">
                  <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                  <button onClick={() => onAddRecommended(item)} className="text-[10px] font-black uppercase tracking-widest text-black hover:underline">+ ADD TO LIST</button>
                </div>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 主程式
// -----------------------------------------------------------------------------

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('rental'); 
  const [activeCategory, setActiveCategory] = useState('camera'); 
  const [cart, setCart] = useState<any[]>([]);
  const [days, setDays] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  // --- 計算邏輯：首顆鏡頭免費 (支援多機身多折抵) ---
  const calculation = useMemo(() => {
    const bodyCount = cart.filter(i => i.type === 'body').reduce((acc, i) => acc + i.quantity, 0);
    const lenses: any[] = [];
    cart.filter(i => i.type === 'lens').forEach(item => {
      for (let k = 0; k < item.quantity; k++) lenses.push({ price: item.price });
    });
    lenses.sort((a, b) => b.price - a.price);
    
    const freeLenses = lenses.slice(0, bodyCount);
    const totalDiscountPerDay = freeLenses.reduce((acc, lens) => acc + lens.price, 0);
    const subTotalPerDay = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = (subTotalPerDay - totalDiscountPerDay) * days;

    return { totalDiscountPerDay, finalTotal, freeLensCount: freeLenses.length };
  }, [cart, days]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, cartId: Date.now(), checked: false }];
    });
  };

  const updateQuantity = (cartId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const toggleCheck = (cartId: number) => setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, checked: !item.checked } : item));
  const removeFromCart = (cartId: number) => setCart(prev => prev.filter(item => item.cartId !== cartId));

  const generateQuoteText = () => {
    let text = `【器材租借詢問單】\n租借天數：${days} 天\n------------------------\n`;
    cart.forEach(item => text += `${item.name} x ${item.quantity}\n`);
    if (calculation.totalDiscountPerDay > 0) text += `(機身搭贈鏡頭折抵: -$${(calculation.totalDiscountPerDay * days).toLocaleString()})\n`;
    text += `------------------------\n總金額：$${calculation.finalTotal.toLocaleString()}\n\n由 PRO 器材助手生成`;
    return text;
  };

  const handleCopyQuote = () => {
    copyTextToClipboard(generateQuoteText());
    setCopyStatus(true);
    setTimeout(() => { setCopyStatus(false); setIsCartOpen(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 font-sans">
      <AnimatePresence>
        {showLanding && <LandingPage onEnter={() => setShowLanding(false)} />}
      </AnimatePresence>

      <header className="sticky top-0 z-50 bg-black text-white shadow-lg px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-sm"><Camera size={18} className="text-black" /></div>
          <div className="flex flex-col -space-y-1">
            <h1 className="font-black text-sm tracking-tighter uppercase">PHOTODIARY</h1>
            <p className="text-[8px] font-mono tracking-[0.2em] opacity-50">._.THOMAS</p>
          </div>
        </div>
        <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
          {['rental', 'script', 'assistant'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-white/50'}`}>
              {tab === 'rental' ? '租借' : tab === 'script' ? '腳本' : '顧問'}
            </button>
          ))}
        </div>
        <button onClick={() => { setIsCartOpen(true); setIsChecklistMode(false); }} className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingCart size={20} />
          {cart.length > 0 && <span className="absolute top-0 right-0 bg-white text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-black">{cart.length}</span>}
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {activeTab === 'rental' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex gap-2 mb-6">
              <button onClick={() => setActiveCategory('camera')} className={`flex-1 py-4 rounded-sm font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border transition-all ${activeCategory === 'camera' ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400'}`}>攝影組</button>
              <button onClick={() => setActiveCategory('light')} className={`flex-1 py-4 rounded-sm font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border transition-all ${activeCategory === 'light' ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400'}`}>燈光組</button>
            </div>
            
            {activeCategory === 'camera' && (
              <div className="mb-6 bg-slate-50 border border-slate-200 p-4 rounded-sm flex items-center gap-3 text-slate-600">
                <Tag size={16} className="flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-tight">優惠方案：租借機身享首顆鏡頭 $0 元（折抵最高價者）</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {INVENTORY.filter(p => p.category === activeCategory).map(item => (
                <motion.div 
                  layout
                  key={item.id} 
                  className="bg-white p-4 rounded-sm border border-slate-200 flex items-center justify-between hover:border-black transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">{item.name}</h3>
                      {item.restricted && <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">Restricted</span>}
                      {item.type === 'lens' && <span className="text-[8px] border border-black text-black px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">Free with body</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.desc}</p>
                    <p className="text-lg font-black text-slate-900 mt-1.5">${item.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ DAY</span></p>
                  </div>
                  <button onClick={() => addToCart(item)} className="p-3 bg-slate-50 group-hover:bg-black group-hover:text-white rounded-sm transition-all active:scale-90"><Plus size={18}/></button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {activeTab === 'script' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ScriptGenerator />
          </motion.div>
        )}
        {activeTab === 'assistant' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SmartAssistant onAddRecommended={addToCart} />
          </motion.div>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <h2 className="font-black text-lg flex items-center gap-3 uppercase tracking-tighter">
                {isChecklistMode ? <ClipboardCheck className="text-black"/> : <ShoppingCart className="text-black" />} 
                {isChecklistMode ? "現場器材清點" : "租借清單"}
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(item => (
                <div key={item.cartId} onClick={() => isChecklistMode && toggleCheck(item.cartId)} className={`flex justify-between items-center p-5 rounded-sm border transition-all ${isChecklistMode ? (item.checked ? 'bg-slate-50 border-slate-200 opacity-40' : 'bg-white border-black cursor-pointer shadow-md') : 'bg-slate-50 border-transparent'}`}>
                  <div className="flex items-center gap-4">
                    {isChecklistMode && (item.checked ? <CheckCircle2 className="text-black"/> : <Circle className="text-slate-300"/>)}
                    <div>
                      <p className={`text-xs font-black uppercase tracking-tight ${item.checked && isChecklistMode ? 'line-through text-slate-400' : 'text-slate-900'}`}>{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">QTY: {item.quantity}</p>
                    </div>
                  </div>
                  {!isChecklistMode && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-sm border shadow-sm">
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, -1); }} className="p-1 hover:text-black"><Minus size={12}/></button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.cartId, 1); }} className="p-1 hover:text-black"><Plus size={12}/></button>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.cartId); }} className="text-slate-300 hover:text-black transition-colors"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              ))}
              {cart.length === 0 && <div className="mt-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">清單目前是空的</div>}
            </div>

            <div className="p-8 border-t space-y-6 bg-white shadow-inner">
              {!isChecklistMode ? (
                <>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">租借總天數 Days</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setDays(d => Math.max(1, d-1))} className="w-8 h-8 rounded-sm border bg-white flex items-center justify-center shadow-sm hover:bg-slate-100 transition-colors">-</button>
                      <span className="font-black text-xl">{days}</span>
                      <button onClick={() => setDays(d => d+1)} className="w-8 h-8 rounded-sm border bg-white flex items-center justify-center shadow-sm hover:bg-slate-100 transition-colors">+</button>
                    </div>
                  </div>
                  {calculation.totalDiscountPerDay > 0 && (
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><Tag size={12}/> 機身搭贈優惠 Discount (x{calculation.freeLensCount})</span>
                      <span className="text-xs text-black font-black">-$${(calculation.totalDiscountPerDay * days).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end px-1 border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">預估總計 Total</span>
                    <span className="text-4xl font-black text-black tracking-tighter">${calculation.finalTotal.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button onClick={() => setIsChecklistMode(true)} disabled={cart.length === 0} className="py-5 bg-slate-100 text-black rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"><ClipboardCheck size={16}/> 現場點交</button>
                    <button onClick={handleCopyQuote} disabled={cart.length === 0} className={`py-5 text-white rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${copyStatus ? 'bg-black' : 'bg-black shadow-2xl shadow-black/20'}`}>{copyStatus ? <Check size={16}/> : <Copy size={16}/>} 複製報價</button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">清點模式：點擊項目確認器材</p>
                  <button onClick={() => setIsChecklistMode(false)} className="w-full py-5 bg-black text-white rounded-sm font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-2xl">返回修改清單</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

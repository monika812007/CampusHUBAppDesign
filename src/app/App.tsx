import { useState, useRef } from "react";
import {
  Home, MessageCircle, Trophy, Briefcase, User, Bell,
  ChevronRight, Search, BookOpen, Code, Database, Terminal, Brain,
  Clock, Calendar, CheckCircle, AlertCircle, Bookmark,
  Upload, Send, Paperclip, Pin, Lock, Eye, EyeOff, ArrowLeft,
  Filter, MapPin, DollarSign, Users, ExternalLink, Zap, Target,
  Award, FileText, Plus, MoreVertical,
  GraduationCap, LogOut, Edit3, X, Check, Info,
  Activity, Globe, Mail, Phone, Building2, Hash,
  Image, Link2, Save, BellOff, Archive, Heart
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "login"
  | "student-home" | "student-chat" | "student-chat-subject"
  | "student-hackathons" | "student-jobs" | "student-profile"
  | "student-notifications"
  | "staff-home" | "staff-class" | "staff-notifications" | "staff-profile"
  | "staff-hackathons";

export type HackathonItem = {
  name: string; organizer: string; theme: string; regDeadline: string;
  eventDate: string; prize: string; teamSize: string; eligibility: string;
  difficulty: string; skills: string[]; type: string; countdown: string;
  url: string; aiSummary: string; addedByStaff?: boolean;
};

const BLUE = "#2563EB";
const BLUE_MID = "#DBEAFE";

// ─── Shared Components ────────────────────────────────────────────────────────

function Avatar({ name, size = 40, bg = BLUE }: { name: string; size?: number; bg?: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

function Badge({ label, color = BLUE }: { label: string; color?: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: color + "18", color }}>{label}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-blue-50 ${className}`}>{children}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: "rgba(15,23,42,0.6)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="bg-white rounded-t-3xl max-h-[88%] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-blue-50 flex-shrink-0">
          <h2 className="font-bold text-slate-800 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100"><X size={16} color="#64748B" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  setTimeout(onDone, 2200);
  return (
    <div className="absolute bottom-24 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
      style={{ background: "#0F172A" }}>
      <CheckCircle size={16} color="#86EFAC" />
      <span className="text-sm text-white font-medium">{msg}</span>
    </div>
  );
}

function BottomNav({ active, onNav, role = "student" }: { active: string; onNav: (s: Screen) => void; role?: "student" | "staff" }) {
  const studentTabs = [
    { icon: Home, label: "Home", screen: "student-home" as Screen },
    { icon: MessageCircle, label: "Chat", screen: "student-chat" as Screen },
    { icon: Trophy, label: "Hackathons", screen: "student-hackathons" as Screen },
    { icon: Briefcase, label: "Jobs", screen: "student-jobs" as Screen },
    { icon: User, label: "Profile", screen: "student-profile" as Screen },
  ];
  const staffTabs = [
    { icon: Home, label: "Dashboard", screen: "staff-home" as Screen },
    { icon: MessageCircle, label: "Classes", screen: "staff-class" as Screen },
    { icon: Trophy, label: "Hackathons", screen: "staff-hackathons" as Screen },
    { icon: Bell, label: "Alerts", screen: "staff-notifications" as Screen },
    { icon: User, label: "Profile", screen: "staff-profile" as Screen },
  ];
  const tabs = role === "staff" ? staffTabs : studentTabs;
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-blue-50 flex items-center z-40"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0 -4px 24px rgba(37,99,235,0.08)" }}>
      {tabs.map(tab => {
        const isActive = active === tab.screen;
        return (
          <button key={tab.screen} onClick={() => onNav(tab.screen)} className="flex-1 flex flex-col items-center py-3 gap-0.5">
            <div className={`p-1.5 rounded-xl ${isActive ? "bg-blue-600" : ""}`}>
              <tab.icon size={20} color={isActive ? "#fff" : "#94A3B8"} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: isActive ? BLUE : "#94A3B8" }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────

function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: BLUE }}>
      <div className="flex flex-col items-center gap-6 px-8">
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center border border-white/30">
          <GraduationCap size={48} color="white" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>CampusHUB</h1>
          <p className="text-blue-100 text-sm mt-2 font-medium">Your complete academic companion</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {["Courses", "Hackathons", "Jobs", "AI-Powered"].map(tag => (
            <span key={tag} className="px-2 py-1 bg-white/15 text-white text-[10px] font-semibold rounded-full">{tag}</span>
          ))}
        </div>
        <button onClick={onNext} className="mt-8 w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-base shadow-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
          Get Started
        </button>
        <p className="text-blue-200 text-xs font-medium">Empowering 10,000+ students across 50+ colleges</p>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (role: "student" | "staff") => void }) {
  const [role, setRole] = useState<"student" | "staff">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [forgot, setForgot] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-40 flex items-end pb-6 px-6" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={22} color="white" />
            <span className="text-white font-extrabold text-xl" style={{ fontFamily: "Outfit, sans-serif" }}>CampusHUB</span>
          </div>
          <p className="text-blue-100 text-sm">Sign in to your account</p>
        </div>
      </div>
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="flex bg-blue-50 rounded-2xl p-1 mb-6">
          {(["student", "staff"] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={role === r ? { background: BLUE, color: "white" } : { color: "#64748B" }}>
              {r === "student" ? "Student" : "Staff / Faculty"}
            </button>
          ))}
        </div>
        {!forgot ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">College Email</label>
                <div className="flex items-center bg-blue-50 rounded-xl px-4 gap-3">
                  <User size={16} color="#93C5FD" />
                  <input type="email" placeholder={role === "student" ? "student@college.edu" : "faculty@college.edu"} value={email}
                    onChange={e => setEmail(e.target.value)} className="flex-1 bg-transparent py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Password</label>
                <div className="flex items-center bg-blue-50 rounded-xl px-4 gap-3">
                  <Lock size={16} color="#93C5FD" />
                  <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={password}
                    onChange={e => setPassword(e.target.value)} className="flex-1 bg-transparent py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none" />
                  <button onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setForgot(true)} className="text-blue-600 text-sm font-semibold mt-3 block text-right w-full">Forgot Password?</button>
            <button onClick={() => onLogin(role)} className="w-full py-4 rounded-2xl font-bold text-white mt-6 text-base"
              style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`, fontFamily: "Outfit, sans-serif" }}>
              Sign In as {role === "student" ? "Student" : "Staff"}
            </button>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">Official college email required</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
              <Info size={16} color={BLUE} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">Use your official institution email ID to access CampusHUB. Contact your administrator if you face login issues.</p>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Reset Password</h2>
            <p className="text-sm text-slate-500 mb-5">Enter your college email to receive a reset link.</p>
            <div className="flex items-center bg-blue-50 rounded-xl px-4 gap-3 mb-4">
              <User size={16} color="#93C5FD" />
              <input type="email" placeholder="your.email@college.edu" className="flex-1 bg-transparent py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none" />
            </div>
            <button className="w-full py-4 rounded-2xl font-bold text-white text-base" style={{ background: BLUE }}>Send Reset Link</button>
            <button onClick={() => setForgot(false)} className="w-full text-center mt-4 text-blue-600 font-semibold text-sm">Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Student Home ─────────────────────────────────────────────────────────────

const todaySchedule = [
  { time: "9:00 AM", subject: "Data Structures", room: "CS-201", type: "Lecture" },
  { time: "11:00 AM", subject: "DBMS Lab", room: "Lab-3", type: "Lab" },
  { time: "2:00 PM", subject: "Operating Systems", room: "CS-305", type: "Lecture" },
  { time: "4:00 PM", subject: "Machine Learning", room: "AI-Lab", type: "Lab" },
];

const upcomingDeadlines = [
  { subject: "Data Structures", task: "Assignment 3 - Graph Algorithms", due: "Tomorrow, 11:59 PM", urgent: true },
  { subject: "DBMS", task: "Mini Project Submission", due: "Mar 18, 5:00 PM", urgent: false },
  { subject: "ML", task: "Lab Report 4", due: "Mar 20, 11:59 PM", urgent: false },
];

const aiTasksData = [
  { priority: 1, task: "Complete DS Assignment 3 (due tomorrow)" },
  { priority: 2, task: "Review DBMS ER diagrams for quiz" },
  { priority: 3, task: "Submit ML attendance form" },
  { priority: 4, task: "Register for TechFest Hackathon" },
];

function StudentHome({ onNav }: { onNav: (s: Screen) => void }) {
  const [tasksDone, setTasksDone] = useState<number[]>([2]);
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="px-5 pt-12 pb-5" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm font-medium">Good morning,</p>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Arjun Sharma 👋</h1>
            <p className="text-blue-200 text-xs mt-0.5">CSE • 3rd Year • Section A</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNav("student-notifications")} className="p-2 bg-white/20 rounded-xl relative">
              <Bell size={20} color="white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <Avatar name="Arjun Sharma" size={40} bg="rgba(255,255,255,0.25)" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Attendance", value: "87%", icon: Activity, good: true },
            { label: "Tasks Done", value: "12/18", icon: CheckCircle, good: true },
            { label: "Assignments", value: "3 due", icon: AlertCircle, good: false },
          ].map(stat => (
            <div key={stat.label} className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
              <stat.icon size={16} color={stat.good ? "#86EFAC" : "#FCA5A5"} className="mx-auto mb-1" />
              <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
              <p className="text-blue-200 text-[10px] mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: BLUE_MID }}>
                <Zap size={14} color={BLUE} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>AI Priority Tasks</h3>
            </div>
            <Badge label="AI" color="#7C3AED" />
          </div>
          <div className="space-y-2">
            {aiTasksData.map((t, i) => {
              const done = tasksDone.includes(i);
              return (
                <button key={i} onClick={() => setTasksDone(prev => done ? prev.filter(x => x !== i) : [...prev, i])} className="flex items-center gap-3 w-full text-left">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                    {done && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <p className={`text-xs leading-tight flex-1 ${done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.task}</p>
                  <span className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: BLUE_MID, color: BLUE }}>{t.priority}</span>
                </button>
              );
            })}
          </div>
        </Card>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{"Today's Schedule"}</h3>
            <span className="text-xs text-blue-600 font-semibold">Thursday, Mar 14</span>
          </div>
          <div className="space-y-2">
            {todaySchedule.map((cls, i) => (
              <Card key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-1 h-12 rounded-full" style={{ background: i === 0 ? "#10B981" : BLUE }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{cls.subject}</p>
                  <p className="text-xs text-slate-400 font-medium">{cls.room} • {cls.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{cls.time}</p>
                  {i === 0 && <Badge label="Now" color="#10B981" />}
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Upcoming Deadlines</h3>
          <div className="space-y-2">
            {upcomingDeadlines.map((d, i) => (
              <Card key={i} className={`px-4 py-3 ${d.urgent ? "border-red-100" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${d.urgent ? "bg-red-50" : "bg-blue-50"}`}>
                    <FileText size={14} color={d.urgent ? "#EF4444" : BLUE} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400">{d.subject}</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{d.task}</p>
                    <p className={`text-xs font-medium mt-0.5 ${d.urgent ? "text-red-500" : "text-slate-400"}`}>{d.urgent ? "⚠️ " : ""}{d.due}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Quick Access</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: MessageCircle, label: "Chat", screen: "student-chat" as Screen, color: "#2563EB" },
              { icon: Trophy, label: "Hackathons", screen: "student-hackathons" as Screen, color: "#7C3AED" },
              { icon: Briefcase, label: "Jobs", screen: "student-jobs" as Screen, color: "#059669" },
              { icon: Bell, label: "Alerts", screen: "student-notifications" as Screen, color: "#F59E0B" },
            ].map(action => (
              <button key={action.label} onClick={() => onNav(action.screen)} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: action.color + "15" }}>
                  <action.icon size={22} color={action.color} />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="student-home" onNav={onNav} />
    </div>
  );
}

// ─── Chat List ─────────────────────────────────────────────────────────────────

const subjectsData = [
  { name: "Data Structures", code: "CS301", icon: Code, color: "#2563EB", unread: 3, lastMsg: "Assignment 3 deadline extended", time: "2m ago", staff: "Dr. Priya Menon", students: 42 },
  { name: "DBMS", code: "CS302", icon: Database, color: "#7C3AED", unread: 1, lastMsg: "Lab manual uploaded", time: "15m ago", staff: "Dr. Suresh Kumar", students: 38 },
  { name: "Operating Systems", code: "CS303", icon: Terminal, color: "#059669", unread: 0, lastMsg: "Quiz on Friday - Ch 5 & 6", time: "1h ago", staff: "Prof. Anita Raj", students: 40 },
  { name: "Python Programming", code: "CS201", icon: Code, color: "#F59E0B", unread: 7, lastMsg: "New study material added", time: "2h ago", staff: "Dr. Meena Rao", students: 45 },
  { name: "Machine Learning", code: "CS401", icon: Brain, color: "#EF4444", unread: 0, lastMsg: "Project guidelines shared", time: "Yesterday", staff: "Dr. Priya Menon", students: 35 },
];

function ChatList({ onNav, onSubject }: { onNav: (s: Screen) => void; onSubject: (idx: number) => void }) {
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({ 0: 3, 1: 1, 3: 7 });
  const [toast, setToast] = useState("");

  const filtered = subjectsData.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase()) ||
    s.lastMsg.toLowerCase().includes(query.toLowerCase())
  );

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === "Mark all as read") {
      setUnreadMap({});
      setToast("All chats marked as read");
    } else if (action === "Mute notifications") {
      setToast("Notifications muted for 8 hours");
    } else if (action === "Archived chats") {
      setToast("No archived chats");
    } else if (action === "Settings") {
      setToast("Opening chat settings...");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Subject Chat</h1>
            <p className="text-xs text-slate-400">{filtered.length} subjects</p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onNav("student-notifications")} className="p-2 rounded-xl hover:bg-blue-50 relative">
              <Bell size={20} color="#64748B" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-xl hover:bg-blue-50">
                <MoreVertical size={20} color="#64748B" />
              </button>
              {showMenu && (
                <>
                  <div className="absolute inset-0 top-auto -left-48 right-0 z-50" style={{ top: "calc(100% + 4px)" }}>
                    <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden w-52">
                      {[
                        { label: "Mark all as read", icon: CheckCircle },
                        { label: "Mute notifications", icon: BellOff },
                        { label: "Archived chats", icon: Archive },
                        { label: "Settings", icon: Save },
                      ].map(item => (
                        <button key={item.label} onClick={() => handleMenuAction(item.label)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 font-medium text-left">
                          <item.icon size={15} color="#64748B" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-blue-50 rounded-xl px-3 gap-2">
          <Search size={15} color="#94A3B8" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
            placeholder="Search subjects, messages..." />
          {query && <button onClick={() => setQuery("")}><X size={14} color="#94A3B8" /></button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Search size={36} color="#CBD5E1" />
            <p className="text-slate-400 text-sm font-medium">No results for "{query}"</p>
            <button onClick={() => setQuery("")} className="text-xs font-bold" style={{ color: BLUE }}>Clear search</button>
          </div>
        ) : (
          filtered.map((sub) => {
            const idx = subjectsData.indexOf(sub);
            const unread = unreadMap[idx] ?? 0;
            return (
              <button key={idx} onClick={() => onSubject(idx)} className="w-full text-left">
                <Card className="flex items-center gap-4 px-4 py-3.5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: sub.color + "15" }}>
                    <sub.icon size={22} color={sub.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-bold text-slate-800">{sub.name}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{sub.time}</span>
                    </div>
                    <p className="text-xs text-slate-400">{sub.code} • {sub.staff}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{sub.lastMsg}</p>
                  </div>
                  {unread > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: BLUE }}>
                      <span className="text-[10px] text-white font-bold">{unread}</span>
                    </div>
                  )}
                </Card>
              </button>
            );
          })
        )}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="student-chat" onNav={onNav} />
    </div>
  );
}

// ─── Chat Subject ─────────────────────────────────────────────────────────────

type ChatMsg = { id: number; sender: string; role: "staff" | "student" | "me"; text: string; time: string; file?: boolean; fileName?: string };

const initAnnouncements: ChatMsg[] = [
  { id: 1, sender: "Dr. Priya Menon", role: "staff", text: "Assignment 3 on Graph Algorithms is due tomorrow at 11:59 PM. Please submit via the portal.", time: "9:15 AM" },
  { id: 2, sender: "Rahul Kumar", role: "student", text: "Ma'am, should we use DFS or BFS for the shortest path question?", time: "10:02 AM" },
  { id: 3, sender: "Dr. Priya Menon", role: "staff", text: "Use BFS for shortest path and DFS for cycle detection. Check the uploaded notes.", time: "10:05 AM" },
  { id: 4, sender: "Sneha Patel", role: "student", text: "DS_Graph_Algorithms.pdf", time: "10:30 AM", file: true, fileName: "DS_Graph_Algorithms.pdf" },
  { id: 5, sender: "Arjun Sharma", role: "me", text: "Thanks! Really helpful.", time: "10:35 AM" },
];
const initDiscussions: ChatMsg[] = [
  { id: 1, sender: "Karthik Raj", role: "student", text: "Can anyone explain the difference between Prim's and Kruskal's algorithm?", time: "8:10 AM" },
  { id: 2, sender: "Divya S", role: "student", text: "Prim's grows the MST from a vertex. Kruskal's adds edges in sorted order. Both produce MST.", time: "8:25 AM" },
  { id: 3, sender: "Arjun Sharma", role: "me", text: "Yes, and Kruskal uses Union-Find for cycle detection!", time: "8:30 AM" },
  { id: 4, sender: "Dr. Priya Menon", role: "staff", text: "Great explanation! Both are important for the exam. Practice both implementations.", time: "9:00 AM" },
];

const subjectMaterials = [
  { name: "DS_Graph_Algorithms.pdf", size: "2.4 MB", date: "Mar 12", type: "pdf", url: "https://nptel.ac.in/courses/106/106/106106127/" },
  { name: "Unit3_Trees_Notes.pdf", size: "1.8 MB", date: "Mar 5", type: "pdf", url: "https://www.geeksforgeeks.org/data-structures/" },
  { name: "Practice_Problems_Set4.pdf", size: "0.9 MB", date: "Feb 28", type: "pdf", url: "https://leetcode.com/problemset/all/" },
  { name: "DS_Lecture_Slides_Unit4.pptx", size: "5.1 MB", date: "Feb 20", type: "ppt", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
  { name: "GeeksForGeeks - Graphs", size: "", date: "Mar 10", type: "link", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
];

function ChatSubject({ subjectIdx, onBack }: { subjectIdx: number; onBack: () => void }) {
  const sub = subjectsData[subjectIdx];
  const [tab, setTab] = useState(0);
  const [announcements, setAnnouncements] = useState<ChatMsg[]>(initAnnouncements);
  const [discussions, setDiscussions] = useState<ChatMsg[]>(initDiscussions);
  const [msg, setMsg] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMsgs = tab === 0 ? announcements : discussions;
  const setCurrentMsgs = tab === 0 ? setAnnouncements : setDiscussions;

  const visibleMsgs = searchQ.trim()
    ? currentMsgs.filter(m => m.text.toLowerCase().includes(searchQ.toLowerCase()) || m.sender.toLowerCase().includes(searchQ.toLowerCase()))
    : currentMsgs;

  const sendMsg = () => {
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCurrentMsgs(prev => [...prev, { id: Date.now(), sender: "Arjun Sharma", role: "me", text: msg.trim(), time }]);
    setMsg("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCurrentMsgs(prev => [...prev, { id: Date.now(), sender: "Arjun Sharma", role: "me", text: file.name, time, file: true, fileName: file.name }]);
    setShowAttach(false);
    setToast(`"${file.name}" attached successfully`);
    e.target.value = "";
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === "info") setShowInfo(true);
    else if (action === "search") setShowSearch(true);
    else if (action === "mute") setToast("Group muted for 24 hours");
    else if (action === "members") setShowInfo(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.zip" />

      <div className="bg-white border-b border-blue-50 sticky top-0 z-40">
        {showSearch ? (
          <div className="flex items-center gap-2 px-4 pt-12 pb-3">
            <button onClick={() => { setShowSearch(false); setSearchQ(""); }} className="p-2 rounded-xl">
              <ArrowLeft size={20} color={BLUE} />
            </button>
            <div className="flex-1 flex items-center bg-blue-50 rounded-xl px-3 gap-2">
              <Search size={15} color="#94A3B8" />
              <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search messages..." className="flex-1 py-2.5 text-sm outline-none bg-transparent text-slate-700" />
              {searchQ && <button onClick={() => setSearchQ("")}><X size={13} color="#94A3B8" /></button>}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 pt-12 pb-3">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-blue-50"><ArrowLeft size={20} color={BLUE} /></button>
            <button onClick={() => setShowInfo(true)} className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sub.color + "20" }}>
                <sub.icon size={20} color={sub.color} />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{sub.name}</h2>
                <p className="text-xs text-slate-400">{sub.code} • {sub.staff} • {sub.students} students</p>
              </div>
            </button>
            <button onClick={() => setShowSearch(true)} className="p-2 rounded-xl hover:bg-blue-50"><Search size={18} color="#94A3B8" /></button>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-xl hover:bg-blue-50"><MoreVertical size={18} color="#94A3B8" /></button>
              {showMenu && (
                <>
                  <div className="absolute right-0 bg-white rounded-2xl shadow-xl border border-blue-50 z-50 overflow-hidden w-44" style={{ top: "calc(100% + 4px)" }}>
                    {[
                      { label: "Group Info", key: "info", icon: Info },
                      { label: "Search Messages", key: "search", icon: Search },
                      { label: "View Members", key: "members", icon: Users },
                      { label: "Mute Group", key: "mute", icon: BellOff },
                    ].map(item => (
                      <button key={item.key} onClick={() => handleMenuAction(item.key)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 font-medium text-left">
                        <item.icon size={14} color="#64748B" />{item.label}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex px-4 pb-1 gap-1">
          {["Announcements", "Discussions", "Materials"].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="flex-1 text-xs font-semibold py-2 border-b-2 transition-all"
              style={tab === i ? { borderColor: BLUE, color: BLUE } : { borderColor: "transparent", color: "#94A3B8" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Pinned */}
      {tab === 0 && (
        <div className="mx-4 mt-3 mb-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <Pin size={12} color="#F59E0B" />
            <p className="text-xs text-amber-700 font-medium flex-1 truncate">📌 Assignment 3 due tomorrow at 11:59 PM</p>
          </div>
        </div>
      )}

      {/* Search results banner */}
      {showSearch && searchQ && (
        <div className="mx-4 my-2 px-3 py-1.5 bg-blue-50 rounded-xl">
          <p className="text-xs font-semibold" style={{ color: BLUE }}>{visibleMsgs.length} result{visibleMsgs.length !== 1 ? "s" : ""} for "{searchQ}"</p>
        </div>
      )}

      {/* Materials tab */}
      {tab === 2 ? (
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1 mb-2">Study Materials — tap to open</p>
          {subjectMaterials.map((m, i) => (
            <button key={i} onClick={() => window.open(m.url, "_blank")} className="w-full text-left">
              <Card className="flex items-center gap-3 px-4 py-3 active:bg-blue-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.type === "pdf" ? "bg-red-50" : m.type === "ppt" ? "bg-orange-50" : "bg-blue-50"}`}>
                  {m.type === "link" ? <Link2 size={18} color={BLUE} /> : <FileText size={18} color={m.type === "pdf" ? "#EF4444" : "#F59E0B"} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.size ? `${m.size} • ` : ""}{m.date}</p>
                </div>
                <ExternalLink size={14} color={BLUE} />
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 pb-2 space-y-3">
            {visibleMsgs.length === 0 && searchQ ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Search size={30} color="#CBD5E1" />
                <p className="text-slate-400 text-sm">No messages matching "{searchQ}"</p>
              </div>
            ) : (
              visibleMsgs.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === "me" ? "flex-row-reverse" : "flex-row"}`}>
                  {m.role !== "me" && <Avatar name={m.sender} size={32} bg={m.role === "staff" ? BLUE : "#7C3AED"} />}
                  <div className={`max-w-[78%] flex flex-col gap-0.5 ${m.role === "me" ? "items-end" : "items-start"}`}>
                    {m.role !== "me" && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-600">{m.sender}</span>
                        {m.role === "staff" && <Badge label="Faculty" color={BLUE} />}
                      </div>
                    )}
                    <div className={`px-3.5 py-2.5 rounded-2xl ${m.role === "me" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                      style={m.role === "me" ? { background: BLUE, color: "white" } : { background: "white", color: "#0F172A" }}>
                      {m.file ? (
                        <div className="flex items-center gap-2">
                          <FileText size={14} color={m.role === "me" ? "white" : BLUE} />
                          <span className="text-xs font-medium underline">{m.fileName || m.text}</span>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed">{m.text}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Attach options */}
          {showAttach && (
            <div className="mx-3 mb-1 bg-white rounded-2xl shadow-xl border border-blue-100 p-3 grid grid-cols-4 gap-3">
              {[
                { icon: FileText, label: "Document", accept: ".pdf,.doc,.docx,.ppt,.pptx,.txt" },
                { icon: Image, label: "Image", accept: ".png,.jpg,.jpeg,.gif,.webp" },
                { icon: Link2, label: "PDF", accept: ".pdf" },
                { icon: Globe, label: "Any File", accept: "*" },
              ].map(a => (
                <button key={a.label} onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = a.accept;
                    fileInputRef.current.click();
                  }
                }} className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: BLUE + "15" }}>
                    <a.icon size={20} color={BLUE} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">{a.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="bg-white border-t border-blue-50 px-3 py-3 mb-16">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAttach(!showAttach)}
                className="p-2 rounded-xl flex-shrink-0 transition-all"
                style={{ background: showAttach ? BLUE : "#EFF6FF" }}>
                <Paperclip size={18} color={showAttach ? "white" : BLUE} />
              </button>
              <div className="flex-1 flex items-center bg-blue-50 rounded-xl px-3">
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  placeholder={tab === 0 ? "Write a message..." : "Ask a doubt or reply..."}
                  className="flex-1 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent" />
              </div>
              <button onClick={sendMsg} className="p-2.5 rounded-xl flex-shrink-0"
                style={{ background: msg.trim() ? BLUE : "#E2E8F0" }}>
                <Send size={18} color={msg.trim() ? "white" : "#94A3B8"} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Group Info Modal */}
      {showInfo && (
        <Modal title={sub.name} onClose={() => setShowInfo(false)}>
          <div className="pt-3 space-y-4">
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: sub.color + "20" }}>
                <sub.icon size={30} color={sub.color} />
              </div>
              <p className="font-bold text-slate-800 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{sub.name}</p>
              <p className="text-xs text-slate-400">{sub.code} • {sub.students} students</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Faculty", value: sub.staff },
                { label: "Subject Code", value: sub.code },
                { label: "Total Students", value: String(sub.students) },
                { label: "Department", value: "Computer Science & Engineering" },
                { label: "Semester", value: "6th Semester — 2024" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-blue-50">
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Members</p>
              <div className="space-y-2">
                {["Dr. Priya Menon (Faculty)", "Arjun Sharma", "Rahul Kumar", "Sneha Patel", "Karthik Raj", "Divya S"].map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar name={m} size={32} bg={i === 0 ? BLUE : "#7C3AED"} />
                    <span className="text-sm text-slate-700 font-medium">{m}</span>
                    {i === 0 && <Badge label="Faculty" color={BLUE} />}
                  </div>
                ))}
                <p className="text-xs text-slate-400 text-center pt-1">+ {sub.students - 5} more students</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      {showAttach && <div className="fixed inset-0 z-30" onClick={() => setShowAttach(false)} />}
    </div>
  );
}

// ─── Hackathons ────────────────────────────────────────────────────────────────

const difficultyColors: Record<string, string> = { Beginner: "#10B981", Intermediate: "#F59E0B", Advanced: "#EF4444" };

const defaultHackathons: HackathonItem[] = [
  {
    name: "TechFest 2024 - AI Innovation", organizer: "IIT Bombay", theme: "Artificial Intelligence",
    regDeadline: "Mar 20, 2024", eventDate: "Apr 5-7, 2024", prize: "₹5,00,000", teamSize: "2-4",
    eligibility: "UG / PG Students", difficulty: "Advanced", skills: ["Python", "ML", "Deep Learning"],
    type: "External", countdown: "6 days left", url: "https://www.techfest.org",
    aiSummary: "AI-focused hackathon by IIT Bombay. Build innovative ML solutions for real-world problems.",
  },
  {
    name: "CampusCode Sprint", organizer: "SVCE Internal", theme: "Web Development",
    regDeadline: "Mar 16, 2024", eventDate: "Mar 22, 2024", prize: "₹50,000", teamSize: "2-3",
    eligibility: "All Years", difficulty: "Beginner", skills: ["React", "Node.js", "HTML/CSS"],
    type: "Internal", countdown: "2 days left", url: "",
    aiSummary: "Internal college hackathon open to all years. Perfect for beginners wanting to build their first web project.",
  },
  {
    name: "Smart India Hackathon", organizer: "Ministry of Education", theme: "Government Problem Statements",
    regDeadline: "Apr 1, 2024", eventDate: "Apr 20-21, 2024", prize: "₹1,00,000", teamSize: "6",
    eligibility: "UG Students", difficulty: "Intermediate", skills: ["IoT", "AI", "Blockchain"],
    type: "External", countdown: "18 days left", url: "https://www.sih.gov.in",
    aiSummary: "National-level hackathon with government problem statements. High prestige event.",
  },
];

function HackathonScreen({ onNav, hackathons, setHackathons }: {
  onNav: (s: Screen) => void;
  hackathons: HackathonItem[];
  setHackathons: React.Dispatch<React.SetStateAction<HackathonItem[]>>;
}) {
  const [tab, setTab] = useState<"All" | "Internal" | "External">("All");
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterDiff, setFilterDiff] = useState<string[]>([]);
  const [showRegModal, setShowRegModal] = useState<number | null>(null);
  const [regForm, setRegForm] = useState({ team: "", leader: "", members: "", idea: "" });
  const [toast, setToast] = useState("");

  const filtered = hackathons.filter(h => {
    const matchTab = tab === "All" || h.type === tab;
    const matchQuery = !query || h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.organizer.toLowerCase().includes(query.toLowerCase()) ||
      h.theme.toLowerCase().includes(query.toLowerCase()) ||
      h.skills.some(s => s.toLowerCase().includes(query.toLowerCase()));
    const matchDiff = filterDiff.length === 0 || filterDiff.includes(h.difficulty);
    return matchTab && matchQuery && matchDiff;
  });

  const toggleDiff = (d: string) => setFilterDiff(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Hackathons</h1>
            <p className="text-xs text-slate-400">{filtered.length} events found</p>
          </div>
          <button onClick={() => onNav("student-notifications")} className="p-2 rounded-xl hover:bg-blue-50 relative">
            <Bell size={20} color="#64748B" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
        <div className="flex items-center bg-blue-50 rounded-xl px-3 gap-2 mb-3">
          <Search size={15} color="#94A3B8" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 py-2.5 text-sm placeholder-slate-400 outline-none bg-transparent text-slate-700"
            placeholder="Search name, theme, skills..." />
          {query && <button onClick={() => setQuery("")}><X size={13} color="#94A3B8" /></button>}
          <button onClick={() => setShowFilter(!showFilter)}
            className="p-1.5 rounded-lg"
            style={{ background: filterDiff.length > 0 ? BLUE : "white" }}>
            <Filter size={14} color={filterDiff.length > 0 ? "white" : BLUE} />
          </button>
        </div>
        {showFilter && (
          <div className="mb-3 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 mb-2">Filter by Difficulty</p>
            <div className="flex gap-2 flex-wrap">
              {["Beginner", "Intermediate", "Advanced"].map(d => (
                <button key={d} onClick={() => toggleDiff(d)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                  style={filterDiff.includes(d)
                    ? { background: difficultyColors[d], color: "white", borderColor: difficultyColors[d] }
                    : { background: "white", color: "#64748B", borderColor: "#E2E8F0" }}>
                  {d}
                </button>
              ))}
              {filterDiff.length > 0 && (
                <button onClick={() => setFilterDiff([])} className="px-3 py-1.5 rounded-full text-xs font-bold text-red-500 bg-red-50">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {(["All", "Internal", "External"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={tab === t ? { background: BLUE, color: "white" } : { background: "white", color: "#64748B" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Trophy size={36} color="#CBD5E1" />
            <p className="text-slate-400 text-sm font-medium">No hackathons match your filters</p>
            <button onClick={() => { setQuery(""); setFilterDiff([]); setTab("All"); }}
              className="text-xs font-bold" style={{ color: BLUE }}>Clear all filters</button>
          </div>
        )}
        {filtered.map((h) => {
          const idx = hackathons.indexOf(h);
          return (
            <Card key={idx} className="overflow-hidden">
              <div className="p-4">
                {h.addedByStaff && (
                  <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-green-50 rounded-xl w-fit">
                    <GraduationCap size={11} color="#059669" />
                    <span className="text-[10px] font-bold text-green-700">Posted by Faculty</span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge label={h.type} color={h.type === "Internal" ? "#7C3AED" : "#2563EB"} />
                      <Badge label={h.difficulty} color={difficultyColors[h.difficulty]} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{h.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{h.organizer} • {h.theme}</p>
                  </div>
                  <button onClick={() => setBookmarked(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx])}
                    className="p-1.5 rounded-xl flex-shrink-0" style={{ background: bookmarked.includes(idx) ? BLUE_MID : "#F8FAFF" }}>
                    <Bookmark size={16} color={bookmarked.includes(idx) ? BLUE : "#94A3B8"} fill={bookmarked.includes(idx) ? BLUE : "none"} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { icon: Calendar, label: "Reg Deadline", value: h.regDeadline },
                    { icon: Clock, label: "Event Date", value: h.eventDate },
                    { icon: Award, label: "Prize Pool", value: h.prize },
                    { icon: Users, label: "Team Size", value: h.teamSize + " members" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
                      <item.icon size={12} color="#64748B" className="flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-400 font-medium uppercase">{item.label}</p>
                        <p className="text-xs font-semibold text-slate-700 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {h.skills.map(s => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{s}</span>)}
                </div>
                <div className="bg-purple-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={11} color="#7C3AED" />
                    <span className="text-[10px] font-bold text-purple-600">AI Summary</span>
                  </div>
                  <p className="text-xs text-purple-700 leading-relaxed">{h.aiSummary}</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={12} color="#EF4444" />
                  <span className="text-xs font-bold text-red-500">{h.countdown}</span>
                  <span className="text-xs text-slate-400">• {h.eligibility}</span>
                </div>
                <button
                  onClick={() => {
                    if (h.type === "Internal" || !h.url) setShowRegModal(idx);
                    else window.open(h.url, "_blank");
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${BLUE}, #1D4ED8)` }}>
                  Register Now {h.type === "External" && h.url && <ExternalLink size={13} color="white" />}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {showRegModal !== null && hackathons[showRegModal] && (
        <Modal title={`Register: ${hackathons[showRegModal].name}`} onClose={() => setShowRegModal(null)}>
          <div className="space-y-3 pt-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-700 mb-1">Internal Hackathon Registration</p>
              <p className="text-xs text-slate-600 leading-relaxed">Fill in your team details. The coordinator will confirm your spot via college email.</p>
            </div>
            {[
              { label: "Team Name", key: "team", ph: "e.g. AlgoMinds" },
              { label: "Team Leader", key: "leader", ph: "Your full name" },
              { label: "Team Members", key: "members", ph: "Member2, Member3 (comma-separated)" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{f.label}</label>
                <input value={(regForm as any)[f.key]} onChange={e => setRegForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.ph} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Project Idea</label>
              <textarea value={regForm.idea} onChange={e => setRegForm(prev => ({ ...prev, idea: e.target.value }))}
                placeholder="Brief description of your project idea..."
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-16" />
            </div>
            <button onClick={() => { setShowRegModal(null); setToast("Registration submitted successfully!"); }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>
              Submit Registration
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="student-hackathons" onNav={onNav} />
    </div>
  );
}

// ─── Job Seek ──────────────────────────────────────────────────────────────────

const jobsData = [
  { company: "Google", role: "SWE Intern", type: "Internship", stipend: "₹80,000/month", location: "Bangalore", mode: "Hybrid", skills: ["Python", "Algorithms", "System Design"], deadline: "Mar 25, 2024", eligibility: "3rd/4th Year CSE", match: 92, logo: "G", logoColor: "#4285F4", url: "https://careers.google.com" },
  { company: "Microsoft", role: "Azure Cloud Intern", type: "Internship", stipend: "₹70,000/month", location: "Hyderabad", mode: "Onsite", skills: ["Azure", "Python", "DevOps"], deadline: "Apr 5, 2024", eligibility: "3rd Year CSE/IT", match: 85, logo: "M", logoColor: "#00A4EF", url: "https://careers.microsoft.com" },
  { company: "Flipkart", role: "Data Science Intern", type: "Internship", stipend: "₹50,000/month", location: "Bangalore", mode: "Remote", skills: ["ML", "Python", "SQL"], deadline: "Mar 30, 2024", eligibility: "2nd/3rd Year", match: 78, logo: "F", logoColor: "#2874F0", url: "https://www.flipkartcareers.com" },
  { company: "Infosys", role: "Full Stack Developer", type: "Full-time", stipend: "₹6.5 LPA", location: "Chennai", mode: "Onsite", skills: ["React", "Node.js", "Java"], deadline: "Apr 15, 2024", eligibility: "2024 Graduates", match: 70, logo: "I", logoColor: "#007CC3", url: "https://www.infosys.com/careers" },
  { company: "Amazon", role: "SDE Intern", type: "Internship", stipend: "₹90,000/month", location: "Hyderabad", mode: "Onsite", skills: ["DSA", "Java", "AWS"], deadline: "Apr 10, 2024", eligibility: "3rd Year CSE", match: 88, logo: "A", logoColor: "#FF9900", url: "https://www.amazon.jobs" },
];

function JobSeekScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [tab, setTab] = useState<"All" | "Internship" | "Full-time">("All");
  const [saved, setSaved] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const filtered = jobsData.filter(j => tab === "All" || j.type === tab);
  const modeColor: Record<string, string> = { Remote: "#10B981", Hybrid: "#F59E0B", Onsite: "#2563EB" };

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Job Seek</h1>
            <p className="text-xs text-slate-400">AI-powered opportunities</p>
          </div>
          <button onClick={() => onNav("student-notifications")} className="p-2 rounded-xl hover:bg-blue-50 relative">
            <Bell size={20} color="#64748B" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
        <div className="flex gap-2">
          {(["All", "Internship", "Full-time"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={tab === t ? { background: BLUE, color: "white" } : { background: "white", color: "#64748B" }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 mb-1">
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, #7C3AED, #5B21B6)` }}>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain size={20} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>AI Match Active</p>
            <p className="text-purple-200 text-xs">Found 24 jobs matching your profile & skills</p>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.6)" className="flex-shrink-0" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 py-3 space-y-3">
        {filtered.map((job, i) => {
          const isSaved = saved.includes(i);
          return (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-white text-lg"
                  style={{ background: job.logoColor, fontFamily: "Outfit, sans-serif" }}>{job.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{job.role}</h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                      <Target size={10} color="#10B981" />
                      <span className="text-[10px] font-bold text-green-600">{job.match}% match</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{job.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label={job.type} color={job.type === "Internship" ? "#7C3AED" : BLUE} />
                    <Badge label={job.mode} color={modeColor[job.mode]} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[{ icon: DollarSign, value: job.stipend }, { icon: MapPin, value: job.location }, { icon: Calendar, value: "Due " + job.deadline }, { icon: GraduationCap, value: job.eligibility }].map((item, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <item.icon size={11} color="#94A3B8" className="flex-shrink-0" />
                    <span className="text-[11px] text-slate-500 truncate">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.map(s => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{s}</span>)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSaved(prev => isSaved ? prev.filter(x => x !== i) : [...prev, i]); setToast(isSaved ? "Removed from saved" : "Job saved!"); }}
                  className="flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  style={isSaved ? { background: BLUE + "18", borderColor: BLUE, color: BLUE } : { borderColor: "#E2E8F0", color: "#64748B" }}>
                  <Heart size={12} color={isSaved ? BLUE : "#94A3B8"} fill={isSaved ? BLUE : "none"} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button onClick={() => window.open(job.url, "_blank")}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-1.5" style={{ background: BLUE }}>
                  Apply Now <ExternalLink size={11} color="white" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="student-jobs" onNav={onNav} />
    </div>
  );
}

// ─── Student Profile ──────────────────────────────────────────────────────────

const weekTimetable: Record<string, { time: string; subject: string; room: string; type: string }[]> = {
  Monday: [
    { time: "9:00 AM", subject: "Data Structures", room: "CS-201", type: "Lecture" },
    { time: "11:00 AM", subject: "Python Programming", room: "CS-102", type: "Lecture" },
    { time: "2:00 PM", subject: "Machine Learning", room: "AI-Lab", type: "Lab" },
  ],
  Tuesday: [
    { time: "9:00 AM", subject: "DBMS", room: "CS-203", type: "Lecture" },
    { time: "11:00 AM", subject: "Operating Systems", room: "CS-305", type: "Lecture" },
    { time: "2:00 PM", subject: "Python Lab", room: "Lab-2", type: "Lab" },
  ],
  Wednesday: [
    { time: "9:00 AM", subject: "Data Structures", room: "CS-201", type: "Lecture" },
    { time: "11:00 AM", subject: "DBMS Lab", room: "Lab-3", type: "Lab" },
    { time: "3:00 PM", subject: "Operating Systems", room: "CS-305", type: "Lecture" },
  ],
  Thursday: [
    { time: "9:00 AM", subject: "Machine Learning", room: "AI-101", type: "Lecture" },
    { time: "11:00 AM", subject: "Data Structures", room: "CS-201", type: "Lecture" },
    { time: "2:00 PM", subject: "DBMS", room: "CS-203", type: "Lecture" },
    { time: "4:00 PM", subject: "ML Lab", room: "AI-Lab", type: "Lab" },
  ],
  Friday: [
    { time: "9:00 AM", subject: "Operating Systems", room: "CS-305", type: "Lecture" },
    { time: "11:00 AM", subject: "Python Programming", room: "CS-102", type: "Lecture" },
    { time: "2:00 PM", subject: "Machine Learning", room: "AI-101", type: "Lecture" },
  ],
  Saturday: [
    { time: "9:00 AM", subject: "Data Structures Lab", room: "Lab-1", type: "Lab" },
    { time: "12:00 PM", subject: "Mini Project Review", room: "CS-201", type: "Lab" },
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = "Thursday";

const aiWeeklyTasks = [
  { day: "Today (Thu)", tasks: ["Complete DS Assignment 3 (due tomorrow)", "Prepare for ML Lab at 4 PM"], urgent: true },
  { day: "Friday", tasks: ["Submit DS Assignment 3 by 11:59 PM", "Prepare OS quiz material — Ch 5&6"], urgent: true },
  { day: "Saturday", tasks: ["DS Lab — practice BFS/DFS implementations", "Mini Project slide preparation"], urgent: false },
  { day: "Monday", tasks: ["Revise Python functions for Monday lecture", "Start DBMS mini project work"], urgent: false },
];

function StudentProfile({ onNav, onLogout }: { onNav: (s: Screen) => void; onLogout: () => void }) {
  const [selectedDay, setSelectedDay] = useState(today);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>My Profile</h1>
        <div className="flex gap-1">
          <button className="p-2 rounded-xl hover:bg-blue-50"><Edit3 size={18} color="#64748B" /></button>
          <button onClick={() => onNav("student-notifications")} className="p-2 rounded-xl hover:bg-blue-50 relative">
            <Bell size={18} color="#64748B" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="h-28" style={{ background: `linear-gradient(135deg, ${BLUE}, #1D4ED8)` }} />
        <div className="px-4 pb-4">
          <div className="flex items-end gap-4 -mt-10 mb-3">
            <div className="w-20 h-20 rounded-3xl border-4 border-white shadow-md flex items-center justify-center font-bold text-2xl text-white" style={{ background: "#7C3AED" }}>AS</div>
            <div className="pb-1">
              <h2 className="font-bold text-slate-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Arjun Sharma</h2>
              <p className="text-slate-500 text-xs">arjun.sharma@svce.edu</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{ label: "Attendance", value: "87%", color: "#10B981" }, { label: "CGPA", value: "8.4", color: BLUE }, { label: "Credits", value: "96", color: "#7C3AED" }].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-3 text-center border border-blue-50">
                <p className="font-bold text-lg" style={{ color: stat.color, fontFamily: "Outfit, sans-serif" }}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Academic Info */}
          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Academic Info</h3>
            <div className="space-y-2.5">
              {[
                { icon: Hash, label: "Register No.", value: "211CS083" },
                { icon: Building2, label: "Department", value: "Computer Science & Engineering" },
                { icon: GraduationCap, label: "Year / Section", value: "3rd Year / Section A" },
                { icon: Mail, label: "Email", value: "arjun.sharma@svce.edu" },
                { icon: Globe, label: "Institution", value: "SVCE, Chennai" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={13} color={BLUE} />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                    <span className="text-xs font-semibold text-slate-700 text-right max-w-[55%]">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timetable */}
          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Class Timetable</h3>
            {/* Day picker */}
            <div className="flex gap-1 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {days.map(d => {
                const isToday = d === today;
                const isSelected = d === selectedDay;
                return (
                  <button key={d} onClick={() => setSelectedDay(d)}
                    className="flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                    style={isSelected ? { background: BLUE, color: "white" } : isToday ? { background: BLUE_MID, color: BLUE } : { background: "#F1F5F9", color: "#64748B" }}>
                    {d.slice(0, 3)}
                    {isToday && <span className="block text-[8px] font-medium">{isSelected ? "Today" : "Today"}</span>}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {(weekTimetable[selectedDay] || []).map((cls, i) => (
                <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl px-3 py-2.5">
                  <div className="w-1 h-10 rounded-full" style={{ background: i === 0 && selectedDay === today ? "#10B981" : BLUE }} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">{cls.subject}</p>
                    <p className="text-[10px] text-slate-400">{cls.room} • {cls.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-700">{cls.time}</p>
                    {i === 0 && selectedDay === today && <Badge label="Now" color="#10B981" />}
                  </div>
                </div>
              ))}
              {(weekTimetable[selectedDay] || []).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No classes scheduled</p>
              )}
            </div>
          </Card>

          {/* AI Weekly Priority */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: BLUE_MID }}>
                <Zap size={14} color={BLUE} />
              </div>
              <h3 className="font-bold text-slate-700 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>AI Weekly Priority</h3>
              <Badge label="AI" color="#7C3AED" />
            </div>
            <div className="space-y-3">
              {aiWeeklyTasks.map((day, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar size={11} color={day.urgent ? "#EF4444" : "#64748B"} />
                    <span className="text-[11px] font-bold" style={{ color: day.urgent ? "#EF4444" : "#64748B" }}>{day.day}</span>
                  </div>
                  <div className="space-y-1.5 ml-4">
                    {day.tasks.map((task, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: day.urgent ? "#EF4444" : BLUE }} />
                        <p className="text-xs text-slate-600 leading-relaxed">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Assignment Progress */}
          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Assignment Progress</h3>
            {[{ subject: "Data Structures", progress: 65, total: 5, done: 3 }, { subject: "DBMS", progress: 80, total: 5, done: 4 }, { subject: "Machine Learning", progress: 40, total: 5, done: 2 }].map(item => (
              <div key={item.subject} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{item.subject}</span>
                  <span className="text-xs font-bold" style={{ color: BLUE }}>{item.done}/{item.total}</span>
                </div>
                <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.progress}%`, background: BLUE }} />
                </div>
              </div>
            ))}
          </Card>

          <button onClick={onLogout} className="w-full py-3 rounded-2xl font-bold text-red-500 border border-red-100 bg-red-50 flex items-center justify-center gap-2 text-sm">
            <LogOut size={16} color="#EF4444" /> Sign Out
          </button>
        </div>
      </div>
      <BottomNav active="student-profile" onNav={onNav} />
    </div>
  );
}

// ─── Notifications ─────────────────────────────────────────────────────────────

const notificationsData = [
  { icon: AlertCircle, color: "#EF4444", title: "Assignment Due Tomorrow", body: "Data Structures Assignment 3 is due tomorrow at 11:59 PM", time: "Just now", type: "urgent" },
  { icon: AlertCircle, color: "#EF4444", title: "Attendance Warning", body: "Your OS attendance is at 71% — below the 75% threshold", time: "30m ago", type: "urgent" },
  { icon: Trophy, color: "#7C3AED", title: "Hackathon Registration Closing", body: "TechFest 2024 registration closes in 6 days", time: "1h ago", type: "academic" },
  { icon: BookOpen, color: BLUE, title: "Study Material Added", body: "Dr. Menon uploaded DS_Graph_Algorithms.pdf in CS301", time: "3h ago", type: "academic" },
  { icon: Activity, color: "#F59E0B", title: "Quiz Reminder", body: "Data Structures quiz on Friday — covers Trees & Heaps", time: "5h ago", type: "academic" },
  { icon: Briefcase, color: "#059669", title: "New Job Match", body: "Google SWE Intern matches your skills (92%) — Apply now!", time: "2h ago", type: "job" },
  { icon: Briefcase, color: "#059669", title: "Application Deadline", body: "Flipkart Data Science Intern closes in 3 days", time: "Yesterday", type: "job" },
  { icon: Bell, color: "#64748B", title: "Class Reminder", body: "DBMS Lab starts in 30 minutes — Lab-3", time: "Yesterday", type: "academic" },
];

type NotiTab = "All" | "Urgent" | "Academic" | "Jobs";

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<NotiTab>("All");
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [snoozed, setSnoozed] = useState<Record<number, string>>({});

  const tabFilter: Record<NotiTab, (n: typeof notificationsData[0]) => boolean> = {
    All: () => true, Urgent: n => n.type === "urgent", Academic: n => n.type === "academic", Jobs: n => n.type === "job",
  };

  const countFor = (t: NotiTab) => notificationsData.filter((n, i) => !dismissed.includes(i) && tabFilter[t](n)).length;

  const visible = notificationsData
    .map((n, i) => ({ ...n, origIdx: i }))
    .filter(n => !dismissed.includes(n.origIdx) && tabFilter[tab](n));

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-blue-50"><ArrowLeft size={20} color={BLUE} /></button>
          <div>
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Notifications</h1>
            <p className="text-xs text-slate-400">{countFor("All")} unread</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(["All", "Urgent", "Academic", "Jobs"] as NotiTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={tab === t ? { background: BLUE, color: "white" } : { background: "white", color: "#64748B" }}>
              {t}
              {countFor(t) > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={tab === t ? { background: "rgba(255,255,255,0.3)", color: "white" } : { background: "#FEE2E2", color: "#EF4444" }}>
                  {countFor(t)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-6 space-y-2">
        {visible.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Bell size={36} color="#CBD5E1" />
            <p className="text-slate-400 text-sm font-medium">No {tab !== "All" ? tab.toLowerCase() + " " : ""}notifications</p>
          </div>
        )}
        {visible.map(n => (
          <Card key={n.origIdx} className={`flex items-start gap-3 p-4 ${n.type === "urgent" ? "border-red-100" : ""}`}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: n.color + "18" }}>
              <n.icon size={18} color={n.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-800 leading-tight">{n.title}</p>
                <button onClick={() => setDismissed(prev => [...prev, n.origIdx])} className="p-1 -mt-0.5 flex-shrink-0">
                  <X size={14} color="#94A3B8" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] text-slate-400">{n.time}</span>
                {["1h", "1d", "3d", "1w"].map(iv => (
                  <button key={iv} onClick={() => setSnoozed(prev => ({ ...prev, [n.origIdx]: iv }))}
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all"
                    style={snoozed[n.origIdx] === iv ? { background: BLUE, color: "white" } : { background: "#EFF6FF", color: BLUE }}>
                    {iv}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
        <Card className="p-4 mt-2">
          <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Notification Preferences</h3>
          <div className="space-y-3">
            {[{ label: "Assignment reminders", enabled: true }, { label: "Hackathon deadlines", enabled: true }, { label: "Class reminders", enabled: false }, { label: "Attendance alerts", enabled: true }].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{item.label}</span>
                <div className={`w-10 h-5 rounded-full flex items-center ${item.enabled ? "justify-end" : "justify-start"}`}
                  style={{ background: item.enabled ? BLUE : "#CBD5E1", padding: "2px" }}>
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Staff Home ────────────────────────────────────────────────────────────────

const staffClassesData = [
  { subject: "Data Structures", code: "CS301", section: "A & B", students: 62, year: "3rd Year", schedule: "Mon, Wed, Fri 9-10 AM", color: BLUE },
  { subject: "Design & Analysis of Algorithms", code: "CS401", section: "A", students: 38, year: "4th Year", schedule: "Tue, Thu 11 AM - 1 PM", color: "#7C3AED" },
  { subject: "DBMS Lab", code: "CS302L", section: "B", students: 32, year: "3rd Year", schedule: "Wed 2-5 PM", color: "#059669" },
];

function StaffHome({ onNav, onSelectClass }: { onNav: (s: Screen) => void; onSelectClass: (idx: number) => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="px-5 pt-12 pb-5" style={{ background: `linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm">Faculty Portal</p>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Dr. Priya Menon</h1>
            <p className="text-blue-200 text-xs mt-0.5">Dept. of CSE • Associate Professor</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNav("staff-notifications")} className="p-2 bg-white/20 rounded-xl relative">
              <Bell size={20} color="white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <button onClick={() => onNav("staff-profile")} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>PM</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Classes", value: "3", icon: BookOpen }, { label: "Students", value: "132", icon: Users }, { label: "Pending", value: "18", icon: Clock }].map(stat => (
            <div key={stat.label} className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
              <stat.icon size={16} color="rgba(255,255,255,0.8)" className="mx-auto mb-1" />
              <p className="text-white font-bold text-xl leading-none">{stat.value}</p>
              <p className="text-blue-200 text-[10px] mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        <div>
          <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Plus, label: "Post", color: "#2563EB", action: () => { onSelectClass(0); onNav("staff-class"); } },
              { icon: Upload, label: "Upload", color: "#7C3AED", action: () => { onSelectClass(0); onNav("staff-class"); } },
              { icon: Bell, label: "Notify", color: "#F59E0B", action: () => onNav("staff-notifications") },
              { icon: Trophy, label: "Hackathon", color: "#059669", action: () => onNav("staff-hackathons") },
            ].map(a => (
              <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: a.color + "15" }}>
                  <a.icon size={22} color={a.color} />
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>My Classes</h3>
            <button onClick={() => { onSelectClass(0); onNav("staff-class"); }} className="text-xs font-bold" style={{ color: BLUE }}>View All</button>
          </div>
          <div className="space-y-2">
            {staffClassesData.map((cls, i) => (
              <button key={i} onClick={() => { onSelectClass(i); onNav("staff-class"); }} className="w-full text-left">
                <Card className="flex items-center gap-4 px-4 py-3.5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm" style={{ background: cls.color, fontFamily: "Outfit, sans-serif" }}>
                    {cls.code.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{cls.subject}</p>
                    <p className="text-xs text-slate-400">{cls.code} • Sec {cls.section} • {cls.students} students</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{cls.schedule}</p>
                  </div>
                  <ChevronRight size={16} color="#CBD5E1" />
                </Card>
              </button>
            ))}
          </div>
        </div>
        <Card className="p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Pending Reviews</h3>
          <div className="space-y-2">
            {[{ subject: "DS", task: "Assignment 3 submissions", count: 18, icon: FileText, clsIdx: 0 }, { subject: "DAA", task: "Project proposals", count: 4, icon: Target, clsIdx: 1 }].map((item, i) => (
              <button key={i} onClick={() => { onSelectClass(item.clsIdx); onNav("staff-class"); }}
                className="flex items-center gap-3 p-2 bg-amber-50 rounded-xl w-full text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <item.icon size={14} color="#F59E0B" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">{item.task}</p>
                  <p className="text-[10px] text-slate-400">{item.subject}</p>
                </div>
                <span className="text-xs font-bold text-amber-600">{item.count} new</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Attendance Overview</h3>
          {staffClassesData.map((cls, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-slate-600">{cls.subject}</span>
                <span className="text-xs font-bold" style={{ color: BLUE }}>{[87, 79, 92][i]}%</span>
              </div>
              <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${[87, 79, 92][i]}%`, background: [87, 79, 92][i] >= 85 ? "#10B981" : "#F59E0B" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
      <BottomNav active="staff-home" onNav={onNav} role="staff" />
    </div>
  );
}

// ─── Staff Profile ────────────────────────────────────────────────────────────

function StaffProfile({ onNav, onLogout }: { onNav: (s: Screen) => void; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Priya Menon", phone: "+91 98400 12345", email: "priya.menon@svce.edu",
    designation: "Associate Professor", department: "Computer Science & Engineering", office: "Block C, Room 214",
    bio: "Ph.D from IIT Madras. Research interests in Graph Neural Networks, Edge Computing and Machine Learning.",
  });
  const [draft, setDraft] = useState(profile);
  const [toast, setToast] = useState("");

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Staff Profile</h1>
        <div className="flex gap-1">
          <button onClick={() => { setDraft(profile); setEditing(true); }} className="p-2 rounded-xl hover:bg-blue-50">
            <Edit3 size={18} color={BLUE} />
          </button>
          <button onClick={() => onNav("staff-notifications")} className="p-2 rounded-xl hover:bg-blue-50 relative">
            <Bell size={18} color="#64748B" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="h-28" style={{ background: `linear-gradient(135deg, #1E3A5F, #2563EB)` }} />
        <div className="px-4 pb-4">
          <div className="flex items-end gap-4 -mt-10 mb-3">
            <div className="w-20 h-20 rounded-3xl border-4 border-white shadow-md flex items-center justify-center font-bold text-2xl text-white" style={{ background: BLUE }}>PM</div>
            <div className="pb-1">
              <h2 className="font-bold text-slate-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>{profile.name}</h2>
              <p className="text-slate-500 text-xs">{profile.email}</p>
              <Badge label={profile.designation} color={BLUE} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{ label: "Classes", value: "3", color: BLUE }, { label: "Students", value: "132", color: "#10B981" }, { label: "Experience", value: "12 Yrs", color: "#7C3AED" }].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-3 text-center border border-blue-50">
                <p className="font-bold text-lg" style={{ color: stat.color, fontFamily: "Outfit, sans-serif" }}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Personal Details</h3>
            <div className="space-y-2.5">
              {[
                { icon: Hash, label: "Staff ID", value: "SVCE-FAC-2012-047" },
                { icon: Mail, label: "Email", value: profile.email },
                { icon: Phone, label: "Phone", value: profile.phone },
                { icon: Building2, label: "Department", value: profile.department },
                { icon: GraduationCap, label: "Designation", value: profile.designation },
                { icon: MapPin, label: "Office", value: profile.office },
                { icon: Globe, label: "Institution", value: "SVCE, Chennai — 600 048" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={13} color={BLUE} />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                    <span className="text-xs font-semibold text-slate-700 text-right max-w-[55%] leading-tight">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {profile.bio && (
              <div className="mt-3 pt-3 border-t border-blue-50">
                <p className="text-xs text-slate-500 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Academic Qualifications</h3>
            <div className="space-y-3">
              {[
                { degree: "Ph.D. in Computer Science", institution: "IIT Madras", year: "2012" },
                { degree: "M.Tech — Computer Science", institution: "NIT Trichy", year: "2007" },
                { degree: "B.E. — Computer Science", institution: "Anna University", year: "2005" },
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: [BLUE, "#7C3AED", "#059669"][i] }} />
                  <div>
                    <p className="text-xs font-bold text-slate-700">{q.degree}</p>
                    <p className="text-xs text-slate-400">{q.institution} • {q.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Subjects Handling</h3>
            <div className="space-y-2">
              {staffClassesData.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "25" }}>
                    <BookOpen size={16} color={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{s.subject}</p>
                    <p className="text-[10px] text-slate-400">{s.code} • Sec {s.section} • {s.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Research & Publications</h3>
            <div className="space-y-2">
              {["Graph Neural Networks for Social Media Analysis — IEEE 2023", "Optimised Cache Algorithms for Edge Computing — Springer 2021", "Machine Learning in Healthcare Diagnostics — Elsevier 2019"].map((pub, i) => (
                <div key={i} className="flex items-start gap-2">
                  <FileText size={12} color={BLUE} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{pub}</p>
                </div>
              ))}
            </div>
          </Card>

          <button onClick={onLogout} className="w-full py-3 rounded-2xl font-bold text-red-500 border border-red-100 bg-red-50 flex items-center justify-center gap-2 text-sm">
            <LogOut size={16} color="#EF4444" /> Sign Out
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <div className="space-y-3 pt-3">
            {[
              { label: "Full Name", key: "name", ph: "Dr. Priya Menon" },
              { label: "Phone", key: "phone", ph: "+91 98400 XXXXX" },
              { label: "Email", key: "email", ph: "email@svce.edu" },
              { label: "Designation", key: "designation", ph: "Associate Professor" },
              { label: "Department", key: "department", ph: "Computer Science & Engineering" },
              { label: "Office Location", key: "office", ph: "Block C, Room 214" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{f.label}</label>
                <input value={(draft as any)[f.key]} onChange={e => setDraft(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.ph} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Bio / About</label>
              <textarea value={draft.bio} onChange={e => setDraft(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-20" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-slate-500 border-slate-200">Cancel</button>
              <button onClick={() => { setProfile(draft); setEditing(false); setToast("Profile updated successfully!"); }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="staff-profile" onNav={onNav} role="staff" />
    </div>
  );
}

// ─── Staff Class Room ──────────────────────────────────────────────────────────

type Announcement = { id: number; title: string; body: string; type: string; date: string; views: number; submitted?: number; total?: number };
type Assignment = { id: number; title: string; desc: string; due: string; submitted: number; total: number; status: string };

const allStudents = [
  { name: "Arjun Sharma", roll: "211CS083", submitted: "Mar 13, 10:45 PM", status: "Submitted", link: "github.com/arjun/ds-a3" },
  { name: "Priya Nair", roll: "211CS051", submitted: "—", status: "Pending", link: "" },
  { name: "Rahul Kumar", roll: "211CS072", submitted: "Mar 14, 8:20 AM", status: "Submitted", link: "github.com/rahul/graphs" },
  { name: "Sneha Patel", roll: "211CS088", submitted: "—", status: "Pending", link: "" },
  { name: "Karthik Raj", roll: "211CS041", submitted: "Mar 13, 9:00 PM", status: "Submitted", link: "github.com/karthik/dsa" },
  { name: "Divya S", roll: "211CS029", submitted: "—", status: "Pending", link: "" },
  { name: "Arun Prasad", roll: "211CS018", submitted: "Mar 14, 11:00 AM", status: "Submitted", link: "drive.google.com/…" },
  { name: "Meena K", roll: "211CS049", submitted: "—", status: "Pending", link: "" },
];

const attendanceData = [
  { name: "Arjun Sharma", roll: "211CS083", pct: 91, present: 41, total: 45 },
  { name: "Priya Nair", roll: "211CS051", pct: 68, present: 31, total: 45 },
  { name: "Rahul Kumar", roll: "211CS072", pct: 85, present: 38, total: 45 },
  { name: "Sneha Patel", roll: "211CS088", pct: 73, present: 33, total: 45 },
  { name: "Karthik Raj", roll: "211CS041", pct: 89, present: 40, total: 45 },
  { name: "Divya S", roll: "211CS029", pct: 71, present: 32, total: 45 },
];

function StaffClassRoom({ onBack, onNav, classIdx }: { onBack: () => void; onNav: (s: Screen) => void; classIdx: number }) {
  const cls = staffClassesData[classIdx];
  const [tab, setTab] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: "Assignment 3 - Graph Algorithms", body: "Implement BFS and DFS traversal for an undirected weighted graph. Include time complexity analysis. Submit via the portal.", type: "assignment", date: "Mar 12", views: 48, submitted: 18, total: 62 },
    { id: 2, title: "Unit 4 Quiz - Mar 17", body: "Quiz covers Chapters 7 & 8: Trees and Heaps. Prepare all standard operations and time complexities.", type: "announcement", date: "Mar 10", views: 61 },
  ]);
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, title: "Assignment 3 - Graph Algorithms", desc: "BFS, DFS traversal with complexity analysis", due: "Mar 15", submitted: 18, total: cls.students, status: "Active" },
    { id: 2, title: "Assignment 2 - Trees & Heaps", desc: "BST insertion, deletion; Heap operations", due: "Mar 8", submitted: cls.students - 2, total: cls.students, status: "Closed" },
  ]);
  const [materials, setMaterials] = useState([
    { name: "DS_Graph_Algorithms.pdf", size: "2.4 MB", date: "Mar 12", views: 48, type: "pdf" },
    { name: "Unit3_Trees_Notes.pdf", size: "1.8 MB", date: "Mar 5", views: 61, type: "pdf" },
    { name: "Practice_Problems_Set4.pdf", size: "0.9 MB", date: "Feb 28", views: 55, type: "pdf" },
  ]);
  const [subFilter, setSubFilter] = useState<"All" | "Submitted" | "Pending">("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [postTitle, setPostTitle] = useState(""); const [postBody, setPostBody] = useState(""); const [postType, setPostType] = useState("announcement");
  const [aTitle, setATitle] = useState(""); const [aDesc, setADesc] = useState(""); const [aDue, setADue] = useState("");
  const [uName, setUName] = useState("");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredStudents = allStudents.filter(s => subFilter === "All" || s.status === subFilter);
  const tabs = ["Announcements", "Assignments", "Materials", "Submissions", "Attendance"];

  const submitPost = () => {
    if (!postTitle.trim()) return;
    setAnnouncements(prev => [{ id: Date.now(), title: postTitle, body: postBody, type: postType, date: "Just now", views: 0, submitted: 0, total: cls.students }, ...prev]);
    setPostTitle(""); setPostBody(""); setShowPostModal(false); setToast("Post published!");
  };
  const submitAssignment = () => {
    if (!aTitle.trim()) return;
    setAssignments(prev => [{ id: Date.now(), title: aTitle, desc: aDesc, due: aDue || "TBD", submitted: 0, total: cls.students, status: "Active" }, ...prev]);
    setATitle(""); setADesc(""); setADue(""); setShowAssignModal(false); setToast("Assignment created!");
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUName(file.name); }
  };
  const uploadMaterial = () => {
    if (!uName.trim()) return;
    setMaterials(prev => [{ name: uName, size: "—", date: "Just now", views: 0, type: "pdf" }, ...prev]);
    setUName(""); setShowUploadModal(false); setToast("Material uploaded!");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleUpload} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4" />
      <div className="bg-white sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-blue-50">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-blue-50"><ArrowLeft size={20} color={BLUE} /></button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
            style={{ background: cls.color, fontFamily: "Outfit, sans-serif" }}>{cls.code.slice(0, 2)}</div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{cls.subject}</h2>
            <p className="text-xs text-slate-400">{cls.code} • Sec {cls.section} • {cls.students} students</p>
          </div>
          <button onClick={() => setShowPostModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: BLUE }}>
            <Plus size={13} />Post
          </button>
        </div>
        <div className="flex overflow-x-auto px-4 py-2 gap-2 border-b border-blue-50" style={{ scrollbarWidth: "none" }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={tab === i ? { background: BLUE, color: "white" } : { background: "#F0F4FF", color: "#64748B" }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-3">
        {tab === 0 && (
          <>
            <button onClick={() => setShowPostModal(true)} className="w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: BLUE }}>
              <Plus size={16} /> New Post / Announcement
            </button>
            {announcements.map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: BLUE }}>PM</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">{a.title}</span>
                      <Badge label={a.type === "assignment" ? "Assignment" : "Announcement"} color={a.type === "assignment" ? "#7C3AED" : BLUE} />
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Posted {a.date}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{a.body}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Eye size={12} /> {a.views} views</span>
                      {a.submitted !== undefined && (
                        <>
                          <button onClick={() => setTab(3)} className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg text-xs font-semibold text-green-600">
                            <CheckCircle size={12} /> {a.submitted} submitted
                          </button>
                          <button onClick={() => setTab(3)} className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg text-xs font-semibold text-amber-600">
                            <Clock size={12} /> {(a.total || cls.students) - (a.submitted || 0)} pending
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 1 && (
          <>
            <button onClick={() => setShowAssignModal(true)} className="w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: BLUE }}>
              <Plus size={16} /> Create New Assignment
            </button>
            {assignments.map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-2">
                    <p className="text-sm font-bold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                    <p className="text-xs text-slate-400">Due: {a.due}</p>
                  </div>
                  <Badge label={a.status} color={a.status === "Active" ? "#10B981" : "#94A3B8"} />
                </div>
                <div className="h-2 bg-blue-50 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full" style={{ width: `${(a.submitted / a.total) * 100}%`, background: BLUE }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{a.submitted}/{a.total} submitted</p>
                  <button onClick={() => setTab(3)} className="text-xs font-bold" style={{ color: BLUE }}>View Submissions →</button>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 2 && (
          <>
            <button onClick={() => setShowUploadModal(true)} className="w-full py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: BLUE }}>
              <Upload size={16} /> Upload Material
            </button>
            {materials.map((f, i) => (
              <Card key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === "pdf" ? "bg-red-50" : "bg-orange-50"}`}>
                  <FileText size={18} color={f.type === "pdf" ? "#EF4444" : "#F59E0B"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400">{f.size} • {f.date} • {f.views} views</p>
                </div>
                <button className="p-2 bg-blue-50 rounded-xl"><ExternalLink size={14} color={BLUE} /></button>
              </Card>
            ))}
          </>
        )}

        {tab === 3 && (
          <>
            <div className="flex gap-2 mb-2">
              {(["All", "Submitted", "Pending"] as const).map(f => (
                <button key={f} onClick={() => setSubFilter(f)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={subFilter === f ? { background: BLUE, color: "white" } : { background: "white", color: "#64748B" }}>
                  {f} ({f === "All" ? allStudents.length : allStudents.filter(s => s.status === f).length})
                </button>
              ))}
            </div>
            <div className="flex gap-3 mb-2">
              {[{ label: "Submitted", count: allStudents.filter(s => s.status === "Submitted").length, color: "#10B981" },
              { label: "Pending", count: allStudents.filter(s => s.status === "Pending").length, color: "#EF4444" },
              { label: "Total", count: allStudents.length, color: BLUE }].map(item => (
                <Card key={item.label} className="flex-1 p-3 text-center">
                  <p className="text-xl font-bold" style={{ color: item.color, fontFamily: "Outfit, sans-serif" }}>{item.count}</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              {filteredStudents.map((s, i) => (
                <Card key={i} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={36} bg={s.status === "Submitted" ? BLUE : "#94A3B8"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.roll}</p>
                      {s.submitted !== "—" && <p className="text-[10px] text-slate-400">Submitted: {s.submitted}</p>}
                      {s.link && <p className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: BLUE }}>{s.link}</p>}
                    </div>
                    <Badge label={s.status} color={s.status === "Submitted" ? "#10B981" : "#EF4444"} />
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === 4 && (
          <>
            <div className="flex gap-3 mb-2">
              <Card className="flex-1 p-3 text-center">
                <p className="text-xl font-bold" style={{ color: "#10B981", fontFamily: "Outfit, sans-serif" }}>83%</p>
                <p className="text-xs text-slate-400">Avg Attendance</p>
              </Card>
              <Card className="flex-1 p-3 text-center">
                <p className="text-xl font-bold" style={{ color: "#EF4444", fontFamily: "Outfit, sans-serif" }}>3</p>
                <p className="text-xs text-slate-400">Below 75%</p>
              </Card>
            </div>
            <div className="space-y-2">
              {attendanceData.map((s, i) => (
                <Card key={i} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={s.name} size={36} bg={s.pct >= 75 ? BLUE : "#EF4444"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                      <span className="text-sm font-bold" style={{ color: s.pct >= 75 ? "#10B981" : "#EF4444" }}>{s.pct}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{s.roll} • {s.present}/{s.total} classes</p>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.pct >= 75 ? "#10B981" : "#EF4444" }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {showPostModal && (
        <Modal title="New Post" onClose={() => setShowPostModal(false)}>
          <div className="space-y-3 pt-3">
            <div className="flex bg-blue-50 rounded-xl p-1">
              {[{ val: "announcement", label: "Announcement" }, { val: "assignment", label: "Assignment" }].map(t => (
                <button key={t.val} onClick={() => setPostType(t.val)} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                  style={postType === t.val ? { background: BLUE, color: "white" } : { color: "#64748B" }}>{t.label}</button>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Title</label>
              <input value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="Enter post title..."
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Content</label>
              <textarea value={postBody} onChange={e => setPostBody(e.target.value)} placeholder="Write your message..."
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-24" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPostModal(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-slate-500 border-slate-200">Cancel</button>
              <button onClick={submitPost} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>Post Now</button>
            </div>
          </div>
        </Modal>
      )}
      {showAssignModal && (
        <Modal title="Create Assignment" onClose={() => setShowAssignModal(false)}>
          <div className="space-y-3 pt-3">
            {[{ label: "Title", key: "aTitle", value: aTitle, set: setATitle, ph: "e.g. Assignment 4 - Sorting" }, { label: "Description", key: "aDesc", value: aDesc, set: setADesc, ph: "Describe the requirements..." }, { label: "Due Date", key: "aDue", value: aDue, set: setADue, ph: "e.g. Apr 5, 2024 11:59 PM" }].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{f.label}</label>
                {f.key === "aDesc" ? (
                  <textarea value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-20" />
                ) : (
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setShowAssignModal(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-slate-500 border-slate-200">Cancel</button>
              <button onClick={submitAssignment} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>Create</button>
            </div>
          </div>
        </Modal>
      )}
      {showUploadModal && (
        <Modal title="Upload Material" onClose={() => setShowUploadModal(false)}>
          <div className="space-y-3 pt-3">
            <button onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Upload size={24} color={BLUE} />
              </div>
              <p className="text-sm font-semibold text-slate-600">Tap to select a file</p>
              <p className="text-xs text-slate-400">PDF, DOCX, PPTX, MP4 supported</p>
            </button>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">File Name</label>
              <input value={uName} onChange={e => setUName(e.target.value)} placeholder="e.g. Unit5_Graphs_Notes.pdf"
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-slate-500 border-slate-200">Cancel</button>
              <button onClick={uploadMaterial} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>Upload</button>
            </div>
          </div>
        </Modal>
      )}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="staff-class" onNav={onNav} role="staff" />
    </div>
  );
}

// ─── Staff Hackathons ──────────────────────────────────────────────────────────

function StaffHackathons({ onNav, hackathons, setHackathons }: {
  onNav: (s: Screen) => void;
  hackathons: HackathonItem[];
  setHackathons: React.Dispatch<React.SetStateAction<HackathonItem[]>>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<HackathonItem>({
    name: "", organizer: "SVCE Internal", theme: "", regDeadline: "", eventDate: "",
    prize: "", teamSize: "2-4", eligibility: "All Years", difficulty: "Intermediate",
    skills: [], type: "Internal", countdown: "", url: "", aiSummary: "", addedByStaff: true,
  });
  const [skillInput, setSkillInput] = useState("");

  const staffHackathons = hackathons.filter(h => h.addedByStaff);

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const submitHackathon = () => {
    if (!form.name.trim()) return;
    const newH: HackathonItem = { ...form, addedByStaff: true };
    setHackathons(prev => [newH, ...prev]);
    setShowAdd(false);
    setToast("Hackathon posted! Visible to all students.");
    setForm({ name: "", organizer: "SVCE Internal", theme: "", regDeadline: "", eventDate: "", prize: "", teamSize: "2-4", eligibility: "All Years", difficulty: "Intermediate", skills: [], type: "Internal", countdown: "", url: "", aiSummary: "", addedByStaff: true });
    setSkillInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Hackathon Manager</h1>
            <p className="text-xs text-slate-400">Post & manage hackathons for students</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-white text-xs" style={{ background: BLUE }}>
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
          <Info size={16} color={BLUE} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 mb-1">Faculty Hackathon Board</p>
            <p className="text-xs text-slate-500 leading-relaxed">Hackathons you post here will instantly appear on the student Hackathons page with a "Posted by Faculty" badge.</p>
          </div>
        </div>

        {staffHackathons.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Trophy size={36} color="#CBD5E1" />
            <p className="text-slate-400 text-sm font-medium">No hackathons posted yet</p>
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: BLUE }}>
              Post First Hackathon
            </button>
          </div>
        )}

        {staffHackathons.map((h, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge label={h.type} color={h.type === "Internal" ? "#7C3AED" : BLUE} />
                  <Badge label={h.difficulty} color={difficultyColors[h.difficulty]} />
                </div>
                <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{h.name}</p>
                <p className="text-xs text-slate-400">{h.organizer} • {h.theme}</p>
              </div>
              <button onClick={() => { setHackathons(prev => prev.filter(x => x !== h)); setToast("Hackathon removed"); }}
                className="p-1.5 bg-red-50 rounded-xl flex-shrink-0">
                <X size={13} color="#EF4444" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <span>📅 Reg: {h.regDeadline}</span>
              <span>🗓 Event: {h.eventDate}</span>
              <span>🏆 {h.prize}</span>
              <span>👥 {h.teamSize} members</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {h.skills.map(s => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{s}</span>)}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-600 font-semibold">Live — visible to students</span>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title="Post a Hackathon" onClose={() => setShowAdd(false)}>
          <div className="space-y-3 pt-3">
            <div className="flex bg-blue-50 rounded-xl p-1 mb-1">
              {[{ val: "Internal", label: "Internal" }, { val: "External", label: "External" }].map(t => (
                <button key={t.val} onClick={() => setForm(prev => ({ ...prev, type: t.val }))} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                  style={form.type === t.val ? { background: BLUE, color: "white" } : { color: "#64748B" }}>{t.label}</button>
              ))}
            </div>
            {[
              { label: "Hackathon Name *", key: "name", ph: "e.g. CodeFest 2024" },
              { label: "Organizer", key: "organizer", ph: "e.g. SVCE / IIT Madras" },
              { label: "Theme / Domain", key: "theme", ph: "e.g. AI, Web Dev, IoT" },
              { label: "Prize Pool", key: "prize", ph: "e.g. ₹50,000" },
              { label: "Team Size", key: "teamSize", ph: "e.g. 2-4" },
              { label: "Eligibility", key: "eligibility", ph: "e.g. All Years / 3rd Year" },
              { label: "Registration Deadline", key: "regDeadline", ph: "e.g. Apr 5, 2024" },
              { label: "Event Date", key: "eventDate", ph: "e.g. Apr 15-16, 2024" },
              { label: "Countdown / Days Left", key: "countdown", ph: "e.g. 12 days left" },
              { label: "Registration URL (optional)", key: "url", ph: "https://..." },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.ph} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Difficulty</label>
              <div className="flex gap-2">
                {["Beginner", "Intermediate", "Advanced"].map(d => (
                  <button key={d} onClick={() => setForm(prev => ({ ...prev, difficulty: d }))}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={form.difficulty === d ? { background: difficultyColors[d], color: "white", borderColor: difficultyColors[d] } : { borderColor: "#E2E8F0", color: "#64748B" }}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Skills Required</label>
              <div className="flex gap-2 mb-2">
                <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                  placeholder="e.g. Python, React..." className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none" />
                <button onClick={addSkill} className="px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background: BLUE }}>Add</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full">
                    {s}
                    <button onClick={() => setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))}><X size={9} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">AI Summary (Brief Description)</label>
              <textarea value={form.aiSummary} onChange={e => setForm(prev => ({ ...prev, aiSummary: e.target.value }))}
                placeholder="Brief description that will be shown as AI summary to students..."
                className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-16" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-slate-500 border-slate-200">Cancel</button>
              <button onClick={submitHackathon} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: BLUE }}>Post Hackathon</button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="staff-hackathons" onNav={onNav} role="staff" />
    </div>
  );
}

// ─── Staff Notifications ───────────────────────────────────────────────────────

function StaffNotifications({ onBack, onNav }: { onBack: () => void; onNav: (s: Screen) => void }) {
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [notifClass, setNotifClass] = useState("");
  const [toast, setToast] = useState("");
  const [sent, setSent] = useState([
    { title: "Assignment 3 Deadline", body: "Due tomorrow at 11:59 PM", cls: "CS301", time: "2h ago" },
    { title: "Quiz on Friday", body: "Covers Chapters 7 & 8", cls: "CS301", time: "Yesterday" },
  ]);
  const sendNotif = () => {
    if (!notifTitle.trim()) return;
    setSent(prev => [{ title: notifTitle, body: notifMsg, cls: notifClass || "All Classes", time: "Just now" }, ...prev]);
    setNotifTitle(""); setNotifMsg(""); setNotifClass("");
    setToast("Notification sent to students!");
  };
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-white border-b border-blue-50 sticky top-0 z-40 px-4 pt-12 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-blue-50"><ArrowLeft size={20} color={BLUE} /></button>
        <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Notifications</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        <Card className="p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Send Notification to Class</h3>
          <div className="space-y-3">
            <select value={notifClass} onChange={e => setNotifClass(e.target.value)} className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none border-0">
              <option value="">Select Class</option>
              <option>CS301 - Data Structures (Sec A & B)</option>
              <option>CS401 - DAA (Sec A)</option>
              <option>CS302L - DBMS Lab (Sec B)</option>
            </select>
            <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Notification title..."
              className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none" />
            <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Write your message..."
              className="w-full bg-blue-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none resize-none h-20" />
            <button onClick={sendNotif} className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: BLUE }}>
              <Send size={15} /> Send Notification
            </button>
          </div>
        </Card>
        <h3 className="font-bold text-slate-700 text-sm px-1" style={{ fontFamily: "Outfit, sans-serif" }}>Recently Sent</h3>
        {sent.map((n, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0"><Bell size={16} color={BLUE} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-slate-800">{n.title}</p>
                  <Badge label={n.cls} color={BLUE} />
                </div>
                <p className="text-xs text-slate-500">{n.body}</p>
                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <BottomNav active="staff-notifications" onNav={onNav} role="staff" />
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<"student" | "staff">("student");
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [classIdx, setClassIdx] = useState(0);
  const [hackathons, setHackathons] = useState<HackathonItem[]>(defaultHackathons);

  const handleLogin = (r: "student" | "staff") => { setRole(r); setScreen(r === "student" ? "student-home" : "staff-home"); };
  const handleLogout = () => setScreen("login");
  const nav = (s: Screen) => setScreen(s);

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#1E293B" }}>
      <div className="relative overflow-hidden bg-[#F0F4FF]"
        style={{ width: "100%", maxWidth: 390, height: "100%", maxHeight: 844, borderRadius: 40, boxShadow: "0 32px 80px rgba(0,0,0,0.4)", fontFamily: "Inter, sans-serif" }}>
        <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; } * { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

        {screen === "splash" && <SplashScreen onNext={() => setScreen("login")} />}
        {screen === "login" && <LoginScreen onLogin={handleLogin} />}

        {screen === "student-home" && <StudentHome onNav={nav} />}
        {screen === "student-chat" && <ChatList onNav={nav} onSubject={idx => { setSubjectIdx(idx); setScreen("student-chat-subject"); }} />}
        {screen === "student-chat-subject" && <ChatSubject subjectIdx={subjectIdx} onBack={() => setScreen("student-chat")} />}
        {screen === "student-hackathons" && <HackathonScreen onNav={nav} hackathons={hackathons} setHackathons={setHackathons} />}
        {screen === "student-jobs" && <JobSeekScreen onNav={nav} />}
        {screen === "student-profile" && <StudentProfile onNav={nav} onLogout={handleLogout} />}
        {screen === "student-notifications" && <NotificationsScreen onBack={() => setScreen(role === "staff" ? "staff-home" : "student-home")} />}

        {screen === "staff-home" && <StaffHome onNav={nav} onSelectClass={idx => setClassIdx(idx)} />}
        {screen === "staff-class" && <StaffClassRoom onBack={() => setScreen("staff-home")} onNav={nav} classIdx={classIdx} />}
        {screen === "staff-hackathons" && <StaffHackathons onNav={nav} hackathons={hackathons} setHackathons={setHackathons} />}
        {screen === "staff-notifications" && <StaffNotifications onBack={() => setScreen("staff-home")} onNav={nav} />}
        {screen === "staff-profile" && <StaffProfile onNav={nav} onLogout={handleLogout} />}
      </div>
    </div>
  );
}

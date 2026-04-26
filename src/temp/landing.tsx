// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, useScroll, useTransform, useInView, AnimatePresence, LayoutGroup } from "framer-motion";
// import {
//   BookOpen, Users, BarChart3, DollarSign, CalendarCheck,
//   Shield, Zap, Star, ChevronDown, ArrowLeft,
//   GraduationCap, Mosque, Trophy, Bell, FileText,
//   CheckCircle, XCircle, Menu, X, Sparkles,
// } from "lucide-react";

// // ─── Animation Variants ───────────────────────────────────────────────────────

// const fadeUp = {
//   hidden: { opacity: 0, y: 32 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
//   }),
// };

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     transition: { duration: 0.5, delay: i * 0.08 },
//   }),
// };

// const staggerContainer = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.1 } },
// };

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FAQItem { q: string; a: string; }
// interface Feature { icon: React.ReactNode; title: string; desc: string; span?: string; color: string; }
// interface Tab { id: string; label: string; }
// interface PainPoint { old: string; newWay: string; }

// // ─── Navbar ───────────────────────────────────────────────────────────────────

// function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", handler);
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   const links = [
//     { href: "#features", label: "المميزات" },
//     { href: "#preview", label: "داخل النظام" },
//     { href: "#audience", label: "لمن هذا النظام؟" },
//     { href: "#faq", label: "الأسئلة الشائعة" },
//   ];

//   return (
//     <motion.nav
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
//         scrolled
//           ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//         {/* Logo */}
//         <a href="#" className="flex items-center gap-2 group">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
//             <Mosque className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-lg tracking-tight text-foreground">
//             مسجد<span className="text-primary">ERP</span>
//           </span>
//         </a>

//         {/* Desktop links */}
//         <div className="hidden md:flex items-center gap-8">
//           {links.map((l) => (
//             <a
//               key={l.href}
//               href={l.href}
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
//             >
//               {l.label}
//             </a>
//           ))}
//         </div>

//         {/* CTA buttons */}
//         <div className="hidden md:flex items-center gap-3">
//           <a
//             href="/login"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
//           >
//             تسجيل الدخول
//           </a>
//           <a
//             href="/register"
//             className="text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg px-5 py-2 transition-colors shadow-md shadow-primary/25 hover:shadow-primary/40"
//           >
//             ابدأ مجاناً
//           </a>
//         </div>

//         {/* Mobile toggle */}
//         <button
//           className="md:hidden p-2 text-muted-foreground"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-background border-b border-border overflow-hidden"
//           >
//             <div className="px-6 py-4 flex flex-col gap-4">
//               {links.map((l) => (
//                 <a key={l.href} href={l.href} className="text-sm font-medium text-foreground" onClick={() => setOpen(false)}>
//                   {l.label}
//                 </a>
//               ))}
//               <a href="/register" className="mt-2 text-sm font-semibold bg-primary text-white rounded-lg px-5 py-2.5 text-center">
//                 ابدأ مجاناً
//               </a>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }

// // ─── Hero ─────────────────────────────────────────────────────────────────────

// function Hero() {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
//   const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
//   const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

//   // Floating animation for mockup
//   const floatVariants = {
//     animate: {
//       y: [-10, 10, -10],
//       rotate: [-1, 1, -1],
//       transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
//     },
//   };

//   return (
//     <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
//       {/* Background gradients */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/90/5 rounded-full blur-[80px]" />
//       </div>

//       {/* Geometric grid overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
//         style={{
//           backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
//         {/* Text content */}
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate="visible"
//           className="text-right order-2 lg:order-1"
//         >
//           {/* Badge */}
//           <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
//             <Sparkles className="w-3.5 h-3.5 text-primary" />
//             <span className="text-xs font-semibold text-primary">منصة مجانية بالكامل للمؤسسات التعليمية</span>
//           </motion.div>

//           {/* Headline */}
//           <motion.h1
//             variants={fadeUp}
//             custom={1}
//             className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-foreground mb-6"
//           >
//             تفرّغ لرسالتك..{" "}
//             <span className="relative">
//               <span className="relative z-10 bg-gradient-to-l from-emerald-400 to-accent bg-clip-text text-transparent">
//                 ودع لنا
//               </span>
//               <motion.span
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//                 className="absolute bottom-1 right-0 left-0 h-3 bg-primary/15 rounded-sm origin-right"
//               />
//             </span>
//             {" "}عبء الإدارة.
//           </motion.h1>

//           {/* Subheadline */}
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
//           >
//             منصة سحابية متكاملة لإدارة مراكز تحفيظ القرآن والمؤسسات التعليمية الإسلامية. تتبّع الطلاب، أدِر الماليات، وأنشئ تقاريرك في ثوانٍ — كل ذلك من مكان واحد.
//           </motion.p>

//           {/* CTAs */}
//           <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4 justify-end">
//             <a
//               href="/register"
//               className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-7 py-3.5 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-base"
//             >
//               <span>ابدأ مجاناً الآن</span>
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             </a>
//             <a
//               href="#preview"
//               className="flex items-center gap-2 border border-border hover:border-foreground/30 text-foreground font-semibold rounded-xl px-7 py-3.5 transition-all duration-300 text-base bg-card/50 backdrop-blur-sm"
//             >
//               <span>شاهد النظام</span>
//             </a>
//           </motion.div>

//           {/* Stats */}
//           <motion.div variants={fadeUp} custom={4} className="flex items-center gap-8 justify-end mt-12 pt-8 border-t border-border">
//             {[
//               { num: "+٥٠٠", label: "مؤسسة تثق بنا" },
//               { num: "+١٢K", label: "طالب مسجّل" },
//               { num: "٩٩.٩٪", label: "وقت التشغيل" },
//             ].map((s) => (
//               <div key={s.label} className="text-right">
//                 <div className="text-2xl font-black text-foreground">{s.num}</div>
//                 <div className="text-xs text-muted-foreground">{s.label}</div>
//               </div>
//             ))}
//           </motion.div>
//         </motion.div>

//         {/* Mockup */}
//         <motion.div
//           className="relative order-1 lg:order-2 flex justify-center lg:justify-start"
//           initial={{ opacity: 0, x: -60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
//         >
//           <motion.div variants={floatVariants} animate="animate" className="relative w-full max-w-lg">
//             {/* Main dashboard card */}
//             <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-gradient-to-br from-[var(--card)] to-[var(--card)]/80 backdrop-blur-xl">
//               {/* Window bar */}
//               <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[var(--muted)]/50">
//                 <div className="w-3 h-3 rounded-full bg-red-400/80" />
//                 <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
//                 <div className="w-3 h-3 rounded-full bg-green-400/80" />
//                 <div className="flex-1 h-5 rounded-md bg-border mx-4" />
//               </div>

//               {/* Fake dashboard content */}
//               <div className="p-5 space-y-4">
//                 {/* Stat cards row */}
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { label: "الطلاب", val: "١٢٤", color: "from-primary/20 to-accent/10", border: "border-primary/30" },
//                     { label: "الحضور", val: "٩٤٪", color: "from-blue-accent/20 to-indigo-500/10", border: "border-blue-accent/30" },
//                     { label: "الإيرادات", val: "٨.٢K", color: "from-warning/20 to-orange-500/10", border: "border-warning/30" },
//                   ].map((s) => (
//                     <div key={s.label} className={`rounded-xl p-3 bg-gradient-to-br ${s.color} border ${s.border}`}>
//                       <div className="text-xs text-muted-foreground mb-1 text-right">{s.label}</div>
//                       <div className="text-xl font-black text-foreground text-right">{s.val}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Progress bars */}
//                 <div className="rounded-xl border border-border p-4 space-y-3 bg-background/50">
//                   <div className="text-sm font-semibold text-foreground text-right mb-2">تقدم الطلاب</div>
//                   {[
//                     { name: "أحمد محمد", pct: 85 },
//                     { name: "فاطمة علي", pct: 92 },
//                     { name: "يوسف إبراهيم", pct: 67 },
//                   ].map((s) => (
//                     <div key={s.name} className="space-y-1">
//                       <div className="flex justify-between text-xs">
//                         <span className="text-primary font-bold">{s.pct}٪</span>
//                         <span className="text-foreground">{s.name}</span>
//                       </div>
//                       <div className="h-1.5 bg-border rounded-full overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${s.pct}%` }}
//                           transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
//                           className="h-full bg-gradient-to-r from-emerald-400 to-accent rounded-full"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mini chart placeholder */}
//                 <div className="rounded-xl border border-border p-4 bg-background/50">
//                   <div className="text-sm font-semibold text-foreground text-right mb-3">الحضور الأسبوعي</div>
//                   <div className="flex items-end gap-1.5 h-16 justify-end">
//                     {[60, 80, 55, 90, 75, 95, 70].map((h, i) => (
//                       <motion.div
//                         key={i}
//                         initial={{ height: 0 }}
//                         animate={{ height: `${h}%` }}
//                         transition={{ duration: 0.6, delay: 0.9 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
//                         className={`flex-1 rounded-sm ${i === 5 ? "bg-primary" : "bg-primary/30"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating notification card */}
//             <motion.div
//               initial={{ opacity: 0, x: 40, y: -20 }}
//               animate={{ opacity: 1, x: 0, y: 0 }}
//               transition={{ delay: 1.2, duration: 0.6 }}
//               className="absolute -top-6 -left-8 bg-card border border-primary/30 rounded-xl p-3 shadow-xl backdrop-blur-xl flex items-center gap-3"
//             >
//               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
//                 <Bell className="w-4 h-4 text-primary" />
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-foreground">تم حفظ التقرير</div>
//                 <div className="text-xs text-muted-foreground">تقرير الحضور - رمضان</div>
//               </div>
//             </motion.div>

//             {/* Floating achievement card */}
//             <motion.div
//               initial={{ opacity: 0, x: 40, y: 20 }}
//               animate={{ opacity: 1, x: 0, y: 0 }}
//               transition={{ delay: 1.4, duration: 0.6 }}
//               className="absolute -bottom-6 -left-6 bg-card border border-warning/30 rounded-xl p-3 shadow-xl backdrop-blur-xl flex items-center gap-3"
//             >
//               <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
//                 <Trophy className="w-4 h-4 text-warning" />
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-foreground">إنجاز جديد!</div>
//                 <div className="text-xs text-muted-foreground">أحمد أتمّ جزء عمّ 🎉</div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </motion.div>

//       {/* Scroll indicator */}
//       <motion.div
//         animate={{ y: [0, 8, 0] }}
//         transition={{ duration: 2, repeat: Infinity }}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
//       >
//         <span className="text-xs">اكتشف المزيد</span>
//         <ChevronDown className="w-4 h-4" />
//       </motion.div>
//     </section>
//   );
// }

// // ─── Features Bento Grid ──────────────────────────────────────────────────────

// function Features() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-100px" });

//   const features: Feature[] = [
//     {
//       icon: <BarChart3 className="w-7 h-7" />,
//       title: "لوحة تحكم تحليلية فورية",
//       desc: "احصل على رؤية شاملة لأداء مؤسستك: معدلات الحضور، والتقدم في الحفظ، والأداء المالي — كلها في شاشة واحدة محدّثة لحظياً.",
//       span: "lg:col-span-2",
//       color: "emerald",
//     },
//     {
//       icon: <Users className="w-7 h-7" />,
//       title: "إدارة الطلاب بسهولة تامة",
//       desc: "سجّل الطلاب، تتبّع حضورهم يومياً، واستعرض ملفاتهم الكاملة بضغطة واحدة.",
//       span: "lg:col-span-1",
//       color: "blue",
//     },
//     {
//       icon: <Trophy className="w-7 h-7" />,
//       title: "نظام مكافآت وتحفيز ذكي",
//       desc: "حفّز طلابك بنظام نقاط وشارات تلقائية عند إتمام الأجزاء والحضور المنتظم. اجعل التحفيظ رحلة ممتعة.",
//       span: "lg:col-span-1",
//       color: "amber",
//     },
//     {
//       icon: <DollarSign className="w-7 h-7" />,
//       title: "محاسبة مالية متكاملة",
//       desc: "تتبّع الرسوم والمصروفات والرواتب. أنشئ كشوف حساب تفصيلية بنقرة واحدة دون الحاجة لمحاسب.",
//       span: "lg:col-span-1",
//       color: "green",
//     },
//     {
//       icon: <FileText className="w-7 h-7" />,
//       title: "تقارير ذكية في ثوانٍ",
//       desc: "صمّم تقارير احترافية وأرسلها لأولياء الأمور أو الإدارة فوراً. PDF بتصميم أنيق يعكس احترافية مؤسستك.",
//       span: "lg:col-span-2",
//       color: "purple",
//     },
//   ];

//   const colorMap: Record<string, string> = {
//     emerald: "from-primary/15 to-accent/5 border-primary/20 [&_svg]:text-primary [&_.icon-bg]:bg-primary/15",
//     blue: "from-blue-accent/15 to-indigo-500/5 border-blue-accent/20 [&_svg]:text-blue-accent [&_.icon-bg]:text-(--blue-accent)/15",
//     amber: "from-warning/15 to-orange-500/5 border-warning/20 [&_svg]:text-warning [&_.icon-bg]:bg-warning/15",
//     green: "from-green-500/15 to-primary/5 border-green-500/20 [&_svg]:text-green-500 [&_.icon-bg]:bg-green-500/15",
//     purple: "from-purple-500/15 to-violet-500/5 border-purple-500/20 [&_svg]:text-purple-500 [&_.icon-bg]:bg-purple-500/15",
//   };

//   return (
//     <section id="features" className="py-32 relative">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section header */}
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
//             <Zap className="w-3.5 h-3.5 text-primary" />
//             <span className="text-xs font-semibold text-primary">المميزات الأساسية</span>
//           </motion.div>
//           <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
//             كل ما تحتاجه في مكان واحد
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             صُمّم خصيصاً لمتطلبات المؤسسات التعليمية الإسلامية، بواجهة سهلة لا تحتاج خبرة تقنية.
//           </motion.p>
//         </motion.div>

//         {/* Bento grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {features.map((f, i) => (
//             <motion.div
//               key={f.title}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.5}
//               whileHover={{ y: -4, transition: { duration: 0.2 } }}
//               className={`${f.span ?? ""} relative group rounded-2xl border bg-gradient-to-br p-6 overflow-hidden transition-shadow hover:shadow-xl ${colorMap[f.color]}`}
//             >
//               {/* Background glow on hover */}
//               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

//               <div className="icon-bg w-12 h-12 rounded-xl flex items-center justify-center mb-4">
//                 {f.icon}
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-2 text-right">{f.title}</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed text-right">{f.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Platform Preview (Tabbed) ────────────────────────────────────────────────

// function PlatformPreview() {
//   const [activeTab, setActiveTab] = useState("students");
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const tabs: Tab[] = [
//     { id: "students", label: "متابعة الطلاب" },
//     { id: "finance", label: "الأداء المالي" },
//     { id: "attendance", label: "سجل الحضور" },
//   ];

//   const tabContent: Record<string, React.ReactNode> = {
//     students: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">لوحة تقدم الطلاب</div>
//           <div className="text-sm text-muted-foreground">متابعة شاملة لأداء كل طالب لحظة بلحظة</div>
//         </div>
//         <div className="space-y-3">
//           {[
//             { name: "أحمد محمد الزهراني", juz: "عمّ", pct: 88, badge: "🏆" },
//             { name: "فاطمة علي الحربي", juz: "تبارك", pct: 95, badge: "⭐" },
//             { name: "يوسف إبراهيم", juz: "قد سمع", pct: 62, badge: "" },
//             { name: "مريم سالم القحطاني", juz: "الذاريات", pct: 78, badge: "🎯" },
//           ].map((s) => (
//             <div key={s.name} className="flex items-center gap-4 p-3 rounded-xl bg-background/60 border border-border">
//               <div className="flex-1 space-y-1.5">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-primary font-bold">{s.pct}٪</span>
//                   <span className="text-sm font-semibold text-foreground">{s.badge} {s.name}</span>
//                 </div>
//                 <div className="h-1.5 bg-border rounded-full">
//                   <div className="h-full bg-gradient-to-r from-emerald-400 to-accent rounded-full" style={{ width: `${s.pct}%` }} />
//                 </div>
//                 <div className="text-right text-xs text-muted-foreground">جزء: {s.juz}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ),
//     finance: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">التقرير المالي الشهري</div>
//           <div className="text-sm text-muted-foreground">نظرة كاملة على الإيرادات والمصروفات</div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { label: "إجمالي الإيرادات", val: "١٢,٤٠٠ ر.س", up: true },
//             { label: "المصروفات", val: "٣,٨٠٠ ر.س", up: false },
//             { label: "صافي الربح", val: "٨,٦٠٠ ر.س", up: true },
//             { label: "الرسوم المعلّقة", val: "١,٢٠٠ ر.س", up: false },
//           ].map((s) => (
//             <div key={s.label} className={`p-4 rounded-xl border text-right ${s.up ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"}`}>
//               <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
//               <div className={`text-lg font-black ${s.up ? "text-primary" : "text-destructive"}`}>{s.val}</div>
//             </div>
//           ))}
//         </div>
//         {/* Bar chart mockup */}
//         <div className="p-4 rounded-xl border border-border bg-background/50">
//           <div className="text-sm font-semibold text-foreground text-right mb-3">الإيرادات الشهرية</div>
//           <div className="flex items-end gap-2 h-20">
//             {[65, 80, 55, 90, 72, 88].map((h, i) => (
//               <div key={i} className="flex-1 flex flex-col items-center gap-1">
//                 <div
//                   className={`w-full rounded-sm ${i === 5 ? "bg-primary" : "bg-primary/30"}`}
//                   style={{ height: `${h}%` }}
//                 />
//                 <span className="text-xs text-muted-foreground">{["ي", "ف", "م", "أ", "م", "ي"][i]}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     ),
//     attendance: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">سجل الحضور اليومي</div>
//           <div className="text-sm text-muted-foreground">الثلاثاء ١٤ رمضان — حلقة الفجر</div>
//         </div>
//         <div className="space-y-2">
//           {[
//             { name: "أحمد محمد", status: "حاضر", time: "٥:١٠ ص" },
//             { name: "فاطمة علي", status: "حاضر", time: "٥:٠٥ ص" },
//             { name: "يوسف إبراهيم", status: "غائب", time: "—" },
//             { name: "مريم سالم", status: "حاضر", time: "٥:١٢ ص" },
//             { name: "خالد العمري", status: "متأخر", time: "٥:٣٠ ص" },
//           ].map((s) => (
//             <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border">
//               <span className="text-xs text-muted-foreground">{s.time}</span>
//               <div className="flex items-center gap-3">
//                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                   s.status === "حاضر" ? "bg-primary/15 text-primary" :
//                   s.status === "غائب" ? "bg-destructive/15 text-destructive" :
//                   "bg-warning/15 -warning"
//                 }`}>{s.status}</span>
//                 <span className="text-sm font-semibold text-foreground">{s.name}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--muted)]/50 border border-border">
//           <span className="text-sm font-bold text-primary">٨٠٪ معدل الحضور</span>
//           <span className="text-sm font-semibold text-foreground">الإجمالي: ٤ حضور / ١ غياب</span>
//         </div>
//       </div>
//     ),
//   };

//   return (
//     <section id="preview" className="py-32 relative overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-(--blue-accent)/10 border border-blue-accent/20 rounded-full px-4 py-1.5 mb-5">
//             <GraduationCap className="w-3.5 h-3.5 text-blue-accent" />
//             <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">داخل النظام</span>
//           </motion.div>
//           <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
//             شاهد النظام بنفسك
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-xl mx-auto">
//             واجهة سلسة ومريحة للعين، صُمّمت لتوفير الوقت وتقليل التعقيد.
//           </motion.p>
//         </motion.div>

//         <motion.div
//           variants={fadeUp}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           custom={3}
//           className="max-w-4xl mx-auto"
//         >
//           {/* Tab container with glassmorphism */}
//           <div className="relative rounded-2xl border border-border overflow-hidden bg-card shadow-2xl shadow-black/10">
//             {/* Glowing border top */}
//             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

//             {/* Tabs */}
//             <LayoutGroup>
//               <div className="flex items-center gap-1 p-2 border-b border-border bg-[var(--muted)]/40 backdrop-blur-sm">
//                 {/* Window dots */}
//                 <div className="flex items-center gap-1.5 px-2 mr-2">
//                   <div className="w-3 h-3 rounded-full bg-red-400/70" />
//                   <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
//                   <div className="w-3 h-3 rounded-full bg-green-400/70" />
//                 </div>
//                 <div className="flex-1 flex justify-end gap-1">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
//                         activeTab === tab.id
//                           ? "text-foreground"
//                           : "text-muted-foreground hover:text-foreground"
//                       }`}
//                     >
//                       {activeTab === tab.id && (
//                         <motion.div
//                           layoutId="active-tab-bg"
//                           className="absolute inset-0 bg-background rounded-lg border border-border shadow-sm"
//                           transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
//                         />
//                       )}
//                       <span className="relative z-10">{tab.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </LayoutGroup>

//             {/* Tab content */}
//             <div className="min-h-[420px]">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -12 }}
//                   transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//                 >
//                   {tabContent[activeTab]}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── Pain vs. Solution ────────────────────────────────────────────────────────

// function PainVsSolution() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const comparisons: PainPoint[] = [
//     { old: "أوراق وسجلات مبعثرة يصعب الوصول إليها", newWay: "ملفات رقمية منظّمة في متناول يدك دائماً" },
//     { old: "حساب الحضور يدوياً كل يوم يستغرق ساعة", newWay: "تسجيل الحضور في ثوانٍ بضغطة واحدة" },
//     { old: "تقارير مالية معقدة تحتاج محاسباً خارجياً", newWay: "تقارير مالية احترافية تُولَّد تلقائياً" },
//     { old: "لا يوجد نظام لتحفيز الطلاب ومتابعة تقدمهم", newWay: "نظام مكافآت ذكي يُحفّز الطلاب ويتابع تقدمهم" },
//     { old: "أولياء الأمور لا يعرفون مستوى أبنائهم", newWay: "تقارير تلقائية لأولياء الأمور عبر واتساب أو البريد" },
//   ];

//   return (
//     <section className="py-32 relative">
//       <div className="max-w-6xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
//             من الفوضى إلى النظام
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-xl mx-auto">
//             أنهِ معاناتك مع الأساليب التقليدية إلى الأبد.
//           </motion.p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Old way */}
//           <motion.div
//             variants={fadeUp}
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 space-y-4"
//           >
//             <div className="flex items-center gap-3 justify-end mb-6">
//               <span className="text-xl font-black text-destructive">الطريقة القديمة</span>
//               <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
//                 <XCircle className="w-5 h-5 text-destructive" />
//               </div>
//             </div>
//             {comparisons.map((c) => (
//               <div key={c.old} className="flex items-start gap-3 justify-end">
//                 <span className="text-sm text-muted-foreground text-right leading-relaxed">{c.old}</span>
//                 <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
//               </div>
//             ))}
//           </motion.div>

//           {/* New way */}
//           <motion.div
//             variants={fadeUp}
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             custom={1}
//             className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4"
//           >
//             <div className="flex items-center gap-3 justify-end mb-6">
//               <span className="text-xl font-black text-primary">مع مسجد ERP</span>
//               <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-primary" />
//               </div>
//             </div>
//             {comparisons.map((c) => (
//               <div key={c.newWay} className="flex items-start gap-3 justify-end">
//                 <span className="text-sm text-foreground text-right leading-relaxed font-medium">{c.newWay}</span>
//                 <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Audience ─────────────────────────────────────────────────────────────────

// function Audience() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const cards = [
//     {
//       icon: <Mosque className="w-8 h-8" />,
//       title: "المساجد والحلقات",
//       desc: "أدِر حلقات التحفيظ، وتابع أئمة الحلقات، وسجّل حضور طلابك بكل سهولة.",
//       color: "emerald",
//     },
//     {
//       icon: <BookOpen className="w-8 h-8" />,
//       title: "مراكز تحفيظ القرآن",
//       desc: "نظام متكامل يغطي كل جوانب إدارة مراكز التحفيظ من التسجيل حتى التخرج.",
//       color: "blue",
//     },
//     {
//       icon: <GraduationCap className="w-8 h-8" />,
//       title: "المدارس الإسلامية",
//       desc: "إدارة شاملة للمناهج، الدرجات، الحضور، وتواصل مباشر مع أولياء الأمور.",
//       color: "amber",
//     },
//   ];

//   const colorMap: Record<string, string> = {
//     emerald: "text-primary bg-primary/15",
//     blue: "text-blue-accent text-(--blue-accent)/15",
//     amber: "text-warning bg-warning/15",
//   };

//   return (
//     <section id="audience" className="py-32 bg-[var(--muted)]/30">
//       <div className="max-w-6xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
//             لمن صُمّم هذا النظام؟
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-xl mx-auto">
//             بُنِي خصيصاً لتلبية احتياجات المؤسسات التعليمية الإسلامية بكل أشكالها.
//           </motion.p>
//         </motion.div>
//         <div className="grid md:grid-cols-3 gap-6">
//           {cards.map((c, i) => (
//             <motion.div
//               key={c.title}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.5}
//               whileHover={{ y: -4 }}
//               className="rounded-2xl border border-border bg-card p-8 text-right group hover:border-foreground/20 transition-all duration-300"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colorMap[c.color]} mr-auto`}>
//                 {c.icon}
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-3">{c.title}</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Trust & Values ───────────────────────────────────────────────────────────

// function TrustSection() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   return (
//     <section className="py-32 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
//       <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <motion.div variants={fadeUp} className="text-6xl mb-6">🕌</motion.div>
//           <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
//             رسالتنا: تمكين التعليم الإسلامي
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-loose mb-8 max-w-3xl mx-auto">
//             نؤمن أن مراكز تحفيظ القرآن الكريم تستحق أفضل الأدوات التقنية. لم يعد المدير مضطراً للاختيار بين رسالته التعليمية وإدارة مؤسسته. <span className="text-primary font-semibold">مسجد ERP</span> يتولى عبء الإدارة، لتتفرّغ أنت للأهم: تربية الأجيال وتحفيظ كلام الله.
//           </motion.p>
//           <motion.div variants={fadeUp} custom={3} className="flex justify-center gap-8 flex-wrap">
//             {[
//               { icon: <Shield className="w-5 h-5" />, label: "بيانات آمنة ومشفّرة" },
//               { icon: <Zap className="w-5 h-5" />, label: "أداء خاطف وموثوق" },
//               { icon: <Star className="w-5 h-5" />, label: "دعم فني على مدار الساعة" },
//             ].map((t) => (
//               <div key={t.label} className="flex items-center gap-2 text-muted-foreground">
//                 <span className="text-primary">{t.icon}</span>
//                 <span className="text-sm font-medium">{t.label}</span>
//               </div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── FAQ ──────────────────────────────────────────────────────────────────────

// function FAQ() {
//   const [openIdx, setOpenIdx] = useState<number | null>(null);
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const faqs: FAQItem[] = [
//     {
//       q: "هل النظام مجاني تماماً؟",
//       a: "نعم، منصة مسجد ERP مجانية بالكامل للمؤسسات التعليمية الإسلامية. نؤمن أن هذه المؤسسات تستحق أحسن الأدوات دون أعباء مالية.",
//     },
//     {
//       q: "هل يتطلب استخدام النظام خبرة تقنية؟",
//       a: "لا على الإطلاق. صُمّم النظام بواجهة بسيطة وسهلة يستطيع أي شخص استخدامها دون أي تدريب مسبق. ويوفر فريق الدعم مساعدة فورية عند الحاجة.",
//     },
//     {
//       q: "هل بيانات الطلاب والمؤسسة آمنة؟",
//       a: "أمان بياناتك أولويتنا القصوى. نستخدم تشفيراً من الدرجة البنكية، ونُجري نسخاً احتياطية يومية تلقائية. لا يصل أحد غيرك لبيانات مؤسستك.",
//     },
//     {
//       q: "هل يدعم النظام لغة عربية كاملة؟",
//       a: "نعم، النظام بالكامل بالعربية مع دعم كامل لاتجاه الكتابة من اليمين لليسار (RTL)، ومصمم خصيصاً للمستخدم العربي.",
//     },
//     {
//       q: "هل يمكنني إضافة أكثر من مدير للنظام؟",
//       a: "بالتأكيد. يدعم النظام إضافة عدة مستخدمين بصلاحيات مختلفة (مدير، معلم، محاسب) مع تحكم كامل في مستوى الوصول لكل منهم.",
//     },
//   ];

//   return (
//     <section id="faq" className="py-32 bg-[var(--muted)]/20">
//       <div className="max-w-3xl mx-auto px-6" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-14"
//         >
//           <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
//             الأسئلة الشائعة
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground">
//             لديك سؤال آخر؟ فريق الدعم مستعد دائماً.
//           </motion.p>
//         </motion.div>

//         <div className="space-y-3">
//           {faqs.map((faq, i) => (
//             <motion.div
//               key={i}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.3}
//               className="rounded-xl border border-border bg-card overflow-hidden"
//             >
//               <button
//                 className="w-full flex items-center justify-between p-5 text-right gap-4"
//                 onClick={() => setOpenIdx(openIdx === i ? null : i)}
//               >
//                 <motion.div
//                   animate={{ rotate: openIdx === i ? 180 : 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                 </motion.div>
//                 <span className="font-semibold text-foreground flex-1 text-right">{faq.q}</span>
//               </button>
//               <AnimatePresence>
//                 {openIdx === i && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//                   >
//                     <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed text-right border-t border-border pt-4">
//                       {faq.a}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Bottom CTA ───────────────────────────────────────────────────────────────

// function BottomCTA() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   return (
//     <section className="py-32 relative overflow-hidden">
//       {/* Gradient background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-blue-600/15 pointer-events-none" />
//       <div className="absolute inset-0 bg-background/60 pointer-events-none" />

//       {/* Decorative circles */}
//       <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
//       <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />

//       <div className="relative max-w-4xl mx-auto px-6 text-center" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <motion.div variants={fadeUp} className="text-5xl mb-6">✨</motion.div>
//           <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
//             ابدأ رحلة التحول الرقمي{" "}
//             <span className="bg-gradient-to-l from-emerald-400 to-accent bg-clip-text text-transparent">
//               اليوم
//             </span>
//           </motion.h2>
//           <motion.p variants={fadeUp} custom={2} className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
//             انضم إلى أكثر من ٥٠٠ مؤسسة إسلامية تدير عملياتها بذكاء وكفاءة. التسجيل مجاني، والبدء يستغرق أقل من دقيقتين.
//           </motion.p>
//           <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
//             <a
//               href="/register"
//               className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 py-4 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-lg"
//             >
//               <span>أنشئ حسابك مجاناً</span>
//               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             </a>
//             <div className="text-sm text-muted-foreground">لا يلزم بطاقة ائتمان • مجاني للأبد</div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── Footer ───────────────────────────────────────────────────────────────────

// function Footer() {
//   return (
//     <footer className="border-t border-border py-10 bg-[var(--muted)]/20">
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-right">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
//             <Mosque className="w-3.5 h-3.5 text-white" />
//           </div>
//           <span className="font-bold text-foreground">مسجد<span className="text-primary">ERP</span></span>
//         </div>
//         <p className="text-sm text-muted-foreground">
//           © {new Date().getFullYear()} مسجد ERP. جميع الحقوق محفوظة. صُنع بـ ❤️ لخدمة التعليم الإسلامي.
//         </p>
//       </div>
//     </footer>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function LandingPage() {
//   return (
//     <div dir="rtl" className="min-h-screen bg-background text-foreground font-sans antialiased">
//       <Navbar />
//       <main>
//         <Hero />
//         <Features />
//         <PlatformPreview />
//         <PainVsSolution />
//         <Audience />
//         <TrustSection />
//         <FAQ />
//         <BottomCTA />
//       </main>
//       <Footer />
//     </div>
//   );
// }
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useInView,
//   AnimatePresence,
//   LayoutGroup,
// } from "framer-motion";
// import {
//   BookOpen,
//   Users,
//   BarChart3,
//   DollarSign,
//   CalendarCheck,
//   Shield,
//   Zap,
//   Star,
//   ChevronDown,
//   ArrowLeft,
//   GraduationCap,
//   Trophy,
//   Bell,
//   FileText,
//   CheckCircle,
//   XCircle,
//   Menu,
//   X,
//   Sparkles,
// } from "lucide-react";

// // ─── Animation Variants ───────────────────────────────────────────────────────

// const fadeUp = {
//   hidden: { opacity: 0, y: 32 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
//   }),
// };

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     transition: { duration: 0.5, delay: i * 0.08 },
//   }),
// };

// const staggerContainer = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.1 } },
// };

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FAQItem {
//   q: string;
//   a: string;
// }
// interface Feature {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   span?: string;
//   color: string;
// }
// interface Tab {
//   id: string;
//   label: string;
// }
// interface PainPoint {
//   old: string;
//   newWay: string;
// }

// // ─── Navbar ───────────────────────────────────────────────────────────────────

// function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", handler);
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   const links = [
//     { href: "#features", label: "المميزات" },
//     { href: "#preview", label: "داخل النظام" },
//     { href: "#audience", label: "لمن هذا النظام؟" },
//     { href: "#faq", label: "الأسئلة الشائعة" },
//   ];

//   return (
//     <motion.nav
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
//         scrolled
//           ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//         {/* Logo */}
//         <a href="#" className="flex items-center gap-2 group">
//           <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
//             <BookOpen className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-lg tracking-tight text-foreground">
//             مسجد<span className="text-primary">ERP</span>
//           </span>
//         </a>

//         {/* Desktop links */}
//         <div className="hidden md:flex items-center gap-8">
//           {links.map((l) => (
//             <a
//               key={l.href}
//               href={l.href}
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
//             >
//               {l.label}
//             </a>
//           ))}
//         </div>

//         {/* CTA buttons */}
//         <div className="hidden md:flex items-center gap-3">
//           <a
//             href="/login"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
//           >
//             تسجيل الدخول
//           </a>
//           <a
//             href="/register"
//             className="text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg px-5 py-2 transition-colors shadow-md shadow-primary/25 hover:shadow-primary/40"
//           >
//             ابدأ مجاناً
//           </a>
//         </div>

//         {/* Mobile toggle */}
//         <button
//           className="md:hidden p-2 text-muted-foreground"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-background border-b border-border overflow-hidden"
//           >
//             <div className="px-6 py-4 flex flex-col gap-4">
//               {links.map((l) => (
//                 <a
//                   key={l.href}
//                   href={l.href}
//                   className="text-sm font-medium text-foreground"
//                   onClick={() => setOpen(false)}
//                 >
//                   {l.label}
//                 </a>
//               ))}
//               <a
//                 href="/register"
//                 className="mt-2 text-sm font-semibold bg-primary text-white rounded-lg px-5 py-2.5 text-center"
//               >
//                 ابدأ مجاناً
//               </a>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }

// // ─── Hero ─────────────────────────────────────────────────────────────────────

// function Hero() {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });
//   const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
//   const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

//   // Floating animation for mockup
//   const floatVariants = {
//     animate: {
//       y: [-10, 10, -10],
//       rotate: [-1, 1, -1],
//       transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
//     },
//   };

//   return (
//     <section
//       ref={ref}
//       className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
//     >
//       {/* Background gradients */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 right-0 w-150 h-150 bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
//         <div className="absolute bottom-0 left-0 w-125 h-125 bg-accent/30 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-primary/90/5 rounded-full blur-[80px]" />
//       </div>

//       {/* Geometric grid overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
//         style={{
//           backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <motion.div
//         style={{ y, opacity }}
//         className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center"
//       >
//         {/* Text content */}
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate="visible"
//           className="text-right order-2 lg:order-1"
//         >
//           {/* Badge */}
//           <motion.div
//             variants={fadeUp}
//             className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
//           >
//             <Sparkles className="w-3.5 h-3.5 text-primary" />
//             <span className="text-xs font-semibold text-primary">
//               منصة مجانية بالكامل للمؤسسات التعليمية
//             </span>
//           </motion.div>

//           {/* Headline */}
//           <motion.h1
//             variants={fadeUp}
//             custom={1}
//             className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-foreground mb-6"
//           >
//             تفرّغ لرسالتك..{" "}
//             <span className="relative">
//               <span className="relative z-10 bg-linear-to-l from-emerald-400 to-accent bg-clip-text text-transparent">
//                 ودع لنا
//               </span>
//               <motion.span
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{
//                   delay: 0.8,
//                   duration: 0.6,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="absolute bottom-1 right-0 left-0 h-3 bg-primary/15 rounded-sm origin-right"
//               />
//             </span>{" "}
//             عبء الإدارة.
//           </motion.h1>

//           {/* Subheadline */}
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
//           >
//             منصة سحابية متكاملة لإدارة مراكز تحفيظ القرآن والمؤسسات التعليمية
//             الإسلامية. تتبّع الطلاب، أدِر الماليات، وأنشئ تقاريرك في ثوانٍ — كل
//             ذلك من مكان واحد.
//           </motion.p>

//           {/* CTAs */}
//           <motion.div
//             variants={fadeUp}
//             custom={3}
//             className="flex flex-wrap items-center gap-4 justify-end"
//           >
//             <a
//               href="/register"
//               className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-7 py-3.5 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-base"
//             >
//               <span>ابدأ مجاناً الآن</span>
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             </a>
//             <a
//               href="#preview"
//               className="flex items-center gap-2 border border-border hover:border-(--foreground)/30 text-foreground font-semibold rounded-xl px-7 py-3.5 transition-all duration-300 text-base bg-(--card)/50 backdrop-blur-sm"
//             >
//               <span>شاهد النظام</span>
//             </a>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             variants={fadeUp}
//             custom={4}
//             className="flex items-center gap-8 justify-end mt-12 pt-8 border-t border-border"
//           >
//             {[
//               { num: "+٥٠٠", label: "مؤسسة تثق بنا" },
//               { num: "+١٢K", label: "طالب مسجّل" },
//               { num: "٩٩.٩٪", label: "وقت التشغيل" },
//             ].map((s) => (
//               <div key={s.label} className="text-right">
//                 <div className="text-2xl font-black text-foreground">
//                   {s.num}
//                 </div>
//                 <div className="text-xs text-muted-foreground">{s.label}</div>
//               </div>
//             ))}
//           </motion.div>
//         </motion.div>

//         {/* Mockup */}
//         <motion.div
//           className="relative order-1 lg:order-2 flex justify-center lg:justify-start"
//           initial={{ opacity: 0, x: -60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
//         >
//           <motion.div
//             variants={floatVariants}
//             animate="animate"
//             className="relative w-full max-w-lg"
//           >
//             {/* Main dashboard card */}
//             <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-linear-to-br from-card to-(--card)/80 backdrop-blur-xl">
//               {/* Window bar */}
//               <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-(--muted)/50">
//                 <div className="w-3 h-3 rounded-full bg-red-400/80" />
//                 <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
//                 <div className="w-3 h-3 rounded-full bg-green-400/80" />
//                 <div className="flex-1 h-5 rounded-md bg-border mx-4" />
//               </div>

//               {/* Fake dashboard content */}
//               <div className="p-5 space-y-4">
//                 {/* Stat cards row */}
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     {
//                       label: "الطلاب",
//                       val: "١٢٤",
//                       color: "from-primary/20 to-accent/10",
//                       border: "border-primary/30",
//                     },
//                     {
//                       label: "الحضور",
//                       val: "٩٤٪",
//                       color: "from-blue-accent/20 to-indigo-500/10",
//                       border: "border-blue-accent/30",
//                     },
//                     {
//                       label: "الإيرادات",
//                       val: "٨.٢K",
//                       color: "from-warning/20 to-orange-500/10",
//                       border: "border-warning/30",
//                     },
//                   ].map((s) => (
//                     <div
//                       key={s.label}
//                       className={`rounded-xl p-3 bg-linear-to-br ${s.color} border ${s.border}`}
//                     >
//                       <div className="text-xs text-muted-foreground mb-1 text-right">
//                         {s.label}
//                       </div>
//                       <div className="text-xl font-black text-foreground text-right">
//                         {s.val}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Progress bars */}
//                 <div className="rounded-xl border border-border p-4 space-y-3 bg-background/50">
//                   <div className="text-sm font-semibold text-foreground text-right mb-2">
//                     تقدم الطلاب
//                   </div>
//                   {[
//                     { name: "أحمد محمد", pct: 85 },
//                     { name: "فاطمة علي", pct: 92 },
//                     { name: "يوسف إبراهيم", pct: 67 },
//                   ].map((s) => (
//                     <div key={s.name} className="space-y-1">
//                       <div className="flex justify-between text-xs">
//                         <span className="text-primary font-bold">
//                           {s.pct}٪
//                         </span>
//                         <span className="text-foreground">{s.name}</span>
//                       </div>
//                       <div className="h-1.5 bg-border rounded-full overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${s.pct}%` }}
//                           transition={{
//                             duration: 1.2,
//                             delay: 0.8,
//                             ease: [0.22, 1, 0.36, 1],
//                           }}
//                           className="h-full bg-linear-to-r from-emerald-400 to-accent rounded-full"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mini chart placeholder */}
//                 <div className="rounded-xl border border-border p-4 bg-background/50">
//                   <div className="text-sm font-semibold text-foreground text-right mb-3">
//                     الحضور الأسبوعي
//                   </div>
//                   <div className="flex items-end gap-1.5 h-16 justify-end">
//                     {[60, 80, 55, 90, 75, 95, 70].map((h, i) => (
//                       <motion.div
//                         key={i}
//                         initial={{ height: 0 }}
//                         animate={{ height: `${h}%` }}
//                         transition={{
//                           duration: 0.6,
//                           delay: 0.9 + i * 0.05,
//                           ease: [0.22, 1, 0.36, 1],
//                         }}
//                         className={`flex-1 rounded-sm ${i === 5 ? "bg-primary" : "bg-primary/30"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating notification card */}
//             <motion.div
//               initial={{ opacity: 0, x: 40, y: -20 }}
//               animate={{ opacity: 1, x: 0, y: 0 }}
//               transition={{ delay: 1.2, duration: 0.6 }}
//               className="absolute -top-6 -left-8 bg-card border border-primary/30 rounded-xl p-3 shadow-xl backdrop-blur-xl flex items-center gap-3"
//             >
//               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
//                 <Bell className="w-4 h-4 text-primary" />
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-foreground">
//                   تم حفظ التقرير
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   تقرير الحضور - رمضان
//                 </div>
//               </div>
//             </motion.div>

//             {/* Floating achievement card */}
//             <motion.div
//               initial={{ opacity: 0, x: 40, y: 20 }}
//               animate={{ opacity: 1, x: 0, y: 0 }}
//               transition={{ delay: 1.4, duration: 0.6 }}
//               className="absolute -bottom-6 -left-6 bg-card border border-warning/30 rounded-xl p-3 shadow-xl backdrop-blur-xl flex items-center gap-3"
//             >
//               <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
//                 <Trophy className="w-4 h-4 text-warning" />
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-foreground">
//                   إنجاز جديد!
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   أحمد أتمّ جزء عمّ 🎉
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </motion.div>

//       {/* Scroll indicator */}
//       <motion.div
//         animate={{ y: [0, 8, 0] }}
//         transition={{ duration: 2, repeat: Infinity }}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
//       >
//         <span className="text-xs">اكتشف المزيد</span>
//         <ChevronDown className="w-4 h-4" />
//       </motion.div>
//     </section>
//   );
// }

// // ─── Features Bento Grid ──────────────────────────────────────────────────────

// function Features() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-100px" });

//   const features: Feature[] = [
//     {
//       icon: <BarChart3 className="w-7 h-7" />,
//       title: "لوحة تحكم تحليلية فورية",
//       desc: "احصل على رؤية شاملة لأداء مؤسستك: معدلات الحضور، والتقدم في الحفظ، والأداء المالي — كلها في شاشة واحدة محدّثة لحظياً.",
//       span: "lg:col-span-2",
//       color: "emerald",
//     },
//     {
//       icon: <Users className="w-7 h-7" />,
//       title: "إدارة الطلاب بسهولة تامة",
//       desc: "سجّل الطلاب، تتبّع حضورهم يومياً، واستعرض ملفاتهم الكاملة بضغطة واحدة.",
//       span: "lg:col-span-1",
//       color: "blue",
//     },
//     {
//       icon: <Trophy className="w-7 h-7" />,
//       title: "نظام مكافآت وتحفيز ذكي",
//       desc: "حفّز طلابك بنظام نقاط وشارات تلقائية عند إتمام الأجزاء والحضور المنتظم. اجعل التحفيظ رحلة ممتعة.",
//       span: "lg:col-span-1",
//       color: "amber",
//     },
//     {
//       icon: <DollarSign className="w-7 h-7" />,
//       title: "محاسبة مالية متكاملة",
//       desc: "تتبّع الرسوم والمصروفات والرواتب. أنشئ كشوف حساب تفصيلية بنقرة واحدة دون الحاجة لمحاسب.",
//       span: "lg:col-span-1",
//       color: "green",
//     },
//     {
//       icon: <FileText className="w-7 h-7" />,
//       title: "تقارير ذكية في ثوانٍ",
//       desc: "صمّم تقارير احترافية وأرسلها لأولياء الأمور أو الإدارة فوراً. PDF بتصميم أنيق يعكس احترافية مؤسستك.",
//       span: "lg:col-span-2",
//       color: "purple",
//     },
//   ];

//   const colorMap: Record<string, string> = {
//     emerald:
//       "from-primary/15 to-accent/5 border-primary/20 [&_svg]:text-primary [&_.icon-bg]:bg-primary/15",
//     blue: "from-blue-accent/15 to-indigo-500/5 border-blue-accent/20 [&_svg]:text-blue-accent [&_.icon-bg]:text-(--blue-accent)/15",
//     amber:
//       "from-warning/15 to-orange-500/5 border-warning/20 [&_svg]:text-warning [&_.icon-bg]:bg-warning/15",
//     green:
//       "from-green-500/15 to-primary/5 border-green-500/20 [&_svg]:text-green-500 [&_.icon-bg]:bg-green-500/15",
//     purple:
//       "from-purple-500/15 to-violet-500/5 border-purple-500/20 [&_svg]:text-purple-500 [&_.icon-bg]:bg-purple-500/15",
//   };

//   return (
//     <section id="features" className="py-32 relative">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section header */}
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.div
//             variants={fadeUp}
//             className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5"
//           >
//             <Zap className="w-3.5 h-3.5 text-primary" />
//             <span className="text-xs font-semibold text-primary">
//               المميزات الأساسية
//             </span>
//           </motion.div>
//           <motion.h2
//             variants={fadeUp}
//             custom={1}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-4"
//           >
//             كل ما تحتاجه في مكان واحد
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-lg text-muted-foreground max-w-2xl mx-auto"
//           >
//             صُمّم خصيصاً لمتطلبات المؤسسات التعليمية الإسلامية، بواجهة سهلة لا
//             تحتاج خبرة تقنية.
//           </motion.p>
//         </motion.div>

//         {/* Bento grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {features.map((f, i) => (
//             <motion.div
//               key={f.title}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.5}
//               whileHover={{ y: -4, transition: { duration: 0.2 } }}
//               className={`${f.span ?? ""} relative group rounded-2xl border bg-linear-to-br p-6 overflow-hidden transition-shadow hover:shadow-xl ${colorMap[f.color]}`}
//             >
//               {/* Background glow on hover */}
//               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

//               <div className="icon-bg w-12 h-12 rounded-xl flex items-center justify-center mb-4">
//                 {f.icon}
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-2 text-right">
//                 {f.title}
//               </h3>
//               <p className="text-sm text-muted-foreground leading-relaxed text-right">
//                 {f.desc}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Platform Preview (Tabbed) ────────────────────────────────────────────────

// function PlatformPreview() {
//   const [activeTab, setActiveTab] = useState("students");
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const tabs: Tab[] = [
//     { id: "students", label: "متابعة الطلاب" },
//     { id: "finance", label: "الأداء المالي" },
//     { id: "attendance", label: "سجل الحضور" },
//   ];

//   const tabContent: Record<string, React.ReactNode> = {
//     students: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">
//             لوحة تقدم الطلاب
//           </div>
//           <div className="text-sm text-muted-foreground">
//             متابعة شاملة لأداء كل طالب لحظة بلحظة
//           </div>
//         </div>
//         <div className="space-y-3">
//           {[
//             { name: "أحمد محمد الزهراني", juz: "عمّ", pct: 88, badge: "🏆" },
//             { name: "فاطمة علي الحربي", juz: "تبارك", pct: 95, badge: "⭐" },
//             { name: "يوسف إبراهيم", juz: "قد سمع", pct: 62, badge: "" },
//             {
//               name: "مريم سالم القحطاني",
//               juz: "الذاريات",
//               pct: 78,
//               badge: "🎯",
//             },
//           ].map((s) => (
//             <div
//               key={s.name}
//               className="flex items-center gap-4 p-3 rounded-xl bg-background/60 border border-border"
//             >
//               <div className="flex-1 space-y-1.5">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-primary font-bold">
//                     {s.pct}٪
//                   </span>
//                   <span className="text-sm font-semibold text-foreground">
//                     {s.badge} {s.name}
//                   </span>
//                 </div>
//                 <div className="h-1.5 bg-border rounded-full">
//                   <div
//                     className="h-full bg-linear-to-r from-emerald-400 to-accent rounded-full"
//                     style={{ width: `${s.pct}%` }}
//                   />
//                 </div>
//                 <div className="text-right text-xs text-muted-foreground">
//                   جزء: {s.juz}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ),
//     finance: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">
//             التقرير المالي الشهري
//           </div>
//           <div className="text-sm text-muted-foreground">
//             نظرة كاملة على الإيرادات والمصروفات
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { label: "إجمالي الإيرادات", val: "١٢,٤٠٠ ر.س", up: true },
//             { label: "المصروفات", val: "٣,٨٠٠ ر.س", up: false },
//             { label: "صافي الربح", val: "٨,٦٠٠ ر.س", up: true },
//             { label: "الرسوم المعلّقة", val: "١,٢٠٠ ر.س", up: false },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className={`p-4 rounded-xl border text-right ${s.up ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"}`}
//             >
//               <div className="text-xs text-muted-foreground mb-1">
//                 {s.label}
//               </div>
//               <div
//                 className={`text-lg font-black ${s.up ? "text-primary" : "text-destructive"}`}
//               >
//                 {s.val}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Bar chart mockup */}
//         <div className="p-4 rounded-xl border border-border bg-background/50">
//           <div className="text-sm font-semibold text-foreground text-right mb-3">
//             الإيرادات الشهرية
//           </div>
//           <div className="flex items-end gap-2 h-20">
//             {[65, 80, 55, 90, 72, 88].map((h, i) => (
//               <div key={i} className="flex-1 flex flex-col items-center gap-1">
//                 <div
//                   className={`w-full rounded-sm ${i === 5 ? "bg-primary" : "bg-primary/30"}`}
//                   style={{ height: `${h}%` }}
//                 />
//                 <span className="text-xs text-muted-foreground">
//                   {["ي", "ف", "م", "أ", "م", "ي"][i]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     ),
//     attendance: (
//       <div className="p-6 space-y-4 h-full">
//         <div className="text-right">
//           <div className="text-lg font-bold text-foreground mb-1">
//             سجل الحضور اليومي
//           </div>
//           <div className="text-sm text-muted-foreground">
//             الثلاثاء ١٤ رمضان — حلقة الفجر
//           </div>
//         </div>
//         <div className="space-y-2">
//           {[
//             { name: "أحمد محمد", status: "حاضر", time: "٥:١٠ ص" },
//             { name: "فاطمة علي", status: "حاضر", time: "٥:٠٥ ص" },
//             { name: "يوسف إبراهيم", status: "غائب", time: "—" },
//             { name: "مريم سالم", status: "حاضر", time: "٥:١٢ ص" },
//             { name: "خالد العمري", status: "متأخر", time: "٥:٣٠ ص" },
//           ].map((s) => (
//             <div
//               key={s.name}
//               className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border"
//             >
//               <span className="text-xs text-muted-foreground">{s.time}</span>
//               <div className="flex items-center gap-3">
//                 <span
//                   className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                     s.status === "حاضر"
//                       ? "bg-primary/15 text-primary"
//                       : s.status === "غائب"
//                         ? "bg-destructive/15 text-destructive"
//                         : "bg-warning/15 -warning"
//                   }`}
//                 >
//                   {s.status}
//                 </span>
//                 <span className="text-sm font-semibold text-foreground">
//                   {s.name}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between items-center p-3 rounded-xl bg-(--muted)/50 border border-border">
//           <span className="text-sm font-bold text-primary">
//             ٨٠٪ معدل الحضور
//           </span>
//           <span className="text-sm font-semibold text-foreground">
//             الإجمالي: ٤ حضور / ١ غياب
//           </span>
//         </div>
//       </div>
//     ),
//   };

//   return (
//     <section id="preview" className="py-32 relative overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.div
//             variants={fadeUp}
//             className="inline-flex items-center gap-2 text-(--blue-accent)/10 border border-blue-accent/20 rounded-full px-4 py-1.5 mb-5"
//           >
//             <GraduationCap className="w-3.5 h-3.5 text-blue-accent" />
//             <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
//               داخل النظام
//             </span>
//           </motion.div>
//           <motion.h2
//             variants={fadeUp}
//             custom={1}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-4"
//           >
//             شاهد النظام بنفسك
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-lg text-muted-foreground max-w-xl mx-auto"
//           >
//             واجهة سلسة ومريحة للعين، صُمّمت لتوفير الوقت وتقليل التعقيد.
//           </motion.p>
//         </motion.div>

//         <motion.div
//           variants={fadeUp}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           custom={3}
//           className="max-w-4xl mx-auto"
//         >
//           {/* Tab container with glassmorphism */}
//           <div className="relative rounded-2xl border border-border overflow-hidden bg-card shadow-2xl shadow-black/10">
//             {/* Glowing border top */}
//             <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

//             {/* Tabs */}
//             <LayoutGroup>
//               <div className="flex items-center gap-1 p-2 border-b border-border bg-(--muted)/40 backdrop-blur-sm">
//                 {/* Window dots */}
//                 <div className="flex items-center gap-1.5 px-2 mr-2">
//                   <div className="w-3 h-3 rounded-full bg-red-400/70" />
//                   <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
//                   <div className="w-3 h-3 rounded-full bg-green-400/70" />
//                 </div>
//                 <div className="flex-1 flex justify-end gap-1">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
//                         activeTab === tab.id
//                           ? "text-foreground"
//                           : "text-muted-foreground hover:text-foreground"
//                       }`}
//                     >
//                       {activeTab === tab.id && (
//                         <motion.div
//                           layoutId="active-tab-bg"
//                           className="absolute inset-0 bg-background rounded-lg border border-border shadow-sm"
//                           transition={{
//                             type: "spring",
//                             bounce: 0.2,
//                             duration: 0.5,
//                           }}
//                         />
//                       )}
//                       <span className="relative z-10">{tab.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </LayoutGroup>

//             {/* Tab content */}
//             <div className="min-h-105">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -12 }}
//                   transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//                 >
//                   {tabContent[activeTab]}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── Pain vs. Solution ────────────────────────────────────────────────────────

// function PainVsSolution() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const comparisons: PainPoint[] = [
//     {
//       old: "أوراق وسجلات مبعثرة يصعب الوصول إليها",
//       newWay: "ملفات رقمية منظّمة في متناول يدك دائماً",
//     },
//     {
//       old: "حساب الحضور يدوياً كل يوم يستغرق ساعة",
//       newWay: "تسجيل الحضور في ثوانٍ بضغطة واحدة",
//     },
//     {
//       old: "تقارير مالية معقدة تحتاج محاسباً خارجياً",
//       newWay: "تقارير مالية احترافية تُولَّد تلقائياً",
//     },
//     {
//       old: "لا يوجد نظام لتحفيز الطلاب ومتابعة تقدمهم",
//       newWay: "نظام مكافآت ذكي يُحفّز الطلاب ويتابع تقدمهم",
//     },
//     {
//       old: "أولياء الأمور لا يعرفون مستوى أبنائهم",
//       newWay: "تقارير تلقائية لأولياء الأمور عبر واتساب أو البريد",
//     },
//   ];

//   return (
//     <section className="py-32 relative">
//       <div className="max-w-6xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.h2
//             variants={fadeUp}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-4"
//           >
//             من الفوضى إلى النظام
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={1}
//             className="text-lg text-muted-foreground max-w-xl mx-auto"
//           >
//             أنهِ معاناتك مع الأساليب التقليدية إلى الأبد.
//           </motion.p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Old way */}
//           <motion.div
//             variants={fadeUp}
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 space-y-4"
//           >
//             <div className="flex items-center gap-3 justify-end mb-6">
//               <span className="text-xl font-black text-destructive">
//                 الطريقة القديمة
//               </span>
//               <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
//                 <XCircle className="w-5 h-5 text-destructive" />
//               </div>
//             </div>
//             {comparisons.map((c) => (
//               <div key={c.old} className="flex items-start gap-3 justify-end">
//                 <span className="text-sm text-muted-foreground text-right leading-relaxed">
//                   {c.old}
//                 </span>
//                 <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
//               </div>
//             ))}
//           </motion.div>

//           {/* New way */}
//           <motion.div
//             variants={fadeUp}
//             initial="hidden"
//             animate={inView ? "visible" : "hidden"}
//             custom={1}
//             className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4"
//           >
//             <div className="flex items-center gap-3 justify-end mb-6">
//               <span className="text-xl font-black text-primary">
//                 مع مسجد ERP
//               </span>
//               <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-primary" />
//               </div>
//             </div>
//             {comparisons.map((c) => (
//               <div
//                 key={c.newWay}
//                 className="flex items-start gap-3 justify-end"
//               >
//                 <span className="text-sm text-foreground text-right leading-relaxed font-medium">
//                   {c.newWay}
//                 </span>
//                 <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Audience ─────────────────────────────────────────────────────────────────

// function Audience() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const cards = [
//     {
//       icon: <BookOpen className="w-8 h-8" />,
//       title: "المساجد والحلقات",
//       desc: "أدِر حلقات التحفيظ، وتابع أئمة الحلقات، وسجّل حضور طلابك بكل سهولة.",
//       color: "emerald",
//     },
//     {
//       icon: <BookOpen className="w-8 h-8" />,
//       title: "مراكز تحفيظ القرآن",
//       desc: "نظام متكامل يغطي كل جوانب إدارة مراكز التحفيظ من التسجيل حتى التخرج.",
//       color: "blue",
//     },
//     {
//       icon: <GraduationCap className="w-8 h-8" />,
//       title: "المدارس الإسلامية",
//       desc: "إدارة شاملة للمناهج، الدرجات، الحضور، وتواصل مباشر مع أولياء الأمور.",
//       color: "amber",
//     },
//   ];

//   const colorMap: Record<string, string> = {
//     emerald: "text-primary bg-primary/15",
//     blue: "text-blue-accent text-(--blue-accent)/15",
//     amber: "text-warning bg-warning/15",
//   };

//   return (
//     <section id="audience" className="py-32 bg-(--muted)/30">
//       <div className="max-w-6xl mx-auto px-6">
//         <motion.div
//           ref={ref}
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-16"
//         >
//           <motion.h2
//             variants={fadeUp}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-4"
//           >
//             لمن صُمّم هذا النظام؟
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={1}
//             className="text-lg text-muted-foreground max-w-xl mx-auto"
//           >
//             بُنِي خصيصاً لتلبية احتياجات المؤسسات التعليمية الإسلامية بكل
//             أشكالها.
//           </motion.p>
//         </motion.div>
//         <div className="grid md:grid-cols-3 gap-6">
//           {cards.map((c, i) => (
//             <motion.div
//               key={c.title}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.5}
//               whileHover={{ y: -4 }}
//               className="rounded-2xl border border-border bg-card p-8 text-right group hover:border-(--foreground)/20 transition-all duration-300"
//             >
//               <div
//                 className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colorMap[c.color]} mr-auto`}
//               >
//                 {c.icon}
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-3">
//                 {c.title}
//               </h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">
//                 {c.desc}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Trust & Values ───────────────────────────────────────────────────────────

// function TrustSection() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   return (
//     <section className="py-32 relative overflow-hidden">
//       <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
//       <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <motion.div variants={fadeUp} className="text-6xl mb-6">
//             🕌
//           </motion.div>
//           <motion.h2
//             variants={fadeUp}
//             custom={1}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight"
//           >
//             رسالتنا: تمكين التعليم الإسلامي
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-lg text-muted-foreground leading-loose mb-8 max-w-3xl mx-auto"
//           >
//             نؤمن أن مراكز تحفيظ القرآن الكريم تستحق أفضل الأدوات التقنية. لم يعد
//             المدير مضطراً للاختيار بين رسالته التعليمية وإدارة مؤسسته.{" "}
//             <span className="text-primary font-semibold">مسجد ERP</span>{" "}
//             يتولى عبء الإدارة، لتتفرّغ أنت للأهم: تربية الأجيال وتحفيظ كلام
//             الله.
//           </motion.p>
//           <motion.div
//             variants={fadeUp}
//             custom={3}
//             className="flex justify-center gap-8 flex-wrap"
//           >
//             {[
//               {
//                 icon: <Shield className="w-5 h-5" />,
//                 label: "بيانات آمنة ومشفّرة",
//               },
//               { icon: <Zap className="w-5 h-5" />, label: "أداء خاطف وموثوق" },
//               {
//                 icon: <Star className="w-5 h-5" />,
//                 label: "دعم فني على مدار الساعة",
//               },
//             ].map((t) => (
//               <div
//                 key={t.label}
//                 className="flex items-center gap-2 text-muted-foreground"
//               >
//                 <span className="text-primary">{t.icon}</span>
//                 <span className="text-sm font-medium">{t.label}</span>
//               </div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── FAQ ──────────────────────────────────────────────────────────────────────

// function FAQ() {
//   const [openIdx, setOpenIdx] = useState<number | null>(null);
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   const faqs: FAQItem[] = [
//     {
//       q: "هل النظام مجاني تماماً؟",
//       a: "نعم، منصة مسجد ERP مجانية بالكامل للمؤسسات التعليمية الإسلامية. نؤمن أن هذه المؤسسات تستحق أحسن الأدوات دون أعباء مالية.",
//     },
//     {
//       q: "هل يتطلب استخدام النظام خبرة تقنية؟",
//       a: "لا على الإطلاق. صُمّم النظام بواجهة بسيطة وسهلة يستطيع أي شخص استخدامها دون أي تدريب مسبق. ويوفر فريق الدعم مساعدة فورية عند الحاجة.",
//     },
//     {
//       q: "هل بيانات الطلاب والمؤسسة آمنة؟",
//       a: "أمان بياناتك أولويتنا القصوى. نستخدم تشفيراً من الدرجة البنكية، ونُجري نسخاً احتياطية يومية تلقائية. لا يصل أحد غيرك لبيانات مؤسستك.",
//     },
//     {
//       q: "هل يدعم النظام لغة عربية كاملة؟",
//       a: "نعم، النظام بالكامل بالعربية مع دعم كامل لاتجاه الكتابة من اليمين لليسار (RTL)، ومصمم خصيصاً للمستخدم العربي.",
//     },
//     {
//       q: "هل يمكنني إضافة أكثر من مدير للنظام؟",
//       a: "بالتأكيد. يدعم النظام إضافة عدة مستخدمين بصلاحيات مختلفة (مدير، معلم، محاسب) مع تحكم كامل في مستوى الوصول لكل منهم.",
//     },
//   ];

//   return (
//     <section id="faq" className="py-32 bg-(--muted)/20">
//       <div className="max-w-3xl mx-auto px-6" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           className="text-center mb-14"
//         >
//           <motion.h2
//             variants={fadeUp}
//             className="text-4xl lg:text-5xl font-black text-foreground mb-4"
//           >
//             الأسئلة الشائعة
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={1}
//             className="text-lg text-muted-foreground"
//           >
//             لديك سؤال آخر؟ فريق الدعم مستعد دائماً.
//           </motion.p>
//         </motion.div>

//         <div className="space-y-3">
//           {faqs.map((faq, i) => (
//             <motion.div
//               key={i}
//               variants={fadeUp}
//               initial="hidden"
//               animate={inView ? "visible" : "hidden"}
//               custom={i * 0.3}
//               className="rounded-xl border border-border bg-card overflow-hidden"
//             >
//               <button
//                 className="w-full flex items-center justify-between p-5 text-right gap-4"
//                 onClick={() => setOpenIdx(openIdx === i ? null : i)}
//               >
//                 <motion.div
//                   animate={{ rotate: openIdx === i ? 180 : 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                 </motion.div>
//                 <span className="font-semibold text-foreground flex-1 text-right">
//                   {faq.q}
//                 </span>
//               </button>
//               <AnimatePresence>
//                 {openIdx === i && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//                   >
//                     <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed text-right border-t border-border pt-4">
//                       {faq.a}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Bottom CTA ───────────────────────────────────────────────────────────────

// function BottomCTA() {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });

//   return (
//     <section className="py-32 relative overflow-hidden">
//       {/* Gradient background */}
//       <div className="absolute inset-0 bg-linear-to-br from-emerald-600/20 via-teal-600/10 to-blue-600/15 pointer-events-none" />
//       <div className="absolute inset-0 bg-background/60 pointer-events-none" />

//       {/* Decorative circles */}
//       <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
//       <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />

//       <div className="relative max-w-4xl mx-auto px-6 text-center" ref={ref}>
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           <motion.div variants={fadeUp} className="text-5xl mb-6">
//             ✨
//           </motion.div>
//           <motion.h2
//             variants={fadeUp}
//             custom={1}
//             className="text-4xl lg:text-6xl font-black text-foreground mb-6 leading-tight"
//           >
//             ابدأ رحلة التحول الرقمي{" "}
//             <span className="bg-linear-to-l from-emerald-400 to-accent bg-clip-text text-transparent">
//               اليوم
//             </span>
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             custom={2}
//             className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
//           >
//             انضم إلى أكثر من ٥٠٠ مؤسسة إسلامية تدير عملياتها بذكاء وكفاءة.
//             التسجيل مجاني، والبدء يستغرق أقل من دقيقتين.
//           </motion.p>
//           <motion.div
//             variants={fadeUp}
//             custom={3}
//             className="flex flex-wrap items-center justify-center gap-4"
//           >
//             <a
//               href="/register"
//               className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 py-4 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-lg"
//             >
//               <span>أنشئ حسابك مجاناً</span>
//               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             </a>
//             <div className="text-sm text-muted-foreground">
//               لا يلزم بطاقة ائتمان • مجاني للأبد
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── Footer ───────────────────────────────────────────────────────────────────

// function Footer() {
//   return (
//     <footer className="border-t border-border py-10 bg-(--muted)/20">
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-right">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary to-teal-600 flex items-center justify-center">
//             <BookOpen className="w-3.5 h-3.5 text-white" />
//           </div>
//           <span className="font-bold text-foreground">
//             مسجد<span className="text-primary">ERP</span>
//           </span>
//         </div>
//         <p className="text-sm text-muted-foreground">
//           © {new Date().getFullYear()} مسجد ERP. جميع الحقوق محفوظة. صُنع بـ ❤️
//           لخدمة التعليم الإسلامي.
//         </p>
//       </div>
//     </footer>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function LandingPage() {
//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen bg-background text-foreground font-sans antialiased"
//     >
//       <Navbar />
//       <main>
//         <Hero />
//         <Features />
//         <PlatformPreview />
//         <PainVsSolution />
//         <Audience />
//         <TrustSection />
//         <FAQ />
//         <BottomCTA />
//       </main>
//       <Footer />
//     </div>
//   );
// }

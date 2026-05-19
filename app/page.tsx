"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ShieldCheck, Calendar, Activity, Wrench, Shield, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 } as const
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative overflow-x-hidden">
      
      {/* Premium Ambient Glow - Breathing Animation */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500 blur-[150px] rounded-full pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 right-1/4 w-[800px] h-[800px] bg-blue-500 blur-[180px] rounded-full pointer-events-none z-0" 
      />

      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-40 flex flex-col items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-5 py-2 text-xs font-black text-orange-400 backdrop-blur-xl uppercase tracking-[0.2em]"
            >
              <ShieldCheck className="w-4 h-4" /> Solusi Servis Terpercaya & Transparan
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] lg:leading-[0.85]">
              SERVIS MEWAH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 drop-shadow-sm">TANPA DRAMA</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Tinggalkan masalah harga gaib. FixIt memberikan transparansi biaya di awal dan kemudahan servis rutin dalam satu dasbor modern.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
            >
              <Link href="/login" className="group relative w-full sm:w-auto">
                 <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                 <div className="relative px-10 py-5 bg-orange-500 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 overflow-hidden">
                    {/* Light Sweep Effect */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                    />
                    Pesan Sekarang
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </div>
              </Link>
              <Button href="/booking" variant="outline" size="lg" className="w-full sm:w-auto font-black uppercase tracking-widest h-16 border-slate-700 bg-slate-800/20 backdrop-blur-md hover:bg-slate-800 hover:border-slate-600">
                Cek Estimasi Harga
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="w-full py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-none">
              MENGAPA MEMILIH FIXIT?
            </h2>
            <p className="text-lg text-slate-400 font-medium">
              Kami menggabungkan teknologi modern dengan teknisi tersertifikasi untuk memberikan kenyamanan total.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {[
              { icon: Activity, title: "Biaya Transparan", desc: "Ketahui detail biaya perbaikan dan suku cadang sebelum teknisi kami tiba. Kami menjamin tidak ada biaya siluman." },
              { icon: Calendar, title: "Smart Scheduling", desc: "Langganan membership untuk pemeliharaan otomatis. Jadwal cuci AC rutin diatur secara berkala tanpa pusing." },
              { icon: Wrench, title: "Layanan Fleksibel", desc: "Panggil teknisi ahli langsung ke tempat Anda, atau bawa barang ke bengkel kami demi privasi ekstra." }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="flex flex-col justify-between h-full bg-slate-900/40 backdrop-blur-xl border-slate-800 hover:border-orange-500/30 transition-all p-10 group min-h-[320px] rounded-[32px] relative overflow-hidden">
                   {/* Hover Glow */}
                   <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <CardHeader className="p-0 relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-black text-white mb-4 leading-tight tracking-tight uppercase">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 relative z-10">
                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full py-32 border-t border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500">Kualitas Premium</h3>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[0.95]">
                  TEKNISI AHLI<br />SKOR TINGGI
                </h2>
              </div>
              
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Kami tidak sembarangan mengirim teknisi. Setiap teknisi di platform FixIt wajib memiliki sertifikasi resmi dan dinilai secara transparan.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Shield, text: "Garansi Penuh 30 Hari untuk setiap perbaikan.", color: "text-emerald-400" },
                  { icon: Clock, text: "Waktu kedatangan teknisi tepat waktu 99.1%.", color: "text-blue-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-4 bg-slate-800/20 border border-slate-800/50 rounded-2xl">
                    <item.icon className={`w-6 h-6 ${item.color} shrink-0`} />
                    <span className="text-sm font-black text-slate-200 uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-default"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-blue-500/20 blur-2xl opacity-50 group-hover:opacity-80 transition-all rounded-[40px]" />
              <div className="aspect-square w-full rounded-[40px] bg-slate-900 border border-slate-800 p-12 flex flex-col items-center justify-center backdrop-blur-2xl relative z-10 shadow-2xl overflow-hidden">
                <div className="text-center space-y-4">
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-emerald-400"
                  >
                    98%
                  </motion.span>
                  <p className="text-lg font-black text-white uppercase tracking-[0.3em]">KEPUASAN</p>
                  <p className="text-xs text-slate-500 font-bold max-w-[200px] mx-auto leading-relaxed">Berdasarkan ulasan 10,000+ pelanggan setia FixIt di seluruh Indonesia.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
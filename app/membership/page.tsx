import { cookies } from "next/headers";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import prisma from "@/lib/prisma";
import { Sparkles, Shield, Clock, Zap, ArrowRight, CheckCircle, Flame, Calendar } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import MembershipForm from "./MembershipForm";

export default async function MembershipPage(props: { searchParams: Promise<{ add?: string }> }) {

  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;
  const isLoggedIn = !!userEmail;

  if (isLoggedIn) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
      include: { 
        orders: { 
          where: { problem: { contains: 'Rutin' } },
          orderBy: { scheduled_date_time: 'asc' }
        }
      }
    });

    const memberships = await prisma.membership.findMany({
      where: { 
        user_id: user?.id,
        status: 'ACTIVE'
      }
    });

    const activeMembership = memberships?.[0];


    const { add } = await props.searchParams;
    const showForm = add === "true" || !activeMembership;

    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          
          {!showForm ? (

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-black text-emerald-400 backdrop-blur-md mb-4 uppercase tracking-widest">
                    <Shield className="w-4 h-4" /> Membership Aktif & Terproteksi
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-50 tracking-tight leading-tight">
                    Smart Care <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 uppercase">{activeMembership.appliance_name}</span>
                  </h1>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-3">Layanan Maintenance Rutin Otomatis</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Status Card */}
                  <div className="md:col-span-4 space-y-6">
                     <Card className="border-slate-800 bg-slate-900/40 p-6 rounded-[32px]">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Detail Langganan</p>
                        <div className="space-y-4">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Frekuensi Kunjungan</p>
                              <p className="text-lg font-black text-white">Tiap {activeMembership.frequency_months} Bulan</p>
                           </div>
                           <hr className="border-slate-800" />
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Status Tagihan</p>
                              <p className="text-sm font-bold text-emerald-500">Lunas (Prepaid)</p>
                           </div>
                        </div>
                     </Card>
                     
                     <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-[32px]">
                        <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                           <Sparkles size={14} /> Keuntungan Anda
                        </h4>
                        <ul className="mt-4 space-y-3">
                           <li className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                              <CheckCircle className="text-emerald-500" size={14} /> Gratis Biaya Kunjungan
                           </li>
                           <li className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                              <CheckCircle className="text-emerald-500" size={14} /> Respon Teknisi Prioritas
                           </li>
                           <li className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                              <CheckCircle className="text-emerald-500" size={14} /> Garansi Service 30 Hari
                           </li>
                        </ul>
                     </div>
                  </div>

                  {/* Schedule Card */}
                  <div className="md:col-span-8">
                     <Card className="border-slate-800 bg-slate-900/40 p-8 rounded-[32px] h-full">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                              <h3 className="text-xl font-black text-white uppercase tracking-tight">Jadwal Servis Berkala</h3>
                              <p className="text-xs text-slate-500 font-bold mt-1">Teknisi akan datang otomatis di tanggal berikut</p>
                           </div>
                           <Calendar className="text-orange-500" size={24} />
                        </div>

                        <div className="space-y-4">
                           {user?.orders?.length ? user.orders.map((order, idx) => (
                             <div key={order.id} className="p-5 bg-slate-800/40 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-orange-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center">
                                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{new Date(order.scheduled_date_time).toLocaleString('id-ID', { month: 'short' })}</span>
                                      <span className="text-sm font-black text-white leading-none">{new Date(order.scheduled_date_time).getDate()}</span>
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-100">{order.problem}</p>
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Automated Routine Check #{idx + 1}</p>
                                   </div>
                                </div>
                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                   <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Scheduled</span>
                                </div>
                             </div>
                           )) : (
                             <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Belum ada jadwal terdekat</p>
                             </div>
                           )}
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-4 text-center">
                           <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                              Anda tidak perlu memesan manual untuk alat ini. Teknisi premium kami akan <br /> 
                              menghubungi Anda 1 hari sebelum jadwal kunjungan di atas.
                           </p>
                           <Button href="/membership?add=true" variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-[10px] font-black uppercase tracking-widest px-8">
                              + Tambah Alat Lain ke Membership
                           </Button>
                        </div>

                     </Card>
                  </div>
               </div>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md mb-4">
                  <Sparkles className="w-4 h-4 animate-pulse" /> Paket Premium Loyalty Gojek-Style
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight">
                  FixIt <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Membership</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg mt-3">
                  Layanan *maintenance* otomatis terjadwal untuk hunian modern yang bebas repot.
                </p>
              </div>
              <MembershipForm />
            </>
          )}
        </div>
      </div>
    );
  }


  // Marketing page for unauthenticated public users
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative overflow-hidden flex flex-col w-full">
      {/* Visual Background Accent */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <Sparkles className="w-4 h-4 animate-pulse" /> Layanan Eksklusif FixIt Care
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Perkenalkan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">FixIt Membership</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Konsep modern yang menggabungkan kemudahan pengerjaan terjadwal dengan teknisi premium. Pastikan semua perangkat elektronik Anda bekerja optimal tanpa harus repot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-3 duration-1000">
              <Button href="/register" variant="primary" size="lg" className="w-full sm:w-auto font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2">
                Daftar Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/login" variant="outline" size="lg" className="w-full sm:w-auto font-semibold h-12 border-slate-700 hover:bg-slate-800">
                Masuk untuk Berlangganan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Concept & What is Membership */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Mengapa FixIt Membership Sangat Penting?
            </h2>
            <p className="text-lg text-slate-400">
              Menjaga kualitas udara dan keawetan barang elektronik Anda dengan kunjungan berkala yang cerdas tanpa perlu repot memesan secara manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Concept Advantage 1 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[300px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Clock className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Smart Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Sistem menjadwalkan servis rutin 3 bulan di dashboard Anda secara berkala. Anda tidak akan lupa lagi melakukan perawatan rutin.
                </p>
              </CardContent>
            </Card>

            {/* Concept Advantage 2 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[300px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Zap className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Teknisi Gojek-Style
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Teknisi berpengalaman tinggi dari sistem pencocokan otomatis kami akan langsung ditugaskan dan tiba dalam waktu singkat untuk menyelesaikan masalah Anda.
                </p>
              </CardContent>
            </Card>

            {/* Concept Advantage 3 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[300px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Shield className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Priority & Discounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Member diprioritaskan penuh di antrean harian kami, mendapatkan gratis biaya kunjungan pengecekan, serta diskon spare part hingga 20%.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Overview */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Pilihan Smart Care Membership
            </h2>
            <p className="text-lg text-slate-400">
              Pilih satu alat elektronik utama Anda yang ingin diprioritaskan perawatannya secara berkala selama 3 bulan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["AC", "Kulkas", "Mesin Cuci"].map((appliance, idx) => (
              <Card
                key={idx}
                className={`flex flex-col justify-between border-2 border-slate-700/60 bg-slate-800/40 backdrop-blur-md p-8 relative overflow-hidden min-h-[420px] transition-all hover:border-orange-500/30 group`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Flame className="h-32 w-32 text-orange-400 group-hover:scale-110 transition-all" />
                </div>

                <div>
                  <div className="mb-6">
                    <span className="text-xs bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-orange-400 rounded-full font-semibold uppercase">Review Paket</span>
                    <h3 className="text-3xl font-bold text-slate-50 mt-4">Smart Care {appliance}</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">Merawat {appliance} Anda otomatis selama 3 bulan penuh.</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-50">Rp 299.000</span>
                    <span className="text-slate-500 text-sm">/ 3 Bulan</span>
                  </div>

                  <ul className="space-y-3 mb-10">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">Servis rutin otomatis 3 bulan sekali.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">Respons prioritas (Gojek-Style).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">Gratis biaya pengecekan & konsultasi.</span>
                    </li>
                  </ul>
                </div>

                <Button href="/register" variant="outline" className="w-full h-12 hover:bg-slate-800 border-slate-700">
                  Daftar Sekarang
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Persistent Call to Action */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-50 tracking-tight sm:text-4xl leading-tight">
            Berikan Ketenangan Pikiran untuk Hunian Anda
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Tidak ada lagi kejutan biaya di akhir atau rasa was-was. Daftarkan diri Anda dan nikmati manfaat menjadi premium member kami sekarang juga.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="/register" variant="primary" size="lg" className="h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              Mulai Langganan Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProfileEditor from "@/components/features/ProfileEditor";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import OrderHistoryList from "./OrderHistoryList";
import FloatingChatWidget from "@/components/features/FloatingChatWidget";
import { User, Zap, ShieldCheck } from "lucide-react";

interface CustomerDashboardViewProps {
  user: any;
  calendarEvents: any[];
}

export default function CustomerDashboardView({ user, calendarEvents }: CustomerDashboardViewProps) {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-950/20">
      <div className="w-full px-4 flex flex-col h-full relative z-10 pt-4 pb-4">
        
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between gap-4 shrink-0 px-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-slate-50 flex items-center gap-3">
              Dashboard Saya
              <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase tracking-widest">
                Customer
              </span>
            </h1>
            <div className="h-4 w-px bg-slate-800" />
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              ID: <span className="text-slate-300">{user.id.slice(0,8)}</span>
            </p>
          </div>
          
          <Button href="/booking" variant="primary" className="shadow-[0_10px_20px_rgba(249,115,22,0.15)] px-6 py-2 text-[10px] font-black uppercase tracking-wider">
            Pesan Servis Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow overflow-hidden min-h-0">
          
          {/* Sidebar (3/12) */}
          <div className="md:col-span-3 flex flex-col gap-4 h-full min-h-0">
            
            {/* Profile Section - Now Larger & More Clear */}
            <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col flex-grow min-h-0">
              <CardHeader className="border-b border-slate-800 p-4 bg-slate-800/20 shrink-0">
                <CardTitle className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <User size={12} className="text-blue-400" />
                  Profil & Pengaturan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 overflow-y-auto custom-scrollbar flex-grow bg-slate-900/10">
                 <div className="space-y-8 pt-4">
                   <div>
                     <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] mb-2">Nama Lengkap</p>
                     <p className="text-sm font-black text-slate-100">{user.name}</p>
                   </div>

                   <div>
                     <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Email Terdaftar</p>
                     <p className="text-[11px] font-bold text-slate-400 truncate">{user.email}</p>
                   </div>
                   <hr className="border-slate-800" />
                   <ProfileEditor 
                     initialPhone={user.phone || ""} 
                     initialAddress={user.address || ""}
                     initialAge={user.age}
                     initialGender={user.gender}
                   />

                 </div>
              </CardContent>
            </Card>

            {/* Slim & Compact Membership Banner */}
            <Card className="border-orange-500/20 bg-gradient-to-r from-slate-900 to-slate-950 p-4 shrink-0 relative overflow-hidden group">
               <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap size={60} className="text-orange-500" />
               </div>
               
               <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 shrink-0">
                        <ShieldCheck size={16} />
                     </div>
                     <div>
                        <h4 className="text-[11px] font-black text-slate-100 uppercase tracking-wider">Premium</h4>
                        <p className="text-[8px] text-slate-500 font-bold">Gratis Kunjungan & Garansi</p>
                     </div>
                  </div>
                  <Button variant="outline" href="/membership" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-[8px] font-black uppercase px-4 py-1.5 rounded-lg shrink-0">
                     Buka
                  </Button>
               </div>
            </Card>
          </div>

          {/* Col 2: Main Workspace (9/12) */}
          <div className="md:col-span-9 flex flex-col gap-4 h-full min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow min-h-0">
               <div className="lg:col-span-9 h-full">
                  <ServiceCalendar events={calendarEvents} />
               </div>
               <div className="lg:col-span-3 h-full">
                  <OrderHistoryList orders={user.orders} />
               </div>


            </div>

          </div>
        </div>
      </div>

      <FloatingChatWidget orders={user.orders} currentUserId={user.id} />
    </div>
  );
}

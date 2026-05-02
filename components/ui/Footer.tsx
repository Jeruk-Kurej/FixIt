import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-900 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">FixIt</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform servis elektronik premium dengan estimasi transparan, teknisi terpercaya, dan jadwal cerdas.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-50 font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Servis AC</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Servis Kulkas</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Servis Mesin Cuci</Link></li>
              <li><Link href="/book" className="hover:text-orange-500 transition-colors text-orange-500/80">Pesan Sekarang &rarr;</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-50 font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/membership" className="hover:text-orange-500 transition-colors">Membership</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Karir</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-50 font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>cs@fixit.com</li>
              <li>0800-1234-5678</li>
              <li>Jl. Sudirman No. 99, Jakarta Pusat</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} FixIt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-slate-300">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-slate-300">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

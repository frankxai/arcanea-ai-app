import { Ghost, Home, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl" />
            <Ghost className="relative w-32 h-32 text-purple-400 animate-bounce" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Realm Not Found
        </h2>

        <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
          This realm exists in the space between possibilities. It hasn't been manifested yet, or it has returned to the Void.
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Link
            href="/"
            className="group p-6 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Home</h3>
            <p className="text-slate-500 text-sm">Return to the beginning</p>
          </Link>

          <Link
            href="/world-builder"
            className="group p-6 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Explore</h3>
            <p className="text-slate-500 text-sm">Discover existing worlds</p>
          </Link>

          <Link
            href="/guardians"
            className="group p-6 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
          >
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-pink-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-pink-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Guardians</h3>
            <p className="text-slate-500 text-sm">Meet your AI companions</p>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-slate-500 text-sm">
          Lost? Check out our{' '}
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 underline">
            dashboard
          </Link>{' '}
          or{' '}
          <Link href="/chat" className="text-blue-400 hover:text-blue-300 underline">
            start a conversation
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

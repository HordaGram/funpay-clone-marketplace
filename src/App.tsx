/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto glass-panel p-6 md:p-10 rounded-3xl relative overflow-hidden">
        {/* Decorative elements for inner glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
            <div className="text-2xl font-bold neon-text tracking-wide flex items-center gap-2">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              NEXUS MARKET
            </div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Главная</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Каталог</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Продать</a>
            </nav>
            <button className="btn-neon text-sm px-6 py-2 rounded-full font-semibold">Войти</button>
          </header>

          <main>
            <div className="mb-14 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Премиальный C2C маркетплейс <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 text-3xl">для цифровых товаров</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Прямо сейчас мы строим фундамент. Безопасные сделки, мгновенная доставка и футуристичный интерфейс. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Шаг 1 */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-5 text-teal-500 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Шаг 1: БД & ORM</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Схема данных на Prisma. Модели User, Product, Order, Transaction.</p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center text-gray-500 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                  Завершено
                </div>
              </div>

              {/* Шаг 2 */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-5 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Шаг 2: Auth</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Модуль аутентификации на Express. JWT, Bcrypt, Middleware.</p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center text-gray-500 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                  Завершено
                </div>
              </div>

              {/* Шаг 3 */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-5 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Шаг 3: Товары</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">REST API готов. CRUD продуктов. Фильтрация и поиск.</p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center text-gray-500 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                  Завершено
                </div>
              </div>

              {/* Шаг 4 */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group border-teal-500/40 relative overflow-hidden shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-5 text-white shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Шаг 4: Сделка</h3>
                  <p className="text-teal-100/70 text-sm leading-relaxed">Ядро маркетплейса на Prisma Transactions. Буферный баланс и консистентное перемещение средств.</p>
                </div>
                <div className="mt-5 pt-4 border-t border-teal-500/20 flex items-center text-cyan-400 text-sm font-medium relative z-10 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_#22d3ee]"></span>
                  Только что выполнено
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "tr";

const languageStorageKey = "mergen-watch-language";

export const dictionary = {
  en: {
    "brand.name": "Mergen Watch League",
    "brand.short": "Mergen Watch",
    "nav.lobby": "Lobby",
    "nav.squad": "Squad",
    "nav.leaderboard": "Leaderboard",
    "nav.badges": "Badges",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.back": "Back to Lobby",
    "demo.notice": "Public demo. Mock data only. No swaps or real transactions.",
    "hero.title": "Build your Base squad.",
    "hero.subtitle":
      "Pick 5 Base tokens, earn weekly XP, and climb the leaderboard.",
    "hero.primary": "Enter the lobby",
    "hero.secondary": "How it works",
    "hero.command": "Watch. Track. Compete.",
    "home.visual": "League lobby preview",
    "home.pillar1": "Weekly Base token squad",
    "home.pillar1Text": "Choose 3 to 5 Base tokens and follow their weekly performance.",
    "home.pillar2": "Collectible token cards",
    "home.pillar2Text": "Each token becomes a character-style card with stance, XP, points, and level.",
    "home.pillar3": "XP and badge reputation",
    "home.pillar3Text": "Earn badges, climb ranks, and build a public market profile over time.",
    "section.weeklySeason": "Weekly Season",
    "section.yourSquad": "Your Base Squad",
    "section.addSlots": "Add Token slots",
    "section.leaderboard": "Weekly Leaderboard",
    "section.badges": "Badges & Achievements",
    "section.profile": "Profile / Avatar",
    "section.signals": "Recent Signals",
    "section.how": "How It Works",
    "section.watchlists": "League Watchlists",
    "section.tokenArena": "Token Arena",
    "squad.subtitle": "Build your squad. Earn points. Climb the ranks.",
    "squad.builderTitle": "Your 5-token squad",
    "squad.builderText": "Pick Base tokens. Earn weekly points. Climb the leaderboard.",
    "squad.slots": "slots",
    "squad.power": "Squad Power",
    "squad.add": "+ Add Token",
    "squad.addText": "Choose wisely. Every pick matters.",
    "squad.chooseTitle": "Choose Your Fighter",
    "squad.chooseSubtitle": "Pick a Base token character for your weekly squad.",
    "squad.remove": "Remove",
    "squad.full": "Squad Full",
    "squad.inSquad": "In Squad",
    "squad.searchPlaceholder": "Search token...",
    "squad.noResults": "No fighters found",
    "season.name": "Season 3 - Week 4",
    "season.ends": "Ends in 4D 12H",
    "season.rank": "Rank",
    "season.top": "Top 1.2%",
    "season.weeklyXp": "Weekly XP",
    "season.weeklyPoints": "Weekly Points",
    "season.rewards": "League Rewards",
    "score.title": "Weekly Score",
    "score.summary": "Mock season progress for this squad.",
    "profile.handle": "@basehunter",
    "profile.role": "Rookie Watcher",
    "profile.connect": "Connect Wallet",
    "profile.chooseAvatar": "Choose your avatar",
    "profile.view": "View Profile",
    "profile.walletSoon": "Wallet profiles later",
    "profile.setupTitle": "Edit Watcher Profile",
    "profile.setupSubtitle": "Choose an avatar and nickname for the weekly league.",
    "profile.nickname": "Nickname",
    "profile.nicknamePlaceholder": "Enter nickname",
    "profile.avatar": "Avatar",
    "profile.save": "Save Profile",
    "profile.edit": "Edit Profile",
    "profile.disconnect": "Disconnect",
    "profile.connectedWallet": "Connected Wallet",
    "metric.xp": "XP",
    "metric.points": "Points",
    "metric.level": "Lv.",
    "metric.performance": "Weekly",
    "metric.hitRate": "Hit rate",
    "metric.followers": "Followers",
    "metric.watchScore": "Watch Score",
    "metric.bestCall": "Best call",
    "metric.liquidity": "Liquidity",
    "metric.mentions": "Mentions",
    "metric.holders": "Holders",
    "metric.price": "Price",
    "metric.rank": "Rank",
    "badge.winStreak": "Win Streak",
    "badge.top10": "Top 10 Weekly",
    "badge.earlyWatcher": "Early Watcher",
    "badge.baseResearcher": "Base Researcher",
    "badge.tokenScout": "Token Scout",
    "badge.squadBuilder": "Squad Builder",
    "badge.highRoller": "High Roller",
    "badge.veteran": "Veteran",
    "badge.winStreakMeta": "5 wins",
    "badge.top10Meta": "Top 10",
    "badge.earlyWatcherMeta": "Joined early",
    "badge.baseResearcherMeta": "10 researches",
    "badge.tokenScoutMeta": "25 discoveries",
    "badge.squadBuilderMeta": "Full squad",
    "badge.highRollerMeta": "5K+ points",
    "badge.veteranMeta": "4 weeks active",
    "signal.upgraded": "upgraded",
    "signal.added": "added",
    "signal.earned": "earned",
    "signal.discovered": "discovered",
    "signal.toSquad": "to their squad",
    "signal.badge": "badge",
    "signal.potential": "potential",
    "how.step1": "Pick 3-5 Base tokens",
    "how.step2": "Watch weekly performance",
    "how.step3": "Earn XP, badges, and rank",
    "how.step4": "Future wallet profiles can mint onchain achievements",
    "list.creator": "League creator",
    "list.total": "Squad performance",
    "list.tokens": "Token cards",
    "list.replies": "League replies",
    "cta.futureSwap": "Future swap terminal",
    "cta.futureSwapText":
      "A future version can connect squad research to a guarded swap flow. This public demo never executes swaps or wallet transactions.",
    "token.stance": "Community stance",
    "token.watchers": "Top watchers",
    "token.related": "Related squads",
    "token.safety": "Safety note",
    "token.safetyText":
      "League scores are mock research signals, not financial advice. No swaps or transactions run in this demo.",
    "roadmap.title": "Future League Roadmap",
    "roadmap.copy":
      "Future versions can add wallet profiles, Base Sepolia seasons, onchain badge minting, sponsored actions, moderation, and live token indexing.",
    "stance.Bullish": "Bullish",
    "stance.Watching": "Watching",
    "stance.Risky": "Risky",
    "stance.Avoid": "Avoid",
  },
  tr: {
    "brand.name": "Mergen Watch League",
    "brand.short": "Mergen Watch",
    "nav.lobby": "Lobi",
    "nav.squad": "Squad",
    "nav.leaderboard": "Liderlik",
    "nav.badges": "Rozetler",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.back": "Lobiye dön",
    "demo.notice": "Public demo. Sadece mock data. Gerçek swap veya işlem yok.",
    "hero.title": "Base squad’ını kur.",
    "hero.subtitle":
      "5 Base tokenı seç, haftalık XP kazan ve liderliğe tırman.",
    "hero.primary": "Lobiye gir",
    "hero.secondary": "Nasıl çalışır",
    "hero.command": "Watch. Track. Compete.",
    "home.visual": "League lobi önizlemesi",
    "home.pillar1": "Haftalık Base token squad",
    "home.pillar1Text": "3 ile 5 Base tokenı seç ve haftalık performanslarını takip et.",
    "home.pillar2": "Koleksiyon token kartları",
    "home.pillar2Text": "Her token stance, XP, puan ve level içeren karakter tarzı karta dönüşür.",
    "home.pillar3": "XP ve rozet itibarı",
    "home.pillar3Text": "Rozet kazan, rank yükselt ve zamanla public piyasa profili oluştur.",
    "section.weeklySeason": "Haftalık Sezon",
    "section.yourSquad": "Base Squad’ın",
    "section.addSlots": "Token slotları ekle",
    "section.leaderboard": "Haftalık Liderlik",
    "section.badges": "Rozetler & Başarımlar",
    "section.profile": "Profil / Avatar",
    "section.signals": "Son Sinyaller",
    "section.how": "Nasıl Çalışır",
    "section.watchlists": "League Watchlistleri",
    "section.tokenArena": "Token Arenası",
    "squad.subtitle": "Squad kur. Puan kazan. Rank yükselt.",
    "squad.builderTitle": "5 tokenlık squad’ın",
    "squad.builderText": "Base tokenlarını seç. Haftalık puan kazan. Liderliğe tırman.",
    "squad.slots": "slot",
    "squad.power": "Squad Gücü",
    "squad.add": "+ Token Ekle",
    "squad.addText": "Akıllı seç. Her pick önemli.",
    "squad.chooseTitle": "Savaşçını Seç",
    "squad.chooseSubtitle": "Haftalık squad’ın için bir Base token karakteri seç.",
    "squad.remove": "Çıkar",
    "squad.full": "Squad Dolu",
    "squad.inSquad": "Squad’da",
    "squad.searchPlaceholder": "Token ara...",
    "squad.noResults": "Savaşçı bulunamadı",
    "season.name": "Sezon 3 - Hafta 4",
    "season.ends": "4G 12S kaldı",
    "season.rank": "Rank",
    "season.top": "Top 1.2%",
    "season.weeklyXp": "Haftalık XP",
    "season.weeklyPoints": "Haftalık Puan",
    "season.rewards": "League Ödülleri",
    "score.title": "Haftalık Skor",
    "score.summary": "Bu squad için mock sezon ilerlemesi.",
    "profile.handle": "@basehunter",
    "profile.role": "Rookie Watcher",
    "profile.connect": "Cüzdan Bağla",
    "profile.chooseAvatar": "Avatarını seç",
    "profile.view": "Profili Gör",
    "profile.walletSoon": "Wallet profilleri sonra",
    "profile.setupTitle": "Watcher Profilini Düzenle",
    "profile.setupSubtitle": "Haftalık lig için avatarını ve kullanıcı adını seç.",
    "profile.nickname": "Nickname",
    "profile.nicknamePlaceholder": "Kullanıcı adı gir",
    "profile.avatar": "Avatar",
    "profile.save": "Profili Kaydet",
    "profile.edit": "Profili Düzenle",
    "profile.disconnect": "Bağlantıyı Kes",
    "profile.connectedWallet": "Bağlı Cüzdan",
    "metric.xp": "XP",
    "metric.points": "Puan",
    "metric.level": "Lv.",
    "metric.performance": "Haftalık",
    "metric.hitRate": "Başarı oranı",
    "metric.followers": "Takipçi",
    "metric.watchScore": "Watch Score",
    "metric.bestCall": "En iyi call",
    "metric.liquidity": "Likidite",
    "metric.mentions": "Bahsedilme",
    "metric.holders": "Holder",
    "metric.price": "Fiyat",
    "metric.rank": "Rank",
    "badge.winStreak": "Win Streak",
    "badge.top10": "Top 10 Weekly",
    "badge.earlyWatcher": "Early Watcher",
    "badge.baseResearcher": "Base Researcher",
    "badge.tokenScout": "Token Scout",
    "badge.squadBuilder": "Squad Builder",
    "badge.highRoller": "High Roller",
    "badge.veteran": "Veteran",
    "badge.winStreakMeta": "5 galibiyet",
    "badge.top10Meta": "Top 10",
    "badge.earlyWatcherMeta": "Erken katılım",
    "badge.baseResearcherMeta": "10 araştırma",
    "badge.tokenScoutMeta": "25 keşif",
    "badge.squadBuilderMeta": "Full squad",
    "badge.highRollerMeta": "5K+ puan",
    "badge.veteranMeta": "4 hafta aktif",
    "signal.upgraded": "level yükseltti",
    "signal.added": "ekledi",
    "signal.earned": "kazandı",
    "signal.discovered": "keşfetti",
    "signal.toSquad": "squadına",
    "signal.badge": "rozeti",
    "signal.potential": "potansiyel",
    "how.step1": "3-5 Base tokenı seç",
    "how.step2": "Haftalık performansı izle",
    "how.step3": "XP, rozet ve rank kazan",
    "how.step4": "Gelecekte wallet profilleri onchain başarımları mint edebilir",
    "list.creator": "League creator",
    "list.total": "Squad performansı",
    "list.tokens": "Token kartları",
    "list.replies": "League reply'ları",
    "cta.futureSwap": "Gelecek swap terminali",
    "cta.futureSwapText":
      "Gelecek bir sürüm squad araştırmasını kontrollü swap akışına bağlayabilir. Bu public demo swap veya wallet işlemi çalıştırmaz.",
    "token.stance": "Topluluk stance'i",
    "token.watchers": "Top watcherlar",
    "token.related": "İlgili squadlar",
    "token.safety": "Güvenlik notu",
    "token.safetyText":
      "League skorları mock araştırma sinyalleridir, finansal tavsiye değildir. Bu demoda swap veya işlem çalışmaz.",
    "roadmap.title": "Gelecek League Roadmap",
    "roadmap.copy":
      "Gelecek sürümler wallet profilleri, Base Sepolia sezonları, onchain rozet minting, sponsorlu aksiyonlar, moderasyon ve canlı token indeksleme ekleyebilir.",
    "stance.Bullish": "Bullish",
    "stance.Watching": "Watching",
    "stance.Risky": "Risky",
    "stance.Avoid": "Avoid",
  },
} as const;

export type CopyKey = keyof typeof dictionary.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "tr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    return isLanguage(storedLanguage) ? storedLanguage : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback(
    (key: CopyKey) => dictionary[language][key] ?? dictionary.en[key],
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex rounded-xl border border-blue-400/20 bg-black/35 p-1"
      aria-label="Language"
    >
      {(["en", "tr"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${
            language === option
              ? "bg-blue-500 text-white shadow-[0_0_22px_rgba(59,130,246,0.35)]"
              : "text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

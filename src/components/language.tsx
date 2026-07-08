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
    "nav.watch": "Watch",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.back": "Back to Watch",
    "brand.short": "Mergen Watch",
    "demo.notice": "Public demo. Mock data only. No swaps or real transactions.",
    "landing.headline": "Follow the watchlists moving Base.",
    "landing.subheadline":
      "Discover public Base token watchlists, track their performance, and build an onchain market profile.",
    "landing.primary": "Open Watch network",
    "landing.secondary": "Read roadmap",
    "landing.preview": "Live product preview",
    "landing.feedTitle": "Signal feed",
    "landing.feedBody": "AERO moved back onto Base Signal Desk after a clean liquidity check.",
    "landing.watchlistTitle": "Featured watchlist",
    "landing.watcherTitle": "Top watcher",
    "landing.tokenTitle": "Token stance",
    "landing.pillar1": "Watchlists with receipts",
    "landing.pillar1Text":
      "Every list shows creator, stance, thesis, risk note, and performance context.",
    "landing.pillar2": "Social token signals",
    "landing.pillar2Text":
      "Comments and public stances make token discovery feel social, not hidden in a spreadsheet.",
    "landing.pillar3": "Performance-based reputation",
    "landing.pillar3Text":
      "Watch Score, hit rate, followers, and best calls turn market research into a public profile.",
    "landing.roadmapTitle": "Roadmap",
    "landing.roadmapText":
      "Today this is a read-only Base product demo. Later versions can move carefully toward Sepolia tests, registry attestations, sponsored actions, moderation, and main Mergen Finance integration.",
    "watch.title": "Watchlists, signals, and market identities.",
    "watch.subtitle":
      "A social feed for Base token conviction, public lists, and reputation signals.",
    "watch.left": "Featured Watchlists",
    "watch.center": "Recent Signals",
    "watch.right": "Top Watchers",
    "watch.leaderboard": "Watch Score leaderboard",
    "watch.how": "How the network works",
    "watch.how1": "Follow lists",
    "watch.how2": "Read signals",
    "watch.how3": "Build reputation",
    "profile.title": "Market identity",
    "profile.subtitle":
      "Public watchlists, signal history, badges, and mock performance for this watcher.",
    "profile.bestCall": "Best call",
    "profile.publicWatchlists": "Public watchlists",
    "profile.recentSignals": "Recent signals",
    "profile.badges": "Badges",
    "list.subtitle":
      "A shareable watchlist with creator context, token stances, performance, and replies.",
    "list.creator": "Creator",
    "list.totalPerformance": "Total performance",
    "list.stanceMix": "Stance mix",
    "list.tokens": "Token list",
    "list.replies": "Social replies",
    "token.subtitle": "Social sentiment and watchlist context for this Base token.",
    "token.communityStance": "Community stance",
    "token.topWatchers": "Top watchers",
    "token.recentSignals": "Recent signals",
    "token.relatedLists": "Related watchlists",
    "token.safety": "Safety note",
    "token.safetyText":
      "Community signals are not financial advice. Verify liquidity, contract risk, and volatility before trading.",
    "cta.viewToken": "View token",
    "cta.viewList": "Open watchlist",
    "cta.profile": "View profile",
    "cta.futureSwap": "Open future swap terminal",
    "cta.futureSwapText":
      "Preview only. This demo does not execute swaps or transactions.",
    "metric.watchScore": "Watch Score",
    "metric.hitRate": "Hit rate",
    "metric.followers": "Followers",
    "metric.performance": "Performance",
    "metric.bestCall": "Best call",
    "metric.liquidity": "Liquidity",
    "metric.mentions": "Mentions",
    "metric.holders": "Holders",
    "metric.price": "Price",
    "metric.return": "Return",
    "metric.conviction": "Conviction",
    "metric.entries": "Entries",
    "label.by": "by",
    "label.mock": "mock",
    "label.reply": "reply",
    "label.replies": "replies",
    "label.likes": "likes",
    "label.owner": "Owner",
    "label.address": "Address",
    "label.joined": "Joined",
    "label.empty": "No demo signals yet.",
    "stance.Bullish": "Bullish",
    "stance.Neutral": "Neutral",
    "stance.Risky": "Risky",
    "stance.Avoid": "Avoid",
  },
  tr: {
    "nav.watch": "Watch",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.back": "Watch'a dön",
    "brand.short": "Mergen Watch",
    "demo.notice": "Public demo. Sadece mock data. Gerçek swap veya işlem yok.",
    "landing.headline": "Base'i hareketlendiren watchlistleri takip et.",
    "landing.subheadline":
      "Public Base token watchlistlerini keşfet, performanslarını izle ve onchain piyasa profilini oluştur.",
    "landing.primary": "Watch ağını aç",
    "landing.secondary": "Roadmap'i oku",
    "landing.preview": "Canlı ürün önizlemesi",
    "landing.feedTitle": "Sinyal akışı",
    "landing.feedBody": "AERO, temiz likidite kontrolünden sonra Base Signal Desk listesine geri girdi.",
    "landing.watchlistTitle": "Öne çıkan watchlist",
    "landing.watcherTitle": "Top watcher",
    "landing.tokenTitle": "Token stance",
    "landing.pillar1": "Kanıtlı watchlistler",
    "landing.pillar1Text":
      "Her listede creator, stance, tez, risk notu ve performans bağlamı görünür.",
    "landing.pillar2": "Sosyal token sinyalleri",
    "landing.pillar2Text":
      "Yorumlar ve public stance'ler token keşfini spreadsheet yerine sosyal hale getirir.",
    "landing.pillar3": "Performansa dayalı itibar",
    "landing.pillar3Text":
      "Watch Score, başarı oranı, takipçiler ve en iyi call'lar araştırmayı public profile dönüştürür.",
    "landing.roadmapTitle": "Roadmap",
    "landing.roadmapText":
      "Bugün bu demo sadece okunur bir Base ürün demosu. Sonraki sürümler Sepolia testleri, registry attestations, sponsorlu aksiyonlar, moderasyon ve ana Mergen Finance entegrasyonuna dikkatli şekilde ilerleyebilir.",
    "watch.title": "Watchlistler, sinyaller ve piyasa kimlikleri.",
    "watch.subtitle":
      "Base token conviction, public listeler ve itibar sinyalleri için sosyal akış.",
    "watch.left": "Öne Çıkan Watchlistler",
    "watch.center": "Son Sinyaller",
    "watch.right": "Top Watcherlar",
    "watch.leaderboard": "Watch Score liderliği",
    "watch.how": "Ağ nasıl çalışır",
    "watch.how1": "Listeleri takip et",
    "watch.how2": "Sinyalleri oku",
    "watch.how3": "İtibar oluştur",
    "profile.title": "Piyasa kimliği",
    "profile.subtitle":
      "Bu watcher için public watchlistler, sinyal geçmişi, rozetler ve mock performans.",
    "profile.bestCall": "En iyi call",
    "profile.publicWatchlists": "Public watchlistler",
    "profile.recentSignals": "Son sinyaller",
    "profile.badges": "Rozetler",
    "list.subtitle":
      "Creator bağlamı, token stance'leri, performans ve reply'ları olan paylaşılabilir watchlist.",
    "list.creator": "Creator",
    "list.totalPerformance": "Toplam performans",
    "list.stanceMix": "Stance dağılımı",
    "list.tokens": "Token listesi",
    "list.replies": "Sosyal reply'lar",
    "token.subtitle": "Bu Base tokenı için sosyal sentiment ve watchlist bağlamı.",
    "token.communityStance": "Topluluk stance'i",
    "token.topWatchers": "Top watcherlar",
    "token.recentSignals": "Son sinyaller",
    "token.relatedLists": "İlgili watchlistler",
    "token.safety": "Güvenlik notu",
    "token.safetyText":
      "Topluluk sinyalleri finansal tavsiye değildir. İşlemden önce likiditeyi, kontrat riskini ve volatiliteyi doğrulayın.",
    "cta.viewToken": "Tokeni gör",
    "cta.viewList": "Watchlisti aç",
    "cta.profile": "Profili gör",
    "cta.futureSwap": "Gelecek swap terminalini aç",
    "cta.futureSwapText":
      "Sadece önizleme. Bu demo swap veya işlem çalıştırmaz.",
    "metric.watchScore": "Watch Score",
    "metric.hitRate": "Başarı oranı",
    "metric.followers": "Takipçi",
    "metric.performance": "Performans",
    "metric.bestCall": "En iyi call",
    "metric.liquidity": "Likidite",
    "metric.mentions": "Bahsedilme",
    "metric.holders": "Holder",
    "metric.price": "Fiyat",
    "metric.return": "Getiri",
    "metric.conviction": "Güven",
    "metric.entries": "Kayıt",
    "label.by": "by",
    "label.mock": "mock",
    "label.reply": "reply",
    "label.replies": "reply",
    "label.likes": "beğeni",
    "label.owner": "Sahip",
    "label.address": "Adres",
    "label.joined": "Katılım",
    "label.empty": "Henüz demo sinyali yok.",
    "stance.Bullish": "Bullish",
    "stance.Neutral": "Neutral",
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
      className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1"
      aria-label="Language"
    >
      {(["en", "tr"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            language === option
              ? "bg-white text-[#061017]"
              : "text-white/58 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

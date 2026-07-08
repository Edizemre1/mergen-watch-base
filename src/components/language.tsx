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
    "nav.home": "Home",
    "nav.watch": "Watch",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.openWatch": "Open Watch",
    "nav.backDashboard": "Back to dashboard",
    "nav.viewProfile": "View profile",
    "nav.viewList": "View list",
    "nav.viewToken": "View token",
    "common.publicDemo": "Public demo",
    "common.demoNotice":
      "This demo uses mock data and does not execute real swaps or transactions.",
    "common.mockData": "Mock data",
    "common.watchlists": "Watchlists",
    "common.watchers": "Watchers",
    "common.signals": "Signals",
    "common.score": "Score",
    "common.performance": "Performance",
    "common.followers": "Followers",
    "common.following": "Following",
    "common.address": "Address",
    "common.joined": "Joined",
    "common.owner": "Owner",
    "common.updated": "Updated",
    "common.horizon": "Horizon",
    "common.price": "Price",
    "common.return": "Return",
    "common.weightedReturn": "Weighted return",
    "common.hitRate": "Hit rate",
    "common.bestCall": "Best call",
    "common.worstCall": "Worst call",
    "common.entries": "Entries",
    "common.comments": "Comments",
    "common.recentComments": "Recent comments",
    "common.emptyComments": "No demo comments yet.",
    "common.likes": "likes",
    "common.reputation": "Reputation",
    "common.badges": "Badges",
    "common.sector": "Sector",
    "common.holders": "Holders",
    "common.mentions": "Mentions",
    "common.liquidity": "Liquidity",
    "common.volatility": "Volatility",
    "common.thesis": "Thesis",
    "common.riskNote": "Risk note",
    "common.conviction": "Conviction",
    "common.notAvailable": "N/A",
    "landing.headline": "Mergen Watch Base",
    "landing.subheadline":
      "Social watchlists and performance tracking for Base tokens.",
    "landing.card1": "Discover public watchlists",
    "landing.card2": "Track token performance",
    "landing.card3": "Build your onchain market profile",
    "landing.card1Text":
      "Browse simple lists curated by public Base researchers.",
    "landing.card2Text":
      "Compare stance, return, hit rate, and token-level signals.",
    "landing.card3Text":
      "Preview how public research history could become portable reputation.",
    "landing.primaryCta": "Browse watchlists",
    "landing.secondaryCta": "View roadmap",
    "landing.snapshotTitle": "A clearer way to read Base token activity",
    "landing.snapshotText":
      "Watchlists, profiles, token pages, comments, and performance are shown with mock data so the product idea is easy to review.",
    "dashboard.eyebrow": "Watch dashboard",
    "dashboard.title": "Simple public signals for Base tokens.",
    "dashboard.subtitle":
      "Start with featured watchlists, see who is publishing, then review the latest demo signals.",
    "dashboard.featured": "Featured Watchlists",
    "dashboard.topWatchers": "Top Watchers",
    "dashboard.recentSignals": "Recent Signals",
    "dashboard.howItWorks": "How it works",
    "dashboard.step1Title": "Browse public lists",
    "dashboard.step1Text": "Open a watchlist and review its token calls.",
    "dashboard.step2Title": "Check performance",
    "dashboard.step2Text": "Use mock hit rate and returns as a research summary.",
    "dashboard.step3Title": "Read social context",
    "dashboard.step3Text": "Comments and stances explain why a token is watched.",
    "dashboard.step4Title": "Prepare for onchain history",
    "dashboard.step4Text": "Future versions can attest watch activity on Base.",
    "profile.eyebrow": "Watcher profile",
    "profile.subtitle":
      "A public research profile with watchlists, badges, comments, and mock performance.",
    "profile.publicLists": "Public lists",
    "profile.researchBadges": "Research badges",
    "profile.watchHistory": "Watch history",
    "list.eyebrow": "Watchlist",
    "list.subtitle":
      "Review each token stance, thesis, risk note, and mock performance in one simple table.",
    "list.tokenCalls": "Token calls",
    "list.listComments": "Watchlist comments",
    "list.listQuality": "List quality",
    "token.eyebrow": "Token page",
    "token.subtitle":
      "A focused social and performance view for one Base token.",
    "token.socialScore": "Mergen Watch Score",
    "token.socialSignals": "Social signals",
    "token.watchlistMentions": "Watchlist mentions",
    "token.stanceDistribution": "Stance distribution",
    "token.communityConviction": "Community conviction",
    "token.researchDepth": "Research depth",
    "token.liquidityConfidence": "Liquidity confidence",
    "token.riskControl": "Risk control",
    "token.avgCallReturn": "Avg call return",
    "safety.title": "Safety note",
    "safety.copy":
      "Community signals are not financial advice. Watchlist performance is informational. Verify liquidity, contract risk, and volatility before trading. This demo does not execute swaps or guarantee returns.",
    "roadmap.eyebrow": "Roadmap",
    "roadmap.title": "Future onchain path",
    "roadmap.subtitle":
      "The demo is read-only today. A future version can move carefully toward Base attestations and safer transaction flows.",
    "roadmap.item1": "Base Sepolia first",
    "roadmap.item2": "MergenWatchRegistry contract later",
    "roadmap.item3": "Builder Code attribution later",
    "roadmap.item4": "Paymaster and sponsored transactions later",
    "roadmap.item5": "Real token price indexing later",
    "roadmap.item6": "Comment moderation later",
    "roadmap.item7": "Future integration with the main Mergen Finance site",
    "swap.title": "Future swap terminal",
    "swap.copy":
      "A later version may connect watch signals to a Base swap terminal. This demo stays read-only.",
    "swap.locked": "Swap preview locked",
    "stance.Bullish": "Bullish",
    "stance.Neutral": "Neutral",
    "stance.Risky": "Risky",
    "stance.Avoid": "Avoid",
  },
  tr: {
    "nav.home": "Ana sayfa",
    "nav.watch": "Watch",
    "nav.roadmap": "Roadmap",
    "nav.github": "GitHub",
    "nav.openWatch": "Watch'i aç",
    "nav.backDashboard": "Dashboard'a dön",
    "nav.viewProfile": "Profili gör",
    "nav.viewList": "Listeyi gör",
    "nav.viewToken": "Tokeni gör",
    "common.publicDemo": "Public demo",
    "common.demoNotice":
      "Bu demo mock data kullanır ve gerçek swap veya işlem çalıştırmaz.",
    "common.mockData": "Mock data",
    "common.watchlists": "Watchlistler",
    "common.watchers": "Watcherlar",
    "common.signals": "Sinyaller",
    "common.score": "Skor",
    "common.performance": "Performans",
    "common.followers": "Takipçi",
    "common.following": "Takip edilen",
    "common.address": "Adres",
    "common.joined": "Katılım",
    "common.owner": "Sahip",
    "common.updated": "Güncellendi",
    "common.horizon": "Vade",
    "common.price": "Fiyat",
    "common.return": "Getiri",
    "common.weightedReturn": "Ağırlıklı getiri",
    "common.hitRate": "Başarı oranı",
    "common.bestCall": "En iyi call",
    "common.worstCall": "En zayıf call",
    "common.entries": "Kayıtlar",
    "common.comments": "Yorumlar",
    "common.recentComments": "Son yorumlar",
    "common.emptyComments": "Henüz demo yorumu yok.",
    "common.likes": "beğeni",
    "common.reputation": "Reputasyon",
    "common.badges": "Rozetler",
    "common.sector": "Sektör",
    "common.holders": "Holder",
    "common.mentions": "Bahsedilme",
    "common.liquidity": "Likidite",
    "common.volatility": "Volatilite",
    "common.thesis": "Tez",
    "common.riskNote": "Risk notu",
    "common.conviction": "Güven",
    "common.notAvailable": "Yok",
    "landing.headline": "Mergen Watch Base",
    "landing.subheadline":
      "Base tokenları için sosyal watchlist ve performans takip platformu.",
    "landing.card1": "Public watchlistleri keşfet",
    "landing.card2": "Token performansını takip et",
    "landing.card3": "Onchain piyasa profilini oluştur",
    "landing.card1Text":
      "Public Base araştırmacılarının hazırladığı sade listeleri incele.",
    "landing.card2Text":
      "Stance, getiri, başarı oranı ve token sinyallerini karşılaştır.",
    "landing.card3Text":
      "Public araştırma geçmişinin taşınabilir reputasyona nasıl dönüşebileceğini gör.",
    "landing.primaryCta": "Watchlistleri incele",
    "landing.secondaryCta": "Roadmap'i gör",
    "landing.snapshotTitle": "Base token aktivitesini daha net oku",
    "landing.snapshotText":
      "Watchlistler, profiller, token sayfaları, yorumlar ve performans mock data ile gösterilir; böylece ürün fikri kolayca değerlendirilebilir.",
    "dashboard.eyebrow": "Watch dashboard",
    "dashboard.title": "Base tokenları için sade public sinyaller.",
    "dashboard.subtitle":
      "Öne çıkan watchlistlerden başla, kimlerin yayın yaptığını gör ve son demo sinyallerini incele.",
    "dashboard.featured": "Öne çıkan watchlistler",
    "dashboard.topWatchers": "Top watcherlar",
    "dashboard.recentSignals": "Son sinyaller",
    "dashboard.howItWorks": "Nasıl çalışır",
    "dashboard.step1Title": "Public listeleri gez",
    "dashboard.step1Text": "Bir watchlist aç ve token call'larını incele.",
    "dashboard.step2Title": "Performansı kontrol et",
    "dashboard.step2Text": "Mock başarı oranı ve getirileri araştırma özeti olarak kullan.",
    "dashboard.step3Title": "Sosyal bağlamı oku",
    "dashboard.step3Text": "Yorumlar ve stance'ler tokenin neden izlendiğini açıklar.",
    "dashboard.step4Title": "Onchain geçmişe hazırlan",
    "dashboard.step4Text": "Gelecek sürümler watch aktivitesini Base üzerinde attest edebilir.",
    "profile.eyebrow": "Watcher profili",
    "profile.subtitle":
      "Watchlistleri, rozetleri, yorumları ve mock performansı olan public araştırma profili.",
    "profile.publicLists": "Public listeler",
    "profile.researchBadges": "Araştırma rozetleri",
    "profile.watchHistory": "Watch geçmişi",
    "list.eyebrow": "Watchlist",
    "list.subtitle":
      "Her tokenin stance'ini, tezini, risk notunu ve mock performansını sade bir tabloda incele.",
    "list.tokenCalls": "Token call'ları",
    "list.listComments": "Watchlist yorumları",
    "list.listQuality": "Liste kalitesi",
    "token.eyebrow": "Token sayfası",
    "token.subtitle":
      "Tek bir Base tokenı için odaklanmış sosyal ve performans görünümü.",
    "token.socialScore": "Mergen Watch Skoru",
    "token.socialSignals": "Sosyal sinyaller",
    "token.watchlistMentions": "Watchlist bahsedilmeleri",
    "token.stanceDistribution": "Stance dağılımı",
    "token.communityConviction": "Topluluk güveni",
    "token.researchDepth": "Araştırma derinliği",
    "token.liquidityConfidence": "Likidite güveni",
    "token.riskControl": "Risk kontrolü",
    "token.avgCallReturn": "Ortalama call getirisi",
    "safety.title": "Güvenlik notu",
    "safety.copy":
      "Topluluk sinyalleri finansal tavsiye değildir. Watchlist performansı bilgilendirme amaçlıdır. İşlem yapmadan önce likiditeyi, kontrat riskini ve volatiliteyi doğrulayın. Bu demo swap çalıştırmaz veya getiri garanti etmez.",
    "roadmap.eyebrow": "Roadmap",
    "roadmap.title": "Gelecek onchain yol",
    "roadmap.subtitle":
      "Demo bugün sadece okunur. Gelecek sürüm dikkatli şekilde Base attestations ve daha güvenli işlem akışlarına ilerleyebilir.",
    "roadmap.item1": "Önce Base Sepolia",
    "roadmap.item2": "Sonra MergenWatchRegistry kontratı",
    "roadmap.item3": "Daha sonra Builder Code attribution",
    "roadmap.item4": "Daha sonra Paymaster ve sponsorlu işlemler",
    "roadmap.item5": "Daha sonra gerçek token fiyat indeksleme",
    "roadmap.item6": "Daha sonra yorum moderasyonu",
    "roadmap.item7": "Gelecekte ana Mergen Finance sitesi ile entegrasyon",
    "swap.title": "Gelecek swap terminali",
    "swap.copy":
      "İleride watch sinyalleri Base swap terminaline bağlanabilir. Bu demo sadece okunur kalır.",
    "swap.locked": "Swap önizlemesi kapalı",
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
      className="inline-flex rounded-md border border-white/10 bg-white/[0.04] p-1"
      aria-label="Language"
    >
      {(["en", "tr"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
            language === option
              ? "bg-emerald-200 text-[#07100b]"
              : "text-white/58 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   WildAlert — warstwa językowa strony (bez build stepu).

   Pięć języków, dokładnie tych, które ma aplikacja: pl, en, sk, cs, ar.
   Napisy interfejsu w makiecie telefonu oraz nazwy typów zgłoszeń NIE są
   tłumaczone od nowa — to te same ciągi, co w `app_localizations.dart`
   i w tabeli `report_types` (kolumny name_en / name_sk / name_cs / name_ar).
   Dzięki temu makieta pokazuje realny tekst z aplikacji, a nie jego wariację.

   Wybór języka: parametr ?lang= → zapamiętany wybór → język przeglądarki → pl.
   ============================================================ */
(function () {
  'use strict';

  var LANGS = [
    { code: 'pl', name: 'Polski',     dir: 'ltr' },
    { code: 'en', name: 'English',    dir: 'ltr' },
    { code: 'sk', name: 'Slovenčina', dir: 'ltr' },
    { code: 'cs', name: 'Čeština',    dir: 'ltr' },
    { code: 'ar', name: 'العربية',    dir: 'rtl' }
  ];

  var DICT = {

    /* ------------------------------------------------------ POLSKI */
    pl: {
      metaTitle: 'WildAlert — górski system ostrzegania w czasie rzeczywistym',
      metaDesc: 'WildAlert ostrzega Cię o dzikich zwierzętach i zagrożeniach w górach — w czasie rzeczywistym, nawet gdy telefon masz w kieszeni.',
      langLabel: 'Zmień język', langCode: 'PL',

      navFeatures: 'Funkcje', navHow: 'Jak działa', navPrivacy: 'Prywatność', navTerms: 'Regulamin',

      heroTitle1: 'Góry ostrzegają.', heroTitle2: 'Ty słuchasz.',
      heroSub: 'WildAlert to górski system ostrzegania w czasie rzeczywistym — o dzikich zwierzętach, osuwiskach i zagrożeniach na szlaku. Nawet gdy telefon masz w kieszeni.',
      ctaGet: 'Pobierz aplikację', ctaGetSub: 'Android — wkrótce', ctaHow: 'Zobacz jak działa',
      hintMouse: 'Najedź kursorem na 🐻 — zobacz, jak leci ostrzeżenie',
      hintTouch: 'Dotknij 🐻 — zobacz, jak leci ostrzeżenie',
      scrollCue: 'przewiń ↓',
      alertTitle: 'Zgłoszenie wysłane — Niedźwiedź',
      alertOne: '1 osoba w pobliżu ostrzeżona',
      alertFew: '{n} osoby w pobliżu ostrzeżone',
      alertMany: '{n} osób w pobliżu ostrzeżonych',
      mkBear: 'Niedźwiedź', mkAvalanche: 'Lawina', mkIce: 'Oblodzenie', mkClosed: 'Szlak zamknięty',
      mkHiker: 'turysta', mkWarned: 'ostrzeżony',
      ariaBear: 'Zgłoszenie: niedźwiedź. Pokaż, jak rozchodzi się ostrzeżenie.',
      ariaAvalanche: 'Zgłoszenie: zagrożenie lawinowe.',
      ariaIce: 'Zgłoszenie: oblodzenie szlaku.',
      ariaClosed: 'Zgłoszenie: szlak zamknięty.',
      canvasAria: 'Trójwymiarowa mapa górskiego terenu ze znacznikami zgłoszonych zagrożeń.',

      howEyebrow: 'Jak to działa',
      howH2: 'Od spotkania do ostrzeżenia:<br>niecała minuta',
      howLead: 'To nie jest wizualizacja „jak by mogło wyglądać” — poniżej są prawdziwe ekrany aplikacji.',
      s1t: 'Widzisz',
      s1b: 'Niedźwiedź kilkadziesiąt metrów od szlaku. Wyjmujesz telefon — mapa zna już Twoją pozycję i pokazuje, co zgłoszono w okolicy.',
      s2t: 'Zgłaszasz',
      s2b: 'Wybierasz z listy gotową pozycję — „Niedźwiedź, spotkanie oko w oko”. Lokalizacja dołącza się sama, zdjęcie jest opcjonalne.',
      s3t: 'Inni dostają ostrzeżenie',
      s3b: 'Każdy w wybranym promieniu dostaje powiadomienie — z telefonem w kieszeni i zgaszonym ekranem. Zgłoszenie samo wygaśnie po dwóch godzinach.',
      tagYou: 'Twój telefon', tagFar: 'Ktoś 800 m dalej',
      lockDate: 'czwartek, 14 sierpnia',
      pushTitle: '⚠️ Niedźwiedź — spotkanie oko w oko w pobliżu!',
      pushBody: 'Otwórz mapę, aby zobaczyć szczegóły i potwierdzić.',
      pushWhen: 'WILDALERT · TERAZ',

      uiFilterAll: 'Wszystkie', uiFilterAnimals: '🐾 Zwierzęta', uiFilterNatural: '🏔️ Zagrożenia naturalne',
      uiWhatSeen: 'Co widzisz?', uiGps: '📍 Lokalizacja GPS zostanie pobrana automatycznie',
      uiCatAnimals: 'ZWIERZĘTA',
      uiOptBoar: '🐗 Dzik na szlaku', uiOptBear: '🐻 Niedźwiedź — spotkanie oko w oko', uiOptWolf: '🐺 Wataha wilków',
      uiSend: 'Wyślij zgłoszenie', uiSent: '✅ Zgłoszenie wysłane — dziękujemy!',
      navMap: 'Mapa', navKnowledge: 'Wiedza', navReport: 'Zgłoś', navProfile: 'Profil', navSettings: 'Ustawienia',

      featEyebrow: 'Co potrafi',
      featH2: 'Szczegóły, które robią<br>różnicę na szlaku',
      featLead: 'Kilka osób na szlaku to kilka par oczu dla wszystkich innych. WildAlert spina je w jeden system.',

      ttlKick: 'Świeżość informacji', ttlH3: 'Zgłoszenia kasują się same',
      ttlP: 'Każdy typ ma własny czas życia — sarna sprzed doby jest bezużyteczna, zamknięty szlak sprzed tygodnia już nie. Nikt nie musi niczego sprzątać.',
      ttlDeer: 'Sarna przy szlaku', ttlBear: 'Niedźwiedź — oko w oko', ttlIce: 'Szklanka / oblodzenie',
      ttlAval: 'Aktywna lawina', ttlChain: 'Uszkodzone ubezpieczenia', ttlClosed: 'Zamknięcie odcinka',
      tMin: '20 min', tH2: '2 godz.', tH24: '24 godz.', tD3: '3 dni', tD14: '14 dni', tD30: '30 dni',

      bgKick: 'Praca w tle', bgH3: 'Czuwa, gdy telefon śpi w plecaku',
      bgP: 'Na serwer trafia wyłącznie ostatnia znana pozycja — nadpisywana, maksymalnie raz na minutę. Historii trasy nie zapisujemy w ogóle, a śledzenie nigdy nie jest ukryte.',
      bgNoteT: 'WildAlert czuwa', bgNoteS: 'Ostrzegam o zagrożeniach w promieniu 600 m',

      radKick: 'Promień', radH3: 'Ty ustawiasz zasięg',
      radP: '400, 600 lub 1000 m w planie darmowym. Premium schodzi do 50 m.',

      dgrKick: 'Skala', dgrH3: 'Cztery poziomy zagrożenia',
      dgrP: 'Ten sam kod kolorów na mapie, w bazie wiedzy i w powiadomieniu.',
      dgrLow: 'NISKI', dgrMid: 'ŚREDNI', dgrHigh: 'WYSOKI', dgrCrit: 'KRYTYCZNY',

      lngKick: 'Języki', lngH3: 'Pięć języków, w tym pismo od prawej',
      lngP: 'Słowacy i Czesi chodzą po tych samych graniach. Arabski ma pełną obsługę RTL — nie tylko przetłumaczone napisy.',

      shKick: 'Baza terenowa', shSub: 'schronisk w bazie',
      shP: 'Uzupełnienie komunikatów TOPR i GOPR — informacja od turystów, dla turystów. Nie zastępuje służb, tylko wypełnia lukę między nimi a szlakiem.',

      safetyP: 'WildAlert ma charakter informacyjny i <b>nie zastępuje</b> służb ratunkowych ani komunikatów TOPR i GOPR. W nagłym wypadku w górach dzwoń:',

      finalH2: 'Miej góry pod kontrolą',
      finalLead: 'Aplikacja jest w przygotowaniu do publikacji. Wkrótce na Androidzie i iOS.',
      soon: 'wkrótce',

      fPrivacy: 'Polityka prywatności', fTerms: 'Regulamin', fDelete: 'Usuwanie konta', fContact: 'Kontakt',
      legalHome: 'Strona główna', legalUpdated: 'Ostatnia aktualizacja:',
      policyPolishOnly: 'Polityka prywatności jest wiążąca w wersji polskiej. Poniżej dokumentu znajdziesz streszczenie po angielsku.'
    },

    /* ------------------------------------------------------ ENGLISH */
    en: {
      metaTitle: 'WildAlert — real-time mountain hazard alerts',
      metaDesc: 'WildAlert warns you about wildlife and hazards in the mountains — in real time, even with your phone in your pocket.',
      langLabel: 'Change language', langCode: 'EN',

      navFeatures: 'Features', navHow: 'How it works', navPrivacy: 'Privacy', navTerms: 'Terms',

      heroTitle1: 'The mountains warn you.', heroTitle2: 'You listen.',
      heroSub: 'WildAlert is a real-time mountain warning system — for wildlife, landslides and hazards on the trail. Even with your phone in your pocket.',
      ctaGet: 'Get the app', ctaGetSub: 'Android — coming soon', ctaHow: 'See how it works',
      hintMouse: 'Hover over the 🐻 — watch the alert travel',
      hintTouch: 'Tap the 🐻 — watch the alert travel',
      scrollCue: 'scroll ↓',
      alertTitle: 'Report sent — Bear',
      alertOne: '1 person nearby warned',
      alertFew: '{n} people nearby warned',
      alertMany: '{n} people nearby warned',
      mkBear: 'Bear', mkAvalanche: 'Avalanche', mkIce: 'Trail icing', mkClosed: 'Trail closed',
      mkHiker: 'hiker', mkWarned: 'warned',
      ariaBear: 'Report: bear. Show how the alert spreads.',
      ariaAvalanche: 'Report: avalanche hazard.',
      ariaIce: 'Report: trail icing.',
      ariaClosed: 'Report: trail closed.',
      canvasAria: 'Three-dimensional map of mountain terrain with markers of reported hazards.',

      howEyebrow: 'How it works',
      howH2: 'From encounter to alert:<br>under a minute',
      howLead: 'This is not a mock-up of what it could look like — these are the real screens of the app.',
      s1t: 'You see it',
      s1b: 'A bear a few dozen metres off the trail. You pull out your phone — the map already knows where you are and what has been reported nearby.',
      s2t: 'You report it',
      s2b: 'You pick a ready-made entry from the list — “Bear, face-to-face encounter”. Your location attaches itself; a photo is optional.',
      s3t: 'Others get warned',
      s3b: 'Everyone within the chosen radius gets a notification — phone in pocket, screen off. The report expires by itself after two hours.',
      tagYou: 'Your phone', tagFar: 'Someone 800 m away',
      lockDate: 'Thursday, 14 August',
      pushTitle: '⚠️ Bear — face-to-face encounter nearby!',
      pushBody: 'Open the map to see the details and confirm.',
      pushWhen: 'WILDALERT · NOW',

      uiFilterAll: 'All', uiFilterAnimals: '🐾 Animals', uiFilterNatural: '🏔️ Natural hazards',
      uiWhatSeen: 'What do you see?', uiGps: '📍 GPS location will be captured automatically',
      uiCatAnimals: 'ANIMALS',
      uiOptBoar: '🐗 Wild boar on the trail', uiOptBear: '🐻 Bear — face-to-face encounter', uiOptWolf: '🐺 Wolf pack',
      uiSend: 'Send report', uiSent: '✅ Report sent — thank you!',
      navMap: 'Map', navKnowledge: 'Guide', navReport: 'Report', navProfile: 'Profile', navSettings: 'Settings',

      featEyebrow: 'What it does',
      featH2: 'The details that matter<br>out on the trail',
      featLead: 'A few people on a trail are a few pairs of eyes for everyone else. WildAlert ties them into one system.',

      ttlKick: 'Freshness', ttlH3: 'Reports delete themselves',
      ttlP: 'Every type has its own lifespan — a roe deer from yesterday is useless, a closed trail from last week is not. Nobody has to clean anything up.',
      ttlDeer: 'Roe deer by the trail', ttlBear: 'Bear — face to face', ttlIce: 'Sheet ice / trail icing',
      ttlAval: 'Active avalanche', ttlChain: 'Damaged trail protection', ttlClosed: 'Section closure',
      tMin: '20 min', tH2: '2 hours', tH24: '24 hours', tD3: '3 days', tD14: '14 days', tD30: '30 days',

      bgKick: 'Background', bgH3: 'On watch while the phone sleeps',
      bgP: 'Only your last known position reaches the server — overwritten, at most once a minute. We never store a route history, and tracking is never hidden.',
      bgNoteT: 'WildAlert on watch', bgNoteS: 'Watching for hazards within 600 m',

      radKick: 'Radius', radH3: 'You set the range',
      radP: '400, 600 or 1000 m on the free plan. Premium goes down to 50 m.',

      dgrKick: 'Scale', dgrH3: 'Four hazard levels',
      dgrP: 'The same colour code on the map, in the guide and in the notification.',
      dgrLow: 'LOW', dgrMid: 'MEDIUM', dgrHigh: 'HIGH', dgrCrit: 'CRITICAL',

      lngKick: 'Languages', lngH3: 'Five languages, right-to-left included',
      lngP: 'Slovaks and Czechs walk the same ridges. Arabic has full RTL support — not just translated labels.',

      shKick: 'Field data', shSub: 'mountain huts in the database',
      shP: 'A complement to TOPR and GOPR bulletins — information from hikers, for hikers. It does not replace the rescue services; it fills the gap between them and the trail.',

      safetyP: 'WildAlert is informational and <b>does not replace</b> the rescue services or official TOPR and GOPR bulletins. In a mountain emergency, call:',

      finalH2: 'Keep the mountains in check',
      finalLead: 'The app is being prepared for release. Coming soon on Android and iOS.',
      soon: 'soon',

      fPrivacy: 'Privacy policy', fTerms: 'Terms of service', fDelete: 'Account deletion', fContact: 'Contact',
      legalHome: 'Home', legalUpdated: 'Last updated:',
      policyPolishOnly: 'The Polish version of the privacy policy is the binding one. An English summary follows the document.'
    },

    /* ------------------------------------------------------ SLOVENČINA */
    sk: {
      metaTitle: 'WildAlert — horský výstražný systém v reálnom čase',
      metaDesc: 'WildAlert vás upozorní na divú zver a nebezpečenstvá v horách — v reálnom čase, aj keď máte telefón vo vrecku.',
      langLabel: 'Zmeniť jazyk', langCode: 'SK',

      navFeatures: 'Funkcie', navHow: 'Ako to funguje', navPrivacy: 'Súkromie', navTerms: 'Podmienky',

      heroTitle1: 'Hory varujú.', heroTitle2: 'Vy počúvate.',
      heroSub: 'WildAlert je horský výstražný systém v reálnom čase — pre divú zver, zosuvy a nebezpečenstvá na chodníku. Aj keď máte telefón vo vrecku.',
      ctaGet: 'Stiahnuť aplikáciu', ctaGetSub: 'Android — čoskoro', ctaHow: 'Pozrite, ako to funguje',
      hintMouse: 'Prejdite kurzorom na 🐻 — pozrite, ako letí varovanie',
      hintTouch: 'Ťuknite na 🐻 — pozrite, ako letí varovanie',
      scrollCue: 'posunúť ↓',
      alertTitle: 'Nahlásenie odoslané — Medveď',
      alertOne: '1 osoba v okolí upozornená',
      alertFew: '{n} osoby v okolí upozornené',
      alertMany: '{n} osôb v okolí upozornených',
      mkBear: 'Medveď', mkAvalanche: 'Lavína', mkIce: 'Zľadovatenie', mkClosed: 'Chodník uzavretý',
      mkHiker: 'turista', mkWarned: 'upozornený',
      ariaBear: 'Nahlásenie: medveď. Ukázať, ako sa šíri varovanie.',
      ariaAvalanche: 'Nahlásenie: lavínové nebezpečenstvo.',
      ariaIce: 'Nahlásenie: zľadovatenie chodníka.',
      ariaClosed: 'Nahlásenie: chodník uzavretý.',
      canvasAria: 'Trojrozmerná mapa horského terénu so značkami nahlásených nebezpečenstiev.',

      howEyebrow: 'Ako to funguje',
      howH2: 'Od stretnutia po varovanie:<br>necelá minúta',
      howLead: 'Toto nie je vizualizácia „ako by to mohlo vyzerať“ — nižšie sú skutočné obrazovky aplikácie.',
      s1t: 'Uvidíte',
      s1b: 'Medveď pár desiatok metrov od chodníka. Vytiahnete telefón — mapa už pozná vašu polohu a ukazuje, čo bolo nahlásené v okolí.',
      s2t: 'Nahlásite',
      s2b: 'Vyberiete zo zoznamu hotovú položku — „Medveď, stretnutie zoči-voči“. Poloha sa pripojí sama, fotka je nepovinná.',
      s3t: 'Ostatní dostanú varovanie',
      s3b: 'Každý vo zvolenom okruhu dostane upozornenie — s telefónom vo vrecku a zhasnutou obrazovkou. Nahlásenie samo vyprší po dvoch hodinách.',
      tagYou: 'Váš telefón', tagFar: 'Niekto 800 m ďalej',
      lockDate: 'štvrtok, 14. augusta',
      pushTitle: '⚠️ Medveď — stretnutie zoči-voči v okolí!',
      pushBody: 'Otvorte mapu, pozrite si podrobnosti a potvrďte.',
      pushWhen: 'WILDALERT · TERAZ',

      uiFilterAll: 'Všetky', uiFilterAnimals: '🐾 Zvieratá', uiFilterNatural: '🏔️ Prírodné nebezpečenstvá',
      uiWhatSeen: 'Čo vidíte?', uiGps: '📍 Poloha GPS sa načíta automaticky',
      uiCatAnimals: 'ZVIERATÁ',
      uiOptBoar: '🐗 Diviak na chodníku', uiOptBear: '🐻 Medveď — stretnutie zoči-voči', uiOptWolf: '🐺 Svorka vlkov',
      uiSend: 'Odoslať nahlásenie', uiSent: '✅ Nahlásenie odoslané — ďakujeme!',
      navMap: 'Mapa', navKnowledge: 'Vedomosti', navReport: 'Nahlásiť', navProfile: 'Profil', navSettings: 'Nastavenia',

      featEyebrow: 'Čo dokáže',
      featH2: 'Detaily, ktoré robia<br>rozdiel na chodníku',
      featLead: 'Zopár ľudí na chodníku je zopár párov očí pre všetkých ostatných. WildAlert ich spája do jedného systému.',

      ttlKick: 'Čerstvosť informácií', ttlH3: 'Nahlásenia sa mažú samy',
      ttlP: 'Každý typ má vlastnú životnosť — srnec spred dňa je nepoužiteľný, uzavretý chodník spred týždňa nie. Nikto nemusí nič upratovať.',
      ttlDeer: 'Srnec pri chodníku', ttlBear: 'Medveď — zoči-voči', ttlIce: 'Poľadovica / zľadovatenie',
      ttlAval: 'Aktívna lavína', ttlChain: 'Poškodené istenie', ttlClosed: 'Uzávierka úseku',
      tMin: '20 min', tH2: '2 hod.', tH24: '24 hod.', tD3: '3 dni', tD14: '14 dní', tD30: '30 dní',

      bgKick: 'Beh na pozadí', bgH3: 'Stráži, kým telefón spí v batohu',
      bgP: 'Na server ide výlučne posledná známa poloha — prepisovaná, najviac raz za minútu. Históriu trasy neukladáme vôbec a sledovanie nikdy nie je skryté.',
      bgNoteT: 'WildAlert stráži', bgNoteS: 'Upozorňujem na nebezpečenstvá v okruhu 600 m',

      radKick: 'Okruh', radH3: 'Dosah si nastavíte sami',
      radP: '400, 600 alebo 1000 m v bezplatnom pláne. Premium ide až na 50 m.',

      dgrKick: 'Škála', dgrH3: 'Štyri stupne nebezpečenstva',
      dgrP: 'Rovnaký farebný kód na mape, vo vedomostiach aj v upozornení.',
      dgrLow: 'NÍZKA', dgrMid: 'STREDNÁ', dgrHigh: 'VYSOKÁ', dgrCrit: 'KRITICKÁ',

      lngKick: 'Jazyky', lngH3: 'Päť jazykov vrátane písma sprava',
      lngP: 'Slováci aj Česi chodia po tých istých hrebeňoch. Arabčina má plnú podporu RTL — nielen preložené nápisy.',

      shKick: 'Terénne dáta', shSub: 'chát v databáze',
      shP: 'Doplnok k správam TOPR a GOPR — informácia od turistov pre turistov. Nenahrádza záchranné zložky, len vypĺňa medzeru medzi nimi a chodníkom.',

      safetyP: 'WildAlert má informatívny charakter a <b>nenahrádza</b> záchranné zložky ani správy TOPR a GOPR. V horskej núdzi volajte:',

      finalH2: 'Majte hory pod kontrolou',
      finalLead: 'Aplikácia sa pripravuje na vydanie. Čoskoro na Androide a iOS.',
      soon: 'čoskoro',

      fPrivacy: 'Ochrana súkromia', fTerms: 'Podmienky', fDelete: 'Zmazanie účtu', fContact: 'Kontakt',
      legalHome: 'Domov', legalUpdated: 'Posledná aktualizácia:',
      policyPolishOnly: 'Záväzná je poľská verzia zásad ochrany súkromia. Pod dokumentom nájdete zhrnutie v angličtine.'
    },

    /* ------------------------------------------------------ ČEŠTINA */
    cs: {
      metaTitle: 'WildAlert — horský výstražný systém v reálném čase',
      metaDesc: 'WildAlert vás upozorní na divokou zvěř a nebezpečí v horách — v reálném čase, i když máte telefon v kapse.',
      langLabel: 'Změnit jazyk', langCode: 'CS',

      navFeatures: 'Funkce', navHow: 'Jak to funguje', navPrivacy: 'Soukromí', navTerms: 'Podmínky',

      heroTitle1: 'Hory varují.', heroTitle2: 'Vy nasloucháte.',
      heroSub: 'WildAlert je horský výstražný systém v reálném čase — pro divokou zvěř, sesuvy a nebezpečí na stezce. I když máte telefon v kapse.',
      ctaGet: 'Stáhnout aplikaci', ctaGetSub: 'Android — brzy', ctaHow: 'Podívejte se, jak to funguje',
      hintMouse: 'Najeďte kurzorem na 🐻 — podívejte se, jak letí varování',
      hintTouch: 'Klepněte na 🐻 — podívejte se, jak letí varování',
      scrollCue: 'posunout ↓',
      alertTitle: 'Hlášení odesláno — Medvěd',
      alertOne: '1 osoba v okolí varována',
      alertFew: '{n} osoby v okolí varovány',
      alertMany: '{n} osob v okolí varováno',
      mkBear: 'Medvěd', mkAvalanche: 'Lavina', mkIce: 'Námraza', mkClosed: 'Stezka uzavřena',
      mkHiker: 'turista', mkWarned: 'varován',
      ariaBear: 'Hlášení: medvěd. Ukázat, jak se šíří varování.',
      ariaAvalanche: 'Hlášení: lavinové nebezpečí.',
      ariaIce: 'Hlášení: námraza na stezce.',
      ariaClosed: 'Hlášení: stezka uzavřena.',
      canvasAria: 'Trojrozměrná mapa horského terénu se značkami nahlášených nebezpečí.',

      howEyebrow: 'Jak to funguje',
      howH2: 'Od setkání k varování:<br>necelá minuta',
      howLead: 'Tohle není vizualizace „jak by to mohlo vypadat“ — níže jsou skutečné obrazovky aplikace.',
      s1t: 'Uvidíte',
      s1b: 'Medvěd pár desítek metrů od stezky. Vytáhnete telefon — mapa už zná vaši polohu a ukazuje, co bylo nahlášeno v okolí.',
      s2t: 'Nahlásíte',
      s2b: 'Vyberete ze seznamu hotovou položku — „Medvěd, setkání tváří v tvář“. Poloha se připojí sama, fotka je nepovinná.',
      s3t: 'Ostatní dostanou varování',
      s3b: 'Každý ve zvoleném okruhu dostane upozornění — s telefonem v kapse a zhasnutou obrazovkou. Hlášení samo vyprší po dvou hodinách.',
      tagYou: 'Váš telefon', tagFar: 'Někdo 800 m dál',
      lockDate: 'čtvrtek, 14. srpna',
      pushTitle: '⚠️ Medvěd — setkání tváří v tvář v okolí!',
      pushBody: 'Otevřete mapu, zobrazte podrobnosti a potvrďte.',
      pushWhen: 'WILDALERT · TEĎ',

      uiFilterAll: 'Vše', uiFilterAnimals: '🐾 Zvířata', uiFilterNatural: '🏔️ Přírodní nebezpečí',
      uiWhatSeen: 'Co vidíte?', uiGps: '📍 Poloha GPS se načte automaticky',
      uiCatAnimals: 'ZVÍŘATA',
      uiOptBoar: '🐗 Divočák na stezce', uiOptBear: '🐻 Medvěd — setkání tváří v tvář', uiOptWolf: '🐺 Vlčí smečka',
      uiSend: 'Odeslat hlášení', uiSent: '✅ Hlášení odesláno — děkujeme!',
      navMap: 'Mapa', navKnowledge: 'Znalosti', navReport: 'Nahlásit', navProfile: 'Profil', navSettings: 'Nastavení',

      featEyebrow: 'Co umí',
      featH2: 'Detaily, které dělají<br>rozdíl na stezce',
      featLead: 'Pár lidí na stezce je pár párů očí pro všechny ostatní. WildAlert je spojuje do jednoho systému.',

      ttlKick: 'Čerstvost informací', ttlH3: 'Hlášení se mažou sama',
      ttlP: 'Každý typ má vlastní životnost — srnec ze včerejška je k ničemu, uzavřená stezka z minulého týdne nikoli. Nikdo nemusí nic uklízet.',
      ttlDeer: 'Srnec u stezky', ttlBear: 'Medvěd — tváří v tvář', ttlIce: 'Ledovka / námraza',
      ttlAval: 'Aktivní lavina', ttlChain: 'Poškozené jištění', ttlClosed: 'Uzavírka úseku',
      tMin: '20 min', tH2: '2 hod.', tH24: '24 hod.', tD3: '3 dny', tD14: '14 dní', tD30: '30 dní',

      bgKick: 'Běh na pozadí', bgH3: 'Hlídá, když telefon spí v batohu',
      bgP: 'Na server jde výhradně poslední známá poloha — přepisovaná, nejvýše jednou za minutu. Historii trasy neukládáme vůbec a sledování nikdy není skryté.',
      bgNoteT: 'WildAlert hlídá', bgNoteS: 'Hlídám nebezpečí v okruhu 600 m',

      radKick: 'Okruh', radH3: 'Dosah si nastavíte sami',
      radP: '400, 600 nebo 1000 m v bezplatném plánu. Premium jde až na 50 m.',

      dgrKick: 'Škála', dgrH3: 'Čtyři stupně nebezpečí',
      dgrP: 'Stejný barevný kód na mapě, ve znalostech i v upozornění.',
      dgrLow: 'NÍZKÁ', dgrMid: 'STŘEDNÍ', dgrHigh: 'VYSOKÁ', dgrCrit: 'KRITICKÁ',

      lngKick: 'Jazyky', lngH3: 'Pět jazyků včetně písma zprava',
      lngP: 'Slováci i Češi chodí po stejných hřebenech. Arabština má plnou podporu RTL — nejen přeložené nápisy.',

      shKick: 'Terénní data', shSub: 'chat v databázi',
      shP: 'Doplněk zpráv TOPR a GOPR — informace od turistů pro turisty. Nenahrazuje záchranné složky, jen vyplňuje mezeru mezi nimi a stezkou.',

      safetyP: 'WildAlert má informativní charakter a <b>nenahrazuje</b> záchranné složky ani zprávy TOPR a GOPR. V horské nouzi volejte:',

      finalH2: 'Mějte hory pod kontrolou',
      finalLead: 'Aplikace se připravuje k vydání. Brzy na Androidu a iOS.',
      soon: 'brzy',

      fPrivacy: 'Ochrana soukromí', fTerms: 'Podmínky', fDelete: 'Smazání účtu', fContact: 'Kontakt',
      legalHome: 'Domů', legalUpdated: 'Poslední aktualizace:',
      policyPolishOnly: 'Závazná je polská verze zásad ochrany soukromí. Pod dokumentem najdete shrnutí v angličtině.'
    },

    /* ------------------------------------------------------ العربية */
    ar: {
      metaTitle: 'WildAlert — نظام تحذير جبلي في الوقت الحقيقي',
      metaDesc: 'ينبّهك WildAlert إلى الحيوانات البرية والمخاطر في الجبال — في الوقت الحقيقي، حتى وهاتفك في جيبك.',
      langLabel: 'تغيير اللغة', langCode: 'AR',

      navFeatures: 'المزايا', navHow: 'كيف يعمل', navPrivacy: 'الخصوصية', navTerms: 'الشروط',

      heroTitle1: 'الجبال تُحذّر.', heroTitle2: 'وأنت تُصغي.',
      heroSub: 'WildAlert نظام تحذير جبلي في الوقت الحقيقي — للحيوانات البرية والانزلاقات والمخاطر على المسار. حتى وهاتفك في جيبك.',
      ctaGet: 'حمّل التطبيق', ctaGetSub: 'أندرويد — قريباً', ctaHow: 'شاهد كيف يعمل',
      hintMouse: 'مرّر المؤشر فوق 🐻 — وشاهد كيف ينطلق التحذير',
      hintTouch: 'المس 🐻 — وشاهد كيف ينطلق التحذير',
      scrollCue: 'مرّر للأسفل ↓',
      alertTitle: 'تم إرسال البلاغ — دب',
      alertOne: 'تم تنبيه شخص واحد قريب',
      alertFew: 'تم تنبيه {n} أشخاص قريبين',
      alertMany: 'تم تنبيه {n} شخصاً قريباً',
      mkBear: 'دب', mkAvalanche: 'انهيار جليدي', mkIce: 'تجمّد المسار', mkClosed: 'المسار مغلق',
      mkHiker: 'متنزّه', mkWarned: 'تم تنبيهه',
      ariaBear: 'بلاغ: دب. اعرض كيف ينتشر التحذير.',
      ariaAvalanche: 'بلاغ: خطر انهيار جليدي.',
      ariaIce: 'بلاغ: تجمّد على المسار.',
      ariaClosed: 'بلاغ: المسار مغلق.',
      canvasAria: 'خريطة ثلاثية الأبعاد لتضاريس جبلية مع علامات المخاطر المُبلّغ عنها.',

      howEyebrow: 'كيف يعمل',
      howH2: 'من المواجهة إلى التحذير:<br>أقل من دقيقة',
      howLead: 'هذه ليست صورة تخيّلية لما يمكن أن يبدو عليه التطبيق — بل شاشاته الحقيقية.',
      s1t: 'ترى',
      s1b: 'دبّ على بُعد عشرات الأمتار من المسار. تُخرج هاتفك — والخريطة تعرف موقعك أصلاً وتُظهر ما أُبلغ عنه في الجوار.',
      s2t: 'تُبلّغ',
      s2b: 'تختار بنداً جاهزاً من القائمة — «دب، مواجهة مباشرة». يُرفق الموقع تلقائياً، والصورة اختيارية.',
      s3t: 'الآخرون يتلقّون التحذير',
      s3b: 'كل من في النطاق المُحدَّد يتلقّى إشعاراً — والهاتف في الجيب والشاشة مطفأة. وينتهي البلاغ من تلقاء نفسه بعد ساعتين.',
      tagYou: 'هاتفك', tagFar: 'شخص على بُعد ٨٠٠ م',
      lockDate: 'الخميس، ١٤ أغسطس',
      pushTitle: '⚠️ دب — مواجهة مباشرة بالقرب منك!',
      pushBody: 'افتح الخريطة لعرض التفاصيل والتأكيد.',
      pushWhen: 'WILDALERT · الآن',

      uiFilterAll: 'الكل', uiFilterAnimals: '🐾 الحيوانات', uiFilterNatural: '🏔️ المخاطر الطبيعية',
      uiWhatSeen: 'ماذا ترى؟', uiGps: '📍 سيتم تحديد موقع GPS تلقائياً',
      uiCatAnimals: 'الحيوانات',
      uiOptBoar: '🐗 خنزير بري على المسار', uiOptBear: '🐻 دب — مواجهة مباشرة', uiOptWolf: '🐺 قطيع ذئاب',
      uiSend: 'إرسال البلاغ', uiSent: '✅ تم إرسال البلاغ — شكراً لك!',
      navMap: 'الخريطة', navKnowledge: 'المعرفة', navReport: 'إبلاغ', navProfile: 'الملف', navSettings: 'الإعدادات',

      featEyebrow: 'ماذا يفعل',
      featH2: 'التفاصيل التي تُحدث<br>فرقاً على المسار',
      featLead: 'بضعة أشخاص على المسار يعني بضعة أزواج من العيون للجميع. يجمعها WildAlert في نظام واحد.',

      ttlKick: 'حداثة المعلومة', ttlH3: 'البلاغات تُحذف من تلقاء نفسها',
      ttlP: 'لكل نوع عمر خاص به — غزال أمس بلا فائدة، أما مسار مغلق منذ أسبوع فلا. لا أحد مضطر إلى تنظيف شيء.',
      ttlDeer: 'غزال قرب المسار', ttlBear: 'دب — مواجهة مباشرة', ttlIce: 'جليد صفائحي / تجمّد',
      ttlAval: 'انهيار جليدي نشط', ttlChain: 'تجهيزات تأمين تالفة', ttlClosed: 'إغلاق مقطع',
      tMin: '٢٠ دقيقة', tH2: 'ساعتان', tH24: '٢٤ ساعة', tD3: '٣ أيام', tD14: '١٤ يوماً', tD30: '٣٠ يوماً',

      bgKick: 'العمل في الخلفية', bgH3: 'يسهر بينما ينام الهاتف في الحقيبة',
      bgP: 'لا يصل إلى الخادم سوى آخر موقع معروف — يُستبدل، مرة واحدة في الدقيقة على الأكثر. لا نحفظ سجل المسار إطلاقاً، والتتبّع ليس خفياً أبداً.',
      bgNoteT: 'WildAlert يسهر', bgNoteS: 'أراقب المخاطر ضمن ٦٠٠ م',

      radKick: 'النطاق', radH3: 'أنت تضبط المدى',
      radP: '٤٠٠ أو ٦٠٠ أو ١٠٠٠ م في الخطة المجانية. وتنزل Premium إلى ٥٠ م.',

      dgrKick: 'المقياس', dgrH3: 'أربعة مستويات خطر',
      dgrP: 'نفس رمز الألوان على الخريطة وفي المعرفة وفي الإشعار.',
      dgrLow: 'منخفض', dgrMid: 'متوسط', dgrHigh: 'مرتفع', dgrCrit: 'حرج',

      lngKick: 'اللغات', lngH3: 'خمس لغات، منها الكتابة من اليمين',
      lngP: 'السلوفاكيون والتشيك يمشون على القمم نفسها. والعربية مدعومة بالكامل من اليمين إلى اليسار — لا مجرد نصوص مترجمة.',

      shKick: 'بيانات ميدانية', shSub: 'ملجأً جبلياً في قاعدة البيانات',
      shP: 'مكمّل لنشرات TOPR وGOPR — معلومات من المتنزّهين وإليهم. لا يحل محل فرق الإنقاذ، بل يسدّ الفجوة بينها وبين المسار.',

      safetyP: 'يقدّم WildAlert معلومات فقط و<b>لا يحل محل</b> فرق الإنقاذ ولا نشرات TOPR وGOPR. في حالات الطوارئ الجبلية اتصل بـ:',

      finalH2: 'أبقِ الجبال تحت السيطرة',
      finalLead: 'التطبيق قيد التحضير للإصدار. قريباً على أندرويد وiOS.',
      soon: 'قريباً',

      fPrivacy: 'سياسة الخصوصية', fTerms: 'الشروط', fDelete: 'حذف الحساب', fContact: 'تواصل معنا',
      legalHome: 'الصفحة الرئيسية', legalUpdated: 'آخر تحديث:',
      policyPolishOnly: 'النسخة البولندية من سياسة الخصوصية هي المُلزِمة. وتجد أسفل المستند ملخصاً بالإنجليزية.'
    }
  };

  /* ---------------- wybór języka ---------------- */

  var STORE = 'wa-lang';
  var codes = LANGS.map(function (l) { return l.code; });

  function pick() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && codes.indexOf(q) >= 0) return q;
    try {
      var saved = localStorage.getItem(STORE);
      if (saved && codes.indexOf(saved) >= 0) return saved;
    } catch (e) { /* prywatny tryb przeglądarki */ }
    var navLangs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < navLangs.length; i++) {
      var base = String(navLangs[i]).slice(0, 2).toLowerCase();
      if (codes.indexOf(base) >= 0) return base;
    }
    return 'pl';
  }

  var cur = pick();
  var listeners = [];

  function meta(l) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === l) return LANGS[i];
    return LANGS[0];
  }

  function t(key) {
    var d = DICT[cur] || DICT.pl;
    return (key in d) ? d[key] : (DICT.pl[key] !== undefined ? DICT.pl[key] : key);
  }

  // Liczba mnoga: polski, słowacki i czeski mają trzy formy (1 / 2–4 / reszta),
  // angielski dwie, arabski upraszczamy do tych samych trzech koszyków.
  function plural(n, base) {
    var form;
    if (cur === 'en') {
      form = n === 1 ? 'One' : 'Many';
    } else if (cur === 'ar') {
      form = n === 1 ? 'One' : (n >= 3 && n <= 10 ? 'Few' : 'Many');
    } else {
      var last = n % 10, last2 = n % 100;
      form = n === 1 ? 'One'
           : (last >= 2 && last <= 4 && !(last2 >= 12 && last2 <= 14)) ? 'Few'
           : 'Many';
    }
    return t(base + form).replace('{n}', n);
  }

  /* ---------------- nakładanie tłumaczeń ---------------- */

  function setMeta(sel, attr, value) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute(attr, value);
  }

  function apply() {
    var m = meta(cur);
    document.documentElement.lang = cur;
    document.documentElement.dir = m.dir;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    // Podstrony podają własny klucz tytułu; bez tego każda dostawałaby
    // tytuł strony głównej.
    var root = document.documentElement;
    var titleKey = root.getAttribute('data-i18n-title');
    if (titleKey) {
      document.title = t(titleKey) + (root.getAttribute('data-i18n-title-suffix') || '');
      setMeta('meta[property="og:locale"]', 'content', cur === 'pl' ? 'pl_PL' : cur);
    } else {
      document.title = t('metaTitle');
      setMeta('meta[name="description"]', 'content', t('metaDesc'));
      setMeta('meta[property="og:title"]', 'content', t('metaTitle'));
      setMeta('meta[property="og:description"]', 'content', t('metaDesc'));
      setMeta('meta[property="og:locale"]', 'content', cur === 'pl' ? 'pl_PL' : cur);
      setMeta('meta[name="twitter:title"]', 'content', t('metaTitle'));
      setMeta('meta[name="twitter:description"]', 'content', t('metaDesc'));
    }

    renderSwitch();
    listeners.forEach(function (cb) { try { cb(cur); } catch (e) { /* nie psuj reszty */ } });
  }

  function set(code) {
    if (codes.indexOf(code) < 0 || code === cur) return;
    cur = code;
    try { localStorage.setItem(STORE, code); } catch (e) { /* trudno */ }
    api.lang = cur;
    api.dir = meta(cur).dir;
    apply();
  }

  /* ---------------- przełącznik w nagłówku ---------------- */

  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15 0 18M12 3c-2.5 2.7-2.5 15 0 18"/></svg>';
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';

  function renderSwitch() {
    var host = document.getElementById('langSwitch');
    if (!host) return;
    var wasOpen = host.classList.contains('open');

    host.innerHTML =
      '<button class="lang-btn" type="button" aria-haspopup="listbox" aria-expanded="' + (wasOpen ? 'true' : 'false') + '" aria-label="' + t('langLabel') + '">' +
        GLOBE + '<span>' + t('langCode') + '</span>' + CHEV +
      '</button>' +
      '<ul class="lang-menu" role="listbox" aria-label="' + t('langLabel') + '">' +
        LANGS.map(function (l) {
          return '<li role="none"><button role="option" type="button" lang="' + l.code + '" dir="' + l.dir + '"' +
            ' data-lang="' + l.code + '" aria-selected="' + (l.code === cur ? 'true' : 'false') + '">' +
            l.name + '<span class="code">' + l.code.toUpperCase() + '</span></button></li>';
        }).join('') +
      '</ul>';

    var btn = host.querySelector('.lang-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = host.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    host.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        host.classList.remove('open');
        set(b.getAttribute('data-lang'));
      });
    });
  }

  document.addEventListener('click', function (e) {
    var host = document.getElementById('langSwitch');
    if (host && !host.contains(e.target)) host.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var host = document.getElementById('langSwitch');
    if (host) host.classList.remove('open');
  });

  // Strony prawne dokładają własne, obszerne słowniki osobnym plikiem —
  // dzięki temu landing nie ciągnie za sobą całego regulaminu.
  function extend(more) {
    Object.keys(more).forEach(function (lang) {
      if (!DICT[lang]) DICT[lang] = {};
      var src = more[lang];
      Object.keys(src).forEach(function (k) { DICT[lang][k] = src[k]; });
    });
    if (document.readyState !== 'loading') apply();
  }

  var api = {
    lang: cur,
    dir: meta(cur).dir,
    languages: LANGS,
    t: t,
    plural: plural,
    set: set,
    extend: extend,
    // pozwala sprawdzić kompletność tłumaczeń bez zaglądania do środka
    has: function (lang, key) { return !!(DICT[lang] && Object.prototype.hasOwnProperty.call(DICT[lang], key)); },
    on: function (cb) { listeners.push(cb); }
  };
  window.WA_I18N = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();

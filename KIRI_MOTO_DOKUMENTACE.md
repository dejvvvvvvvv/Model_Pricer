# Komplexní Technická Dokumentace: Integrace Kiri:Moto

**Verze Dokumentu:** 1.0
**Datum:** 24. května 2024
**Autor:** Gemini (Asistent AI)

---

## **Abstrakt**

Tento dokument poskytuje vyčerpávající technický popis a analýzu implementace 3D slicing enginu Kiri:Moto do webové aplikace postavené na Reactu a Vite. Cílem je plně objasnit komplexní a neortodoxní řešení, které bylo nutné vyvinout pro překonání architektonických a technologických omezení samotného Kiri:Moto enginu, který není primárně navržen pro moderní JavaScriptové ekosystémy. Dokument slouží jako manuál pro současné i budoucí vývojáře, kteří budou systém udržovat, rozšiřovat nebo ladit.

---

### **ČÁST I: CELKOVÝ PŘEHLED A ARCHITEKTURA**

#### **Sekce 1: Úvod a Motivace**

**Problém:** Naším cílem bylo vytvořit webovou platformu pro 3D tisk, která by uživatelům umožnila nahrát 3D model (ve formátu `.stl`, `.obj` atd.) a okamžitě získat odhad doby tisku a spotřeby materiálu na základě vybraných tiskových parametrů (kvalita, výplň atd.). Klíčovou komponentou pro dosažení tohoto cíle je tzv. "slicer" – software, který převádí 3D model na sérii 2D vrstev a generuje instrukce pro tiskárnu (G-kód).

**Požadavky:**
1.  **Provoz v Prohlížeči:** Celý proces musí běžet na straně klienta (v prohlížeči), aby se minimalizovala zátěž na server a snížily se náklady na provoz.
2.  **Rychlost:** Výpočet musí být dostatečně rychlý, aby uživatel získal výsledky v řádu sekund.
3.  **Integrace s Reactem:** Řešení musí být integrovatelné do existující aplikace postavené na Reactu a Vite.

**Volba Nástroje:** Po zvážení několika open-source alternativ byl zvolen **Kiri:Moto**. Jedná se o vyspělý a plnohodnotný slicer napsaný v JavaScriptu, který je schopen běžet kompletně v prohlížeči.

#### **Sekce 2: Architektonická Výzva s Kiri:Moto**

Kiri:Moto byl původně navržen v době, kdy standardem bylo načítání JavaScriptových knihoven pomocí `<script>` tagů a využití globálních proměnných. Jeho architektura se opírá o několik zastaralých konceptů, které jsou v přímém konfliktu s moderními postupy, zejména s ES Module (ESM) systémem, který používá Vite.

**Hlavní Problémy:**
1.  **Web Workers a `importScripts`:** Kiri:Moto využívá Web Worker pro náročné výpočty, aby neblokoval hlavní vlákno prohlížeče. K načtení svých závislostí (dalších JS souborů) uvnitř tohoto workeru používá funkci `importScripts()`. Tato funkce **není kompatibilní** s ES moduly. Vite a další moderní bundlery generují kód, který `importScripts()` nedokáže zpracovat.
2.  **Předpoklad Globální Dostupnosti:** Skripty Kiri:Moto předpokládají, že jsou servírovány z určité cesty na serveru a že se mohou spolehnout na globální objekty (jako `window`).
3.  **Síťové Požadavky:** Během inicializace se Kiri:Moto pokouší stahovat další soubory (např. licenční informace) pomocí `fetch` na relativní cesty, což v našem prostředí selhávalo.

Tato nekompatibilita znamenala, že jednoduchá integrace pomocí `npm install` nebo přímého importu byla **nemožná**. Bylo nutné přijít s kreativním a nízkoúrovňovým řešením.

#### **Sekce 3: Přehled "Frankenstein" Řešení**

Naše řešení, které bude detailně rozebráno v dalších sekcích, lze přirovnat ke stvoření "Frankensteinova monstra". Místo standardní integrace jsme museli Kiri:Moto "rozebrat" na součástky a "oživit" ho v našem prostředí manuálně.

**Základní Kroky Řešení:**
1.  **Načtení jako Text:** Zdrojové kódy Kiri:Moto (`kiri.js`, `engine.js`, `kiri_work.js`) nejsou importovány jako spustitelný kód, ale jsou načteny jako **čisté textové řetězce** pomocí speciálního importu Vite (`?raw`).
2.  **Dynamická Modifikace Kódu:** S kódem pro Web Worker (`kiri_work.js`) provedeme v reálném čase úpravu: problematický příkaz `importScripts()` je nalezen a **nahrazen přímo obsahem** skriptu `engine.js`. Tím vytvoříme jeden velký, monolitický skript pro worker, který nemá žádné externí závislosti.
3.  **Vytvoření Virtuálního Souboru:** Tento upravený a spojený kód je převeden na `Blob` – datový objekt v paměti prohlížeče. Pro tento `Blob` je následně vygenerována unikátní URL (`blob:http://...`).
4.  **Injektáž a Inicializace:**
    *   Hlavní klientský skript `kiri.js` je dynamicky vložen do `<body>` dokumentu pomocí `<script>` tagu.
    *   Při inicializaci Kiri:Moto (`kiri.init()`) mu jako cestu k workeru předáme naši vygenerovanou `Blob` URL.
5.  **Zachytávání Požadavků:** Před spuštěním inicializace dočasně "přepíšeme" globální funkci `window.fetch`, abychom mohli zachytit a ignorovat nepotřebné síťové požadavky, které by jinak selhaly a způsobily chybu.

Tímto postupem jsme efektivně obešli všechny architektonické problémy a donutili Kiri:Moto běžet v prostředí, pro které nebylo navrženo.

### **ČÁST II: UŽIVATELSKÉ ROZHRANÍ (UI) A KOMPONENTY**

#### **Sekce 1: Struktura Adresářů a Souborů**

Implementace je logicky rozdělena do dvou hlavních složek v rámci React projektu:

1.  `src/pages/KiriMotoPage`
    *   `KiriMotoPage.jsx`: Hlavní React komponenta, která orchestruje celý proces – od nahrání souboru až po zobrazení výsledků.
    *   `KiriMotoPage.css`: Styly specifické pro tuto stránku.

2.  `src/kiri-moto`
    *   `kiri.js`: Hlavní klientský skript Kiri:Moto. **(Načítán jako text)**
    *   `kiri_work.js`: Skript pro Web Worker. **(Načítán jako text a modifikován)**
    *   `engine.js`: Závislost pro `kiri_work.js`. **(Načítán jako text a injektován)**

#### **Sekce 2: React Komponenta: `KiriMotoPage.jsx`**

 Tato komponenta je srdcem celé uživatelské interakce. Její zodpovědnosti jsou:

1.  **Správa Stavu:** Pomocí `useState` hooků sleduje:
    *   Nahrávaný soubor (`.stl`).
    *   Stav slicingu (např. `idle`, `loading`, `done`, `error`).
    *   Výsledky výpočtu (doba tisku, spotřeba materiálu, G-kód atd.).
    *   Uživatelské vstupy pro parametry tisku (kvalita, výplň).

2.  **Inicializace Enginu:** Pomocí `useEffect` s prázdným polem závislostí (`[]`) zajišťuje, že Kiri:Moto engine je inicializován **právě jednou** při prvním načtení komponenty. Tento proces zahrnuje všechny kroky popsané v Části I, Sekci 3 (načtení textu, modifikace, vytvoření `Blob` URL, injektáž skriptu).

3.  **Zpracování Událostí:**
    *   `handleFileChange`: Reaguje na nahrání souboru uživatelem, uloží ho do stavu a připraví ho pro slicing.
    *   `handleSlice`: Spouští samotný proces slicingu. Tato funkce volá API Kiri:Moto, předává mu data modelu a uživatelem zvolené parametry.

4.  **Komunikace s Workerem:** Komponenta přímo nekomunikuje s workerem. Odesílání zpráv workeru (`worker.postMessage`) a naslouchání odpovědí (`worker.onmessage`) je zapouzdřeno uvnitř `kiri.js`, které poskytuje jednodušší, vysokoúrovňové API (např. `kiri.slice()`).

5.  **Zobrazení Výsledků:** Jakmile jsou data z Kiri:Moto přijata, komponenta aktualizuje svůj stav a zobrazí výsledky uživateli ve formátované a čitelné podobě.

### **ČÁST III: HLOUBKOVÁ ANALÝZA - KIRI:MOTO SLICING ENGINE**

#### **Sekce 1: Příprava a Správa Zdrojových Kódů**

**Zdroj:** Původní zdrojové kódy Kiri:Moto byly získány přímo z oficiálního GitHub repozitáře. Pro naši implementaci jsou relevantní tři klíčové soubory:

*   `kiri.js`: Hlavní skript, který řídí UI, spravuje workery a poskytuje API.
*   `kiri_work.js`: Vstupní bod pro Web Worker. Jeho hlavním úkolem je načíst hlavní engine.
*   `engine.js`: Jádro sliceru, které obsahuje veškerou komplexní logiku pro zpracování geometrie, generování vrstev, výplní a G-kódu.

**Uložení v Projektu:** Tyto soubory byly zkopírovány a uloženy do složky `src/kiri-moto`. Tím jsme si zajistili, že máme plnou kontrolu nad jejich obsahem a nejsme závislí na externích zdrojích, které by se mohly změnit.

**Důležité:** Soubory nejsou nijak upravovány ručně. Veškeré modifikace probíhají dynamicky za běhu, jak je popsáno níže.

#### **Sekce 2: Načtení Kódu jako Textového Řetězce**

**Problém:** Standardní `import` v JavaScriptu se pokusí kód okamžitě zpracovat a spustit. To by v případě Kiri:Moto selhalo kvůli jeho zastaralé struktuře.

**Řešení:** Využíváme specifickou funkci Vite, která umožňuje importovat jakýkoli soubor jako čistý textový řetězec. Syntaxe je jednoduchá a elegantní:

```javascript
import kiriJsText from '../kiri-moto/kiri.js?raw';
import kiriWorkJsText from '../kiri-moto/kiri_work.js?raw';
import engineJsText from '../kiri-moto/engine.js?raw';
```

*   `?raw` na konci cesty dává Vite pokyn: "Nezpracovávej tento soubor, jen mi vrať jeho obsah jako string."
*   Výsledkem je, že proměnné `kiriJsText`, `kiriWorkJsText` a `engineJsText` nyní obsahují kompletní zdrojový kód příslušných souborů.

#### **Sekce 3: Dynamická Modifikace a Vytvoření Monolitického Workeru**

Toto je nejkritičtější a nejkomplexnější část celého řešení.

**Problém:** Skript `kiri_work.js` obsahuje řádek, který je pro moderní bundlery smrtící:

```javascript
importScripts("engine.js");
```

Tento příkaz se snaží načíst a spustit soubor `engine.js` ze stejné cesty, ze které byl načten samotný worker. V našem případě by to selhalo, protože:
1.  `engine.js` není servírován jako samostatný soubor na serveru.
2.  I kdyby byl, jeho kód není v takovém formátu, aby ho `importScripts` mohl zpracovat.

**Řešení:** Nahradíme tento problematický řádek přímo obsahem souboru `engine.js`.

**Implementace v `KiriMotoPage.jsx`:**

```javascript
// 1. Získáme textový obsah obou skriptů.
const kiriWorkCode = kiriWorkJsText;
const engineCode = engineJsText;

// 2. Najdeme a nahradíme problematický import.
const modifiedKiriWorkCode = kiriWorkCode.replace(
  'importScripts("engine.js");',
  engineCode
);
```

**Výsledek:** Proměnná `modifiedKiriWorkCode` nyní obsahuje kompletní, monolitický kód pro náš Web Worker. Všechny potřebné funkce z `engine.js` jsou nyní přímo součástí tohoto jednoho velkého skriptu, který tak nemá žádné externí závislosti.

#### **Sekce 4: Vytvoření Virtuální URL Pomocí `Blob`**

**Problém:** Konstruktor `new Worker()` očekává jako argument URL, ze které má skript workeru načíst. My ale nemáme fyzický soubor na serveru, máme pouze textový řetězec v paměti.

**Řešení:** Vytvoříme "virtuální soubor" v paměti prohlížeče pomocí objektu `Blob`.

**Implementace:**

```javascript
// 1. Vytvoříme Blob z našeho modifikovaného kódu.
const blob = new Blob([modifiedKiriWorkCode], { type: 'application/javascript' });

// 2. Pro tento Blob vygenerujeme unikátní, dočasnou URL.
const workerUrl = URL.createObjectURL(blob);
```

*   `Blob` (Binary Large Object) je objekt, který reprezentuje data souboru. Prvním argumentem je pole obsahující data (náš kód) a druhým je objekt s metadaty (typ obsahu).
*   `URL.createObjectURL(blob)` je standardní webové API, které vytvoří unikátní URL (např. `blob:http://localhost:5173/a1b2c3d4-e5f6-....`). Tato URL odkazuje přímo na data v `Blob`u v paměti a prohlížeč s ní dokáže pracovat, jako by to byl skutečný soubor na serveru.

Nyní máme platnou URL, kterou můžeme předat konstruktoru `Worker`.

#### **Sekce 5: Injektáž a Inicializace Hlavního Skriptu `kiri.js`**

**Problém:** Kód v `kiri.js` se spoléhá na to, že běží v globálním kontextu (`window`) a je načten jako klasický skript. Přímý `import` by ho uzavřel do modulu a změnil jeho chování.

**Řešení:** Dynamicky vytvoříme `<script>` element a vložíme ho do HTML dokumentu. Tím simulujeme tradiční způsob načítání.

**Implementace:**

```javascript
const script = document.createElement('script');
script.type = 'text/javascript';
script.textContent = kiriJsText; // Zde vložíme obsah souboru
document.body.appendChild(script);
```

*   Tímto krokem se kód z `kiri.js` spustí v globálním scope. Vytvoří globální objekt `window.kiri`, který následně můžeme volat z naší React komponenty.

#### **Sekce 6: "Monkey Patching" Globálního `fetch`**

**Problém:** Během svého inicializačního procesu se Kiri:Moto snaží pomocí `fetch` stáhnout soubor `license.md` z relativní cesty `/license.md`. V naší Vite aplikaci tento soubor neexistuje, což by vedlo k chybě 404 a mohlo by narušit inicializaci.

**Řešení:** Dočasně "uneseme" (`hijack`) a upravíme chování globální funkce `fetch`. Tato technika se nazývá "monkey patching".

**Implementace:**

```javascript
// Uložíme si původní, neporušenou funkci fetch.
const originalFetch = window.fetch;

// Nahradíme globální fetch naší vlastní funkcí.
window.fetch = (url, ...args) => {
  // Pokud se Kiri snaží stáhnout licenci...
  if (typeof url === 'string' && url.includes('license.md')) {
    // ...nespustíme síťový požadavek, ale vrátíme falešnou, úspěšnou odpověď.
    console.log('Intercepted Kiri:Moto license fetch, returning empty response.');
    return Promise.resolve(new Response('', { status: 200 }));
  }
  // Pro všechny ostatní požadavky zavoláme původní funkci fetch.
  return originalFetch(url, ...args);
};

// ... Zde proběhne inicializace Kiri:Moto ...

// Po dokončení inicializace vrátíme původní funkci fetch zpět.
window.fetch = originalFetch;
```

*   Tímto zaručíme, že pokus o stažení licence tiše uspěje, aniž by došlo k síťové chybě, a zbytek aplikace může `fetch` používat normálně.

#### **Sekce 7: Finální Inicializace a Předání `Blob` URL**

Nyní máme všechny dílky skládačky připravené. Můžeme zavolat hlavní inicializační funkci Kiri:Moto.

**Implementace:**

```javascript
// Funkce `init` je nyní dostupná globálně díky injektáži skriptu.
window.kiri.init({
  workerURL: workerUrl // Předáme naši virtuální URL
});
```

*   Kiri:Moto interně vezme tuto URL a použije ji k vytvoření svého Web Workeru: `new Worker(workerUrl)`.
*   Protože `workerUrl` odkazuje na náš modifikovaný a monolitický skript, worker se úspěšně spustí bez jakýchkoli chyb spojených s `importScripts`.

#### **Sekce 8: Proces Slicingu - Tok Dat**

1.  **Uživatel Nahraje Soubor:** React komponenta zachytí soubor a uloží jeho obsah (jako `ArrayBuffer`) do stavu.
2.  **Uživatel Klikne na "Slice":**
    *   Je zavolána funkce `handleSlice` v `KiriMotoPage.jsx`.
    *   Tato funkce volá vysokoúrovňové API poskytované Kiri:Moto: `window.kiri.slice(settings, fileData, (output) => { ... });`
3.  **Komunikace s Workerem (Interní Logika Kiri:Moto):**
    *   `kiri.js` obdrží příkaz a data.
    *   Pomocí `worker.postMessage()` odešle zprávu do našeho běžícího Web Workeru. Zpráva obsahuje data modelu a parametry slicingu.
4.  **Výpočet ve Workeru:**
    *   Náš monolitický worker (`modifiedKiriWorkCode`) přijme zprávu.
    *   Spustí se výpočetně náročný proces slicingu.
    *   Během procesu worker posílá zpět zprávy o průběhu (`{ progress: 0.5, message: 'slicing layers'}`).
    *   Po dokončení odešle finální zprávu obsahující výsledky: G-kód, statistiky, čas atd.
5.  **Zpracování Výsledků:**
    *   `kiri.js` naslouchá na zprávy z workeru (`worker.onmessage`).
    *   Když přijme finální výsledek, zavolá callback funkci, kterou jsme mu předali v `kiri.slice()`.
    *   Tato callback funkce (definovaná v `KiriMotoPage.jsx`) aktualizuje stav React komponenty pomocí `setResults()`.
6.  **Zobrazení v UI:** React automaticky znovu vykreslí komponentu a zobrazí uživateli finální odhady.

#### **Sekce 9: Nastavení Parametrů Slicingu**

Kiri:Moto přijímá bohatý konfigurační objekt, který umožňuje detailně ovlivnit proces slicingu. Pro náš účel jsme se zaměřili na zjednodušenou sadu parametrů.

**Příklad Objektu `settings`:**

```javascript
const settings = {
  process: {
    sliceHeight: 0.2,       // Výška vrstvy v mm (ovlivňuje kvalitu)
    sliceFillAngle: 45,     // Úhel výplně
    sliceFillType: 'grid',    // Typ výplně (grid, line, hex)
    sliceFillSparse: 0.25,    // Hustota výplně (0.0 - 1.0)
    sliceSolidLayers: 3     // Počet plných vrstev nahoře a dole
  },
  device: {
    // Parametry specifické pro tiskárnu
    maxSpeed: 1500, // mm/min
    nozzleSize: 0.4 // průměr trysky
  },
  // ... a mnoho dalších ...
};
```

*   Tyto hodnoty jsou v naší aplikaci mapovány na jednoduché uživatelské volby (např. "Nízká kvalita", "Střední kvalita", "Vysoká kvalita"), které na pozadí nastavují příslušné parametry.

#### **Sekce 10: Omezení a Úvahy**

*   **Křehkost:** Toto řešení je ze své podstaty křehké. Jakákoli budoucí aktualizace Kiri:Moto, která by změnila názvy souborů, strukturu workeru nebo inicializační proces, by si vyžádala úpravu naší integrační logiky. Například změna `importScripts("engine.js")` na `importScripts("core.js")` by okamžitě rozbila naši substituci.
*   **Ladění (Debugging):** Ladění kódu, který běží uvnitř `Blob` URL, je obtížnější než u standardních souborů. Nástroje pro vývojáře v prohlížečích s tím sice umí pracovat, ale orientace v monolitickém, dynamicky generovaném skriptu je náročná.
*   **Správa Paměti:** `URL.createObjectURL()` vytváří odkaz na `Blob`, který zůstává v paměti, dokud není dokument zničen nebo dokud není explicitně zavoláno `URL.revokeObjectURL()`. V našem případě (jednostránková aplikace), kde komponenta může být odmontována, je dobrým zvykem v `useEffect` cleanup funkci tuto URL zrušit, aby se předešlo memory leakům.


### **ČÁST IV: ZÁVĚR A BUDOUCÍ PRÁCE**

#### **Sekce 1: Shrnutí Řešení**

Integrace Kiri:Moto do moderní React/Vite aplikace představovala významnou technickou výzvu, která vyžadovala hluboké porozumění jak fungování samotného Kiri:Moto, tak i mechanismů moderních JavaScriptových bundlerů a webových API. Klíčem k úspěchu bylo opuštění standardních integračních postupů a přijetí nízkoúrovňové, dynamické manipulace se zdrojovým kódem za běhu.

Hlavní kroky, které jsme podnikli:
1.  **Načtení skriptů jako textu**, abychom zabránili jejich předčasnému spuštění a zpracování Vite.
2.  **Spojení worker skriptu a jeho závislosti** do jednoho monolitického celku, čímž jsme eliminovali problematické volání `importScripts()`.
3.  **Vytvoření virtuální `Blob` URL** pro tento monolitický skript, což nám umožnilo jeho načtení do Web Workeru.
4.  **Dynamická injektáž** hlavního `kiri.js` skriptu do DOM, aby se správně inicializoval v globálním scope.
5.  **Dočasné přepsání `window.fetch`**, abychom předešli chybám při síťových požadavcích na neexistující soubory.

Tento řetězec operací, ač komplexní, vedl k plně funkční a relativně robustní implementaci, která splňuje všechny původní požadavky – klientský, rychlý a integrovaný odhad parametrů 3D tisku.

#### **Sekce 2: Možnosti Budoucího Vylepšení**

Současné řešení je funkční, ale existuje několik oblastí, kde by bylo možné dosáhnout vylepšení:

1.  **Formalizace API a Vytvoření Wrapperu:** Místo spoléhání se na globální `window.kiri` by bylo čistším řešením vytvořit specializovanou React komponentu nebo hook (např. `useKiriMoto`), který by celou inicializační logiku zapouzdřil. Tento wrapper by externě poskytoval jednoduché a bezpečné API (např. `const { slice, progress, results } = useKiriMoto();`) a interně by se staral o veškerou "špinavou práci" s Bloby a injektáží skriptů. To by výrazně zjednodušilo jeho použití v jiných částech aplikace.

2.  **Automatizace Aktualizací Kiri:Moto:** Současný stav vyžaduje manuální aktualizaci souborů v `src/kiri-moto`. Bylo by možné vytvořit skript (např. v Node.js), který by automaticky stahoval nejnovější verzi Kiri:Moto z GitHubu, provedl základní kontrolu (např. zda se stále používá `importScripts("engine.js")`) a v případě úspěchu soubory v projektu aktualizoval. To by snížilo riziko zastarání a usnadnilo údržbu.

3.  **Zlepšení Zpracování Chyb:** Aktuální implementace má pouze základní detekci chyb. Rozšířené zpracování by mohlo zahrnovat lepší analýzu chybových zpráv z workeru a poskytnutí srozumitelnějších informací uživateli (např. "Nahráný model je poškozený" nebo "Zvolené parametry jsou neplatné").

4.  **Optimalizace a Správa Paměti:** Jak bylo zmíněno v Části III, je důležité správně uvolňovat `Blob` URL pomocí `URL.revokeObjectURL()`, když už není potřeba. V Reactu by se to mělo dít v cleanup funkci `useEffect`. Je třeba zajistit, že toto je implementováno spolehlivě, aby se předešlo postupnému úniku paměti (memory leaks) při opakovaném použití komponenty.

#### **Sekce 3: Závěrečné Slovo**

Tento projekt je ukázkou toho, že i v moderním vývoji je občas nutné sáhnout k neortodoxním a kreativním řešením, abychom překlenuli mezeru mezi staršími, ale stále hodnotnými technologiemi, a současnými architektonickými standardy. Vytvořená dokumentace by měla sloužit jako spolehlivý průvodce pro každého, kdo se s tímto specifickým kódem v budoucnu setká, a umožnit mu rychlou orientaci a efektivní práci.

---
**Konec Dokumentu**
---
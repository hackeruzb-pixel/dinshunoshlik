const $ = (s) => document.querySelector(s);
const homeView = $("#homeView"), presentationView = $("#presentationView");
const topicGrid = $("#topicGrid"), searchInput = $("#searchInput");
let selectedTopic = null, slideIndex = 0, activeFilter = "all";

const palettes = [
 ["#c7a7ff","#78e2d0","#171326"],["#f5c16c","#f58e8e","#21180f"],["#7bd5ff","#a5f0bd","#0e1d2b"],
 ["#f2a7c4","#e9d28a","#241421"],["#8fe3ca","#f0cb82","#102522"],["#f0b46b","#f3e5a5","#211b12"],
 ["#d2b4ff","#f1a5a5","#20152b"],["#8ee4db","#f2c27a","#0e2427"],["#f0b66e","#9dd7ff","#211a12"],
 ["#ffb6a4","#ffd98b","#281815"],["#9fd6ff","#d9c5ff","#111d2d"],["#e9bb78","#8cd5c8","#211a13"],
 ["#a8d9ff","#f2c17a","#101d2b"],["#b8e0a5","#e6d18c","#172116"],["#c9b2ff","#f3b7b7","#1c172b"],
 ["#82d8d4","#c9b4ff","#102323"],["#e7bd8b","#b8e0d2","#211a14"],["#e9a7b5","#f0d69a","#24151d"],
 ["#93d7ff","#c1f0bc","#101d28"],["#f3c278","#c6a7ff","#21190e"],["#c7a7ff","#8ce0d4","#181426"],
 ["#ffb77c","#ff8d8d","#261511"],["#82d8f2","#bba7ff","#101c2a"],["#d2a7ff","#8de0c0","#1a1427"],
 ["#f3b87e","#9dd6ff","#21180f"],["#ff9f9f","#f5cf7c","#261414"],["#9dd8b0","#f4c27a","#132319"],
 ["#b7b5ff","#8be2d3","#17162b"],["#f4cb81","#8fdbd1","#201b12"]
];
const symbols = ["✦","◈","◎","✧","✚","☼","◇","☸","⌂","✝","☾","◉","▤","❋","∞","✺","❂","❖","◌","⚖","⌘","◍","⌁","▧","◉","△","✣","⬡","✳"];
const categories = TOPICS.map((t,i)=>({ ...t, index:i, palette:palettes[i%palettes.length], symbol:symbols[i%symbols.length], group:i>=21&&i<=23?"digital":i>=18&&i<=20||i>=24?"society":"history"}));

const slideNames = ["Mavzuga kirish","Asosiy tushuncha","Tarixiy va nazariy zamin","Muhim jihatlar","Bugungi kundagi ahamiyati","Tahlil va muhokama","Xulosa"];
function slideData(topic, n) {
 const title = topic.title, sub = topic.subtitle;
 const generic = [
  {k:"KIRISH",h:title,lead:`Ushbu taqdimotda “${title}” mavzusi izchil ko‘rib chiqiladi. Asosiy maqsad — tushunchalarni anglash, tarixiy kontekstni ko‘rish va ularning jamiyat hayotidagi o‘rnini tahlil qilish.`,points:[["Maqsad","Mavzuning mazmuni va muhim tushunchalarini ochib berish."],["Yondashuv","Tarixiy, madaniy va ijtimoiy omillarni birgalikda ko‘rib chiqish."]]},
  {k:"ASOSIY TUSHUNCHA",h:"Bu mavzu nimani o‘rganadi?",lead:`${sub}. Mavzuni tushunishda atamalarni aniq ishlatish, manbalarni solishtirish va hodisalarni o‘z davri sharoitida baholash muhimdir.`,points:[["Ta’rif","Mavzuning markaziy tushunchasi va uning qo‘llanish doirasi."],["Tarkib","Asosiy g‘oyalar, amaliy ko‘rinishlar va ular bilan bog‘liq tushunchalar."]]},
  {k:"TARIXIY ZAMIN",h:"Shakllanish va rivojlanish",lead:"Har qanday diniy yoki ijtimoiy hodisa muayyan tarixiy sharoitda shakllanadi. Uni to‘g‘ri tushunish uchun davr, hudud, madaniy aloqalar va tarixiy manbalarni hisobga olish lozim.",points:[["Davr va makon","Hodisaning qayerda va qaysi sharoitda shakllanganini aniqlash."],["Manbalar","Tarixiy hujjatlar, ilmiy tadqiqotlar va madaniy yodgorliklarga tayanish."]]},
  {k:"MUHIM JIHATLAR",h:"E’tibor beriladigan asosiy jihatlar",lead:"Mavzuni bir tomonlama emas, bir necha nuqtayi nazardan o‘rganish zarur. Quyidagi yo‘nalishlar tahlilni tartibli va tushunarli qiladi.",points:[["1. Mazmun","Asosiy g‘oya, tushuncha va qarashlarni aniqlash."],["2. Muhit","Jamiyat, madaniyat, huquq va tarix bilan aloqasini ko‘rish."],["3. Manba","Ma’lumotning ishonchliligi va kelib chiqishini tekshirish."],["4. Ta’sir","Shaxs va jamiyat hayotiga ta’sirini baholash."]]},
  {k:"BUGUNGI KUN",h:"Mavzuning zamonaviy ahamiyati",lead:"Bugungi globallashuv va axborot almashinuvi sharoitida mavzuni ilmiy, xolis va mas’uliyatli o‘rganish muhim. Turli qarashlarni bilish o‘zaro hurmat va muloqot madaniyatini mustahkamlaydi.",points:[["Savodxonlik","Ma’lumotni tekshirish va dalilni fikrdan ajrata olish."],["Muloqot","Turli qarash va e’tiqod egalariga hurmat bilan munosabatda bo‘lish."]]},
  {k:"TAHLIL",h:"Tahlil uchun savollar",lead:"Quyidagi savollar mavzuni mustahkamlash, mustaqil fikrlash va dalillarga asoslangan munozara olib borishga yordam beradi.",points:[["Savol 1","Mavzuning eng muhim tushunchalari qaysilar?"],["Savol 2","Tarixiy sharoit uning rivojiga qanday ta’sir ko‘rsatgan?"],["Savol 3","Bugungi jamiyat uchun qanday saboqlar chiqarish mumkin?"]]},
  {k:"YAKUNIY XULOSA",h:"Bilim, xolislik va hurmat",lead:`“${title}” mavzusi tarixiy va zamonaviy jarayonlarni chuqurroq tushunishga yordam beradi. Ishonchli manbalarga tayanish, turli qarashlarni xolis o‘rganish va inson qadr-qimmatini hurmat qilish — dinshunoslikning muhim tamoyillaridir.`,points:[["Esda tuting","Murakkab mavzularni dalil va ilmiy yondashuv asosida o‘rganing."],["Amalda qo‘llang","Bag‘rikenglik, mas’uliyat va tanqidiy fikrlashni rivojlantiring."]]}
 ];
 return generic[n];
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderCards(){
 const q=searchInput.value.trim().toLocaleLowerCase("uz");
 const filtered=categories.filter(t=>(activeFilter==="all"||t.group===activeFilter)&&(`${t.id} ${t.title} ${t.subtitle}`).toLocaleLowerCase("uz").includes(q));
 topicGrid.innerHTML=filtered.map(t=>`<button class="topic-card" data-id="${t.id}" style="--card-accent:${t.palette[0]}"><div class="card-top"><span class="topic-code">${t.id}</span><span class="topic-symbol">${t.symbol}</span></div><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.subtitle)}</p><div class="card-bottom"><span>7 ta slayd · Taqdimot</span><strong>↗</strong></div></button>`).join("");
 $("#emptyState").hidden=filtered.length>0;
 topicGrid.querySelectorAll(".topic-card").forEach(card=>card.addEventListener("click",()=>openTopic(card.dataset.id)));
}
function openTopic(id){selectedTopic=categories.find(t=>t.id===id);slideIndex=0;homeView.hidden=true;presentationView.hidden=false;$("#presCode").textContent=selectedTopic.id;$("#presTitle").textContent=selectedTopic.title;document.body.classList.add("in-presentation");renderSlide();window.scrollTo({top:0,behavior:"smooth"});}
function makeSlideMarkup(topic,n,print=false){
 const d=slideData(topic,n), p=topic.palette;
 let points=d.points.map((x,i)=>`<div class="slide-point"><b>${escapeHtml(x[0])}</b><p>${escapeHtml(x[1])}</p></div>`).join("");
 return `<div class="slide" style="--theme-a:${p[0]};--theme-b:${p[1]};--slide-bg:${p[2]};--theme-ink:#fbf9ff"><div class="slide-topline"><span>${topic.id} · DINSHUNOSLIK</span><span>${String(n+1).padStart(2,"0")} / 07</span></div><div class="slide-content"><div class="slide-kicker">${escapeHtml(d.k)}</div><h2>${escapeHtml(d.h)}</h2><p class="slide-lead">${escapeHtml(d.lead)}</p><div class="slide-grid">${points}</div>${n===0?`<div class="quote-box">${escapeHtml(topic.subtitle)}</div>`:""}</div><div class="slide-number">${String(n+1).padStart(2,"0")}</div><div class="slide-footer"><span>DINSHUNOSLIK · O‘QUV TAQDIMOTI</span><span>${String(n+1).padStart(2,"0")}</span></div></div>`;
}
function renderSlide(){
 const slide=$("#slide"), d=slideData(selectedTopic,slideIndex), p=selectedTopic.palette;
 slide.style.setProperty("--theme-a",p[0]);slide.style.setProperty("--theme-b",p[1]);slide.style.setProperty("--slide-bg",p[2]);slide.style.setProperty("--theme-ink","#fbf9ff");
 $("#slideTopicCode").textContent=`${selectedTopic.id} · DINSHUNOSLIK`;
 $("#slideCounter").textContent=`${String(slideIndex+1).padStart(2,"0")} / 07`;
 $("#slideFooterNum").textContent=String(slideIndex+1).padStart(2,"0");
 $("#slideContent").innerHTML=`<div class="slide-kicker">${escapeHtml(d.k)}</div><h2>${escapeHtml(d.h)}</h2><p class="slide-lead">${escapeHtml(d.lead)}</p><div class="slide-grid">${d.points.map(x=>`<div class="slide-point"><b>${escapeHtml(x[0])}</b><p>${escapeHtml(x[1])}</p></div>`).join("")}</div>${slideIndex===0?`<div class="quote-box">${escapeHtml(selectedTopic.subtitle)}</div>`:""}<div class="slide-number">${String(slideIndex+1).padStart(2,"0")}</div>`;
 slide.classList.remove("anim-in");void slide.offsetWidth;slide.classList.add("anim-in");
 $("#progressText").textContent=`${slideIndex+1}-slayd · ${slideNames[slideIndex]}`;
 $("#progressPercent").textContent=`${Math.round((slideIndex+1)/7*100)}%`;
 $("#progressBar").style.width=`${(slideIndex+1)/7*100}%`;
 $("#prevBtn").disabled=slideIndex===0;$("#prevBtn").style.opacity=slideIndex===0?".4":"1";
 $("#nextBtn").textContent=slideIndex===6?"↻":"→";
 $("#slideDots").innerHTML=slideNames.map((_,i)=>`<button class="dot ${i===slideIndex?"active":""}" aria-label="${i+1}-slaydga o‘tish" data-slide="${i}"></button>`).join("");
 $("#slideDots").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{slideIndex=Number(b.dataset.slide);renderSlide();}));
}
function moveSlide(step){if(!selectedTopic)return;if(step===1&&slideIndex===6){slideIndex=0}else slideIndex=Math.max(0,Math.min(6,slideIndex+step));renderSlide();}
function printPresentation(){
 const printDeck=$("#printDeck");
 printDeck.innerHTML=Array.from({length:7},(_,i)=>`<div class="print-page">${makeSlideMarkup(selectedTopic,i,true)}</div>`).join("");
 window.print();
}
$("#prevBtn").addEventListener("click",()=>moveSlide(-1));$("#nextBtn").addEventListener("click",()=>moveSlide(1));
$("#backBtn").addEventListener("click",()=>{presentationView.hidden=true;homeView.hidden=false;selectedTopic=null;window.scrollTo({top:0,behavior:"smooth"});});
$("#printBtn").addEventListener("click",printPresentation);
$("#homeBrand").addEventListener("click",e=>{e.preventDefault();presentationView.hidden=true;homeView.hidden=false;selectedTopic=null;window.scrollTo({top:0,behavior:"smooth"});});
searchInput.addEventListener("input",renderCards);
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderCards();}));
$("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
document.addEventListener("keydown",e=>{if(!selectedTopic)return;if(e.key==="ArrowRight"){e.preventDefault();moveSlide(1)}if(e.key==="ArrowLeft"){e.preventDefault();moveSlide(-1)}if(e.key==="Escape"){presentationView.hidden=true;homeView.hidden=false;selectedTopic=null;}});
renderCards();
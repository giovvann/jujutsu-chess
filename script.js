// ================================================================
// CONSTANTS
// ================================================================
const SYMBOLS={W:{P:'♙',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔'},B:{P:'♟',R:'♜',N:'♞',B:'♝',Q:'♛',K:'♚'}};
const PIECE_NAMES={Q:'QUEEN',R:'ROOK',B:'BISHOP',N:'KNIGHT'};
const PIECE_VALS={P:1,N:3,B:3,R:5,Q:9,K:100};

const SKILLS={
    // Specials (S1–S3)
    'Divergent Fist':    {cost:20,  type:'target',  color:'#9b59b6', slot:'Special', desc:'SPECIAL — Click an enemy pawn to destroy it and leave a cursed hazard on that square. Enemy pieces that step on hazards take damage. Blocked by Infinity and Limitless.'},
    'Divine Dog':        {cost:80,  type:'instant', color:'#3498db', slot:'Special', desc:'SPECIAL — Summon your shikigami Divine Dog: a piece that moves like a Knight AND slides diagonally like a Bishop. Click again to retract it for free. If the Dog is captured in battle, it cannot be re-summoned this game.'},
    'Straw Doll':        {cost:60,  type:'target',  color:'#e67e22', slot:'Special', desc:'SPECIAL — Target any non-pawn enemy piece you have a clear line of sight to. That piece is instantly destroyed. Cannot harm Mahoraga (isAdaptive). Blocked by Infinity and Limitless.'},
    'Reversal Red':      {cost:150, type:'target',  color:'#e74c3c', slot:'Special', desc:'SPECIAL — Fire a blast of reversed cursed energy at any enemy piece (including pawns) in your line of sight, destroying it instantly. Cannot harm Mahoraga. Blocked by Infinity and Limitless.'},
    'Cleave':            {cost:140, type:'target',  color:'#8B6914', slot:'Special', desc:'SPECIAL — Destroy any enemy piece anywhere on the board (except the King and Mahoraga). No line-of-sight required. Blocked by Infinity and Limitless unless Mahoraga has adapted to them.'},
    'Lapse Blue':        {cost:60,  type:'instant', color:'#0066ff', slot:'Special', desc:'SPECIAL — Select any piece on the board (not King, not Mahoraga) then click any destination square. That piece teleports there instantly, capturing anything at the destination. Bypasses Infinity and Limitless entirely.'},
    'Dismantle':         {cost:200, type:'target',  color:'#ff6b35', slot:'Special', desc:'SPECIAL — Click an enemy piece as the center of a 3-square horizontal sweep. All enemy pieces at (col-1, col, col+1) on that row are destroyed. Cannot hit King or Mahoraga. You must have one of your own pieces in the same column with a clear vertical path to the target row.'},
    // Abilities (A1–A2)
    'Six Eyes':          {cost:0,   type:'passive', color:'#00d2ff', slot:'Ability', desc:'PASSIVE — Satoru Gojo\'s Six Eyes halve the CE cost of ALL your skills permanently (including Limitless triggers and Hollow Purple). Cannot be sealed or dispelled.'},
    'Limitless':         {cost:0,   type:'passive', color:'#00d2ff', slot:'Ability', desc:'PASSIVE — While you have 50 CE or more, every enemy attack (chess capture or skill) automatically costs them 50 CE and makes all your pieces immune for that entire turn. Mahoraga can pierce this after blocking it 3 times. Disabled during a Domain Clash.'},
    'Infinity':          {cost:120, type:'instant', color:'#00d2ff', slot:'Special', desc:'SPECIAL — Activate Infinity to block ALL enemy attacks (chess captures and all attacking skills) until your next turn starts. Bypassed by: Mahoraga (after adapting), Heavenly Restriction, attacker has an active domain, or Domain Clash.'},
    'Mahoraga':          {cost:200, type:'instant', color:'#FFD700', slot:'Ability', desc:'ABILITY — Summon the Divine General Mahoraga onto the board. Mahoraga moves as a Knight combined with a Queen. After blocking Limitless/Infinity 3 times, Mahoraga permanently adapts and pierces through them. If Mahoraga is captured, it cannot be re-summoned. Press again to retract for free.'},
    'Heavenly Restriction':{cost:0, type:'instant', color:'#e0e0e0', slot:'Ability', desc:'PASSIVE — Zenin Toji\'s zero-cursed-energy body. Your King moves like a Queen and cannot be blocked. Every turn you move two separate pieces. All your attacks completely bypass Infinity and Limitless. Trade-off: all other skill slots are permanently sealed, and Black Flash is disabled.'},
    'Projection Sorcery':{cost:80,  type:'passive', color:'#00e5ff', slot:'Ability', desc:'PASSIVE — Naoya Zenin\'s time-slicing technique. At the start of each of your turns, 80 CE is automatically spent to grant you one extra piece move. If you cannot afford the 80 CE, the bonus is skipped. Stacks with Velocidad vow and Imaginary Fierce God.'},
    // Ultimates (Ult)
    'Hollow Purple':     {cost:300, type:'target',  color:'#8b00ff', slot:'Ultimate', desc:'ULTIMATE — Click any column; that column and both adjacent (3 total) are instantly annihilated. With Annihilation vow: 5 columns (center ±2). All enemy pieces in affected columns except King are destroyed. One of the few techniques that can destroy Mahoraga and Rika.'},
    // Domains (Dom)
    'Malevolent Shrine': {cost:500, type:'instant', color:'#8B0000', slot:'Domain', desc:'DOMAIN EXPANSION — Sukuna\'s Binding Vow with the outside world. Every 3 turns, the 2 most valuable enemy pieces anywhere on the board are automatically destroyed (Cleave then Dismantle animations). Mahoraga cannot be hit by shrine strikes. Overwhelms all other domains.'},
    'Infinite Void':     {cost:500, type:'instant', color:'#6600cc', slot:'Domain', desc:'DOMAIN EXPANSION — Gojo\'s domain. The enemy is completely sealed for 10 turns — they cannot move or use skills. If Mahoraga is on the board, it adapts instantly and collapses the void before it forms. Overwhelms all other domains except Malevolent Shrine.'},
    // RCT
    'Reverse Cursed Technique':{cost:80, type:'instant', color:'#e91e63', slot:'RCT', desc:'RCT — Spend 80 CE to restore your most recently lost piece. It returns to its original square if empty, or the nearest available square on your side of the board. Does not count as a Mahoraga adaptation trigger.'},
    // Yuta skills
    'Cursed Speech':     {cost:80,  type:'instant', color:'#00cec9', slot:'Special', desc:'SPECIAL — Jogo\'s cursed speech seals one random opponent skill slot for 20 moves. They cannot use any technique in that slot for the duration. Can only be used ONCE per battle. The slot is chosen randomly from the opponent\'s active skills.'},
    'Copy':              {cost:100, type:'instant', color:'#a29bfe', slot:'Special', desc:'SPECIAL — Okkotsu Yuta\'s Copy: permanently record one random skill from the current opponent\'s kit. A temporary extra slot appears for one use at that skill\'s standard CE cost. Can only copy once per battle.'},
    'Rika':              {cost:150, type:'instant', color:'#fd79a8', slot:'Special', desc:'SPECIAL — Equipping Rika doubles your starting CE pool. Summon Rika as a bonus Queen piece on your back rank; while she is on the board, ALL your skill costs are halved (stacks with Six Eyes for 25% total). Rika acts as a normal queen in chess. Press again to retract for free. If Rika is captured she cannot return.'},
    'True Mutual Love':  {cost:500, type:'instant', color:'#fd79a8', slot:'Domain',  desc:'DOMAIN EXPANSION — Rika\'s love fills all space. Each turn a completely random skill from the entire skill pool fires automatically against the enemy. Collapses immediately if Malevolent Shrine or Infinite Void is active. Clashes equally with SEP, TCMP, and CSG.'},
    'Nue':               {cost:120, type:'instant', color:'#7b2fff', slot:'Special', desc:'SPECIAL — Summon the winged shikigami Nue. Nue moves as a Bishop but can also teleport to ANY empty square on the board instantly. Cannot capture or interact with the King in any way. Once destroyed in battle, Nue cannot be re-summoned. Press again to retract.'},
    'Chimera Shadow Garden':{cost:500,type:'instant',color:'#4a9eff',slot:'Domain',desc:'DOMAIN EXPANSION — Megumi\'s Ten Shadows domain. Each turn, a shadow clone of one of your pieces materialises as a new piece on the board — same movement rules as the original. Active for 10 turns. Collapses against Infinite Void and Malevolent Shrine.'},
    'Time Cell Moon Palace':{cost:500,type:'instant',color:'#ffaa00',slot:'Domain',desc:'DOMAIN EXPANSION — Naoya\'s temporal domain. Every enemy piece that moves during its turn is immediately destroyed. You gain free Projection Sorcery (one extra move) at the start of each of your turns. Collapses against Infinite Void and Malevolent Shrine.'},
    'Idle Transfiguration':{cost:150,type:'target-own',color:'#b040ff',slot:'Special',desc:'SPECIAL — Mahito\'s soul manipulation. Click one of your own pieces or pawns (not King, not Queen) to instantly transform it into a Queen. This does not consume your turn — you still get to make a chess move after.'},
    'Self Embodiment of Perfection':{cost:500,type:'instant',color:'#8800cc',slot:'Domain',desc:'DOMAIN EXPANSION — Mahito\'s domain. Each turn, one random enemy piece (not King, not pawn) has its soul warped and becomes a pawn. Once all non-King enemy pieces are already pawns, one pawn disappears per turn. Clashes equally with TML, TCMP, and CSG. Collapses against Infinite Void and Malevolent Shrine.'},
    // Heian Sukuna
    'Malevolent Shrine: Heian':{cost:800,type:'instant',color:'#8B0000',slot:'Domain',desc:'DOMAIN EXPANSION — The true form of Malevolent Shrine. Heian Sukuna\'s vow with the outside world destroys the 3 most valuable enemy pieces every 2 turns (instead of 2 every 3). Overwhelms all other domains. Cannot be shattered by chess captures.'},
    'Heian Cleave':      {cost:220,type:'instant',color:'#8B6914',slot:'Special',desc:'SPECIAL — Heian Sukuna\'s Cleave auto-targets and destroys the 2 most valuable enemy pieces anywhere on the board simultaneously. No click targeting required — the two highest-value non-King, non-Mahoraga enemy pieces are removed instantly.'},
    'Heian Dismantle':   {cost:380,type:'target', color:'#ff6b35',slot:'Special',desc:'SPECIAL — Click an enemy piece as the center of a 5-square horizontal sweep (col-2 to col+2). All enemy pieces in that sweep are destroyed. Cannot hit King or Mahoraga. You must have a piece in the same column with clear vertical line of sight to the target row.'},
    'World Cutting Slash':{cost:0, type:'instant',color:'#8B0000',slot:'Ultimate',desc:'ULTIMATE — A 4-activation incantation that cannot be interrupted. Press once: "Scale of the Dragon" overlay (no turn consumed). Press again: "Recoil". Press a third time: "Twin Meteors". Press the fourth time: WORLD CUTTING SLASH fires — the closest enemy piece in EVERY column is destroyed simultaneously. Cannot be blocked or stopped.'},
    'Hollow Nuke':       {cost:0,  type:'instant',color:'#8b00ff',slot:'Ultimate',desc:'ULTIMATE — Gojo\'s final convergence. An 8-stage incantation (2 per turn, 4 turns). On the 4th press, "HOLLOW PURPLE" fires: ALL enemy pieces on the inner board (columns B–G, ranks 2–7) are annihilated — King, Mahoraga and Rika included. Pieces on files A/H and ranks 1/8 (the border) survive. Bypassed by Infinity/Limitless unless: your domain is active, Mahoraga adapted, domain clash, or opponent has Heavenly Restriction.'},
    'Fuga':              {cost:500,type:'target', color:'#8B0000',slot:'Ultimate',desc:'ULTIMATE — Requires your Malevolent Shrine: Heian domain to be active. Click the center square of your target area. ALL enemy pieces (except King and Mahoraga) within the surrounding 5×5 area are instantly annihilated. Devastating but requires careful aim.'},
    'Imaginary Fierce God':{cost:0,type:'passive',color:'#FFD700',slot:'Ability',desc:'PASSIVE — Heian Sukuna\'s four-armed form. At battle start, an extra row of R N B Q Q B N R pieces spawns in front of your pawns as the Imaginary Fierce God row. These pieces move and capture like standard chess pieces. Also grants one extra chess move per turn (2 total moves every turn).'},
};

// ================================================================
// PROGRESS
// ================================================================
const PROG_KEY='jjc_prog_v8';
const SLOT_ORDER=['S1','S2','S3','S4','A1','A2','Dom','RCT','Ult'];
const SLOT_CATEGORY={S1:'Special',S2:'Special',S3:'Special',S4:'Special',A1:'Ability',A2:'Ability',Dom:'Domain',RCT:'RCT',Ult:'Ultimate'};
const SLOT_LABEL={S1:'Special 1',S2:'Special 2',S3:'Special 3',S4:'Special 4',A1:'Ability 1',A2:'Ability 2',Dom:'Domain',RCT:'Reverse Cursed Technique',Ult:'Ultimate'};
let prog=JSON.parse(localStorage.getItem(PROG_KEY))||JSON.parse(localStorage.getItem('jjc_prog_v7'))||null;
if(!prog){
    prog={unlocked:['Divergent Fist'],eq:{S1:'Divergent Fist',S2:null,S3:null,S4:null,A1:null,A2:null,Dom:null,RCT:null,Ult:null},ceMaxUnlocked:300,highestBot:null,unlockLog:{},beaten:{}};
} else {
    // migrate old shape (v7 → v8)
    const oldEq=prog.eq||{};
    const newEq={S1:null,S2:null,S3:null,S4:null,A1:null,A2:null,Dom:null,RCT:null,Ult:null};
    Object.entries(oldEq).forEach(([k,v])=>{
        if(!v) return;
        const cat=SKILLS[v]?.slot;
        if(!cat) return;
        // Find first empty slot in that category
        for(const sk of SLOT_ORDER){
            if(SLOT_CATEGORY[sk]===cat && !newEq[sk]){ newEq[sk]=v; break; }
        }
    });
    prog.eq=newEq;
    if(prog.ceMaxUnlocked===undefined) prog.ceMaxUnlocked=300;
    if(prog.highestBot===undefined) prog.highestBot=null;
    if(prog.unlockLog===undefined) prog.unlockLog={};
    if(prog.beaten===undefined) prog.beaten={};
    if(!prog.unlocked.includes('Divergent Fist')) prog.unlocked.unshift('Divergent Fist');
}
function saveProg(){ localStorage.setItem(PROG_KEY,JSON.stringify(prog)); }
saveProg();
let curSlot=null;
let pendingBattle=null;

// ── Settings (must be declared before initBoard/loadSettings calls) ──
const SETTINGS_KEY='jjk_settings';
let gameSettings={pieceStyle:'svg',boardTheme:'dark',bgImage:null,boardSize:65};

// ================================================================
// STATE
// ================================================================
let state={
    board:[],turn:'W',ceP:300,ceE:300,ceMaxP:300,ceRegenP:0,ceEMax:300,ceERegenRate:0,
    sel:null,moves:[],hazards:[],infP:0,infE:0,epTarget:null,
    domain:null,opp:null,oppElo:0,over:false,casting:null,vow:null,
    sukunaCaptured:[],sukunaPiecesLost:0,mahoragaActive:false,pendingMahoraga:false,
    rctTimer:0,adaptedTech:[],techUsageCount:{},domainBreakCount:0,
    dogCooldown:0,
    inBattleVowUsed:false,captureBonus:0,sealedTech:null,
    battleVowCostReduction:0,vowBonusRegen:0,vowBonusRegenLeft:0,
    capturedByW:[],capturedByE:[],
    awaitingPromo:null,
    projectionActive:false,projectionPiece:null,projectionMovesLeft:0,
    moveHistory:[],lastMove:null,heavenlyRestriction:false,
    tojiLastMoveDest:null,
    playerMahoragaActive:false,playerAdaptedTech:[],playerTechUsageCount:{},
    infiniteVoidActive:false,infiniteVoidTimer:0,
    limitlessImmunityP:0,limitlessImmunityE:0,
    lapseBluePhase:null,lapseBlueTarget:null,lapseBlueMoving:false,
    hollowPurplePhase:false,hollowPurpleColsAnim:[],hollowPurpleFirstCol:-1,
    domain2:null,domainClashTimer:0,domainChoicePending:false,
    gojoVoidActive:false,gojoVoidTimer:0,
    naoyaPhase2:false,naoyaRevivalDone:false,naoyaPhase2Moves:0,
    naoyaTCMPActive:false,playerTCMPActive:false,mahitoDomainActive:false,mahitoDomainTimer:0,playerSEPActive:false,
    mahoragaDomainAdaptTimer:0,playerMahoragaDomainAdaptTimer:0,
    mahoragaLimitlessBlocks:0,mahoragaAdaptedLimitless:false,mahoragaDestroyed:false,
    mahoragaAdaptedPS:false,mahoragaPSGrantedThisTurn:false,
    extraMovesThisTurn:0,rctUsedThisTurn:false,
    divineDogActive:false,divineDogDestroyed:false,
    aiLastSkill:null,aiSkillCooldowns:{},dismantlePhase:false,
    vowReversionTimer:0,vowSacrificeUsedThisTurn:false,
    yutaRikaActive:false,yutaRikaDestroyed:false,
    yutaCopiedSkill:null,yutaCopiedSkillUsed:false,
    cursedSpeechSeal:null,
    cursedSpeechUsed:false,
    trueMutualLoveActive:false,
    playerTMLActive:false,
    playerRikaActive:false,playerRikaDestroyed:false,
    playerCopiedSkill:null,playerCopiedSkillUsed:false,
    aiTurnCount:0,
    tmlClashTimer:0,
    // Megumi (Awakened)
    megRevivalUsed:false,megMahoragaPhase:false,megTurnsLeft:40,megRevivalPending:false,
    // Nue
    nueActive:false,nueDestroyed:false,nuePhase:null,
    aiNueActive:false,aiNueDestroyed:false,
    // Chimera Shadow Garden
    csgActive:false,csgTimer:0,playerCSGActive:false,playerCSGTimer:0,
};

// ================================================================
// SCREENS
// ================================================================
function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active-screen'));
    document.getElementById('game-screen').style.display=(id==='game-screen'?'flex':'none');
    if(id!=='game-screen') document.getElementById(id).classList.add('active-screen');
    if(id==='archive') renderArchive();
    if(id==='char-select') renderCharDrops();
    if(id==='home') updateHomeProgress();
    if(id==='settings'){updateSettingsUI();updateSettingsProgress();}
}
function updateHomeProgress(){
    const el=document.getElementById('home-progress-bar');
    if(!el) return;
    const unlocked=prog.unlocked.length;
    const ceMax=prog.ceMaxUnlocked||300;
    const beaten=Object.keys(prog.beaten||{}).length;
    el.innerHTML=
        `<span style="color:#333">⚡ CE <b style="color:#FFD700">${ceMax}</b></span>`+
        `<span style="color:#333">📜 <b style="color:#00d2ff">${unlocked}</b> techniques</span>`+
        `<span style="color:#333">💀 <b style="color:#8a2be2">${beaten}</b> defeated</span>`+
        `<span style="color:#222;font-size:7px;margin-left:auto;">● AUTO-SAVED</span>`;
}

if(!window._archiveTab) window._archiveTab='All';

function renderArchive(){
    // CE pool banner
    const banner=document.getElementById('archive-ce-banner');
    if(banner) banner.innerHTML=`⚡ CE POOL <b style="color:#FFD700">${prog.ceMaxUnlocked}</b> &nbsp;· TECHNIQUES <b style="color:#00d2ff">${prog.unlocked.length}</b> &nbsp;· DEFEATED <b style="color:#8a2be2">${Object.keys(prog.beaten||{}).length}</b>`;

    // Slot panel
    const slotEl=document.getElementById('slots');
    slotEl.innerHTML='';
    SLOT_ORDER.forEach(s=>{
        const el=document.createElement('div');
        const equipped=prog.eq[s];
        const color=equipped?SKILLS[equipped]?.color||'#888':'#2a2a2a';
        el.className='slot-card'+(curSlot===s?' selected':'');
        el.style.borderLeftColor=equipped?color:'rgba(255,255,255,.08)';
        el.innerHTML=`<div class="slot-card-label">${s} · ${SLOT_CATEGORY[s]}</div>`+
            `<div class="slot-card-skill" style="color:${equipped?color:'#444'}">${equipped||'— empty —'}</div>`;
        el.onclick=()=>{curSlot=s;renderArchive();};
        slotEl.appendChild(el);
    });

    // Filter tabs
    const tabsEl=document.getElementById('archive-tabs');
    if(tabsEl){
        tabsEl.innerHTML='';
        const cats=['All','Special','Ability','Domain','RCT','Ultimate'];
        cats.forEach(cat=>{
            const tab=document.createElement('button');
            tab.className='archive-tab'+(window._archiveTab===cat?' active':'');
            tab.textContent=cat.toUpperCase();
            tab.onclick=()=>{window._archiveTab=cat;renderArchive();};
            tabsEl.appendChild(tab);
        });
    }

    // Tech list header label
    const flabel=document.getElementById('archive-filter-label');
    if(flabel) flabel.textContent=curSlot?`· SHOWING ${SLOT_CATEGORY[curSlot].toUpperCase()}`:(window._archiveTab!=='All'?`· ${window._archiveTab.toUpperCase()}`:'');

    // Technique cards
    const list=document.getElementById('tech-list');
    list.innerHTML='';

    // Unequip card (when slot selected)
    if(curSlot){
        const unCard=document.createElement('div');
        unCard.className='tech-card tech-card-unequip';
        unCard.style.setProperty('--tc-color','#555');
        unCard.innerHTML='<div class="tc-name" style="color:#555;font-size:9px;">✖ UNEQUIP SLOT</div><div class="tc-meta"><span>Remove technique from '+curSlot+'</span></div>';
        unCard.onclick=()=>{prog.eq[curSlot]=null;saveProg();showSaveIndicator();renderArchive();};
        list.appendChild(unCard);
    }

    const targetCat=curSlot?SLOT_CATEGORY[curSlot]:null;
    const filterCat=(!targetCat&&window._archiveTab!=='All')?window._archiveTab:null;

    Object.keys(SKILLS).forEach(t=>{
        const sk=SKILLS[t];
        if(targetCat&&sk.slot!==targetCat) return;
        if(!targetCat&&filterCat&&sk.slot!==filterCat) return;

        const unlocked=prog.unlocked.includes(t);
        const isEquipped=curSlot&&prog.eq[curSlot]===t;
        const card=document.createElement('div');

        if(!unlocked){
            card.className='tech-card locked';
            card.style.setProperty('--tc-color','#2a2a2a');
            card.innerHTML='<div class="tc-name" style="color:#2a2a2a">🔒 LOCKED</div>'+
                '<div class="tc-meta"><span style="color:#222">'+sk.slot+' · ??? CE</span></div>';
        } else {
            card.className='tech-card'+(isEquipped?' selected':'');
            card.style.setProperty('--tc-color',sk.color);
            card.innerHTML='<div class="tc-name">'+t+(isEquipped?' <span class="tc-equipped-badge">EQUIPPED</span>':'')+'</div>'+
                '<div class="tc-meta">'+
                '<span class="tc-slot-badge" style="color:'+sk.color+';border-color:'+sk.color+'">'+sk.slot+'</span>'+
                '<span>'+sk.cost+' CE</span>'+
                '</div>';
            const ttHtml='<div style="color:'+sk.color+';font-size:11px;font-weight:bold;margin-bottom:5px;">'+t+'</div>'+
                '<div style="font-size:9px;color:#888;margin-bottom:2px;"><b style="color:#aaa">Slot:</b> '+sk.slot+' &nbsp;·&nbsp; <b style="color:#aaa">Cost:</b> '+sk.cost+' CE &nbsp;·&nbsp; <b style="color:#aaa">Type:</b> '+sk.type+'</div>'+
                '<div style="font-size:9px;color:#666;line-height:1.5;margin-top:5px;border-top:1px solid rgba(255,255,255,.06);padding-top:5px;">'+sk.desc+'</div>';
            card.addEventListener('mouseenter',()=>showTooltip(card,ttHtml,'right'));
            card.addEventListener('mouseleave',hideTooltip);
            card.onclick=()=>{
                if(!curSlot) return;
                if(SLOT_CATEGORY[curSlot]!==sk.slot) return;
                for(const s of SLOT_ORDER) if(prog.eq[s]===t&&s!==curSlot) prog.eq[s]=null;
                prog.eq[curSlot]=t;
                saveProg();showSaveIndicator();
                renderArchive();
            };
        }
        list.appendChild(card);
    });
}

// ================================================================
// BATTLE FLOW
// ================================================================
function renderCharDrops(){
    const allDrops={
        'Nobara Kugisaki':['Straw Doll'],
        'Itadori Yuji':['Divergent Fist'],
        'Fushiguro Megumi':['Divine Dog'],
        'Naoya Zenin':['Projection Sorcery','Time Cell Moon Palace'],
        'Mahito':['Idle Transfiguration','Reverse Cursed Technique','Self Embodiment of Perfection'],
        'Zenin Toji':['Heavenly Restriction'],
        'Gojo Sensei':['Reversal Red','Infinity','Lapse Blue','Six Eyes'],
        'Ryomen Sukuna (Shadow)':['Cleave','Malevolent Shrine','Mahoraga','Dismantle','Reverse Cursed Technique'],
        'Gojo Satoru (Strongest)':['Lapse Blue','Six Eyes','Hollow Purple','Hollow Nuke','Limitless','Infinite Void','Reverse Cursed Technique'],
        'Okkotsu Yuta':['Cursed Speech','Copy','Reverse Cursed Technique','Rika','True Mutual Love'],
        'Megumi (Awakened)':['Mahoraga','Chimera Shadow Garden','Nue'],
        'Ryomen Sukuna Heian':['World Cutting Slash','Heian Cleave','Heian Dismantle','Imaginary Fierce God','Fuga'],
    };
    const beaten=prog.beaten||{};
    Object.entries(allDrops).forEach(([opp,drops])=>{
        const id='cw-'+opp.replace(/[^a-zA-Z0-9]/g,'_');
        const el=document.getElementById(id);
        if(!el) return;
        const beatenClass=beaten[opp]?'c-beaten':'';
        let html=beaten[opp]?'<span style="color:#4caf50;font-size:8px;letter-spacing:1px;">✓ DEFEATED</span> ':'';
        html+=`<div style="margin-top:4px;font-size:8px;color:${beaten[opp]?'#FFD700':'#555'};letter-spacing:1px;">DROPS: ${drops.map(d=>`<span style="color:${beaten[opp]?SKILLS[d]?.color||'#888':'#444'}">${d}</span>`).join(', ')}</div>`;
        el.innerHTML=html;
    });
}

function selectOpponent(name,elo){
    pendingBattle={name,elo};
    document.getElementById('vow-target').innerText=`TARGET: ${name.toUpperCase()}`;
    showScreen('binding-vow');
}

function confirmVow(vow){state.vow=vow;startBattle(pendingBattle.name,pendingBattle.elo);}

function startBattle(name,elo){
    const vow=state.vow;
    const isShadow=(name==='Ryomen Sukuna (Shadow)');
    const isToji=(name==='Zenin Toji');
    const isGojo=(name==='Gojo Satoru (Strongest)');
    const hasHR=Object.values(prog.eq).includes('Heavenly Restriction');
    // New CE economy: bots start with CE = their ELO; player starts with their unlocked pool.
    let startCeE = isToji ? 0 : elo * 3;
    let startCeP = prog.ceMaxUnlocked || 300;
    let maxCeP = startCeP;
    let maxCeE = startCeE;
    // Vow effects on starting CE
    if(vow==='aniquilacion') startCeP=Math.max(0,startCeP-200);
    if(vow==='hambre')       startCeP=0;
    if(vow==='divina')       { startCeP=startCeP*3; maxCeP=startCeP; }
    // Rika equipped: double the CE pool
    if(Object.values(prog.eq).some(v=>v==='Rika')) { startCeP*=2; maxCeP*=2; }
    state={
        board:[],turn:'W',
        ceP:startCeP, ceE:startCeE, ceMaxP:maxCeP, ceEMax:maxCeE,
        // Legacy regen fields kept at 0 (CE no longer regenerates in v19)
        ceRegenP:0, ceERegenRate:0,
        sel:null,moves:[],hazards:[],infP:0,infE:0,epTarget:null,
        domain:null,opp:name,oppElo:elo,over:false,casting:null,vow:vow,
        sukunaCaptured:[],sukunaPiecesLost:0,mahoragaActive:false,pendingMahoraga:false,
        rctTimer:0,adaptedTech:[],techUsageCount:{},domainBreakCount:0,
        dogCooldown:0,
        inBattleVowUsed:false,captureBonus:0,
        sealedTech:null,
        battleVowCostReduction:0,
        vowBonusRegen:0,vowBonusRegenLeft:0,
        capturedByW:[],capturedByE:[],
        awaitingPromo:null,
        projectionActive:false,projectionPiece:null,projectionMovesLeft:0,
        moveHistory:[],lastMove:null,
        heavenlyRestriction:hasHR,
        tojiLastMoveDest:null,
        playerMahoragaActive:false,playerAdaptedTech:[],playerTechUsageCount:{},
        infiniteVoidActive:false,infiniteVoidTimer:0,
        limitlessImmunityP:0,limitlessImmunityE:0,
        lapseBluePhase:null,lapseBlueTarget:null,lapseBlueMoving:false,
        hollowPurplePhase:false,hollowPurpleColsAnim:[],hollowPurpleFirstCol:-1,
        domain2:null,domainClashTimer:0,domainChoicePending:false,
        gojoVoidActive:false,gojoVoidTimer:0,
        mahoragaLimitlessBlocks:0,mahoragaAdaptedLimitless:false,
        mahoragaDestroyed:false,
        mahoragaAdaptedPS:false,mahoragaPSGrantedThisTurn:false,
        // v19 additions
        extraMovesThisTurn:0,         // Projection Sorcery / Velocidad / HR
        rctUsedThisTurn:false,
        divineDogActive:false,divineDogDestroyed:false,
        aiLastSkill:null,aiSkillCooldowns:{},
        dismantlePhase:false,
        vowReversionTimer:0,
        vowSacrificeUsedThisTurn:false,
        _aiNoEndTurn:false,
        yutaRikaActive:false,yutaRikaDestroyed:false,
        yutaCopiedSkill:null,yutaCopiedSkillUsed:false,
        cursedSpeechSeal:null,
        cursedSpeechUsed:false,
        trueMutualLoveActive:false,
        playerTMLActive:false,
        playerRikaActive:false,playerRikaDestroyed:false,
        playerCopiedSkill:null,playerCopiedSkillUsed:false,
        aiTurnCount:0,
        tmlClashTimer:0,
        naoyaPhase2:false,
        naoyaRevivalDone:false,
        naoyaPhase2Moves:0,
        naoyaTCMPActive:false,
        playerTCMPActive:false,
        mahitoDomainActive:false,mahitoDomainTimer:0,playerSEPActive:false,
        mahoragaDomainAdaptTimer:0,playerMahoragaDomainAdaptTimer:0,
            // Megumi (Awakened)
        megRevivalUsed:false,megMahoragaPhase:false,megTurnsLeft:40,megRevivalPending:false,
        // Nue
        nueActive:false,nueDestroyed:false,nuePhase:null,
        aiNueActive:false,aiNueDestroyed:false,
        // Chimera Shadow Garden
        csgActive:false,csgTimer:0,playerCSGActive:false,playerCSGTimer:0,
        // Heian Sukuna
        heianDomainActive:false,heianDomainTimer:0,
        playerHeianDomainActive:false,
        wcsChantStage:0,playerWCSChantStage:0,wcsChantCooldown:0,
        hollowNukeChantStage:0,playerHollowNukeChantStage:0,aiHollowNukeUsed:false,
        fugaPhase:false,
    };
    // HR re-uses the old projection mechanism for "move 2 pieces per turn".
    if(hasHR){state.projectionActive=true;state.projectionMovesLeft=2;}
    document.getElementById('opp-display').innerText=name;
    document.getElementById('opp-display').style.color=isShadow?'var(--gold-light)':isToji?'#e0e0e0':isGojo?'#a78bfa':'var(--blue)';
    const eloEl=document.getElementById('opp-elo-display');
    if(eloEl) eloEl.textContent='ELO '+elo;
    const npEl=document.getElementById('opp-nameplate');
    if(npEl) npEl.style.borderLeftColor=isShadow?'var(--gold)':isGojo?'#7c3aed':name==='Ryomen Sukuna Heian'?'#8B0000':'var(--accent)';
    deactivateSukunaDomain();
    deactivateVoidDomain();
    deactivateHeianDomain();deactivatePlayerHeianDomain();
    const vowLabels={
        aniquilacion:'☠ ANNIHILATION active — enhanced skills, -200 start CE',
        velocidad:'💨 SPEED active — +1 extra move/turn, skills +50%',
        hambre:'🍖 HUNGER active — captures restore 100×value CE, 0 start CE',
        sacrificio:'🩸 SACRIFICE active — sacrifice piece for 50×value CE, no Black Flash',
        divina:'✨ DIVINE active — 3× starting CE, Abilities sealed',
        reversion:'💊 REVERSION active — auto-RCT every 2 turns, Domain sealed',
    };
    document.getElementById('vow-display').innerText=vow?vowLabels[vow]:'';
    // Sacrificio: X key listener to sacrifice selected piece
    if(state._sacrificioListener) document.removeEventListener('keydown',state._sacrificioListener);
    if(vow==='sacrificio'){
        state._sacrificioListener=function(e){
            if((e.key==='x'||e.key==='X')&&state.turn==='W'&&!state.over&&!state.vowSacrificeUsedThisTurn&&state.sel){
                const p=state.board[state.sel.r][state.sel.c];
                if(p&&p.color==='W'&&p.type!=='K'){
                    const gain=50*(PIECE_VALS[p.type]||1);
                    state.capturedByE.push(p.type);
                    state.board[state.sel.r][state.sel.c]=null;
                    state.ceP=Math.min(state.ceMaxP,state.ceP+gain);
                    showCEDelta(gain,true);
                    showTitle('SACRIFICE','#c0392b');
                    log(`Sacrificio: ${p.type} sacrificed for +${gain} CE!`);
                    state.vowSacrificeUsedThisTurn=true;
                    state.sel=null;state.moves=[];
                    render();
                }
            }
        };
        document.addEventListener('keydown',state._sacrificioListener);
    }
    initBoard();
    // Okkotsu Yuta: keep all normal pieces + add Rika as an extra queen in row 2
    if(name==='Okkotsu Yuta'){
        // Row 2 is empty at game start — place Rika there (column 3 = d6 area)
        state.board[2][3]={type:'Q',color:'B',isRika:true,moved:false};
        state.yutaRikaActive=true;
        const equippedSkills=Object.values(prog.eq).filter(v=>v&&v!=='Divergent Fist');
        if(equippedSkills.length>0&&state.ceE>=100){
            state.ceE-=100;
            state.yutaCopiedSkill=equippedSkills[Math.floor(Math.random()*equippedSkills.length)];
            log(`Yuta: Rika manifested! Copying ${state.yutaCopiedSkill}...`);
        }
    }
    renderCombatUI();render();showScreen('game-screen');
}

// ================================================================
// BOARD INIT
// ================================================================
function initBoard(){
    const b=['R','N','B','Q','K','B','N','R'];
    const ifgRow=['R','N','B','Q','Q','B','N','R'];
    state.board=Array(8).fill(null).map(()=>Array(8).fill(null));
    for(let i=0;i<8;i++){
        state.board[0][i]={type:b[i],color:'B',moved:false};
        state.board[1][i]={type:'P',color:'B',moved:false};
        state.board[6][i]={type:'P',color:'W',moved:false};
        state.board[7][i]={type:b[i],color:'W',moved:false};
    }
    // Imaginary Fierce God passive — extra row for Heian Sukuna (row 2) or player (row 5)
    if(state.opp==='Ryomen Sukuna Heian'){
        for(let i=0;i<8;i++) state.board[2][i]={type:ifgRow[i],color:'B',moved:false,isIFG:true};
    }
    if(Object.values(prog.eq).includes('Imaginary Fierce God')&&!isDivinaSealed('Imaginary Fierce God')){
        for(let i=0;i<8;i++) state.board[5][i]={type:ifgRow[i],color:'W',moved:false,isIFG:true};
    }
    document.getElementById('row-labels').innerHTML=[8,7,6,5,4,3,2,1].map(n=>`<span>${n}</span>`).join('');
    document.getElementById('col-labels').innerHTML=['a','b','c','d','e','f','g','h'].map(l=>`<span>${l}</span>`).join('');
}

// ================================================================
// CHESS LOGIC
// ================================================================
function getRawMoves(r,c,board=state.board){
    const p=board[r][c];if(!p) return [];
    // Nue: can teleport to any empty square + standard diagonal captures (cannot capture/check King)
    if(p.isNue){
        const nMoves=[];
        for(let nr=0;nr<8;nr++) for(let nc=0;nc<8;nc++){
            const t=board[nr][nc];
            if(!t) nMoves.push({r:nr,c:nc,isNueTeleport:true}); // empty — teleport
            else if(t.color!==p.color&&t.type!=='K'&&!t.isAdaptive&&!t.isMahoragaKing) nMoves.push({r:nr,c:nc}); // capture non-King, non-Mahoraga enemy
        }
        return nMoves;
    }
    let moves=[];
    const isW=p.color==='W';
    const push=(nr,nc)=>{
        if(nr<0||nr>=8||nc<0||nc>=8) return 'stop';
        if(p.color==='B'&&state.hazards.some(h=>h.r===nr&&h.c===nc)) return 'stop';
        const t=board[nr][nc];
        if(!t){moves.push({r:nr,c:nc});return 'go';}
        if(t.color!==p.color){moves.push({r:nr,c:nc});return 'stop';}
        return 'stop';
    };
    if(p.type==='P'){
        let d=isW?-1:1;
        if(!board[r+d]?.[c]){
            moves.push({r:r+d,c});
            if(!p.moved&&!board[r+d*2]?.[c]) moves.push({r:r+d*2,c,isDouble:true});
        }
        [-1,1].forEach(dc=>{
            if(board[r+d]?.[c+dc]&&board[r+d][c+dc].color!==p.color) moves.push({r:r+d,c:c+dc});
            if(state.epTarget&&state.epTarget.r===r+d&&state.epTarget.c===c+dc) moves.push({r:r+d,c:c+dc,isEP:true});
        });
    } else if(p.type==='N'||p.type==='K'){
        const steps=p.type==='K'?[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]:[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
        steps.forEach(s=>push(r+s[0],c+s[1]));
        // Divine Dog: knight + bishop sliding
        if(p.isDivineDog){
            [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(d=>{
                for(let i=1;i<8;i++) if(push(r+d[0]*i,c+d[1]*i)==='stop') break;
            });
        }
        // Mahoraga: also moves as Queen
        if(p.isAdaptive){
            [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(d=>{
                for(let i=1;i<8;i++) if(push(r+d[0]*i,c+d[1]*i)==='stop') break;
            });
        }
        // Toji: King moves as Queen (sliding)
        if(p.type==='K'&&p.color==='B'&&state.opp==='Zenin Toji'){
            [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(d=>{
                for(let i=1;i<8;i++) if(push(r+d[0]*i,c+d[1]*i)==='stop') break;
            });
        }
        // Heavenly Restriction: King slides like a Queen but is blocked by own pieces
        if(p.type==='K'&&p.color==='W'&&state.heavenlyRestriction){
            [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(d=>{
                for(let i=1;i<8;i++){
                    const nr=r+d[0]*i,nc=c+d[1]*i;
                    if(nr<0||nr>7||nc<0||nc>7) break;
                    const t=board[nr][nc];
                    if(t?.color===p.color) break; // blocked by own pieces
                    moves.push({r:nr,c:nc});
                    if(t) break; // stop after enemy capture
                }
            });
        }
        // Castling (only for normal Kings)
        if(p.type==='K'&&!p.moved&&c===4&&!(p.color==='B'&&state.opp==='Zenin Toji')){
            const row=isW?7:0;
            if(r===row){
                const kR=board[row][7];
                if(kR?.type==='R'&&kR.color===p.color&&!kR.moved&&!board[row][5]&&!board[row][6])
                    moves.push({r:row,c:6,isCastle:'kingside'});
                const qR=board[row][0];
                if(qR?.type==='R'&&qR.color===p.color&&!qR.moved&&!board[row][1]&&!board[row][2]&&!board[row][3])
                    moves.push({r:row,c:2,isCastle:'queenside'});
            }
        }
    } else {
        let dirs=(p.type==='R'||p.type==='Q')?[[0,1],[0,-1],[1,0],[-1,0]]:[];
        if(p.type==='B'||p.type==='Q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        dirs.forEach(d=>{for(let i=1;i<8;i++) if(push(r+d[0]*i,c+d[1]*i)==='stop') break;});
    }
    return moves;
}

function isInCheck(color,board){
    let kr=-1,kc=-1;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(board[r][c]?.type==='K'&&board[r][c]?.color===color){kr=r;kc=c;}
    if(kr===-1) return false;
    const enemy=color==='W'?'B':'W';
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(board[r][c]?.color===enemy)
            if(getRawMoves(r,c,board).some(m=>m.r===kr&&m.c===kc)) return true;
    return false;
}

function getLegalMoves(r,c,board=state.board){
    const p=board[r][c];if(!p) return [];
    return getRawMoves(r,c,board).filter(m=>{
        // Castling: can't castle in check, or through a checked square
        if(m.isCastle){
            if(isInCheck(p.color,board)) return false;
            const midCol=m.isCastle==='kingside'?5:3;
            const bMid=JSON.parse(JSON.stringify(board));
            bMid[r][midCol]=bMid[r][c];bMid[r][c]=null;
            if(isInCheck(p.color,bMid)) return false;
        }
        const bCopy=JSON.parse(JSON.stringify(board));
        if(m.isEP){const d=p.color==='W'?1:-1;bCopy[m.r+d][m.c]=null;}
        bCopy[m.r][m.c]=bCopy[r][c];bCopy[r][c]=null;
        return !isInCheck(p.color,bCopy);
    });
}

function getAllLegalMoves(color){
    let moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(state.board[r][c]?.color===color)
            getLegalMoves(r,c).forEach(m=>moves.push({fr:r,fc:c,...m}));
    return moves;
}

// ================================================================
// COMBAT UI
// ================================================================
// Returns true if a skill in an Ability slot is suppressed by the Divina vow
function isDivinaSealed(skillName){
    if(state.vow!=='divina') return false;
    const slot=Object.entries(prog.eq).find(([,v])=>v===skillName)?.[0];
    return slot==='A1'||slot==='A2';
}

function getTechCost(name,forAI=false){
    if(name===state.sealedTech) return Infinity;
    // Mahoraga retract is always free
    if(name==='Mahoraga'&&isPlayerMahoragaOnBoard()) return 0;
    let cost=SKILLS[name]?.cost??0;
    if(!forAI&&state.vow==='velocidad') cost=Math.ceil(cost*1.5);
    if(state.battleVowCostReduction>0) cost=Math.floor(cost*(1-state.battleVowCostReduction));
    // Rika: halves all costs (player's Rika on board)
    if(!forAI&&state.playerRikaActive) cost=Math.floor(cost*0.5);
    // Yuta's Rika: halves his costs
    if(forAI&&state.opp==='Okkotsu Yuta'&&state.yutaRikaActive) cost=Math.floor(cost*0.5);
    // Six Eyes: 50% off for holder — disabled if slot is sealed by Divina vow
    const hasSixEyes=forAI?(state.opp==='Gojo Satoru (Strongest)'||state.opp==='Gojo Sensei'):
        (Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes'));
    if(hasSixEyes) cost=Math.floor(cost*0.5);
    return cost;
}

function renderCombatUI(){
    // Toji: hide enemy CE bar (no CE system)
    const isTojiOpp=state.opp==='Zenin Toji';
    const ceRowE=document.getElementById('ce-row-e');
    const ceBarE=document.getElementById('ce-bar-e');
    if(ceRowE) ceRowE.style.display=isTojiOpp?'none':'flex';
    if(ceBarE) ceBarE.style.display=isTojiOpp?'none':'block';

    const cont=document.getElementById('battle-skills');
    cont.innerHTML='';
    SLOT_ORDER.forEach(slot=>{
        const name=prog.eq[slot];
        const b=document.createElement('div');
        const isDom=slot==='Dom';

        // Heavenly Restriction: seal all slots except HR itself; show HR as ACTIVE
        if(state.heavenlyRestriction&&name==='Heavenly Restriction'){
            b.className=`skill-slot sealed ${isDom?'dom-slot':''}`;
            b.style.borderColor='#e0e0e0';
            b.innerHTML=`<b style="font-size:8px;color:#e0e0e0">HEAVENLY RESTRICTION</b><span style="font-size:7px;color:#aaa">ACTIVE</span>`;
            cont.appendChild(b);return;
        }
        if(state.heavenlyRestriction&&name!=='Heavenly Restriction'){
            b.className=`skill-slot sealed ${isDom?'dom-slot':''}`;
            b.innerHTML=`<b style="font-size:8px">RESTRICTED</b><span style="font-size:7px">HR</span>`;
            cont.appendChild(b);return;
        }
        if(state.vow==='divina'&&(slot==='A1'||slot==='A2')){
            b.className='skill-slot sealed';
            b.innerHTML='<b style="font-size:8px">'+slot+' SEALED</b><span style="font-size:7px">Divine Vow</span>';
            cont.appendChild(b);return;
        }
        if(state.vow==='reversion'&&slot==='Dom'){
            b.className='skill-slot dom-slot sealed';
            b.innerHTML='<b style="font-size:8px">DOM SEALED</b><span style="font-size:7px">Reversion Vow</span>';
            cont.appendChild(b);return;
        }
        if(name&&name===state.sealedTech){
            b.className=`skill-slot sealed ${slot==='Dom'?'dom-slot':''}`;
            b.innerHTML=`<b style="font-size:8px">${name.length>12?name.substring(0,10)+'..':name}</b><span style="font-size:7px">SEALED</span>`;
            cont.appendChild(b);return;
        }

        // Passive skills: display-only, no click
        if(name&&SKILLS[name]?.type==='passive'){
            b.className=`skill-slot active passive-slot ${slot==='Dom'?'dom-slot':''}`;
            b.style.borderColor=SKILLS[name].color;
            let passiveActive=false;
            if(name==='Six Eyes') passiveActive=true;
            if(name==='Limitless'){
                const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                passiveActive=state.ceP>=(hasSE?25:50);
            }
            const sk=SKILLS[name];
            b.innerHTML=`<b style="font-size:8px;color:${sk.color}">${name.toUpperCase()}</b><span style="font-size:7px;color:${passiveActive?'#aaffaa':'#666'}">${passiveActive?'● ACTIVE':'○ LOW CE'}</span>`;
            const ttHtml=`<div class="tt-name" style="color:${sk.color};font-size:11px;font-weight:bold;margin-bottom:4px;">${name}</div>`+
                `<div style="font-size:9px;color:#888;margin-bottom:2px;"><b style="color:#aaa">Type:</b> Passive</div>`+
                `<div style="font-size:9px;color:#666;line-height:1.4;margin-top:4px;border-top:1px solid rgba(255,255,255,.06);padding-top:4px;">${sk.desc}</div>`;
            b.addEventListener('mouseenter',()=>showTooltip(b,ttHtml,'top'));
            b.addEventListener('mouseleave',hideTooltip);
            cont.appendChild(b);return;
        }

        // Mahoraga destroyed: show permanent blocked state
        if(name==='Mahoraga'&&state.mahoragaDestroyed){
            b.className=`skill-slot sealed ${slot==='Dom'?'dom-slot':''}`;
            b.style.borderColor='#FF4444';
            b.innerHTML=`<b style="font-size:8px;color:#FF4444">☸ MAHORAGA</b><span style="font-size:7px;color:#cc3333">DESTROYED</span>`;
            cont.appendChild(b);return;
        }
        b.className=`skill-slot ${name?'active':''} ${slot==='Dom'?'dom-slot':''} ${slot==='RCT'?'rct-slot':''} ${slot==='Ult'?'ult-slot':''}`;
        // Cursed Speech sealed slot visual
        if(state.cursedSpeechSeal&&state.cursedSpeechSeal.slot===slot&&(state.cursedSpeechSeal.movesLeft??state.cursedSpeechSeal.turnsLeft)>0){
            b.classList.add('slot-sealed');
            b.setAttribute('data-sealed-txt',`SEALED (${state.cursedSpeechSeal.movesLeft??state.cursedSpeechSeal.turnsLeft} moves)`);
        }
        if(name&&SKILLS[name]){
            const cost=getTechCost(name);
            const isAdapted=state.adaptedTech.includes(name);
            if(isAdapted) b.classList.add('adapted');
            const canAfford=state.ceP>=cost||cost===0;
            const sk=SKILLS[name];
            const isMahoragaToggle=(name==='Mahoraga'&&isPlayerMahoragaOnBoard());
            const isNueToggle=(name==='Nue'&&state.nueActive);
            const displayLabel=isNueToggle?'↩ RETRACT 🦅':isMahoragaToggle?'↩ RETRACT ☸':(name.length>14?name.substring(0,12)+'..':name);
            b.innerHTML=`
                <b style="font-size:9px;color:${canAfford?sk.color:'#555'}">${displayLabel}</b>
                <span style="font-size:8px;color:${canAfford?'#aaa':'#444'}">${cost===Infinity?'∞':cost} CE</span>
                <div class="skill-tooltip">
                    <div class="tt-name" style="color:${sk.color}">${name}</div>
                    <div class="tt-row"><b>Cost:</b> ${cost===Infinity?'∞ (SEALED)':cost+' CE'}</div>
                    <div class="tt-row"><b>Type:</b> ${sk.type}</div>
                    <div class="tt-desc">${sk.desc}</div>
                    ${isAdapted?'<div style="color:#c0392b;font-size:8px;margin-top:4px;">⚠ ADAPTED by Mahoraga</div>':''}
                </div>`;
            b.onclick=()=>{
                if(isAdapted&&state.opp==='Ryomen Sukuna (Shadow)'&&state.mahoragaActive&&isMahoragaOnBoard()) return;
                if(state.cursedSpeechSeal&&state.cursedSpeechSeal.slot===slot&&(state.cursedSpeechSeal.movesLeft??state.cursedSpeechSeal.turnsLeft)>0){
                    log(`Slot SEALED by Cursed Speech (${state.cursedSpeechSeal.movesLeft??state.cursedSpeechSeal.turnsLeft} moves remaining).`);return;
                }
                if((canAfford||isMahoragaToggle||isNueToggle)&&state.turn==='W') triggerSkill(name,false);
            };
            // Global tooltip (works regardless of parent overflow/stacking context)
            const ttHtml=`<div class="tt-name" style="color:${sk.color};font-size:11px;font-weight:bold;margin-bottom:4px;">${name}</div>`+
                `<div style="font-size:9px;color:#888;margin-bottom:2px;"><b style="color:#aaa">Cost:</b> ${cost===Infinity?'∞ (SEALED)':cost+' CE'}</div>`+
                `<div style="font-size:9px;color:#888;margin-bottom:2px;"><b style="color:#aaa">Type:</b> ${sk.type}</div>`+
                `<div style="font-size:9px;color:#666;line-height:1.4;margin-top:4px;border-top:1px solid rgba(255,255,255,.06);padding-top:4px;">${sk.desc}</div>`+
                (isAdapted?'<div style="color:#c0392b;font-size:8px;margin-top:4px;">⚠ ADAPTED by Mahoraga</div>':'');
            b.addEventListener('mouseenter',()=>showTooltip(b,ttHtml,'top'));
            b.addEventListener('mouseleave',hideTooltip);
        } else {
            b.innerHTML='<span style="font-size:9px">EMPTY</span>';
        }
        cont.appendChild(b);
    });

    // Copied skill slot
    if(state.playerCopiedSkill&&!state.playerCopiedSkillUsed){
        const copiedBtn=document.createElement('div');
        copiedBtn.className='skill-slot active copied-slot';
        const copiedCost=getTechCost(state.playerCopiedSkill);
        const copiedCanAfford=state.ceP>=copiedCost;
        copiedBtn.style.cssText='margin-top:4px;cursor:pointer;';
        copiedBtn.innerHTML=`<b style="font-size:9px;color:${copiedCanAfford?'#a29bfe':'#555'}">COPY: ${state.playerCopiedSkill.length>14?state.playerCopiedSkill.substring(0,12)+'..':state.playerCopiedSkill}</b><span style="font-size:8px;color:${copiedCanAfford?'#aaa':'#444'}">${copiedCost} CE</span>`;
        copiedBtn.onclick=()=>{
            if(state.turn!=='W'||state.over) return;
            if(!copiedCanAfford){log('Not enough CE for copied skill.');return;}
            state.ceP-=copiedCost;
            const cs=state.playerCopiedSkill;
            if(SKILLS[cs]?.type==='target'){state.casting=cs;render();log(`Copy: select target for ${cs}.`);}
            else{executeTech(cs,false);state.playerCopiedSkillUsed=true;}
        };
        cont.appendChild(copiedBtn);
    }

    // CE affordability marker
    const ceBarP=document.getElementById('ce-bar-p');
    if(ceBarP){
        ceBarP.querySelectorAll('.ce-bar-marker').forEach(m=>m.remove());
        const costs=Object.values(prog.eq).filter(n=>n&&SKILLS[n]&&n!==state.sealedTech&&!state.adaptedTech.includes(n)).map(n=>getTechCost(n)).filter(c=>c<Infinity);
        if(costs.length){
            const minCost=Math.min(...costs);
            const pct=Math.min(100,(minCost/state.ceMaxP)*100);
            const mk=document.createElement('div');mk.className='ce-bar-marker';
            mk.style.left=pct+'%';ceBarP.style.position='relative';ceBarP.appendChild(mk);
        }
    }

    const invBtn=document.getElementById('invoke-vow-btn');
    if(invBtn) invBtn.style.display='none';
}

// ================================================================
// SKILLS
// ================================================================
function triggerSkill(name,isAI,tr,tc){
    if(!isAI&&isDomainClash()){log('⚔ Domain Clash: all techniques sealed — neither side can act!');return;}
    showTitle(name,SKILLS[name].color);
    if(SKILLS[name].type==='instant'||(isAI&&tr!==undefined)){executeTech(name,isAI,tr,tc);}
    else if(isAI){executeTech(name,isAI);}
    else{state.casting=name;render();}
}

function getOppSkillPool(opp){
    const pools={
        'Nobara Kugisaki':['Straw Doll'],
        'Itadori Yuji':['Divergent Fist'],
        'Fushiguro Megumi':['Divine Dog'],
        'Naoya Zenin':['Projection Sorcery'],
        'Mahito':['Idle Transfiguration','Self Embodiment of Perfection'],
        'Zenin Toji':['Heavenly Restriction'],
        'Gojo Sensei':['Reversal Red','Infinity'],
        'Ryomen Sukuna (Shadow)':['Cleave','Malevolent Shrine','Dismantle','Reverse Cursed Technique'],
        'Gojo Satoru (Strongest)':['Hollow Purple','Hollow Nuke','Reversal Red','Lapse Blue','Infinite Void','Reverse Cursed Technique'],
        'Okkotsu Yuta':['Cursed Speech','Copy','Reverse Cursed Technique','Rika','True Mutual Love'],
        'Ryomen Sukuna Heian':['Heian Cleave','Heian Dismantle','World Cutting Slash','Malevolent Shrine: Heian'],
    };
    return pools[opp]||[];
}
function executeTech(name,isAI,r,c){
    const color=isAI?'B':'W';

    // Domain Clash: all skills sealed except Mahoraga
    if(isDomainClash()&&name!=='Mahoraga'){
        log('Domain Clash: all techniques sealed!');
        state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
    }

    // Infinite Void (player's): block AI skills
    if(state.infiniteVoidActive&&!isDomainClash()&&name!=='Infinite Void'){
        log('Skills sealed by Infinite Void!');
        state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
    }
    // Gojo Void (AI's): block player skills
    if(!isAI&&state.gojoVoidActive&&!isDomainClash()&&name!=='Infinite Void'&&name!=='Malevolent Shrine'){
        log('You are sealed in the Infinite Void! Techniques are impossible...');
        state.casting=null;return;
    }

    // Player Mahoraga adapts to AI skills (2-encounter system: starts on 1st, immune on 2nd)
    // RCT does not trigger Mahoraga adaptation
    if(isAI&&isPlayerMahoragaOnBoard()&&name!=='Reverse Cursed Technique'){
        if(state.playerAdaptedTech.includes(name)){
            // Fully adapted — block the skill
            log(`Mahoraga: ${name} has no effect!`);
            showMahoragaWheel();
            state.ceE-=getTechCost(name,true); // CE still spent — can't spam for free
            state._aiNoEndTurn=false; // tell aiCycle not to continue — we're handling the turn
            endTurn();return;
        }
        state.playerTechUsageCount[name]=(state.playerTechUsageCount[name]||0)+1;
        if(state.playerTechUsageCount[name]===1){
            // First encounter — adaptation begins, skill still fires
            showMahoragaWheel();
            log(`Mahoraga begins adapting to ${name}! Next use will be nullified.`);
            // fall through — skill executes normally
        } else if(state.playerTechUsageCount[name]>=2){
            // Second encounter — fully adapted, block from now on
            state.playerAdaptedTech.push(name);
            showMahoragaWheel();
            log(`Mahoraga fully adapts to ${name}! It has no effect!`);
            state.ceE-=getTechCost(name,true);
            state._aiNoEndTurn=false; // tell aiCycle not to continue — we're handling the turn
            endTurn();return;
        }
    }

    // Mahoraga adaptation block (only if enemy Mahoraga is physically on the board)
    if(!isAI&&state.opp==='Ryomen Sukuna (Shadow)'&&state.mahoragaActive&&isMahoragaOnBoard()&&state.adaptedTech.includes(name)){
        log(`Mahoraga has adapted to ${name}. No effect!`);
        showTitle('ADAPTATION','#c0392b');
        showMahoragaWheel();
        state.casting=null;endTurn();return;
    }

    // LOS check
    if(name==='Reversal Red'||name==='Straw Doll'||name==='Divergent Fist'){
        if(!hasLOS(r,c,color)){log("No Line of Sight!");state.casting=null;return;}
    }

    // Deduct CE
    if(isAI) state.ceE-=getTechCost(name,true);
    else state.ceP-=getTechCost(name);

    if(name==='Infinity'){
        if(isAI) state.infE=1; else state.infP=1;

    } else if(name==='Malevolent Shrine'){
        // Player-usable domain
        state.domain={owner:'W',type:'malevolent-player',timer:0};
        activateSukunaDomain();
        showTitle('MALEVOLENT SHRINE','#8B0000');
        log('Domain Expansion: Malevolent Shrine! The ritual begins...');
        // Gojo Strongest auto-counter with Infinite Void
        if(state.opp==='Gojo Satoru (Strongest)'&&state.ceE>=getTechCost('Infinite Void',true)&&!state.gojoVoidActive){
            state.ceE-=getTechCost('Infinite Void',true);
            setTimeout(()=>{
                activateGojoVoidDomain();
                checkDomainClashVisual();
                log('Gojo counters: Infinite Void! DOMAIN CLASH!');
                render();
            },600);
        }

    } else if(name==='Divine Dog'){
        // Player Divine Dog: retract / destroyed checks (AI Megumi keeps simple summon)
        if(!isAI){
            if(state.divineDogDestroyed){
                state.ceP+=getTechCost(name);
                log('Divine Dog destroyed — cannot re-summon.');
                state.casting=null;return;
            }
            if(state.divineDogActive){
                // Retract: free (refund cost)
                state.ceP+=getTechCost(name);
                for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                    const pp=state.board[rr][cc];
                    if(pp?.isDivineDog&&pp.color==='W') state.board[rr][cc]=null;
                }
                state.divineDogActive=false;
                log('Divine Dog retreats into the shadows.');
                state.casting=null;endTurn();return;
            }
        }
        const summonColor=isAI?'B':'W';
        const rows=isAI?[0,1,2]:[7,6,5];
        const summonCount=(!isAI&&state.vow==='aniquilacion')?2:1;
        let placed=0;
        loop:for(let row of rows) for(let col=0;col<8;col++){
            if(!state.board[row][col]){
                state.board[row][col]={type:'N',color:summonColor,isDivineDog:true,moved:true};
                playAnim(row,col,'dog-anim');
                placed++;
                if(placed>=summonCount) break loop;
            }
        }
        if(!isAI&&placed>0){state.divineDogActive=true;}
        log(isAI?'Megumi: Divine Dog — Wolf summoned!':`Divine Dog — Wolf summoned${placed>1?' ×'+placed:''}!`);

    } else if(name==='RCT'||name==='Reverse Cursed Technique'){
        // Restore most recent captured piece to canonical start square or random back-row empty
        const arr=isAI?state.capturedByW:state.capturedByE;
        if(!arr.length){
            if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name);
            log('RCT: nothing to restore.');
            state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        const restoredType=arr.pop();
        const color=isAI?'B':'W';
        const backRow=isAI?0:7;
        const backRow2=isAI?1:6;
        // Canonical start positions for non-pawn pieces
        const canonical={R:[[backRow,0],[backRow,7]],N:[[backRow,1],[backRow,6]],B:[[backRow,2],[backRow,5]],Q:[[backRow,3]],K:[[backRow,4]]};
        let placedAt=null;
        if(restoredType==='P'){
            for(let cc=0;cc<8;cc++){if(!state.board[backRow2][cc]){placedAt=[backRow2,cc];break;}}
        } else if(canonical[restoredType]){
            for(const [rr,cc] of canonical[restoredType]) if(!state.board[rr][cc]){placedAt=[rr,cc];break;}
        }
        if(!placedAt){
            // Random empty square on back two rows
            const empties=[];
            for(const rr of [backRow,backRow2]) for(let cc=0;cc<8;cc++) if(!state.board[rr][cc]) empties.push([rr,cc]);
            if(empties.length) placedAt=empties[Math.floor(Math.random()*empties.length)];
        }
        if(placedAt){
            state.board[placedAt[0]][placedAt[1]]={type:restoredType,color,moved:true};
            playAnim(placedAt[0],placedAt[1],'rct-anim');
            showTitle('RCT','#e91e63');
            log(`${isAI?state.opp+': ':''}Reverse Cursed Technique! ${restoredType} restored.`);
        } else {
            // No room — refund
            arr.push(restoredType);
            if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name);
            log('RCT: no empty square available.');
        }

    } else if(name==='Dismantle'){
        const target=state.board[r]?.[c];
        const refund=()=>{ if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name); };
        if(!target||target.color===color||target.type==='K'||target.isAdaptive){
            log('Dismantle needs an enemy center target (not King or Mahoraga).');
            refund();state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        // Find friendly piece in same column with clear LOS to row r (player only — AI skips)
        if(!isAI){
            let casterR=-1;
            for(let rr=0;rr<8;rr++){
                const pp=state.board[rr][c];
                if(pp?.color===color){casterR=rr;break;}
            }
            if(casterR===-1){
                log(`Dismantle needs one of your pieces in column ${String.fromCharCode(97+c)}.`);
                refund();state.casting=null;return;
            }
            const lo=Math.min(casterR,r), hi=Math.max(casterR,r);
            for(let rr=lo+1;rr<hi;rr++) if(state.board[rr][c]){
                log('Dismantle blocked: column line of sight obstructed.');
                refund();state.casting=null;return;
            }
        }
        // Infinity (player): AI Dismantle blocked unless bypass rules apply
        if(isAI&&state.infP>0&&state.mahoragaAdaptedLimitless) showMahoragaWheel();
        else if(isAI&&state.infP>0&&!canBypassBarrier(true)){
            log('Infinity: Dismantle blocked! (lasts until end of turn)');state.infP=Math.max(1,state.infP);
            refund();state.casting=null;render();if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        // Limitless (player passive): AI Dismantle blocked unless bypass rules apply
        if(isAI&&!canBypassBarrier(true)){
            const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless){
                const lActive=state.limitlessImmunityP>0;
                const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                const lCost=hasSE?25:50;
                if(lActive||(state.ceP>=lCost)){
                    if(!lActive){state.ceP-=lCost;state.limitlessImmunityP=1;}
                    showTitle('LIMITLESS','#00d2ff');
                    log(`Limitless: Dismantle absorbed!`);
                    refund();state.casting=null;render();if(isAI&&!state._aiNoEndTurn) endTurn();return;
                }
            }
        }
        // Player Dismantle vs Gojo's Limitless
        if(!isAI&&state.opp==='Gojo Satoru (Strongest)'&&!canBypassBarrier(false)){
            const lActive=state.limitlessImmunityE>0;
            const lCost=25;
            if(lActive||(state.ceE>=lCost)){
                if(!lActive){state.ceE-=lCost;state.limitlessImmunityE=1;}
                showTitle('LIMITLESS','#00d2ff');
                log("Gojo's Limitless: Dismantle absorbed!");
                refund();state.casting=null;render();return;
            }
        }
        // Width: aniquilacion → 5 (c-2..c+2); else 3 (c-1..c+1)
        const width=(!isAI&&state.vow==='aniquilacion')?2:1;
        for(let dc=-width;dc<=width;dc++){
            const cc=c+dc;
            if(cc<0||cc>7) continue;
            const tg=state.board[r][cc];
            if(tg&&tg.color!==color&&tg.type!=='K'&&!tg.isAdaptive){
                if(isAI) state.capturedByE.push(tg.type); else state.capturedByW.push(tg.type);
                state.board[r][cc]=null;
                playAnim(r,cc,'dismantle-anim');
            }
        }
        const titleEl=document.getElementById('tech-title');
        showTitle('DISMANTLE','#ff6b35');
        if(titleEl) titleEl.style.fontSize='48px';
        setTimeout(()=>{ if(titleEl) titleEl.style.fontSize=''; },2100);
        log(`${isAI?state.opp+': ':''}Dismantle!`);

    } else if(name==='Reversal Red'){
        // Infinity / Limitless blocks direct attacks unless bypass rules apply
        if(isAI){
            const rTarget=state.board[r]?.[c];
            if(rTarget?.color==='W'){
                if(state.infP>0&&state.mahoragaAdaptedLimitless) showMahoragaWheel();
                else if(state.infP>0&&!canBypassBarrier(true)){
                    log('Infinity: Reversal Red blocked!');state.ceE+=getTechCost(name,true);render();if(!state._aiNoEndTurn) endTurn();return;
                }
                if(!canBypassBarrier(true)){
                    const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
                    if(hasLimitless){
                        const lActive=state.limitlessImmunityP>0;
                        const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                        const lCost=hasSE?25:50;
                        if(lActive||(state.ceP>=lCost)){
                            if(!lActive){state.ceP-=lCost;state.limitlessImmunityP=1;}
                            showTitle('LIMITLESS','#00d2ff');
                            log(`Limitless: Reversal Red absorbed! (${lActive?'immune':'spent '+lCost+' CE'})`);
                            render();endTurn();return;
                        }
                    }
                }
            }
        }
        // Mahoraga immunity
        const rrTarget=state.board[r]?.[c];
        if(rrTarget?.isAdaptive){
            if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name);
            log('Reversal Red is too weak to harm Mahoraga.');
            state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        // Aniquilación: 3×3 AoE for player
        if(!isAI&&state.vow==='aniquilacion'){
            for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
                const rr=r+dr, cc=c+dc;
                if(rr<0||rr>7||cc<0||cc>7) continue;
                const tg=state.board[rr][cc];
                if(tg&&tg.color!==color&&!tg.isAdaptive&&tg.type!=='K'){
                    state.capturedByW.push(tg.type);
                    state.board[rr][cc]=null;
                    playAnim(rr,cc,'red-anim');
                }
            }
            log('Reversal Red 3×3 (Aniquilación)!');
        } else {
            if(rrTarget){if(isAI)state.capturedByE.push(rrTarget.type);else state.capturedByW.push(rrTarget.type);}
            playAnim(r,c,'red-anim');state.board[r][c]=null;log('Reversal Red!');
        }

    } else if(name==='Straw Doll'){
        // Infinity (player) blocks AI Straw Doll unless bypass rules apply
        if(isAI&&state.infP>0&&state.mahoragaAdaptedLimitless) showMahoragaWheel();
        else if(isAI&&state.infP>0&&!canBypassBarrier(true)){
            log('Infinity: Straw Doll blocked!');state.infP=0;
            state.ceE+=getTechCost(name,true);state.casting=null;if(!state._aiNoEndTurn) endTurn();return;
        }
        // Limitless (player) blocks AI Straw Doll unless bypass rules apply
        if(isAI&&!canBypassBarrier(true)){
            const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless){
                const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                const lCost=hasSE?25:50;
                if(state.limitlessImmunityP>0||(state.ceP>=lCost)){
                    if(!state.limitlessImmunityP){state.ceP-=lCost;state.limitlessImmunityP=1;}
                    showTitle('LIMITLESS','#00d2ff');log('Limitless: Straw Doll absorbed!');
                    state.ceE+=getTechCost(name,true);state.casting=null;render();if(!state._aiNoEndTurn) endTurn();return;
                }
            }
        }
        // Infinity (AI) blocks player Straw Doll unless bypass rules apply
        if(!isAI&&state.infE>0&&!canBypassBarrier(false)){
            log("Infinity: Straw Doll blocked by opponent's Infinity!");state.infE=0;
            state.ceP+=getTechCost(name);state.casting=null;return;
        }
        if(state.board[r][c]?.isAdaptive){
            if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name);
            log('Straw Doll is too weak to harm Mahoraga.');
            state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        // Cannot target back ranks — rush piece would land there and cause promotion issues
        if(!isAI&&(r===0||r===7)){
            log('Straw Doll cannot target the back rank!');
            state.ceP+=getTechCost(name);state.casting=null;return;
        }
        playAnim(r,c,'doll-anim');
        if(state.board[r][c]?.type!=='P'){
            const sdTgt=state.board[r][c];
            if(sdTgt){if(isAI)state.capturedByE.push(sdTgt.type);else state.capturedByW.push(sdTgt.type);}
            state.board[r][c]=null;
            // Annihilation vow: also destroy the nearest adjacent enemy non-pawn
            if(!isAI&&state.vow==='aniquilacion'){
                const sdEColor=isAI?'W':'B';
                let sd2={r:-1,c:-1,dist:Infinity};
                for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                    const pp=state.board[rr][cc];
                    if(pp?.color===sdEColor&&pp.type!=='P'&&pp.type!=='K'&&!pp.isAdaptive){
                        const d=Math.abs(rr-r)+Math.abs(cc-c);
                        if(d>0&&d<sd2.dist){sd2={r:rr,c:cc,dist:d};}
                    }
                }
                if(sd2.r>=0){state.capturedByW.push(state.board[sd2.r][sd2.c].type);state.board[sd2.r][sd2.c]=null;playAnim(sd2.r,sd2.c,'doll-anim');}
            }
            log('Straw Doll: Resonance!');
            // Rush: nearest friendly non-King piece advances to the cleared square
            const sdFc=isAI?'B':'W';
            let sdRusher=null,sdRushDist=Infinity;
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                const fp=state.board[rr][cc];
                if(fp?.color===sdFc&&fp.type!=='K'&&!fp.isRika&&!fp.isPlayerRika&&!fp.isAdaptive){
                    const d=Math.abs(rr-r)+Math.abs(cc-c);
                    if(d>0&&d<sdRushDist){sdRushDist=d;sdRusher={r:rr,c:cc};}
                }
            }
            if(sdRusher){
                state.board[r][c]={...state.board[sdRusher.r][sdRusher.c],moved:true};
                state.board[sdRusher.r][sdRusher.c]=null;
                playAnim(r,c,'doll-anim');
                // Auto-promote pawn (Black promotes at row 7, White promotes at row 0)
                if(state.board[r][c]?.type==='P'){
                    if(isAI&&r===7){state.board[r][c].type='Q';state.ceE=state.ceEMax;}
                    else if(!isAI&&r===0){state.board[r][c].type='Q';state.ceP=state.ceMaxP;}
                }
            }
        }
        else{log('Cannot target pawns!');if(isAI)state.ceE+=SKILLS[name].cost;else state.ceP+=getTechCost(name);state.casting=null;return;}

    } else if(name==='Divergent Fist'){
        // Infinity (player) blocks AI Divergent Fist unless bypass rules apply
        if(isAI&&state.infP>0&&state.mahoragaAdaptedLimitless) showMahoragaWheel();
        else if(isAI&&state.infP>0&&!canBypassBarrier(true)){
            log('Infinity: Divergent Fist blocked!');state.infP=0;
            state.ceE+=getTechCost(name,true);state.casting=null;if(!state._aiNoEndTurn) endTurn();return;
        }
        // Limitless (player) blocks AI Divergent Fist unless bypass rules apply
        if(isAI&&!canBypassBarrier(true)){
            const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless){
                const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                const lCost=hasSE?25:50;
                if(state.limitlessImmunityP>0||(state.ceP>=lCost)){
                    if(!state.limitlessImmunityP){state.ceP-=lCost;state.limitlessImmunityP=1;}
                    showTitle('LIMITLESS','#00d2ff');log('Limitless: Divergent Fist absorbed!');
                    state.ceE+=getTechCost(name,true);state.casting=null;render();if(!state._aiNoEndTurn) endTurn();return;
                }
            }
        }
        // CHANGE 1: only works on enemy PAWNS
        const target=state.board[r]?.[c];
        // Infinity/Limitless blocks player's Divergent Fist against enemy pawns
        const _playerHasDomain=!!(state.infiniteVoidActive||state.playerTMLActive||state.playerSEPActive||state.playerHeianDomainActive||state.playerCSGActive||state.playerTCMPActive);
        const _aiHasDomain=!!(state.domain||state.gojoVoidActive||state.mahitoDomainActive||state.naoyaTCMPActive||state.csgActive||state.heianDomainActive);
        if(!isAI&&target?.color==='B'&&target?.type==='P'){
            if(state.infE>0&&!canBypassBarrier(false)){
                log('Infinity: Divergent Fist blocked!');state.infE=0;
                state.ceP+=getTechCost(name);state.casting=null;render();return;
            }
            if(!canBypassBarrier(false)&&state.opp==='Gojo Satoru (Strongest)'){
                const lActive=state.limitlessImmunityE>0;
                const lCost=25;
                if(lActive||(state.ceE>=lCost)){
                    if(!lActive){state.ceE-=lCost;state.limitlessImmunityE=1;}
                    showTitle('LIMITLESS','#00d2ff');log('Limitless: Divergent Fist absorbed!');
                    state.ceP+=getTechCost(name);state.casting=null;render();return;
                }
            }
        }
        if(target?.color!==color&&target?.type==='P'){
            if(isAI) state.capturedByE.push(target.type); else state.capturedByW.push(target.type);
            state.board[r][c]=null;
            state.hazards.push({r,c});
            // Annihilation vow: also destroy nearest other enemy pawn
            if(!isAI&&state.vow==='aniquilacion'){
                let df2={r:-1,c:-1,dist:Infinity};
                for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                    const pp=state.board[rr][cc];
                    if(pp?.color!==color&&pp?.type==='P'){const d=Math.abs(rr-r)+Math.abs(cc-c);if(d>0&&d<df2.dist)df2={r:rr,c:cc,dist:d};}
                }
                if(df2.r>=0){state.capturedByW.push('P');state.board[df2.r][df2.c]=null;state.hazards.push({r:df2.r,c:df2.c});playAnim(df2.r,df2.c,'projection-anim');}
            }
            log('Divergent Fist! Pawn destroyed, hazard created.');
        } else {
            log('Divergent Fist only targets enemy pawns!');
            if(isAI) state.ceE+=SKILLS[name].cost; else state.ceP+=getTechCost(name);
            state.casting=null;return;
        }

    } else if(name==='Cleave'){
        // CHANGE 2: targets ANY enemy piece except King, anywhere
        const target=state.board[r]?.[c];
        if(target&&target.color!==color&&target.type!=='K'){
            // Gojo Limitless check: player Cleaving Gojo's pieces (bypassed if player has domain)
            const _pDom=!!(state.infiniteVoidActive||state.playerTMLActive||state.playerSEPActive||state.playerHeianDomainActive||state.playerCSGActive||state.playerTCMPActive);
            const _aDom=!!(state.domain||state.gojoVoidActive||state.mahitoDomainActive||state.naoyaTCMPActive||state.csgActive||state.heianDomainActive);
            if(!isAI&&!canBypassBarrier(false)&&target.color==='B'&&state.opp==='Gojo Satoru (Strongest)'){
                const lActive=state.limitlessImmunityE>0;
                const lCost=25; // Gojo always has Six Eyes → 50*0.5
                if(lActive||(state.ceE>=lCost)){
                    if(!lActive){state.ceE-=lCost;state.limitlessImmunityE=1;}
                    showTitle('LIMITLESS','#00d2ff');
                    log('Limitless: Cleave absorbed by Gojo\'s Limitless!');
                    if(isAI&&!state._aiNoEndTurn) endTurn();
                    render();return;
                }
            }
            // Player Infinity check: AI using Cleave vs player with active Infinity (bypassed if AI has domain)
            if(isAI&&target.color==='W'&&state.infP>0&&state.mahoragaAdaptedLimitless) showMahoragaWheel();
            else if(isAI&&target.color==='W'&&state.infP>0&&!canBypassBarrier(true)){
                log('Infinity: Cleave blocked!');
                state.ceE+=getTechCost(name,true);
                render();if(!state._aiNoEndTurn) endTurn();return;
            }
            // Player Limitless check: AI using Cleave against limitless player
            if(isAI&&target.color==='W'&&!canBypassBarrier(true)){
                const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
                if(hasLimitless){
                    const lActive=state.limitlessImmunityP>0;
                    const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                    const lCost=hasSE?25:50;
                    if(lActive||(state.ceP>=lCost)){
                        if(!lActive){state.ceP-=lCost;state.limitlessImmunityP=1;}
                        showTitle('LIMITLESS','#00d2ff');
                        log('Limitless: Cleave absorbed!');
                        endTurn();render();return;
                    }
                }
            }
            showTitle('CLEAVE','#FFD700');
            shakeScreen();impactFlash('rgba(255,255,200,.35)',130);
            playAnim(r,c,'cleave-anim');
            setTimeout(()=>playAnim(r,c,'red-anim'),200);
            state.board[r][c]=null;
            if(isAI){
                state.capturedByE.push(target.type);
                // Note: Mahoraga cannot be destroyed by Cleave — only Hollow Purple can destroy it
            } else {
                state.capturedByW.push(target.type);
            }
            if(state.mahoragaAdaptedLimitless&&(Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless')||state.opp==='Gojo Satoru (Strongest)')){
                showMahoragaWheel();
                log('Mahoraga adaptation: Cleave pierces through Limitless!');
            } else {
                log(isAI?'Sukuna: Cleave!':'Cleave!');
            }
            // Aniquilación: kill the next-most-valuable enemy piece too
            if(!isAI&&state.vow==='aniquilacion'){
                let cands=[];
                for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                    const pp=state.board[rr][cc];
                    if(pp&&pp.color!==color&&pp.type!=='K'&&!pp.isAdaptive) cands.push({r:rr,c:cc,v:PIECE_VALS[pp.type]});
                }
                cands.sort((a,b)=>b.v-a.v);
                const t2=cands[0];
                if(t2){
                    state.capturedByW.push(state.board[t2.r][t2.c].type);
                    state.board[t2.r][t2.c]=null;
                    playAnim(t2.r,t2.c,'cleave-anim');
                    log('Cleave (Aniquilación bonus)!');
                }
            }
        } else {
            log('Cleave: select a valid enemy piece (not King).');
            state.ceP+=getTechCost(name);state.casting=null;return;
        }

    } else if(name==='Mahoraga'){
        if(state.mahoragaDestroyed){
            log('Mahoraga was destroyed — cannot summon again.');
            state.ceP+=getTechCost(name);state.casting=null;return;
        }
        if(isPlayerMahoragaOnBoard()){
            // Retract for free (CE already 0 from getTechCost)
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='W') state.board[r][c]=null;
            }
            state.playerMahoragaActive=false;
            log('Mahoraga retreats into the Ten Shadows.');
        } else {
            let placed=false;
            for(let row of [7,6,5]) for(let col=0;col<8&&!placed;col++){
                if(!state.board[row][col]){
                    state.board[row][col]={type:'N',color:'W',moved:true,isAdaptive:true};
                    placed=true;
                }
            }
            if(placed){
                state.playerMahoragaActive=true;
                state.playerAdaptedTech=[];state.playerTechUsageCount={};
                showMahoragaWheel();
                log('Divine General Mahoraga summoned!');
            } else {
                state.ceP+=getTechCost('Mahoraga');
                log('No empty squares to summon Mahoraga!');
                state.casting=null;return;
            }
        }
    } else if(name==='Lapse Blue'){
        if(!isAI){
            state.lapseBluePhase='select';
            state.sel=null;state.moves=[];
            log('Lapse Blue: select any piece (not King) to teleport to any empty square.');
            state.casting=null;render();return;
        } else {
            // AI: teleport the cheapest B piece onto the most valuable W piece (capture it)
            let bestWR=-1,bestWC=-1,bestWV=0;
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                const pp=state.board[rr][cc];
                if(pp?.color==='W'&&pp.type!=='K'&&!pp.isAdaptive&&!pp.isMahoragaKing&&PIECE_VALS[pp.type]>bestWV){
                    bestWV=PIECE_VALS[pp.type];bestWR=rr;bestWC=cc;
                }
            }
            let atkR=-1,atkC=-1,atkV=Infinity;
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                const pp=state.board[rr][cc];
                if(pp?.color==='B'&&pp.type!=='K'&&!pp.isAdaptive&&!pp.isMahoragaKing&&PIECE_VALS[pp.type]<atkV){
                    atkV=PIECE_VALS[pp.type];atkR=rr;atkC=cc;
                }
            }
            if(bestWR>=0&&atkR>=0){
                const piece=state.board[atkR][atkC];
                state.capturedByE.push(state.board[bestWR][bestWC].type);
                state.board[bestWR][bestWC]=piece;
                state.board[atkR][atkC]=null;
                playAnim(bestWR,bestWC,'cleave-anim');
                log(`${state.opp}: Lapse Blue — ${piece.type} captures your ${state.board[bestWR][bestWC]?.type||'piece'}!`);
            } else if(bestWR>=0){
                // Fallback: banish the W piece to a random back-row empty square
                const empties=[];
                for(let rr=0;rr<4;rr++) for(let cc=0;cc<8;cc++) if(!state.board[rr][cc]) empties.push({r:rr,c:cc});
                if(!empties.length) for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++) if(!state.board[rr][cc]) empties.push({r:rr,c:cc});
                if(empties.length){
                    const dest=empties[Math.floor(Math.random()*empties.length)];
                    const piece=state.board[bestWR][bestWC];
                    state.board[dest.r][dest.c]=piece;
                    state.board[bestWR][bestWC]=null;
                    playAnim(dest.r,dest.c,'rct-anim');
                    log(`${state.opp}: Lapse Blue — your ${piece.type} banished!`);
                }
            }
        }

    } else if(name==='Hollow Purple'){
        if(!isAI){
            // AI has Infinity — block player's Hollow Purple (unless player has domain)
            if(!canBypassBarrier(false)&&state.infE>0){
                log("Infinity: Hollow Purple blocked by opponent's Infinity!");state.infE=0;
                state.ceP+=getTechCost(name);state.casting=null;return;
            }
            state.hollowPurplePhase=true;
            state.hollowPurpleFirstCol=-1;
            if(state.vow==='aniquilacion'){
                log('Hollow Purple (ANNIHILATION): click a column — that column and the 2 on each side (5 total) are annihilated.');
            } else {
                log('Hollow Purple: click a column — that column and both adjacent columns (3 total) are annihilated.');
            }
            state.casting=null;render();return;
        } else {
            // Infinity (player) blocks AI Hollow Purple (unless AI has domain)
            if(state.infP>0&&!canBypassBarrier(true)){
                log('Infinity: Hollow Purple blocked!');state.infP=0;
                state.ceE+=getTechCost(name,true);if(!state._aiNoEndTurn) endTurn();return;
            }
            // Limitless (player) blocks AI Hollow Purple unless bypass rules apply
            if(!canBypassBarrier(true)){
                const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
                if(hasLimitless){
                    const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                    const lCost=hasSE?25:50;
                    if(state.limitlessImmunityP>0||(state.ceP>=lCost)){
                        if(!state.limitlessImmunityP){state.ceP-=lCost;state.limitlessImmunityP=1;}
                        showTitle('LIMITLESS','#00d2ff');log('Limitless: Hollow Purple absorbed!');
                        state.ceE+=getTechCost(name,true);render();if(!state._aiNoEndTurn) endTurn();return;
                    }
                }
            }
            // AI: find best center column (1–6) for 3-col sweep (center ±1)
            let bestCol=-1,bestVal=0;
            for(let cc=1;cc<=6;cc++){
                let val=0;
                for(let dc=-1;dc<=1;dc++){const col=cc+dc;if(col>=0&&col<=7)for(let rr=0;rr<8;rr++){const pp=state.board[rr][col];if(pp?.color==='W'&&pp.type!=='K') val+=PIECE_VALS[pp.type];}}
                if(val>bestVal){bestVal=val;bestCol=cc;}
            }
            if(bestCol>=0&&bestVal>=3){
                // Build column list: center ±1 (3 cols); AI never has vow
                let hpCols=[];
                for(let dc=-1;dc<=1;dc++){const col=bestCol+dc;if(col>=0&&col<=7)hpCols.push(col);}
                const hpDestroyFn=(col)=>{
                    for(let rr=0;rr<8;rr++){const pp=state.board[rr][col];if(pp?.color==='W'&&pp.type!=='K'){state.capturedByE.push(pp.type);state.board[rr][col]=null;if(pp.isAdaptive){state.playerMahoragaActive=false;state.mahoragaDestroyed=true;state.playerAdaptedTech=[];state.playerTechUsageCount={};state.mahoragaAdaptedLimitless=false;state.mahoragaLimitlessBlocks=0;state.playerMahoragaDomainAdaptTimer=0;showTitle('MAHORAGA DESTROYED','#FF4444');log('Hollow Purple destroys Mahoraga!');}if(pp.isPlayerRika)state.playerRikaActive=false;}}
                };
                hpCols.forEach(hpDestroyFn);
                state.hollowPurpleColsAnim=hpCols.slice();
                const hpColNames=hpCols.map(x=>String.fromCharCode(97+x)).join(',');
                log(`Hollow Purple: columns ${hpColNames} annihilated!`);
                render();
                setTimeout(()=>{state.hollowPurpleColsAnim=[];render();},1200);
            } else {
                // Refund CE — not worth using
                state.ceE+=getTechCost(name,true);
            }
        }

    } else if(name==='Infinite Void'){
        if(!isAI){
            // Enemy Mahoraga instantly adapts to IV and collapses it
            if(isMahoragaOnBoard()){
                state.ceP+=getTechCost('Infinite Void'); // refund
                showMahoragaWheel();
                showTitle('MAHORAGA ADAPTS','#FFD700');
                log('☸ Mahoraga instantly adapts to Infinite Void! The domain is destroyed before it expands!');
                state.casting=null;render();return;
            }
            state.infiniteVoidActive=true;
            state.infiniteVoidTimer=10;
            activateVoidDomain();
            showTitle('INFINITE VOID','#6600cc');
            log('Domain Expansion: Infinite Void! The opponent is sealed...');
            // Check if enemy can counter
            if(canEnemyExpandDomain()){
                aiExpandDomain();
                checkDomainClashVisual();
            }
            state.casting=null;endTurn();return;
        }

    } else if(name==='Cursed Speech'){
        if(isAI){
            const slots=SLOT_ORDER.filter(s=>prog.eq[s]&&!(state.cursedSpeechSeal&&state.cursedSpeechSeal.slot===s));
            if(slots.length>0){
                const tSlot=slots[Math.floor(Math.random()*slots.length)];
                state.cursedSpeechSeal={slot:tSlot,movesLeft:20};
                showTitle('CURSED SPEECH','#00cec9');
                log(`Cursed Speech! Your ${SLOT_LABEL[tSlot]} slot is sealed for 20 moves!`);
            }
        } else {
            if(state.cursedSpeechUsed){log('Cursed Speech already used this battle!');state.ceP+=getTechCost(name);state.casting=null;return;}
            state.cursedSpeechUsed=true;
            const oppPool=getOppSkillPool(state.opp);
            if(oppPool.length>0){
                const toSeal=oppPool[Math.floor(Math.random()*oppPool.length)];
                state.aiSkillCooldowns[toSeal]=(state.aiSkillCooldowns[toSeal]||0)+20;
                showTitle('CURSED SPEECH','#00cec9');
                log(`Cursed Speech! ${toSeal} sealed on ${state.opp} for 20 moves!`);
            }
        }

    } else if(name==='Copy'){
        if(!state.playerCopiedSkill){
            const pool=getOppSkillPool(state.opp);
            if(pool.length>0){
                const copied=pool[Math.floor(Math.random()*pool.length)];
                state.playerCopiedSkill=copied;state.playerCopiedSkillUsed=false;
                showTitle('COPY','#a29bfe');
                log(`Copy! Captured technique: ${copied}. Use it once this battle.`);
            }
            state.casting=null;render();return; // Copy doesn't end turn
        } else {
            log('Already copied a skill this battle.');
            refund();state.casting=null;return;
        }

    } else if(name==='Rika'){
        if(state.playerRikaDestroyed){
            refund();state.casting=null;
            log('Rika was destroyed — cannot re-summon.');return;
        }
        if(state.playerRikaActive){
            // Retract for free
            for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){
                if(state.board[rr][cc]?.isPlayerRika) state.board[rr][cc]=null;
            }
            state.playerRikaActive=false;
            log('Rika retreats.');
            state.casting=null;render();return;
        } else {
            let placed=false;
            for(let row of [7,6]) for(let col=0;col<8&&!placed;col++){
                if(!state.board[row][col]){
                    state.board[row][col]={type:'Q',color:'W',isRika:true,isPlayerRika:true,moved:false};
                    state.playerRikaActive=true;placed=true;
                    playAnim(row,col,'rika-summon-anim');
                    showTitle('RIKA','#fd79a8');
                    log('Rika summoned! All skill costs halved while she stands.');
                }
            }
            if(!placed){log('No empty square for Rika.');refund();state.casting=null;return;}
        }

    } else if(name==='True Mutual Love'){
        if(!isAI){
            // Player activates True Mutual Love
            if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
                log('True Mutual Love collapses — overwhelmed by the stronger domain!');
                showTitle('COLLAPSED','#fd79a8');
                refund();state.casting=null;render();return;
            }
            showDomainCinematic('DOMAIN EXPANSION — TRUE MUTUAL LOVE','#fd79a8');
            state.playerTMLActive=true;
            const gs=document.getElementById('game-screen');if(gs) gs.classList.add('tml-domain');
            showTitle('TRUE MUTUAL LOVE','#fd79a8');
            log('Domain Expansion: True Mutual Love! Rika\'s power fills the space...');
        }
    } else if(name==='Idle Transfiguration'){
        const myColor=isAI?'B':'W';
        const _itTarget=state.board[r][c];
        if(!_itTarget||_itTarget.color!==myColor||_itTarget.type==='K'||_itTarget.type==='Q'){
            if(isAI)state.ceE+=getTechCost(name,true);else state.ceP+=getTechCost(name);
            state.casting=null;return;
        }
        const _itOld=_itTarget.type;
        state.board[r][c].type='Q';
        playAnim(r,c,'sep-anim');
        showTitle('IDLE TRANSFIGURATION','#b040ff');
        log(`${isAI?'Mahito transfigures':'You transfigure'} a ${_itOld} into a cursed vessel — instant Queen!`);
    } else if(name==='Self Embodiment of Perfection'){
        if(!isAI) activateSEP(true);
    } else if(name==='Time Cell Moon Palace'){
        if(!isAI){
            if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
                showTitle('COLLAPSED','#ffaa00');log('Time Cell Moon Palace collapses — overwhelmed by the stronger domain!');
                state.ceP+=getTechCost(name);state.casting=null;return;
            }
            state.playerTCMPActive=true;
            const gs=document.getElementById('game-screen');
            if(gs)gs.classList.add('tcmp-domain');
            document.getElementById('tcmp-veil').style.display='block';
            showTitle('TIME CELL MOON PALACE','#ffaa00');
            log('Domain Expansion: Time Cell Moon Palace! Every step is death...');
        }
    }

    // ── Nue ──
    if(name==='Nue'){
        if(!isAI){
            if(state.nueActive){
                // Retract
                for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                    if(state.board[r][c]?.isNue&&state.board[r][c].color==='W'){state.board[r][c]=null;break;}
                }
                state.nueActive=false;
                log('Nue retracted.');
            } else if(!state.nueDestroyed){
                state.nuePhase='place';
                log('Select an empty square to summon Nue.');
                state.casting=null;render();return;
            } else {
                log('Nue cannot be re-summoned once destroyed.');
                state.ceP+=getTechCost(name);state.casting=null;return;
            }
        } else {
            // AI summons Nue on back rank
            if(!state.aiNueActive&&!state.aiNueDestroyed){
                for(let c=0;c<8;c++){
                    if(!state.board[0][c]){
                        state.board[0][c]={type:'B',color:'B',isNue:true,moved:false};
                        state.aiNueActive=true;
                        playAnim(0,c,'rct-anim');
                        log('Megumi summons Nue — a winged shikigami!');
                        break;
                    }
                }
            } else {
                state.ceE+=getTechCost(name,true);state._aiNoEndTurn=false;endTurn();return;
            }
        }
    }

    // ── Chimera Shadow Garden ──
    if(name==='Chimera Shadow Garden'){
        if(!isAI){
            if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
                showTitle('COLLAPSED','#4a9eff');log('Chimera Shadow Garden collapses — overwhelmed by the stronger domain!');
                state.ceP+=getTechCost(name);state.casting=null;return;
            }
            showDomainCinematic('CHIMERA SHADOW GARDEN','#4a9eff');
            state.playerCSGActive=true;state.playerCSGTimer=0;
            document.getElementById('game-screen')?.classList.add('csg-domain');
            showTitle('CHIMERA SHADOW GARDEN','#4a9eff');
            log('Chimera Shadow Garden — the shadows swallow the board!');
            checkDomainClashVisual();
        } else {
            if(state.infiniteVoidActive||state.domain?.type?.includes('malevolent-player')){
                showTitle('COLLAPSED','#4a9eff');log('Chimera Shadow Garden collapses!');
                state.ceE+=getTechCost(name,true);state._aiNoEndTurn=false;endTurn();return;
            }
            showDomainCinematic('CHIMERA SHADOW GARDEN','#4a9eff');
            state.csgActive=true;state.csgTimer=0;
            document.getElementById('game-screen')?.classList.add('csg-domain');
            showTitle('CHIMERA SHADOW GARDEN','#4a9eff');
            log('⬛ Megumi activates Chimera Shadow Garden! The shadows swallow the board...');
            if(isDomainClash()) log('⚔ DOMAIN CLASH — both domains neutralised!');
            checkDomainClashVisual();
        }
    }

    // Mahoraga adaptation tracking (only when on the board; RCT never triggers adaptation)
    if(!isAI&&name!=='Reverse Cursed Technique'&&state.opp==='Ryomen Sukuna (Shadow)'&&state.mahoragaActive&&isMahoragaOnBoard()){
        state.techUsageCount[name]=(state.techUsageCount[name]||0)+1;
        if(state.techUsageCount[name]>=2){
            if(name==='Projection Sorcery'&&!state.mahoragaAdaptedPS){
                // PS: Mahoraga gains PS ability instead of locking the player's skill
                state.mahoragaAdaptedPS=true;
                showMahoragaWheel();
                log('Mahoraga adapts to Projection Sorcery! The Divine General gains extra movement!');
            } else if(name!=='Projection Sorcery'&&!state.adaptedTech.includes(name)){
                state.adaptedTech.push(name);
                showMahoragaWheel();
                log(`Mahoraga adapts to ${name}! Future uses will fail.`);
            }
        }
    }

    if(name==='Heian Cleave'){
        // Auto-destroys 2 highest-value enemy pieces — no target selection
        // Infinity / Limitless check (AI path attacking player — bypassed if AI has active domain)
        const _hcAiDom=!!(state.domain||state.gojoVoidActive||state.mahitoDomainActive||state.naoyaTCMPActive||state.csgActive||state.heianDomainActive);
        if(isAI&&!canBypassBarrier(true)){
            if(state.infP>0){
                log('Infinity: Heian Cleave blocked!');
                state.ceE+=getTechCost(name,true);render();if(!state._aiNoEndTurn) endTurn();return;
            }
            const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless){
                const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                const lCost=hasSE?25:50;
                if(state.limitlessImmunityP>0||(state.ceP>=lCost)){
                    if(!state.limitlessImmunityP){state.ceP-=lCost;state.limitlessImmunityP=1;}
                    showTitle('LIMITLESS','#00d2ff');
                    log('Limitless: Heian Cleave absorbed!');
                    state.ceE+=getTechCost(name,true);render();if(!state._aiNoEndTurn) endTurn();return;
                }
            }
        }
        const enemyColor=isAI?'W':'B';
        let hcTargets=[];
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=state.board[r][c];
            if(p?.color===enemyColor&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing)
                hcTargets.push({r,c,v:PIECE_VALS[p.type]});
        }
        hcTargets.sort((a,b)=>b.v-a.v);
        const hcHits=hcTargets.slice(0,2);
        if(hcHits.length===0){
            log('Heian Cleave: no valid targets.');
            if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name);
        } else {
            hcHits.forEach(t=>{
                if(isAI) state.capturedByE.push(state.board[t.r][t.c].type);
                else state.capturedByW.push(state.board[t.r][t.c].type);
                state.board[t.r][t.c]=null;
                playAnim(t.r,t.c,'cleave-anim');
            });
            showTitle('HEIAN CLEAVE','#FFD700');
            shakeScreen();impactFlash('rgba(255,215,0,.35)',130);
            log(`${isAI?state.opp+': ':''}Heian Cleave — two strikes!`);
        }

    } else if(name==='Heian Dismantle'){
        // Identical to Dismantle but 5-wide; re-use that block by delegating
        const target=state.board[r]?.[c];
        const refund=()=>{ if(isAI) state.ceE+=getTechCost(name,true); else state.ceP+=getTechCost(name); };
        if(!target||target.color===color||target.type==='K'||target.isAdaptive||target.isMahoragaKing){
            log('Heian Dismantle needs an enemy center target (not King or Mahoraga).');
            refund();state.casting=null;if(isAI&&!state._aiNoEndTurn) endTurn();return;
        }
        // Infinity / Limitless check (AI path — bypassed if AI has active domain)
        if(isAI&&!canBypassBarrier(true)){
            if(state.infP>0){
                log('Infinity: Heian Dismantle blocked!');refund();state.casting=null;render();if(!state._aiNoEndTurn) endTurn();return;
            }
            const hasLimitless2=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless2){
                const hasSE2=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                const lCost2=hasSE2?25:50;
                if(state.limitlessImmunityP>0||(state.ceP>=lCost2)){
                    if(!state.limitlessImmunityP){state.ceP-=lCost2;state.limitlessImmunityP=1;}
                    showTitle('LIMITLESS','#00d2ff');
                    log('Limitless: Heian Dismantle absorbed!');
                    refund();state.casting=null;render();if(!state._aiNoEndTurn) endTurn();return;
                }
            }
        }
        if(!isAI){
            let hd_casterR=-1;
            for(let rr=0;rr<8;rr++){const pp=state.board[rr][c];if(pp?.color===color){hd_casterR=rr;break;}}
            if(hd_casterR===-1){log(`Heian Dismantle needs one of your pieces in column ${String.fromCharCode(97+c)}.`);refund();state.casting=null;return;}
            const lo=Math.min(hd_casterR,r),hi=Math.max(hd_casterR,r);
            for(let rr=lo+1;rr<hi;rr++) if(state.board[rr][c]){log('Heian Dismantle blocked: column line of sight obstructed.');refund();state.casting=null;return;}
        }
        for(let dc=-2;dc<=2;dc++){
            const cc=c+dc;
            if(cc<0||cc>7) continue;
            const tg=state.board[r][cc];
            if(tg&&tg.color!==color&&tg.type!=='K'&&!tg.isAdaptive&&!tg.isMahoragaKing){
                if(isAI) state.capturedByE.push(tg.type); else state.capturedByW.push(tg.type);
                state.board[r][cc]=null;
                playAnim(r,cc,'dismantle-anim');
            }
        }
        showTitle('HEIAN DISMANTLE','#FF4500');
        log(`${isAI?state.opp+': ':''}Heian Dismantle — 5-wide slash!`);

    } else if(name==='World Cutting Slash'){
        const WCS_STAGES=['SCALE OF THE DRAGON','RECOIL','TWIN METEORS','WORLD CUTTING SLASH'];
        if(!isAI){
            state.playerWCSChantStage=(state.playerWCSChantStage||0)+1;
            showWCSTitle(WCS_STAGES[state.playerWCSChantStage-1]);
            log(`World Cutting Slash chant [${state.playerWCSChantStage}/4]: ${WCS_STAGES[state.playerWCSChantStage-1]}`);
            if(state.playerWCSChantStage<4){state.casting=null;render();return;} // don't end turn
            // Stage 4 — fire the attack
            state.playerWCSChantStage=0;
            for(let col=0;col<8;col++){
                for(let row=7;row>=0;row--){ // player fires upward: closest B piece = highest row index
                    const p=state.board[row][col];
                    if(p&&p.color==='B'&&!p.isAdaptive&&!p.isMahoragaKing){
                        state.capturedByW.push(p.type);state.board[row][col]=null;
                        playAnim(row,col,'wcs-slash-anim');break;
                    }
                }
            }
            log('WORLD CUTTING SLASH — every column severed!');
        } else {
            // AI fires WCS (handled by aiCycle chant logic; executeTech just executes)
            for(let col=0;col<8;col++){
                for(let row=0;row<8;row++){ // AI fires downward: closest W piece = lowest row index
                    const p=state.board[row][col];
                    if(p&&p.color==='W'&&!p.isAdaptive&&!p.isMahoragaKing){
                        state.capturedByE.push(p.type);state.board[row][col]=null;
                        playAnim(row,col,'wcs-slash-anim');break;
                    }
                }
            }
            log(`${state.opp}: WORLD CUTTING SLASH — every column severed!`);
        }

    } else if(name==='Fuga'){
        if(isAI){
            if(!state.heianDomainActive){log('Fuga requires Malevolent Shrine: Heian domain.');if(!state._aiNoEndTurn)endTurn();return;}
            let fBestScore=0,fBestR=3,fBestC=3;
            for(let r=2;r<=5;r++) for(let c=2;c<=5;c++){
                let sc=0;
                for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
                    const p=state.board[r+dr]?.[c+dc];
                    if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive) sc++;
                }
                if(sc>fBestScore){fBestScore=sc;fBestR=r;fBestC=c;}
            }
            if(fBestScore===0){log('Fuga: no valid target area.');if(!state._aiNoEndTurn)endTurn();return;}
            for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
                const p=state.board[fBestR+dr]?.[fBestC+dc];
                if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing){
                    state.capturedByE.push(p.type);state.board[fBestR+dr][fBestC+dc]=null;
                    playAnim(fBestR+dr,fBestC+dc,'fuga-anim');
                }
            }
            showTitle('FUGA','#8B0000');
            shakeScreen();impactFlash('rgba(139,0,0,.5)',170);
            log('Sukuna: FUGA — 5×5 annihilation!');
        } else {
            if(!state.playerHeianDomainActive){log('Fuga requires your Malevolent Shrine: Heian domain.');state.ceP+=getTechCost(name);state.casting=null;return;}
            state.fugaPhase=true;
            log('Fuga: click the center of your 5×5 strike zone.');
            state.casting=null;render();return;
        }

    } else if(name==='Malevolent Shrine: Heian'){
        if(!isAI){
            if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
                showTitle('COLLAPSED','#8B0000');
                log('Malevolent Shrine: Heian collapses — overwhelmed by the active domain!');
                state.ceP+=getTechCost(name);state.casting=null;return;
            }
            state.playerHeianDomainActive=true;
            const domObj={owner:'W',type:'malevolent-heian-player',timer:0};
            if(state.domain) state.domain2=domObj; else state.domain=domObj;
            activateHeianDomain();
            showTitle('MALEVOLENT SHRINE: HEIAN','#8B0000');
            log('Domain Expansion: Malevolent Shrine: Heian! The true form awakens — three cuts every two turns!');
            checkDomainClashVisual();
        } else {
            // AI path handled directly in aiCycle; if we reach here via executeTech, just log
            state.heianDomainActive=true;
            const domObj={owner:'B',type:'malevolent-heian',timer:0};
            if(state.infiniteVoidActive) state.domain2=domObj; else state.domain=domObj;
            activateHeianDomain();
            checkDomainClashVisual();
            showTitle('MALEVOLENT SHRINE: HEIAN','#8B0000');
            log('Domain Expansion: Malevolent Shrine: Heian! The true King has arrived — three cuts every two turns!');
        }
    } else if(name==='Hollow Nuke'){
        const HN_STAGES=['PHASE','TWILIGHT','EYES OF WISDOM','NINE ROPES','POLARIZED LIGHT','CROW AND DECLARATION','BETWEEN THE FRONT AND BACK','HOLLOW PURPLE'];
        if(!isAI){
            state.playerHollowNukeChantStage=(state.playerHollowNukeChantStage||0)+2;
            const s=state.playerHollowNukeChantStage;
            showHollowNukeTitle(HN_STAGES[s-2]);
            log(`Hollow Nuke [${s-1}/8]: ${HN_STAGES[s-2]}`);
            setTimeout(()=>{showHollowNukeTitle(HN_STAGES[s-1]);log(`Hollow Nuke [${s}/8]: ${HN_STAGES[s-1]}`);},1600);
            if(s<8){state.casting=null;render();return;} // turn not consumed until stage 8
            // Stage 8: check Infinity/Limitless, then fire
            state.playerHollowNukeChantStage=0;
            if(state.infE>0&&!canBypassBarrier(false)){
                log("Gojo's Infinity: Hollow Nuke blocked!");state.infE=0;
                state.ceP+=getTechCost(name);state.casting=null;endTurn();return;
            }
            if(state.opp==='Gojo Satoru (Strongest)'&&!canBypassBarrier(false)){
                const lActive=state.limitlessImmunityE>0;const lCost=25;
                if(lActive||(state.ceE>=lCost)){
                    if(!lActive){state.ceE-=lCost;state.limitlessImmunityE=1;}
                    showTitle('LIMITLESS','#00d2ff');log("Limitless: Hollow Nuke absorbed!");
                    state.ceP+=getTechCost(name);state.casting=null;endTurn();return;
                }
            }
            // Fire: destroy all inner pieces (rows 1-6, cols 1-6) except own color
            for(let nr=1;nr<=6;nr++) for(let nc=1;nc<=6;nc++){
                const np=state.board[nr][nc];
                if(!np||np.color==='W') continue;
                state.capturedByW.push(np.type);state.board[nr][nc]=null;
                playAnim(nr,nc,'hollow-nuke-anim');
            }
            showHollowNukeTitle('HOLLOW PURPLE');
            shakeScreen();impactFlash('rgba(100,0,255,.5)',200);
            log('HOLLOW PURPLE — the convergence annihilates everything! All inner enemy pieces destroyed!');
            state.casting=null;render();endTurn();return;
        } else {
            // AI Hollow Nuke (called from aiCycle stage 8)
            if(state.infP>0&&!canBypassBarrier(true)){
                log('Infinity: Hollow Nuke blocked!');state.ceE+=getTechCost(name,true);endTurn();return;
            }
            if(!canBypassBarrier(true)){
                const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
                if(hasLimitless){
                    const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                    const lCost=hasSE?25:50;
                    if(state.limitlessImmunityP>0||(state.ceP>=lCost)){
                        if(!state.limitlessImmunityP){state.ceP-=lCost;state.limitlessImmunityP=1;}
                        showTitle('LIMITLESS','#00d2ff');log('Limitless: Hollow Nuke absorbed!');
                        state.ceE+=getTechCost(name,true);endTurn();return;
                    }
                }
            }
            for(let nr=1;nr<=6;nr++) for(let nc=1;nc<=6;nc++){
                const np=state.board[nr][nc];
                if(!np||np.color==='B') continue;
                state.capturedByE.push(np.type);state.board[nr][nc]=null;
                playAnim(nr,nc,'hollow-nuke-anim');
            }
            log('Gojo: HOLLOW PURPLE — the convergence! All inner player pieces annihilated!');
        }
    }

    state.casting=null;
    // These skills do NOT end the player's turn — they still get to move/use another skill
    // (Infinite Void is the only domain that intentionally ends the turn)
    const _noEndTurn=['Reverse Cursed Technique','Idle Transfiguration',
        'Malevolent Shrine','Malevolent Shrine: Heian','Self Embodiment of Perfection','True Mutual Love',
        'Time Cell Moon Palace','Chimera Shadow Garden'];
    if(!isAI&&_noEndTurn.includes(name)){render();return;}
    // AI skill+move mode: caller set _aiNoEndTurn so it can continue to a chess move
    if(isAI&&state._aiNoEndTurn){state._aiNoEndTurn=false;render();return;}
    endTurn();
}

// ================================================================
// PLAYER INPUT
// ================================================================
function handleCellClick(r,c){
    if(state.turn!=='W'||state.over) return;

    // Gojo Void: player sealed — cannot act unless Domain Clash
    if(state.gojoVoidActive&&!isDomainClash()){
        showTitle('INFINITE VOID','#6600cc');
        log(`Infinite Void: you are sealed (${state.gojoVoidTimer} turns remaining)...`);
        return;
    }

    // --- Fuga: center-square selection ---
    if(state.fugaPhase){
        state.fugaPhase=false;
        const fCR=r,fCC=c;
        for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
            const nr=fCR+dr,nc=fCC+dc;
            if(nr>=0&&nr<8&&nc>=0&&nc<8){
                const p=state.board[nr][nc];
                if(p?.color==='B'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing){
                    state.capturedByW.push(p.type);state.board[nr][nc]=null;
                    playAnim(nr,nc,'fuga-anim');
                }
            }
        }
        showTitle('FUGA','#8B0000');
        shakeScreen();impactFlash('rgba(139,0,0,.5)',170);
        log('FUGA — 5×5 annihilation!');
        endTurn();return;
    }

    // --- Hollow Purple: 1-click column selection ---
    if(state.hollowPurplePhase){
        // Base: center ±1 (3 cols). Annihilation: center ±2 (5 cols).
        const hpRadius=state.vow==='aniquilacion'?2:1;
        let cols=[];
        for(let dc=-hpRadius;dc<=hpRadius;dc++){const cc=c+dc;if(cc>=0&&cc<=7)cols.push(cc);}
        cols=[...new Set(cols)];
        state.hollowPurplePhase=false;
        showTitle('HOLLOW PURPLE','#8b00ff');
        shakeScreen();impactFlash('rgba(139,0,255,.45)',150);
        log(`Hollow Purple annihilates column${cols.length>1?'s':''} ${cols.map(x=>String.fromCharCode(97+x)).join(', ')}!`);
        let killed=0;
        state.hollowPurpleColsAnim=cols.slice();
        cols.forEach(col=>{
            for(let row=0;row<8;row++){
                const p=state.board[row][col];
                if(p&&p.color==='B'&&p.type!=='K'){
                    state.capturedByW.push(p.type);
                    state.board[row][col]=null;
                    killed++;
                    if(p.isAdaptive){state.mahoragaActive=false;state.mahoragaDomainAdaptTimer=0;state.mahoragaDestroyed=true;}
                    if(p.isRika) state.yutaRikaActive=false;
                }
            }
        });
        if(killed===0) log('No enemy pieces on those columns.');
        render();
        setTimeout(()=>{state.hollowPurpleColsAnim=[];state.hollowPurpleFirstCol=-1;render();},1200);
        endTurn();return;
    }

    // --- Lapse Blue: select any non-King piece, teleport to any empty square ---
    if(state.lapseBluePhase==='select'){
        const p=state.board[r][c];
        if(p&&p.type!=='K'){
            state.lapseBluePhase='move';
            state.lapseBlueTarget={r,c};
            state.sel=null;state.moves=[];
            render();
        }
        return;
    }
    if(state.lapseBluePhase==='move'){
        const dest=state.board[r][c];
        const tgt=state.lapseBlueTarget;
        // Block: cannot land on King or Mahoraga; cannot land on same square as selected piece
        if(dest&&(dest.type==='K'||dest.isAdaptive||dest.isMahoragaKing)){render();return;}
        if(r===tgt.r&&c===tgt.c){render();return;}
        // Cannot teleport to back ranks (row 0/7) — causes promotion glitches
        if(r===0||r===7){log('Lapse Blue cannot teleport to the back rank!');render();return;}
        // Capture if occupied (any non-King, non-Mahoraga piece — own or enemy)
        if(dest){
            if(dest.color==='W') state.capturedByE.push(dest.type);
            else state.capturedByW.push(dest.type);
        }
        const piece=state.board[tgt.r][tgt.c];
        state.board[r][c]=piece;
        state.board[tgt.r][tgt.c]=null;
        playAnim(r,c,'rct-anim');
        log(`Lapse Blue: ${piece.color==='W'?'your':'enemy'} ${piece.type} teleported${dest?' — captures '+dest.type+'!':'!'}`);
        state.lapseBluePhase=null;state.lapseBlueTarget=null;
        state.sel=null;state.moves=[];
        // Promotion check
        if(piece.type==='P'&&piece.color==='W'&&r===0){
            triggerPromo(r,c,()=>endTurn());
        } else if(piece.type==='P'&&piece.color==='B'&&r===7){
            state.board[r][c].type='Q';
            endTurn();
        } else {
            endTurn();
        }
        return;
    }

    // --- Nue placement ---
    if(state.nuePhase==='place'){
        if(!state.board[r][c]){
            state.board[r][c]={type:'B',color:'W',isNue:true,moved:false};
            state.nueActive=true;
            state.nuePhase=null;
            playAnim(r,c,'rct-anim');
            log('Nue summoned! It can teleport to any empty square. Cannot capture or affect the King.');
            render();endTurn();
        } else {
            log('Select an empty square to summon Nue.');
        }
        return;
    }

    // --- Projection Sorcery flow ---
    if(state.projectionActive){
        if(state.projectionPiece===null){
            // Select the piece to project
            const p=state.board[r][c];
            if(p&&p.color==='W'){
                state.projectionPiece={r,c};
                state.sel={r,c};
                // King ignores check on the first projection move
                state.moves=(p.type==='K')?getRawMoves(r,c):getLegalMoves(r,c);
                render();
            }
            return;
        }
        // Make the move for the selected piece
        const m=state.moves.find(m=>m.r===r&&m.c===c);
        if(m){
            // 2nd move: cannot capture King or Mahoraga
            if(state.projectionMovesLeft===1&&(state.board[r][c]?.type==='K'||state.board[r][c]?.isAdaptive||state.board[r][c]?.isMahoragaKing)){
                log('Projection Sorcery / HR: cannot capture King or Mahoraga on the second move!');
                return;
            }
            playAnim(r,c,'projection-anim');
            playAnim(state.projectionPiece.r,state.projectionPiece.c,'projection-trail');
            const projBlocked=applyMove(state.projectionPiece.r,state.projectionPiece.c,r,c,m);
            if(projBlocked){render();return;} // Limitless/Infinity blocked — keep projection state, let player try again
            state.projectionMovesLeft--;
            state.projectionPiece={r,c};
            const movesLeft=state.projectionMovesLeft;
            const nextPiece={r,c};
            if(state.awaitingPromo){
                triggerPromo(state.awaitingPromo.r,state.awaitingPromo.c,()=>{
                    if(movesLeft>0){const pp=state.board[nextPiece.r][nextPiece.c];state.sel=nextPiece;state.moves=(pp?.type==='K'&&state.heavenlyRestriction)?getRawMoves(nextPiece.r,nextPiece.c):getLegalMoves(nextPiece.r,nextPiece.c);render();}
                    else{state.projectionActive=false;state.projectionPiece=null;endTurn();}
                });
                return;
            }
            if(movesLeft>0){
                state.sel=nextPiece;
                const np=state.board[nextPiece.r][nextPiece.c];
                state.moves=(np?.type==='K'&&state.heavenlyRestriction)?getRawMoves(nextPiece.r,nextPiece.c):getLegalMoves(nextPiece.r,nextPiece.c);
                render();
            } else {
                state.projectionActive=false;
                state.projectionPiece=null;
                endTurn();
            }
        } else {
            // Re-select: HR allows switching to any piece at any move slot
            if(state.projectionMovesLeft===2||state.heavenlyRestriction){
                const p=state.board[r][c];
                if(p&&p.color==='W'){
                    state.projectionPiece={r,c};
                    state.sel={r,c};
                    state.moves=(p.type==='K'&&state.heavenlyRestriction)?getRawMoves(r,c):getLegalMoves(r,c);
                    render();
                }
            }
        }
        return;
    }

    if(state.casting){
        if(state.casting==='Idle Transfiguration'){
            const _itT=state.board[r][c];
            if(_itT&&_itT.color==='W'&&_itT.type!=='K'&&_itT.type!=='Q'){
                executeTech('Idle Transfiguration',false,r,c);
            } else {state.casting=null;render();}
            return;
        }
        executeTech(state.casting,false,r,c);return;
    }

    const m=state.moves.find(m=>m.r===r&&m.c===c);
    if(m){
        const captured=state.board[r][c]!==null||m.isEP;
        const selPiece=state.board[state.sel.r][state.sel.c]; // capture before move clears it
        const blocked=applyMove(state.sel.r,state.sel.c,r,c,m);
        if(!blocked){
            // Mahoraga PS adaptation: Mahoraga piece gets 1 extra move per turn (once only)
            if(selPiece?.isAdaptive&&selPiece?.color==='W'&&state.mahoragaAdaptedPS&&!state.mahoragaPSGrantedThisTurn){
                state.extraMovesThisTurn=Math.max(state.extraMovesThisTurn,1);
                state.mahoragaPSGrantedThisTurn=true;
            }
            if(state.awaitingPromo){
                triggerPromo(state.awaitingPromo.r,state.awaitingPromo.c,()=>{
                    // Extra move check after promo
                    if(state.extraMovesThisTurn>0){state.extraMovesThisTurn--;state.sel=null;state.moves=[];render();}
                    else endTurn();
                });
                return;
            }
            // Projection Sorcery passive / Velocidad / IFG / Mahoraga PS extra move
            // Extra moves cannot capture the King
            if(state.extraMovesThisTurn>0){
                state.extraMovesThisTurn--;
                state.sel=null;state.moves=[];
                render();
            } else {
                endTurn();
            }
        } else endTurn();
    } else {
        const p=state.board[r][c];
        if(p&&p.color==='W'){
            state.sel={r,c};
            // HR King ignores check restrictions — moves anywhere a Queen can
            // extraMovesThisTurn King: use raw moves to allow free movement
            state.moves=(p.type==='K'&&state.heavenlyRestriction)?getRawMoves(r,c):(state.extraMovesThisTurn>0&&p.type==='K')?getRawMoves(r,c,state.board):getLegalMoves(r,c);
            render();
        }
    }
}

function applyMove(fr,fc,tr,tc,m){
    const p=state.board[fr][fc];
    const target=state.board[tr][tc];
    // Record move notation before applying
    const notation=toAlgebraic(fr,fc,tr,tc,p,!!target||!!m.isEP,m.isCastle,null);
    state.moveHistory.push(notation);

    if(target||m.isEP){
        // Helper: track Mahoraga block and potentially trigger adaptation
        const trackMahoragaBlock=()=>{
            if(!p.isAdaptive||state.mahoragaAdaptedLimitless) return;
            state.mahoragaLimitlessBlocks=(state.mahoragaLimitlessBlocks||0)+1;
            if(state.mahoragaLimitlessBlocks>=3){
                state.mahoragaAdaptedLimitless=true;
                showMahoragaWheel();
                showTitle('ADAPTATION','#FFD700');
                log('Mahoraga adapts to Limitless/Infinity! Mahoraga and all your moves now pierce through it!');
            }
        };

        // Heavenly Restriction (player) and Zenin Toji bypass ALL Infinity/Limitless protection
        const hrBypass=p.color==='W'&&state.heavenlyRestriction;
        const tojiBypass=p.color==='B'&&state.opp==='Zenin Toji';
        // Domain-active bypass: attacker has active domain → ignores enemy Infinity/Limitless
        const aiHasDomain=!!(state.domain||state.gojoVoidActive||state.mahitoDomainActive||state.naoyaTCMPActive||state.csgActive||state.heianDomainActive);
        const playerHasDomain=!!(state.infiniteVoidActive||state.playerTMLActive||state.playerSEPActive||state.playerHeianDomainActive||state.playerCSGActive||state.playerTCMPActive);

        // Infinity (player): blocks Black captures — Mahoraga adapted lets ALL AI attacks through; Toji/AI-domain ignores
        if(p.color==='B'&&!tojiBypass&&!aiHasDomain&&state.infP>0&&!isDomainClash()){
            if(state.mahoragaAdaptedLimitless){
                // Mahoraga adapted — ALL AI attacks pierce Infinity
                if(p.isAdaptive) showMahoragaWheel();
                log('Mahoraga adaptation: attack pierces Infinity!');
                // fall through — do NOT return
            } else {
                trackMahoragaBlock();
                log('Infinity Blocked! (lasts until end of this turn)');return true;
                // infP cleared at start of player's next turn in endTurn()
            }
        }
        if(p.color==='W'&&!hrBypass&&!playerHasDomain&&state.infE>0&&!isDomainClash()){log("Infinity Blocked! (lasts until end of this turn)");return true;
        // infE cleared at start of AI's next turn in endTurn()
        }

        // Limitless (player passive): blocks Black captures — disabled during Domain Clash; Toji/AI-domain ignores
        if(p.color==='B'&&!tojiBypass&&!aiHasDomain&&target&&!isDomainClash()){
            const hasLimitless=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless');
            if(hasLimitless){
                if(state.mahoragaAdaptedLimitless){
                    // Mahoraga adapted — ALL AI attacks pierce Limitless
                    if(p.isAdaptive) showMahoragaWheel();
                    log('Mahoraga adaptation: attack pierces Limitless!');
                    // fall through — do NOT return
                } else {
                    trackMahoragaBlock();
                    if(state.limitlessImmunityP>0){showTitle('LIMITLESS','#00d2ff');log('Limitless: capture blocked!');return true;}
                    const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
                    const lCost=hasSE?25:50;
                    if(state.ceP>=lCost){
                        state.ceP-=lCost;state.limitlessImmunityP=1;
                        showTitle('LIMITLESS','#00d2ff');log(`Limitless: ${lCost} CE — all pieces immortal this turn!`);
                        render();return true;
                    }
                }
            }
        }
        // Limitless: Gojo Strongest passive — blocks player captures against his pieces
        // Disabled during Domain Clash. Mahoraga (adapted, all attacks), HR, or player's active domain can pierce through.
        if(p.color==='W'&&!hrBypass&&!playerHasDomain&&target&&state.opp==='Gojo Satoru (Strongest)'&&!isDomainClash()){
            if(state.mahoragaAdaptedLimitless){
                // Mahoraga adapted — ALL player attacks pierce Gojo's Limitless
                if(p.isAdaptive) showMahoragaWheel();
                log("Mahoraga adaptation: attack pierces Gojo's Limitless!");
                // fall through — capture proceeds
            } else {
                if(p.isAdaptive) trackMahoragaBlock(); // track adaptation progress for player's Mahoraga
                if(state.limitlessImmunityE>0){showTitle('LIMITLESS','#00d2ff');log('Limitless: Gojo blocks!');return true;}
                const lCost=25;
                if(state.ceE>=lCost){
                    state.ceE-=lCost;state.limitlessImmunityE=1;
                    showTitle('LIMITLESS','#00d2ff');log('Limitless: Gojo shields all pieces!');render();return true;
                }
            }
        }
    }

    if(target){
        if(p.color==='W'){
            state.capturedByW.push(target.type);
            // AI Mahoraga captured by player via chess move — permanently destroyed
            if(target.isAdaptive&&target.color==='B'){state.mahoragaActive=false;state.mahoragaDomainAdaptTimer=0;state.mahoragaDestroyed=true;}
            if((state.opp==='Ryomen Sukuna (Shadow)'||state.opp==='Gojo Satoru (Strongest)')&&target.type!=='K') state.sukunaCaptured.push({...target});
            if(state.opp==='Ryomen Sukuna (Shadow)'||state.opp==='Gojo Satoru (Strongest)'){
                state.sukunaPiecesLost++;
                if(state.opp==='Ryomen Sukuna (Shadow)'&&state.sukunaPiecesLost>=3&&!state.mahoragaActive&&!state.pendingMahoraga&&!state.mahoragaDestroyed) state.pendingMahoraga=true;
                if(state.domain?.type==='malevolent-shadow'){
                    state.domainBreakCount++;
                    if(state.domainBreakCount>=5){
                        state.domain=null;
                        deactivateSukunaDomain();
                        showTitle('DOMAIN COLLAPSE','#888');
                        log('Sukuna weakened! Domain collapsed!');
                    }
                }
            }
        } else {
            state.capturedByE.push(target.type);
            // Detect player's Mahoraga being destroyed
            if(target.isAdaptive&&target.color==='W'){
                state.mahoragaDestroyed=true;
                state.playerMahoragaActive=false;
                state.playerAdaptedTech=[];
                state.playerTechUsageCount={};
                state.mahoragaAdaptedLimitless=false;
                state.mahoragaLimitlessBlocks=0;
                state.playerMahoragaDomainAdaptTimer=0;
                showTitle('MAHORAGA DESTROYED','#FF4444');
                log('Mahoraga was destroyed! The Ten Shadows technique is sealed.');
            }
            // Rika destruction detection
            if(target.isRika&&target.color==='B'){
                state.yutaRikaActive=false;state.yutaRikaDestroyed=true;
                showTitle('RIKA DESTROYED','#fd79a8');
                log("Rika defeated — Yuta's costs return to normal.");
            }
            if(target.isPlayerRika&&target.color==='W'){
                state.playerRikaActive=false;state.playerRikaDestroyed=true;
                showTitle('RIKA DESTROYED','#fd79a8');
                log("Your Rika was captured — technique sealed.");
            }
        }
        // Hunger vow: captures restore 100 × piece value CE
        if(p.color==='W'&&state.vow==='hambre'&&target){
            const gain=100*(PIECE_VALS[target.type]||1);
            state.ceP=Math.min(state.ceMaxP,state.ceP+gain);
            showCEDelta(gain,true);
        }
        // Nue destruction detection
        if(target?.isNue){
            if(target.color==='W'){state.nueActive=false;state.nueDestroyed=true;showTitle('NUE DESTROYED','#7b2fff');log('Your Nue was destroyed! Cannot be re-summoned.');}
            if(target.color==='B'){state.aiNueActive=false;state.aiNueDestroyed=true;log('Enemy Nue destroyed!');}
        }
        // Divine Dog destroyed detection
        if(target?.isDivineDog&&target.color==='W'){
            state.divineDogDestroyed=true;state.divineDogActive=false;
            showTitle('DIVINE DOG DESTROYED','#888');
            log('Divine Dog was destroyed! Cannot be re-summoned.');
        }
        // Passive Black Flash: 10% chance — disabled for HR/Sacrificio vow (player) and Toji (AI)
        const bfAllowed=p.color==='W'
            ? !(state.heavenlyRestriction) && !(state.vow==='sacrificio')
            : !(state.opp==='Zenin Toji');
        if(bfAllowed&&Math.random()<0.1){
            showTitle('BLACK FLASH','#9b59b6');
            const bf=200;
            if(p.color==='W'){
                const prev=state.ceP;
                state.ceP=Math.min(state.ceMaxP,state.ceP+bf);
                const gained=state.ceP-prev;
                if(gained>0) showCEDelta(gained,true);
                log(`BLACK FLASH! +${gained} CE`);
            } else if(state.ceEMax>0){
                state.ceE=Math.min(state.ceEMax,state.ceE+bf);
                log(`Black Flash! Enemy +${bf} CE`);
            }
        }
    }

    if(m.isEP){const d=p.color==='W'?1:-1;state.board[tr+d][tc]=null;}
    state.board[tr][tc]=p;state.board[fr][fc]=null;p.moved=true;
    // TCMP: destroy W pieces that move (Naoya's domain)
    if(state.naoyaTCMPActive&&!isDomainClash()){
        const _placed=state.board[tr][tc];
        const _tcmpMahoImmune=_placed?.isAdaptive&&state.playerAdaptedTech.includes('TCMP');
        if(_placed?.color==='W'&&_placed.type!=='K'&&!_placed.isPlayerRika&&!_tcmpMahoImmune){
            state.capturedByE.push(_placed.type);
            state.board[tr][tc]=null;
            playAnim(tr,tc,'projection-anim');
            log('Time Cell Moon Palace: your piece was destroyed by movement!');
        } else if(_tcmpMahoImmune){
            log('Mahoraga is immune — Time Cell Moon Palace cannot stop the Divine General!');
        }
    }
    // TCMP: destroy B pieces that move (player's domain) — Mahoraga is immune
    if(state.playerTCMPActive&&!isDomainClash()){
        const _placed=state.board[tr][tc];
        if(_placed?.color==='B'&&_placed.type!=='K'&&!_placed.isRika&&!_placed.isAdaptive&&!_placed.isMahoragaKing){
            state.capturedByW.push(_placed.type);
            state.board[tr][tc]=null;
            playAnim(tr,tc,'projection-anim');
            log('Time Cell Moon Palace: enemy piece destroyed by movement!');
        }
    }
    state.epTarget=m.isDouble?{r:(fr+tr)/2,c:fc}:null;
    // Castling: also move the rook
    if(m.isCastle){
        const row=p.color==='W'?7:0;
        if(m.isCastle==='kingside'){
            state.board[row][5]=state.board[row][7];state.board[row][7]=null;
            if(state.board[row][5]) state.board[row][5].moved=true;
        } else {
            state.board[row][3]=state.board[row][0];state.board[row][0]=null;
            if(state.board[row][3]) state.board[row][3].moved=true;
        }
        log(m.isCastle==='kingside'?'Kingside castle!':'Queenside castle!');
    }
    // Pawn promotion
    if(p.type==='P'&&(tr===0||tr===7)){
        if(p.color==='W'){
            state.awaitingPromo={r:tr,c:tc}; // player picks via modal
        } else {
            p.type='Q'; // AI auto-promotes to Queen
            state.ceE=state.ceEMax; // pawn promotion restores full CE
        }
    }
    state.lastMove={fr,fc,tr,tc};
    return false;
}

function triggerPromo(r,c,callback){
    const modal=document.getElementById('promo-modal');
    const opts=document.getElementById('promo-opts');
    modal.style.display='flex';opts.innerHTML='';
    ['Q','R','B','N'].forEach(t=>{
        const b=document.createElement('button');b.className='promo-btn';
        b.innerHTML=`${SYMBOLS['W'][t]}<span>${PIECE_NAMES[t]}</span>`;
        b.onclick=()=>{
            state.board[r][c].type=t;
            state.awaitingPromo=null;
            state.ceP=state.ceMaxP; // pawn promotion restores full CE
            modal.style.display='none';
            render();
            if(callback) callback();
        };
        opts.appendChild(b);
    });
}

// ================================================================
// LINE OF SIGHT
// ================================================================
function hasLOS(tr,tc,color){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        if(state.board[r][c]?.color===color){
            let dr=tr-r,dc=tc-c;
            if(dr===0||dc===0||Math.abs(dr)===Math.abs(dc)){
                let sR=dr===0?0:dr/Math.abs(dr),sC=dc===0?0:dc/Math.abs(dc);
                let blocked=false;
                for(let i=1;i<Math.max(Math.abs(dr),Math.abs(dc));i++){
                    if(state.board[r+sR*i][c+sC*i]){blocked=true;break;}
                }
                if(!blocked) return true;
            }
        }
    }
    return false;
}

// ================================================================
// DOMAIN
// ================================================================
function activateYutaDomain(){
    // Collapse vs stronger domains
    if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
        log('True Mutual Love collapses — overwhelmed by the stronger domain!');
        showTitle('COLLAPSED','#fd79a8');return;
    }
    showDomainCinematic('DOMAIN EXPANSION — TRUE MUTUAL LOVE','#fd79a8');
    state.trueMutualLoveActive=true;
    const gs=document.getElementById('game-screen');if(gs) gs.classList.add('tml-domain');
    document.getElementById('tml-veil').style.display='block';
    showTitle('TRUE MUTUAL LOVE','#fd79a8');
    log('Domain Expansion: True Mutual Love! Rika\'s power fills the space...');
    checkDomainClashVisual();
}
function deactivateYutaDomain(){
    state.trueMutualLoveActive=false;
    // Only remove visuals if player's TML is also gone
    if(!state.playerTMLActive){
        const gs=document.getElementById('game-screen');
        if(gs){gs.classList.remove('tml-domain');gs.classList.remove('tml-shrine-clash');}
        document.getElementById('tml-veil').style.display='none';
    }
}
function activateTCMP(){
    // Collapse immediately if a stronger domain is already active
    if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
        state.ceE+=getTechCost('Time Cell Moon Palace',true); // refund
        showTitle('COLLAPSED','#ffaa00');
        log('Time Cell Moon Palace collapses — overwhelmed by the stronger domain!');
        return;
    }
    showDomainCinematic('DOMAIN EXPANSION — TIME CELL MOON PALACE','#ffaa00');
    state.naoyaTCMPActive=true;
    const gs=document.getElementById('game-screen');
    if(gs)gs.classList.add('tcmp-domain');
    document.getElementById('tcmp-veil').style.display='block';
    showTitle('TIME CELL MOON PALACE','#ffaa00');
    checkDomainClashVisual();
    // Mahoraga adaptation to TCMP — instant full adaptation (domain is a one-time event)
    if(isPlayerMahoragaOnBoard()&&!state.playerAdaptedTech.includes('TCMP')){
        state.playerAdaptedTech.push('TCMP');
        showMahoragaWheel();
        log('Mahoraga adapts to Time Cell Moon Palace — the Divine General is immune to its destruction!');
    }
    log('Domain Expansion: Time Cell Moon Palace! Naoya fills every moment...');
    // Offer counter only if player has a domain skill equipped but not yet active
    const hasVoidEq=Object.values(prog.eq).includes('Infinite Void');
    const hasMalEq=Object.values(prog.eq).includes('Malevolent Shrine');
    const canC=(hasVoidEq&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive)
              ||(hasMalEq&&state.ceP>=getTechCost('Malevolent Shrine')&&!state.domain);
    if(canC)showDomainCounterChoice();
}
function deactivateTCMP(){
    state.naoyaTCMPActive=false;
    const gs=document.getElementById('game-screen');
    if(gs)gs.classList.remove('tcmp-domain');
    document.getElementById('tcmp-veil').style.display='none';
}
function deactivatePlayerTCMP(){
    state.playerTCMPActive=false;
    const gs=document.getElementById('game-screen');
    if(gs)gs.classList.remove('tcmp-domain');
    document.getElementById('tcmp-veil').style.display='none';
}
function activateSEP(isPlayer){
    if(!isPlayer){
        if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
            state.ceE+=getTechCost('Self Embodiment of Perfection',true);
            showTitle('COLLAPSED','#8800cc');
            log('Self Embodiment of Perfection collapses against the stronger domain!');
            return;
        }
        showDomainCinematic('DOMAIN EXPANSION — SELF EMBODIMENT OF PERFECTION','#8800cc');
        state.mahitoDomainActive=true;state.mahitoDomainTimer=0;
        const gs=document.getElementById('game-screen');
        if(gs)gs.classList.add('sep-domain');
        document.getElementById('sep-veil').style.display='block';
        showTitle('SELF EMBODIMENT OF PERFECTION','#8800cc');
        log('Domain Expansion: Self Embodiment of Perfection! Souls twist and shatter at Mahito\'s touch...');
        checkDomainClashVisual();
        const hasVoidEq=Object.values(prog.eq).includes('Infinite Void');
        const hasMalEq=Object.values(prog.eq).includes('Malevolent Shrine');
        const canC=(hasVoidEq&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive)
                  ||(hasMalEq&&state.ceP>=getTechCost('Malevolent Shrine')&&!state.domain);
        if(canC)showDomainCounterChoice();
    } else {
        if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
            showTitle('COLLAPSED','#8800cc');
            log('Self Embodiment of Perfection collapses — overwhelmed by the stronger domain!');
            state.ceP+=getTechCost('Self Embodiment of Perfection');
            state.casting=null;return;
        }
        showDomainCinematic('DOMAIN EXPANSION — SELF EMBODIMENT OF PERFECTION','#8800cc');
        state.playerSEPActive=true;
        const gs=document.getElementById('game-screen');
        if(gs)gs.classList.add('sep-domain');
        document.getElementById('sep-veil').style.display='block';
        showTitle('SELF EMBODIMENT OF PERFECTION','#8800cc');
        log('Domain Expansion: Self Embodiment of Perfection! Every enemy piece bends to your will...');
        checkDomainClashVisual();
    }
}
function deactivateSEP(){
    state.mahitoDomainActive=false;
    const gs=document.getElementById('game-screen');
    if(gs)gs.classList.remove('sep-domain');
    document.getElementById('sep-veil').style.display='none';
}
function deactivatePlayerSEP(){
    state.playerSEPActive=false;
    const gs=document.getElementById('game-screen');
    if(gs)gs.classList.remove('sep-domain');
    document.getElementById('sep-veil').style.display='none';
}
function triggerNaoyaRevival(){
    state.naoyaRevivalDone=true;
    // Collect surviving W pieces
    const survivingW=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W')survivingW.push({...p});}
    // Reset board to starting position
    initBoard();
    // Clear all W pieces from reset board
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(state.board[r][c]?.color==='W')state.board[r][c]=null;}
    // Place surviving W pieces in home rows (6-7), left-to-right
    let hRow=7,hCol=0;
    for(const p of survivingW){
        while(hRow>=6&&state.board[hRow][hCol]!==null){hCol++;if(hCol>=8){hCol=0;hRow--;}}
        if(hRow>=6){state.board[hRow][hCol]={...p,moved:true};hCol++;}
    }
    // ── Clear ALL Phase 1 domain/visual state so nothing carries over ──
    state.domain=null;state.domain2=null;state.domainClashTimer=0;state.domainChoicePending=false;
    state.mahitoDomainActive=false;state.playerSEPActive=false;state.mahitoDomainTimer=0;
    state.playerTCMPActive=false;state.naoyaTCMPActive=false;
    state.infiniteVoidActive=false;state.infiniteVoidTimer=0;
    state.trueMutualLoveActive=false;
    state.playerTMLActive=false;
    state.gojoVoidActive=false;state.gojoVoidTimer=0;
    // Remove all domain CSS classes and veils
    const gs=document.getElementById('game-screen');
    if(gs){
        gs.style.backgroundColor='';
        gs.classList.remove('sukuna-domain','infinite-void-domain','tml-domain','tml-shrine-clash','tcmp-domain','sep-domain','sep-clash','domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash');
    }
    ['domain-veil','void-veil','tml-veil','tcmp-veil','sep-veil'].forEach(id=>{
        const el=document.getElementById(id);if(el)el.style.display='none';
    });
    state.naoyaPhase2=true;
    state.naoyaPhase2Moves=0;
    state.ceE=state.ceEMax; // restore full CE on revival
    state.aiSkillCooldowns={};
    // NOTE: state.turn is already 'B' — endTurn() switched it before calling checkGameOver()
    // NOTE: aiCycle is already scheduled by endTurn()'s final line — do NOT schedule again here
    showTitle('REVIVAL — CURSED SPIRIT','#ffaa00');
    log('Naoya transcended death as a cursed spirit! Phase 2 begins — only your survivors remain...');
    render();
}
function triggerMegumiRevival(){
    state.megRevivalUsed=true;
    state.megRevivalPending=true; // blocks aiCycle during animation
    showTitle('With this treasure, I summon...','#4a9eff');
    log('— With this treasure, I summon...');
    setTimeout(()=>{
        // Clear all B pieces
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.color==='B') state.board[r][c]=null;}
        // Clear CSG domain if active
        state.csgActive=false;state.csgTimer=0;
        document.getElementById('game-screen')?.classList.remove('csg-domain');
        // Place Mahoraga as the Black King
        state.board[0][4]={type:'K',color:'B',isAdaptive:true,isMahoragaKing:true,moved:false};
        state.megMahoragaPhase=true;
        state.megTurnsLeft=40;
        state.mahoragaActive=false; // suppress the "Mahoraga" skill from this piece
        showMahoragaWheel();
        showTitle('☸ DIVINE GENERAL MAHORAGA','#FFD700');
        log('☸ DIVINE GENERAL MAHORAGA! All of Megumi\'s pieces become Mahoraga.');
        log('"Hey you damn bastard — I\'ll be dying first. Let me see your best shot."');
        log('Survive 40 turns for Megumi to bleed out, or destroy Mahoraga to win immediately!');
        state.megRevivalPending=false;
        render();
        // Schedule aiCycle now that revival animation is done
        if(!state.over) setTimeout(aiCycle,800);
    },2500);
}
function activateHeianDomain(){
    showDomainCinematic('DOMAIN EXPANSION — MALEVOLENT SHRINE','#8B0000');
    document.getElementById('game-screen').classList.add('heian-domain');
    document.getElementById('domain-veil').style.display='block';
}
function deactivateHeianDomain(){
    state.heianDomainActive=false;state.heianDomainTimer=0;
    if(!state.playerHeianDomainActive){
        document.getElementById('game-screen').classList.remove('heian-domain');
        document.getElementById('domain-veil').style.display='none';
    }
}
function deactivatePlayerHeianDomain(){
    state.playerHeianDomainActive=false;
    if(!state.heianDomainActive){
        document.getElementById('game-screen').classList.remove('heian-domain');
        document.getElementById('domain-veil').style.display='none';
    }
}
function activateSukunaDomain(){
    showDomainCinematic('DOMAIN EXPANSION — MALEVOLENT SHRINE','#8B0000');
    document.getElementById('game-screen').style.backgroundColor='';
    document.getElementById('game-screen').classList.add('sukuna-domain');
    document.getElementById('domain-veil').style.display='block';
}
function deactivateSukunaDomain(){
    document.getElementById('game-screen').classList.remove('sukuna-domain');
    document.getElementById('domain-veil').style.display='none';
    document.getElementById('game-screen').style.backgroundColor='';
}
function breakDomain(){
    if(state.domain?.type==='malevolent-shadow'||state.domain?.type==='malevolent-player') return;
    state.domain=null;
    document.getElementById('game-screen').style.backgroundColor='';
    log("Domain Shattered!");
}
function activateVoidDomain(){
    showDomainCinematic('DOMAIN EXPANSION — INFINITE VOID','#00d2ff');
    document.getElementById('game-screen').classList.add('infinite-void-domain');
    document.getElementById('void-veil').style.display='block';
}
function deactivateVoidDomain(){
    document.getElementById('game-screen').classList.remove('infinite-void-domain');
    document.getElementById('void-veil').style.display='none';
    state.infiniteVoidActive=false;state.infiniteVoidTimer=0;
}
function isDomainClash(){
    // IV vs MS: classic clash
    const hasVoid=state.infiniteVoidActive||state.gojoVoidActive;
    const hasMalevolent=state.domain?.type?.includes('malevolent')||state.domain2?.type?.includes('malevolent');
    if(hasVoid&&hasMalevolent) return true;
    // Two Voids simultaneously (edge case)
    if(state.infiniteVoidActive&&state.gojoVoidActive) return true;
    // Non-MS/IV domain pairs — all clash equally
    const hasTML=state.trueMutualLoveActive||state.playerTMLActive;
    const hasTCMP=state.naoyaTCMPActive||state.playerTCMPActive;
    const hasSEP=state.mahitoDomainActive||state.playerSEPActive;
    const hasCSG=state.csgActive||state.playerCSGActive;
    if(hasTML&&hasTCMP) return true;
    if(hasTML&&hasSEP)  return true;
    if(hasTCMP&&hasSEP) return true;
    if(hasCSG&&(hasTML||hasTCMP||hasSEP)) return true;
    if(hasMalevolent&&(hasTML||hasTCMP||hasSEP||hasCSG)) return true;
    // Same-type domain clashes (player and opponent use the same domain)
    if(state.playerTMLActive&&state.trueMutualLoveActive) return true;
    if(state.playerSEPActive&&state.mahitoDomainActive)   return true;
    if(state.playerTCMPActive&&state.naoyaTCMPActive)     return true;
    if(state.playerCSGActive&&state.csgActive)            return true;
    return false;
}
// Infinity/Limitless bypass rule: returns true if the attacker CAN bypass the barrier
// A: attacker has domain active  B: Mahoraga adapted  C: domain clash  D: attacker has HR
function canBypassBarrier(isAIAttacking){
    if(isDomainClash()) return true;                    // C
    if(state.mahoragaAdaptedLimitless) return true;     // B
    if(isAIAttacking){
        // A: AI attacker has any domain active
        if(state.domain||state.domain2||state.gojoVoidActive||state.mahitoDomainActive||state.naoyaTCMPActive||state.csgActive||state.heianDomainActive) return true;
        // D: AI is Toji (Heavenly Restriction — zero cursed energy bypasses barrier)
        if(state.opp==='Zenin Toji') return true;
    } else {
        // A: player attacker has domain active
        if(state.infiniteVoidActive||state.playerTMLActive||state.playerSEPActive||state.playerHeianDomainActive||state.playerCSGActive||state.playerTCMPActive) return true;
        // D: player has Heavenly Restriction equipped
        if(Object.values(prog.eq).some(v=>v==='Heavenly Restriction')) return true;
    }
    return false;
}
function activateGojoVoidDomain(){
    // Player's Mahoraga instantly adapts, destroying the domain before it expands
    if(isPlayerMahoragaOnBoard()){
        state.ceE+=getTechCost('Infinite Void',true);
        showMahoragaWheel();
        showTitle('MAHORAGA ADAPTS','#FFD700');
        log('☸ Your Mahoraga instantly adapts to Gojo\'s Infinite Void! The domain is nullified!');
        return;
    }
    document.getElementById('game-screen').classList.add('infinite-void-domain');
    document.getElementById('void-veil').style.display='block';
    state.gojoVoidActive=true;state.gojoVoidTimer=10;
    showTitle('INFINITE VOID','#6600cc');
    log('Gojo: Domain Expansion — Infinite Void! You are sealed for 10 turns...');
}
function deactivateGojoVoidDomain(){
    state.gojoVoidActive=false;state.gojoVoidTimer=0;
    if(!state.infiniteVoidActive){
        document.getElementById('game-screen').classList.remove('infinite-void-domain');
        document.getElementById('void-veil').style.display='none';
    }
    log('Infinite Void fades — you can move again.');
}
function canEnemyExpandDomain(){
    if(state.opp==='Ryomen Sukuna (Shadow)'&&state.ceE>=getTechCost('Malevolent Shrine',true)&&!state.domain&&!state.domain2) return true;
    if(state.opp==='Ryomen Sukuna Heian'&&state.ceE>=getTechCost('Malevolent Shrine: Heian',true)&&!state.heianDomainActive&&!state.domain&&!state.domain2
        &&(!state.aiSkillCooldowns['Malevolent Shrine: Heian']||state.aiSkillCooldowns['Malevolent Shrine: Heian']<=0)) return true;
    return false;
}
function aiExpandDomain(){
    if(state.opp==='Ryomen Sukuna (Shadow)'){
        state.ceE-=getTechCost('Malevolent Shrine',true);
        const d={owner:'B',type:'malevolent-shadow',timer:0};
        if(state.infiniteVoidActive) state.domain2=d; else state.domain=d;
        activateSukunaDomain();
        showTitle('MALEVOLENT SHRINE','#FFD700');
        log('Malevolent Shrine counters Infinite Void! DOMAIN CLASH!');
    }
    if(state.opp==='Ryomen Sukuna Heian'&&(!state.aiSkillCooldowns['Malevolent Shrine: Heian']||state.aiSkillCooldowns['Malevolent Shrine: Heian']<=0)){
        state.ceE-=getTechCost('Malevolent Shrine: Heian',true);
        state.heianDomainActive=true;
        const d={owner:'B',type:'malevolent-heian',timer:0};
        if(state.infiniteVoidActive) state.domain2=d; else state.domain=d;
        activateHeianDomain();
        showTitle('MALEVOLENT SHRINE: HEIAN','#8B0000');
        log('Malevolent Shrine: Heian counters Infinite Void! DOMAIN CLASH!');
    }
}
function checkDomainClashVisual(){
    if(!isDomainClash()) return;
    const gs=document.getElementById('game-screen');
    // Remove all previous clash + domain classes so we start clean
    gs.classList.remove('domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tcmp-shrine-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash');
    // Determine which pair is clashing and apply the correct class
    const hasVoid=state.infiniteVoidActive||state.gojoVoidActive;
    const hasMalevolent=state.domain?.type?.includes('malevolent')||state.domain2?.type?.includes('malevolent');
    const hasTML=state.trueMutualLoveActive||state.playerTMLActive;
    const hasTCMP=state.naoyaTCMPActive||state.playerTCMPActive;
    const hasSEP=state.mahitoDomainActive||state.playerSEPActive;
    const pTML=state.playerTMLActive, yTML=state.trueMutualLoveActive;
    if(hasVoid&&hasMalevolent)                                gs.classList.add('domain-clash');
    else if(pTML&&yTML)                                       gs.classList.add('tml-tml-clash');
    else if(state.playerSEPActive&&state.mahitoDomainActive)  gs.classList.add('sep-sep-clash');
    else if(state.playerTCMPActive&&state.naoyaTCMPActive)    gs.classList.add('tcmp-tcmp-clash');
    else if(hasTML&&hasTCMP)                                  gs.classList.add('tml-tcmp-clash');
    else if(hasTML&&hasSEP)                                   gs.classList.add('tml-sep-clash');
    else if(hasTCMP&&hasSEP)                                  gs.classList.add('tcmp-sep-clash');
    else                                                      gs.classList.add('domain-clash');
    if(!state.domainClashTimer||state.domainClashTimer===0){
        state.domainClashTimer=20;
        // Neutralise any active Infinity on both sides
        state.infP=0;state.infE=0;
        state.limitlessImmunityP=0;state.limitlessImmunityE=0;
        showTitle('DOMAIN CLASH!','#ff00ff');
        log('⚔ Domain Clash! Both domains clash — neither side may use skills for 20 turns. Check the enemy king to end it early!');
    }
}
function endDomainClash(){
    const crack=document.getElementById('crack-overlay');
    crack.style.display='block';
    crack.style.animation='none';void crack.offsetWidth;
    crack.style.animation='crack-shatter 1.2s ease-out forwards';
    setTimeout(()=>{
        crack.style.display='none';
        deactivateVoidDomain();
        deactivateSukunaDomain();
        deactivateGojoVoidDomain();
        deactivateYutaDomain();
        state.domain=null;state.domain2=null;state.domainClashTimer=0;
        state.playerTMLActive=false;
        state.trueMutualLoveActive=false;
        state.mahitoDomainActive=false;state.mahitoDomainTimer=0;
        state.playerSEPActive=false;
        state.naoyaTCMPActive=false;state.playerTCMPActive=false;
        state.csgActive=false;state.csgTimer=0;state.playerCSGActive=false;state.playerCSGTimer=0;
        state.heianDomainActive=false;state.heianDomainTimer=0;state.playerHeianDomainActive=false;
        state.mahoragaDomainAdaptTimer=0;state.playerMahoragaDomainAdaptTimer=0;
        document.getElementById('tml-veil').style.display='none';
        document.getElementById('tcmp-veil').style.display='none';
        document.getElementById('sep-veil').style.display='none';
        const gs=document.getElementById('game-screen');
        gs.classList.remove('domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tcmp-shrine-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash','infinite-void-domain','tml-domain','sep-domain','tcmp-domain','csg-domain','heian-domain');
        log('Domain Clash ended — the cursed energy disperses.');
        render();
    },1400);
}
function showDomainCounterChoice(){
    state.domainChoicePending=true;
    document.getElementById('domain-choice-overlay').style.display='flex';
}
function chooseDomainExpand(){
    document.getElementById('domain-choice-overlay').style.display='none';
    state.domainChoicePending=false;
    // Try Infinite Void first, fall back to Malevolent Shrine
    const hasVoid=Object.values(prog.eq).includes('Infinite Void');
    const hasMalevolent=Object.values(prog.eq).includes('Malevolent Shrine');
    if(hasVoid&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive){
        state.ceP-=getTechCost('Infinite Void');
        state.infiniteVoidActive=true;state.infiniteVoidTimer=10;
        activateVoidDomain();checkDomainClashVisual();
        showTitle('INFINITE VOID','#6600cc');
        log('Infinite Void expands! DOMAIN CLASH!');
    } else if(hasMalevolent&&state.ceP>=getTechCost('Malevolent Shrine')&&!state.domain){
        state.ceP-=getTechCost('Malevolent Shrine');
        state.domain={owner:'W',type:'malevolent-player',timer:0};
        activateSukunaDomain();checkDomainClashVisual();
        showTitle('MALEVOLENT SHRINE','#8B0000');
        log('Malevolent Shrine counter-expands! DOMAIN CLASH!');
    } else {
        log('Not enough CE for a counter domain!');
    }
    render();
}
function chooseDomainSurvive(){
    document.getElementById('domain-choice-overlay').style.display='none';
    state.domainChoicePending=false;
    log('You endure the enemy domain...');
    render();
}

function tmlFireSkill(isAI){
    const myColor=isAI?'B':'W';
    const enemyColor=isAI?'W':'B';
    const ceKey=isAI?'ceE':'ceP';
    const capturedKey=isAI?'capturedByE':'capturedByW';
    // Build pool: all non-domain, non-passive skills affordable right now
    // Exclude Copy (no tml handler) and Heavenly Restriction (battle-start passive, meaningless here)
    const TML_EXCLUDE=new Set(['Copy','Heavenly Restriction']);
    const pool=Object.entries(SKILLS)
        .filter(([n,s])=>s.slot!=='Domain'&&s.type!=='passive'&&!TML_EXCLUDE.has(n)&&state[ceKey]>=getTechCost(n,isAI))
        .map(([n])=>n);
    if(!pool.length) return;
    const chosen=pool[Math.floor(Math.random()*pool.length)];
    state[ceKey]-=getTechCost(chosen,isAI);
    log(`✦ True Mutual Love fires: ${chosen}!`);
    // Collect pieces
    const enemyPieces=[],ownPieces=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        const p=state.board[r][c];
        if(p?.color===enemyColor&&p.type!=='K'&&!p.isAdaptive) enemyPieces.push({r,c});
        if(p?.color===myColor&&p.type!=='K'&&p.type!=='Q') ownPieces.push({r,c});
    }
    switch(chosen){
        case 'Divergent Fist':case 'Straw Doll':case 'Reversal Red':case 'Cleave':case 'Lapse Blue':{
            if(!enemyPieces.length) break;
            const t=enemyPieces[Math.floor(Math.random()*enemyPieces.length)];
            state[capturedKey].push(state.board[t.r][t.c].type);
            state.board[t.r][t.c]=null;playAnim(t.r,t.c,'cleave-anim');break;
        }
        case 'Dismantle':{
            if(!enemyPieces.length) break;
            const row=enemyPieces[Math.floor(Math.random()*enemyPieces.length)].r;
            for(let c=0;c<8;c++){const p=state.board[row][c];if(p?.color===enemyColor&&p.type!=='K'){state[capturedKey].push(p.type);state.board[row][c]=null;playAnim(row,c,'dismantle-anim');}}
            break;
        }
        case 'Hollow Purple':{
            let bestCol=0,bestCount=0;
            for(let c=0;c<7;c++){
                let cnt=0;
                for(let r=0;r<8;r++){if(state.board[r][c]?.color===enemyColor&&state.board[r][c].type!=='K') cnt++;}
                for(let r=0;r<8;r++){if(state.board[r][c+1]?.color===enemyColor&&state.board[r][c+1].type!=='K') cnt++;}
                if(cnt>bestCount){bestCount=cnt;bestCol=c;}
            }
            for(let dc=0;dc<=1;dc++) for(let r=0;r<8;r++){
                const p=state.board[r][bestCol+dc];
                if(p&&p.color===enemyColor&&p.type!=='K'){state[capturedKey].push(p.type);state.board[r][bestCol+dc]=null;playAnim(r,bestCol+dc,'cleave-anim');
                    if(p.isAdaptive){if(isAI){state.playerMahoragaActive=false;state.playerMahoragaDomainAdaptTimer=0;}else{state.mahoragaActive=false;state.mahoragaDomainAdaptTimer=0;}}
                    if(p.isRika){if(isAI)state.playerRikaActive=false;else state.yutaRikaActive=false;}
                }
            }
            break;
        }
        case 'Divine Dog':{
            const backRow=isAI?0:7;const alt=isAI?1:6;let placed=false;
            for(const row of[backRow,alt])for(let col=0;col<8&&!placed;col++){
                if(!state.board[row][col]){state.board[row][col]={type:'N',color:myColor,isDivDog:true,moved:false};playAnim(row,col,'rct-anim');placed=true;}
            }
            break;
        }
        case 'Idle Transfiguration':{
            if(!ownPieces.length) break;
            ownPieces.sort((a,b)=>PIECE_VALS[state.board[a.r][a.c].type]-PIECE_VALS[state.board[b.r][b.c].type]);
            const t=ownPieces[0];state.board[t.r][t.c].type='Q';playAnim(t.r,t.c,'sep-anim');break;
        }
        case 'Reverse Cursed Technique':{
            const captured=isAI?state.capturedByW:state.capturedByE;
            if(!captured.length) break;
            const piece=captured.pop();let placed=false;
            const homeRow=isAI?0:7;
            for(let rr=homeRow;isAI?rr<8:rr>=0;isAI?rr++:rr--) for(let cc=0;cc<8&&!placed;cc++){
                if(!state.board[rr][cc]){state.board[rr][cc]={type:piece,color:myColor,moved:true};playAnim(rr,cc,'rct-anim');placed=true;}
            }
            break;
        }
        case 'Rika':{
            const rRow=isAI?0:7;
            for(let col=0;col<8;col++){if(!state.board[rRow][col]){state.board[rRow][col]={type:'Q',color:myColor,isRika:true,moved:false};playAnim(rRow,col,'rika-summon-anim');break;}}
            break;
        }
        case 'Infinity':if(isAI) state.infE=1; else state.infP=1; break;
        case 'Mahoraga':{
            const mRow=isAI?0:7;
            for(let col=0;col<8;col++){if(!state.board[mRow][col]){state.board[mRow][col]={type:'Q',color:myColor,isAdaptive:true,moved:false};playAnim(mRow,col,'rct-anim');break;}}
            break;
        }
        case 'Cursed Speech':{
            if(isAI){
                // AI TML seals a random AI (opponent of player) skill
                const pool2=getOppSkillPool(state.opp);
                if(pool2.length){const s2=pool2[Math.floor(Math.random()*pool2.length)];state.aiSkillCooldowns[s2]=(state.aiSkillCooldowns[s2]||0)+3;}
            } else {
                // Player TML seals a random AI skill
                const pool2=getOppSkillPool(state.opp);
                if(pool2.length){const s2=pool2[Math.floor(Math.random()*pool2.length)];state.aiSkillCooldowns[s2]=(state.aiSkillCooldowns[s2]||0)+3;log(`✦ Cursed Speech seals enemy ${s2} for 3 turns!`);}
            }
            break;
        }
        default:break;
    }
}

function processDomain(){
    // True Mutual Love — player's domain (fires against AI/enemy, on AI's turn)
    if(state.playerTMLActive&&!isDomainClash()&&state.turn==='B'){
        if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
            state.playerTMLActive=false;
            document.getElementById('game-screen')?.classList.remove('tml-domain');
            document.getElementById('tml-veil').style.display='none';
            log('True Mutual Love shattered by the stronger domain!');
        } else {
            tmlFireSkill(false);
        }
    }
    // Yuta's True Mutual Love — AI domain (fires against player, on player's turn)
    if(state.opp==='Okkotsu Yuta'&&state.trueMutualLoveActive&&!isDomainClash()&&state.turn==='W'){
        if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
            deactivateYutaDomain();log('True Mutual Love shattered!');
        } else {
            tmlFireSkill(true);
        }
    }
    // Chimera Shadow Garden — player's CSG (fires on AI's turn)
    // Creates shadow clones of the PLAYER's own pieces (White → White clone)
    if(state.playerCSGActive&&!isDomainClash()&&state.turn==='B'){
        if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
            state.playerCSGActive=false;
            document.getElementById('game-screen')?.classList.remove('csg-domain');
            log('Chimera Shadow Garden shattered by the stronger domain!');
        } else {
            const wPieces=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.color==='W'&&state.board[r][c].type!=='K') wPieces.push({r,c});}
            if(wPieces.length){
                const src=wPieces[Math.floor(Math.random()*wPieces.length)];
                const empty=[];
                for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(!state.board[r][c]) empty.push({r,c});
                if(empty.length){
                    const dest=empty[Math.floor(Math.random()*empty.length)];
                    state.board[dest.r][dest.c]={...state.board[src.r][src.c],color:'W',isShadow:true,moved:true};
                    playAnim(dest.r,dest.c,'sep-anim');
                    log('Chimera Shadow Garden: a shadow clone of your piece emerges!');
                }
            }
            state.playerCSGTimer=(state.playerCSGTimer||0)+1;
            if(state.playerCSGTimer>=10){
                state.playerCSGActive=false;
                document.getElementById('game-screen')?.classList.remove('csg-domain');
                log('Chimera Shadow Garden fades.');
            }
        }
    }
    // AI Chimera Shadow Garden (fires on player's turn)
    // Creates shadow clones of MEGUMI's own pieces (Black → Black clone)
    if(state.opp==='Megumi (Awakened)'&&state.csgActive&&!isDomainClash()&&state.turn==='W'){
        if(state.infiniteVoidActive||state.domain?.type?.includes('malevolent-player')){
            state.csgActive=false;
            document.getElementById('game-screen')?.classList.remove('csg-domain');
            log('Chimera Shadow Garden shattered by your domain!');
        } else {
            const bPieces=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.color==='B'&&state.board[r][c].type!=='K') bPieces.push({r,c});}
            if(bPieces.length){
                const src=bPieces[Math.floor(Math.random()*bPieces.length)];
                const empty=[];
                for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(!state.board[r][c]) empty.push({r,c});
                if(empty.length){
                    const dest=empty[Math.floor(Math.random()*empty.length)];
                    state.board[dest.r][dest.c]={...state.board[src.r][src.c],color:'B',isShadow:true,moved:true};
                    playAnim(dest.r,dest.c,'sep-anim');
                    log('Chimera Shadow Garden: a shadow clone of Megumi\'s piece materialises!');
                }
            }
            state.csgTimer=(state.csgTimer||0)+1;
            if(state.csgTimer>=10){
                state.csgActive=false;
                document.getElementById('game-screen')?.classList.remove('csg-domain');
                log('Chimera Shadow Garden fades.');
            }
        }
    }

    // Domain clash: effects cancelled, just count timers
    const clash=isDomainClash();

    // Process domain2 (secondary concurrent domain, e.g. malevolent-shadow during Infinite Void)
    if(state.domain2&&!clash){
        const d2=state.domain2;
        if(d2.type==='malevolent-shadow'){
            d2.timer=(d2.timer||0)+1;
            if(d2.timer>=3){
                d2.timer=0;
                let wPieces=[];
                for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                    const p=state.board[r][c];
                    // Mahoraga is immune to Shrine strikes — it will adapt to the domain instead
                    if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) wPieces.push({r,c,val:PIECE_VALS[p.type]});
                }
                wPieces.sort((a,b)=>b.val-a.val);
                const targets=wPieces.slice(0,2);
                targets.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByE.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
                setTimeout(()=>{if(targets[0]){showTitle('CLEAVE','#FFD700');playAnim(targets[0].r,targets[0].c,'cleave-anim');log('Malevolent Shrine: Cleave!');}},80);
                if(targets[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(targets[1].r,targets[1].c,'dismantle-anim');log('Malevolent Shrine: Dismantle!');},680);
            }
        }
    }

    // Malevolent Shrine: Heian — AI domain (fires on player's turn, every 2 turns, 3 pieces)
    if(state.domain?.type==='malevolent-heian'&&!clash&&state.turn==='W'){
        state.domain.timer=(state.domain.timer||0)+1;
        if(state.domain.timer%2===0){
            let hWP=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) hWP.push({r,c,val:PIECE_VALS[p.type]});
            }
            hWP.sort((a,b)=>b.val-a.val);
            const hT=hWP.slice(0,3);
            hT.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByE.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
            setTimeout(()=>{if(hT[0]){showTitle('HEIAN CLEAVE','#FFD700');playAnim(hT[0].r,hT[0].c,'cleave-anim');log('Malevolent Shrine: Heian — First Cut!');}},80);
            if(hT[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(hT[1].r,hT[1].c,'dismantle-anim');log('Malevolent Shrine: Heian — Second Cut!');},680);
            if(hT[2]) setTimeout(()=>{showTitle('HEIAN CLEAVE','#FFD700');playAnim(hT[2].r,hT[2].c,'cleave-anim');log('Malevolent Shrine: Heian — Third Cut!');},1280);
        }
        return;
    }
    // Malevolent Shrine: Heian — domain2 (during Void clash)
    if(state.domain2?.type==='malevolent-heian'&&!clash){
        state.domain2.timer=(state.domain2.timer||0)+1;
        if(state.domain2.timer%2===0){
            let hWP2=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) hWP2.push({r,c,val:PIECE_VALS[p.type]});
            }
            hWP2.sort((a,b)=>b.val-a.val);
            const hT2=hWP2.slice(0,3);
            hT2.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByE.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
            setTimeout(()=>{if(hT2[0]){showTitle('HEIAN CLEAVE','#FFD700');playAnim(hT2[0].r,hT2[0].c,'cleave-anim');log('Malevolent Shrine: Heian — First Cut!');}},80);
            if(hT2[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(hT2[1].r,hT2[1].c,'dismantle-anim');log('Malevolent Shrine: Heian — Second Cut!');},680);
            if(hT2[2]) setTimeout(()=>{showTitle('HEIAN CLEAVE','#FFD700');playAnim(hT2[2].r,hT2[2].c,'cleave-anim');log('Malevolent Shrine: Heian — Third Cut!');},1280);
        }
    }
    // Malevolent Shrine: Heian — player domain (fires on AI's turn, every 2 turns, 3 pieces)
    if(state.domain?.type==='malevolent-heian-player'&&!clash&&state.turn==='B'){
        state.domain.timer=(state.domain.timer||0)+1;
        if(state.domain.timer%2===0){
            let hBP=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color==='B'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) hBP.push({r,c,val:PIECE_VALS[p.type]});
            }
            hBP.sort((a,b)=>b.val-a.val);
            const hTP=hBP.slice(0,3);
            hTP.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByW.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
            setTimeout(()=>{if(hTP[0]){showTitle('HEIAN CLEAVE','#8B0000');playAnim(hTP[0].r,hTP[0].c,'cleave-anim');log('Your Malevolent Shrine: Heian — First Cut!');}},80);
            if(hTP[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(hTP[1].r,hTP[1].c,'dismantle-anim');log('Your Malevolent Shrine: Heian — Second Cut!');},680);
            if(hTP[2]) setTimeout(()=>{showTitle('HEIAN CLEAVE','#8B0000');playAnim(hTP[2].r,hTP[2].c,'cleave-anim');log('Your Malevolent Shrine: Heian — Third Cut!');},1280);
        }
        return;
    }

    // Domain Clash timer — must run before any early-return to handle IV vs Heian and similar
    if(clash&&state.domainClashTimer>0){
        state.domainClashTimer--;
        if(state.domainClashTimer<=0){endDomainClash();return;}
    }
    if(!state.domain&&!state.mahitoDomainActive&&!state.playerSEPActive) return;

    // Sukuna Shadow's domain (enemy)
    if(state.domain?.type==='malevolent-shadow'){
        state.domain.timer=(state.domain.timer||0)+1;
        if(state.domain.timer>=3&&!clash){
            state.domain.timer=0;
            let wPieces=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                // Mahoraga is immune to Shrine strikes — adapts to the domain instead
                if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) wPieces.push({r,c,val:PIECE_VALS[p.type]});
            }
            wPieces.sort((a,b)=>b.val-a.val);
            const targets=wPieces.slice(0,2);
            targets.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByE.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
            setTimeout(()=>{if(targets[0]){showTitle('CLEAVE','#FFD700');playAnim(targets[0].r,targets[0].c,'cleave-anim');log('Malevolent Shrine: Cleave!');}},80);
            if(targets[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(targets[1].r,targets[1].c,'dismantle-anim');log('Malevolent Shrine: Dismantle!');},680);
        }
        return;
    }

    // Player's Malevolent Shrine (targets enemy)
    if(state.domain?.type==='malevolent-player'){
        state.domain.timer=(state.domain.timer||0)+1;
        if(state.domain.timer>=3&&!clash){
            state.domain.timer=0;
            let bPieces=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                // Mahoraga is immune to Shrine strikes — adapts to the domain instead
                if(p?.color==='B'&&p.type!=='K'&&!p.isAdaptive&&!p.isMahoragaKing) bPieces.push({r,c,val:PIECE_VALS[p.type]});
            }
            bPieces.sort((a,b)=>b.val-a.val);
            const targets=bPieces.slice(0,2);
            targets.forEach(t=>{if(state.board[t.r]?.[t.c]){state.capturedByW.push(state.board[t.r][t.c].type);state.board[t.r][t.c]=null;}});
            setTimeout(()=>{if(targets[0]){showTitle('CLEAVE','#8B0000');playAnim(targets[0].r,targets[0].c,'cleave-anim');log('Your Malevolent Shrine: Cleave!');}},80);
            if(targets[1]) setTimeout(()=>{showTitle('DISMANTLE','#FF4500');playAnim(targets[1].r,targets[1].c,'dismantle-anim');log('Your Malevolent Shrine: Dismantle!');},680);
        }
        // Check if all enemy pieces are gone (relevant for Sukuna Shadow / Gojo Strongest / Heian)
        if(state.opp==='Ryomen Sukuna (Shadow)'||state.opp==='Gojo Satoru (Strongest)'||state.opp==='Ryomen Sukuna Heian'){
            let bCount=0;
            for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.color==='B') bCount++;
            if(bCount===0){endGame('EXORCISED',state.opp);return;}
        }
        return;
    }

    // TCMP collapse checks
    if(state.naoyaTCMPActive){
        if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
            deactivateTCMP();log('Time Cell Moon Palace shattered by the stronger domain!');
        }
    }
    if(state.playerTCMPActive){
        if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive){
            deactivatePlayerTCMP();log('Time Cell Moon Palace collapses...');
        }
    }
    // SEP collapse vs stronger domains
    if(state.mahitoDomainActive){
        if(state.domain?.type?.includes('malevolent')||state.infiniteVoidActive||state.gojoVoidActive){
            deactivateSEP();log('Self Embodiment of Perfection shattered by the stronger domain!');
        }
    }
    if(state.playerSEPActive){
        if(state.domain?.type?.includes('malevolent')||state.gojoVoidActive||state.infiniteVoidActive){
            deactivatePlayerSEP();log('Self Embodiment of Perfection collapses...');
        }
    }
    // SEP active effect — AI Mahito (fires when AI just moved: turn==='W')
    if(state.mahitoDomainActive&&!isDomainClash()&&state.turn==='W'&&state.opp==='Mahito'){
        state.mahitoDomainTimer++;
        const _sepC=[];
        for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W'&&p.type!=='K'&&p.type!=='P'&&!p.isAdaptive&&!p.isMahoragaKing)_sepC.push({r,c});}
        if(_sepC.length>0){
            const t=_sepC[Math.floor(Math.random()*_sepC.length)];
            log(`★ SELF EMBODIMENT: ${state.board[t.r][t.c].type} twisted into a pawn by Mahito's curse!`);
            state.board[t.r][t.c].type='P';playAnim(t.r,t.c,'sep-anim');
        } else {
            const _sepP=[];
            for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W'&&p.type==='P')_sepP.push({r,c});}
            if(_sepP.length>0){const t=_sepP[Math.floor(Math.random()*_sepP.length)];state.capturedByE.push('P');state.board[t.r][t.c]=null;playAnim(t.r,t.c,'sep-anim');log('Self Embodiment of Perfection: a pawn dissolves into nothing...');}
        }
    }
    // SEP active effect — Player (fires when player just moved: turn==='B')
    if(state.playerSEPActive&&!isDomainClash()&&state.turn==='B'){
        const _sepC=[];
        for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='B'&&p.type!=='K'&&p.type!=='P'&&!p.isAdaptive&&!p.isMahoragaKing)_sepC.push({r,c});}
        if(_sepC.length>0){
            const t=_sepC[Math.floor(Math.random()*_sepC.length)];
            log(`★ SELF EMBODIMENT: enemy ${state.board[t.r][t.c].type} soul twisted — warped into a pawn!`);
            state.board[t.r][t.c].type='P';playAnim(t.r,t.c,'sep-anim');
        } else {
            const _sepP=[];
            for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='B'&&p.type==='P')_sepP.push({r,c});}
            if(_sepP.length>0){const t=_sepP[Math.floor(Math.random()*_sepP.length)];state.capturedByW.push('P');state.board[t.r][t.c]=null;playAnim(t.r,t.c,'sep-anim');log('★ SELF EMBODIMENT: an enemy pawn dissolves into nothing!');}
        }
    }
    // ── Domain Clash management ──
    if(isDomainClash()){
        // First detection this clash: start 20-turn timer
        if(state.domainClashTimer===0){
            state.domainClashTimer=20;
            state.infP=0;state.infE=0;
            state.limitlessImmunityP=0;state.limitlessImmunityE=0;
            state.mahoragaDomainAdaptTimer=0;state.playerMahoragaDomainAdaptTimer=0;
            showTitle('DOMAIN CLASH!','#ff00ff');
            log('⚔ Domain Clash! Both domains cancelled — neither side may use skills for 20 turns. Check the enemy king to end the clash early!');
        }
        // Apply correct clash CSS
        const gs=document.getElementById('game-screen');
        if(gs){
            const pTML=state.playerTMLActive,yTML=state.trueMutualLoveActive;
            const hasTML=pTML||yTML;
            const hasTCMP=state.naoyaTCMPActive||state.playerTCMPActive;
            const hasSEP=state.mahitoDomainActive||state.playerSEPActive;
            const hasVoid=state.infiniteVoidActive||state.gojoVoidActive;
            const hasMalevolent=state.domain?.type?.includes('malevolent')||state.domain2?.type?.includes('malevolent');
            gs.classList.remove('domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tcmp-shrine-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash');
            if(hasVoid&&hasMalevolent)                               gs.classList.add('domain-clash');
            else if(pTML&&yTML)                                      gs.classList.add('tml-tml-clash');
            else if(state.playerSEPActive&&state.mahitoDomainActive) gs.classList.add('sep-sep-clash');
            else if(state.playerTCMPActive&&state.naoyaTCMPActive)   gs.classList.add('tcmp-tcmp-clash');
            else if(hasTML&&hasTCMP)                                 gs.classList.add('tml-tcmp-clash');
            else if(hasTML&&hasSEP)                                  gs.classList.add('tml-sep-clash');
            else if(hasTCMP&&hasSEP)                                 gs.classList.add('tcmp-sep-clash');
        }
    } else {
        document.getElementById('game-screen')?.classList.remove('domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tcmp-shrine-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash');

        // ── Mahoraga domain adaptation (non-clash only) ──
        // AI Mahoraga adapts to player's active domain after 3 turns
        const hasPlayerDomain=state.infiniteVoidActive||state.playerTMLActive||state.playerSEPActive||state.playerTCMPActive||(state.domain?.type==='malevolent-player');
        const aiMahoragaSquare=(()=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='B')return{r,c};}return null;})();
        if(aiMahoragaSquare&&hasPlayerDomain&&!state.over){
            state.mahoragaDomainAdaptTimer=(state.mahoragaDomainAdaptTimer||0)+1;
            playAnim(aiMahoragaSquare.r,aiMahoragaSquare.c,'mahoraga-wheel-anim');
            if(state.mahoragaDomainAdaptTimer>=3){
                state.mahoragaDomainAdaptTimer=0;
                showTitle('MAHORAGA ADAPTS','#FFD700');
                log('☸ Mahoraga has adapted to the domain! The enemy\'s domain collapses!');
                // Collapse player domains
                deactivateVoidDomain();
                if(state.domain?.type==='malevolent-player') deactivateSukunaDomain();
                state.playerTMLActive=false;
                if(state.domain?.owner==='W') state.domain=null;
                document.getElementById('game-screen')?.classList.remove('tml-domain','sep-domain','tcmp-domain','infinite-void-domain');
                document.getElementById('tml-veil').style.display='none';
                state.playerSEPActive=false;state.playerTCMPActive=false;
            }
        } else if(!aiMahoragaSquare||!hasPlayerDomain){
            state.mahoragaDomainAdaptTimer=0;
        }

        // Player Mahoraga adapts to AI's active domain after 3 turns
        const hasEnemyDomain=state.gojoVoidActive||state.trueMutualLoveActive||state.mahitoDomainActive||state.naoyaTCMPActive||(state.domain?.type?.includes('malevolent-shadow'))||(state.domain2?.type?.includes('malevolent'));
        const playerMahoragaSquare=(()=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='W')return{r,c};}return null;})();
        if(playerMahoragaSquare&&hasEnemyDomain&&!state.over){
            state.playerMahoragaDomainAdaptTimer=(state.playerMahoragaDomainAdaptTimer||0)+1;
            playAnim(playerMahoragaSquare.r,playerMahoragaSquare.c,'mahoraga-wheel-anim');
            if(state.playerMahoragaDomainAdaptTimer>=3){
                state.playerMahoragaDomainAdaptTimer=0;
                showTitle('MAHORAGA ADAPTS','#FFD700');
                log('☸ Mahoraga has adapted to the enemy domain! It collapses!');
                // Collapse AI domains
                deactivateGojoVoidDomain();
                deactivateSukunaDomain();
                deactivateYutaDomain();
                state.trueMutualLoveActive=false;state.mahitoDomainActive=false;state.mahitoDomainTimer=0;
                state.naoyaTCMPActive=false;state.domain=null;state.domain2=null;
                document.getElementById('game-screen')?.classList.remove('sep-domain','tcmp-domain','tml-domain','infinite-void-domain');
            }
        } else if(!playerMahoragaSquare||!hasEnemyDomain){
            state.playerMahoragaDomainAdaptTimer=0;
        }
    }
}

// ================================================================
// TURN
// ================================================================
function endTurn(){
    state.turn=state.turn==='W'?'B':'W';
    // Infinity duration: expires at the end of the turn it was supposed to protect
    // infE (AI's Infinity) expires when AI's turn starts (turn just became 'B')
    if(state.turn==='B'&&state.infE>0) state.infE=0;
    // infP (player's Infinity) expires when player's turn starts (turn just became 'W')
    if(state.turn==='W'&&state.infP>0) state.infP=0;
    // Append "+" to last notation if move puts opponent in check
    if(state.moveHistory.length&&isInCheck(state.turn,state.board)){
        state.moveHistory[state.moveHistory.length-1]+='+';
    }
    if(state.turn==='B'&&state.opp!=='Ryomen Sukuna (Shadow)'&&isInCheck('B',state.board)){
        showTitle('CHECK!','#00d2ff');
    }

    // ── Domain Clash check-win: checking opponent's king collapses their domain ──
    if(isDomainClash()&&state.domainClashTimer>0&&isInCheck(state.turn,state.board)){
        const checker=state.turn==='B'?'W':'B'; // side that just moved (caused check)
        const loser=state.turn; // side in check (their domain collapses)
        showTitle('DOMAIN CLASH RESOLVED!','#ff00ff');
        log(`⚔ Domain Clash resolved! ${loser==='B'?'Enemy':'Your'} domain shattered by check — ${checker==='B'?'enemy':'your'} domain takes control!`);
        state.domainClashTimer=0;
        const gs=document.getElementById('game-screen');
        gs.classList.remove('domain-clash','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash');
        if(loser==='B'){
            // Collapse AI's domain(s); preserve winner (player) domain state & CSS
            const pHadVoid=state.infiniteVoidActive;
            const pHadMalevolent=state.domain?.type==='malevolent-player';
            const pHadTML=state.playerTMLActive;
            const pHadSEP=state.playerSEPActive;
            const pHadTCMP=state.playerTCMPActive;
            deactivateGojoVoidDomain();
            if(state.domain?.type?.includes('malevolent-shadow')||state.domain2?.type?.includes('malevolent')) deactivateSukunaDomain();
            deactivateYutaDomain();
            state.trueMutualLoveActive=false;state.mahitoDomainActive=false;state.mahitoDomainTimer=0;
            state.naoyaTCMPActive=false;
            if(state.domain?.owner==='B') state.domain=null;
            state.domain2=null;
            // Re-apply winner (player) domain CSS
            if(pHadVoid) activateVoidDomain();
            if(pHadMalevolent) activateSukunaDomain();
            if(pHadTML){gs.classList.add('tml-domain');document.getElementById('tml-veil').style.display='block';log('✦ Your True Mutual Love domain takes control!');}
            if(pHadSEP){gs.classList.add('sep-domain');document.getElementById('sep-veil').style.display='block';log('✦ Your Self Embodiment of Perfection domain takes control!');}
            if(pHadTCMP){gs.classList.add('tcmp-domain');document.getElementById('tcmp-veil').style.display='block';log('✦ Your Time Cell Moon Palace domain takes control!');}
        } else {
            // Collapse player's domain(s); preserve winner (AI) domain state & CSS
            const aiHadVoid=state.gojoVoidActive;
            const aiHadMalevolent=state.domain?.type==='malevolent-shadow'||state.domain2?.type?.includes('malevolent');
            const aiHadTML=state.trueMutualLoveActive;
            const aiHadSEP=state.mahitoDomainActive;
            const aiHadTCMP=state.naoyaTCMPActive;
            deactivateVoidDomain();
            if(state.domain?.type==='malevolent-player') deactivateSukunaDomain();
            state.playerTMLActive=false;document.getElementById('tml-veil').style.display='none';
            state.playerSEPActive=false;state.playerTCMPActive=false;
            state.infiniteVoidActive=false;state.infiniteVoidTimer=0;
            if(state.domain?.owner==='W') state.domain=null;
            gs.classList.remove('tml-domain','sep-domain','tcmp-domain','infinite-void-domain');
            // Re-apply winner (AI) domain CSS
            if(aiHadVoid) activateGojoVoidDomain();
            if(aiHadMalevolent) activateSukunaDomain();
            if(aiHadTML){gs.classList.add('tml-domain');document.getElementById('tml-veil').style.display='block';log('✦ Enemy True Mutual Love domain takes control!');}
            if(aiHadSEP){gs.classList.add('sep-domain');document.getElementById('sep-veil').style.display='block';log('✦ Enemy Self Embodiment of Perfection domain takes control!');}
            if(aiHadTCMP){gs.classList.add('tcmp-domain');document.getElementById('tcmp-veil').style.display='block';log('✦ Enemy Time Cell Moon Palace domain takes control!');}
        }
    }

    // HR: re-enable double-move every time it becomes the player's turn
    if(state.turn==='W'&&state.heavenlyRestriction&&!state.over){
        state.projectionActive=true;state.projectionPiece=null;state.projectionMovesLeft=2;
    }
    // Limitless immunity decrement (each full turn cycle)
    if(state.limitlessImmunityP>0) state.limitlessImmunityP--;
    if(state.limitlessImmunityE>0) state.limitlessImmunityE--;

    // Infinite Void (player's): decrement each time AI gets a turn
    if(state.turn==='B'&&state.infiniteVoidActive&&!isDomainClash()){
        state.infiniteVoidTimer--;
        if(state.infiniteVoidTimer<=0) deactivateVoidDomain();
    }
    // Gojo Void (AI's): decrement each time player gets a turn
    if(state.turn==='W'&&state.gojoVoidActive&&!isDomainClash()){
        state.gojoVoidTimer--;
        if(state.gojoVoidTimer<=0) deactivateGojoVoidDomain();
    }
    // Gojo Void instant turn-end: if player has no counter, skip their turn automatically
    if(state.turn==='W'&&state.gojoVoidActive&&!isDomainClash()&&!state.over){
        const hasCounter=state.mahoragaAdaptedLimitless||state.infiniteVoidActive||(state.domain?.type==='malevolent-player');
        if(!hasCounter){
            setTimeout(()=>{if(!state.over&&state.turn==='W'&&state.gojoVoidActive&&!isDomainClash()) endTurn();},600);
        }
    }

    if(state.turn==='W'){
        // Reset per-turn flags
        state.rctUsedThisTurn=false;
        state.vowSacrificeUsedThisTurn=false;
        // Cursed Speech seal decrement (moves-based)
        if(state.cursedSpeechSeal){
            if(state.cursedSpeechSeal.movesLeft!==undefined){
                state.cursedSpeechSeal.movesLeft--;
                if(state.cursedSpeechSeal.movesLeft<=0) state.cursedSpeechSeal=null;
            } else {
                state.cursedSpeechSeal.turnsLeft--;
                if(state.cursedSpeechSeal.turnsLeft<=0) state.cursedSpeechSeal=null;
            }
        }

        // Decrement AI skill cooldowns
        Object.keys(state.aiSkillCooldowns).forEach(k=>{
            if(state.aiSkillCooldowns[k]>0) state.aiSkillCooldowns[k]--;
        });

        // Reset per-turn flags for player
        state.mahoragaPSGrantedThisTurn=false;
        // Projection Sorcery passive drain at start of player turn (disabled during domain clash)
        if(!isDomainClash()){
            const hasProjection=Object.values(prog.eq).some(v=>v==='Projection Sorcery');
            if(hasProjection&&state.ceP>=80){ state.ceP-=80; state.extraMovesThisTurn=1; }
            else { state.extraMovesThisTurn=0; }
            if(state.vow==='velocidad') state.extraMovesThisTurn++;
        } else {
            state.extraMovesThisTurn=0;
        }
        // TCMP: free Projection Sorcery for player
        if(state.playerTCMPActive&&!isDomainClash()) state.extraMovesThisTurn=Math.max(state.extraMovesThisTurn,1);
        // Imaginary Fierce God passive: grants one extra move per player turn
        if(Object.values(prog.eq).includes('Imaginary Fierce God')&&!isDivinaSealed('Imaginary Fierce God')&&!isDomainClash())
            state.extraMovesThisTurn=Math.max(state.extraMovesThisTurn,1);

        // Reversión vow: free RCT every 3 player turns
        if(state.vow==='reversion'){
            state.vowReversionTimer=(state.vowReversionTimer||0)+1;
            if(state.vowReversionTimer>=2){
                state.vowReversionTimer=0;
                const pool=state.capturedByE.slice();
                if(pool.length>0){
                    const type=pool[pool.length-1];
                    state.capturedByE.splice(state.capturedByE.lastIndexOf(type),1);
                    let placed=false;
                    for(let rr=6;rr<8&&!placed;rr++) for(let cc=0;cc<8&&!placed;cc++){
                        if(!state.board[rr][cc]){state.board[rr][cc]={type,color:'W',moved:true};placed=true;}
                    }
                    if(!placed) for(let rr=0;rr<8&&!placed;rr++) for(let cc=0;cc<8&&!placed;cc++){
                        if(!state.board[rr][cc]){state.board[rr][cc]={type,color:'W',moved:true};placed=true;}
                    }
                    showTitle('REVERSION','#e91e63');
                    log(`Reversion: ${type} restored!`);
                }
            }
        }

        if(state.dogCooldown>0) state.dogCooldown--;
    }

    if(state.pendingMahoraga){
        state.pendingMahoraga=false;state.mahoragaActive=true;
        let placed=false;
        for(let r=0;r<2&&!placed;r++) for(let c=0;c<8&&!placed;c++){
            if(!state.board[r][c]){state.board[r][c]={type:'N',color:'B',moved:false,isAdaptive:true};placed=true;}
        }
        showTitle('MAHORAGA','#c0392b');
        log('Ten Shadows: Divine General Mahoraga!');
    }

    state.sel=null;state.moves=[];
    if(state.turn==='B') state.aiTurnCount=(state.aiTurnCount||0)+1;

    // Megumi (Awakened) Mahoraga phase: decrement survival counter
    if(state.megMahoragaPhase&&state.turn==='W'&&!state.over){
        state.megTurnsLeft--;
        log(`☸ Mahoraga turns remaining: ${state.megTurnsLeft}`);
        if(state.megTurnsLeft<=0){
            showTitle('MEGUMI BLEEDS OUT','#4a9eff');
            log('Megumi bleeds out — you survived the Divine General! Victory!');
            endGame('EXORCISED','Megumi (Awakened)');
            return;
        }
    }

    processDomain();render();checkGameOver();
    if(state.turn==='B'&&!state.over) setTimeout(aiCycle,800);
}

// ================================================================
// AI
// ================================================================
function aiCycle(isSecondMove=false){
    if(state.over) return;
    if(state.megRevivalPending) return; // wait for revival animation

    // Infinite Void: AI cannot move (skip turn, decrement timer)
    if(state.infiniteVoidActive&&!isDomainClash()){
        endTurn();return;
    }

    // Domain choice pending: wait for player
    if(state.domainChoicePending) return;

    // Toji second move: aggressive — capture > advance toward enemy > any move (never retreat)
    if(isSecondMove&&state.opp==='Zenin Toji'&&state.tojiLastMoveDest){
        const {r,c}=state.tojiLastMoveDest;
        state.tojiLastMoveDest=null;
        const p=state.board[r][c];
        if(p?.color==='B'){
            const moves=getRawMoves(r,c,state.board);
            if(moves.length){
                // Priority 1: captures (highest value first)
                const captures=moves.filter(mv=>state.board[mv.r][mv.c]?.color==='W');
                if(captures.length){
                    captures.sort((a,b)=>PIECE_VALS[state.board[b.r][b.c].type]-PIECE_VALS[state.board[a.r][a.c].type]);
                    applyMove(r,c,captures[0].r,captures[0].c,captures[0]);
                } else {
                    // Priority 2: forward moves (tr > r for Black, advancing toward row 7)
                    const forward=moves.filter(mv=>mv.r>r);
                    const pool=forward.length?forward:moves;
                    // Pick move closest to enemy King
                    let wKingR=7,wKingC=4;
                    for(let rr=0;rr<8;rr++) for(let cc=0;cc<8;cc++){const pp=state.board[rr][cc];if(pp?.color==='W'&&pp.type==='K'){wKingR=rr;wKingC=cc;}}
                    pool.sort((a,b)=>
                        (Math.abs(a.r-wKingR)+Math.abs(a.c-wKingC))-(Math.abs(b.r-wKingR)+Math.abs(b.c-wKingC))
                    );
                    applyMove(r,c,pool[0].r,pool[0].c,pool[0]);
                }
            }
        }
        endTurn();return;
    }

    // Helper: pick a skill respecting last-skill and cooldowns
    function aiPickSkill(options){
        const available=options.filter(o=>o.ok&&(!state.aiSkillCooldowns[o.name]||state.aiSkillCooldowns[o.name]<=0));
        if(!available.length) return null;
        // Avoid repeating same skill twice in a row unless only option
        const notLast=available.filter(o=>o.name!==state.aiLastSkill);
        const pool=notLast.length?notLast:available;
        // Weighted random
        const totalW=pool.reduce((s,o)=>s+(o.w||1),0);
        let rng=Math.random()*totalW;
        for(const o of pool){rng-=(o.w||1);if(rng<=0) return o.name;}
        return pool[pool.length-1].name;
    }

    // Gojo Sensei: Lapse Blue (priority) / Infinity (stance) / Reversal Red (attack)
    if(state.opp==='Gojo Sensei'&&!isDomainClash()){
        // Lapse Blue: banish player's strongest piece (Rook or better) to enemy back rank
        if(state.ceE>=getTechCost('Lapse Blue',true)&&(!state.aiSkillCooldowns['Lapse Blue']||state.aiSkillCooldowns['Lapse Blue']<=0)){
            let best=null,bestV=0;
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color==='W'&&p.type!=='K'&&PIECE_VALS[p.type]>=bestV){bestV=PIECE_VALS[p.type];best={r,c};}
            }
            if(best&&bestV>=5){
                state.aiLastSkill='Lapse Blue';state.aiSkillCooldowns['Lapse Blue']=4;state._aiNoEndTurn=true;
                executeTech('Lapse Blue',true);
            }
        }
        const picked=aiPickSkill([
            {name:'Infinity',   ok:state.ceE>=getTechCost('Infinity',true)&&state.infE===0, w:1},
            {name:'Reversal Red',ok:state.ceE>=getTechCost('Reversal Red',true), w:2}
        ]);
        if(picked==='Infinity'){state.aiLastSkill='Infinity';state.aiSkillCooldowns['Infinity']=2;triggerSkill('Infinity',true);return;}
        if(picked==='Reversal Red'){
            let targets=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W'&&p.type!=='K'&&hasLOS(r,c,'B')) targets.push({r,c,v:PIECE_VALS[p.type]});}
            if(targets.length){targets.sort((a,b)=>b.v-a.v);const t=targets[0];state.aiLastSkill='Reversal Red';state.aiSkillCooldowns['Reversal Red']=2;showTitle('REVERSAL RED',SKILLS['Reversal Red'].color);state._aiNoEndTurn=true;executeTech('Reversal Red',true,t.r,t.c);}
        }
    }

    // Nobara: Straw Doll then continue to chess move
    if(state.opp==='Nobara Kugisaki'&&!isDomainClash()&&state.ceE>=45&&Math.random()<0.4){
        let targets=[];
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=state.board[r][c];
            if(p?.color==='W'&&p.type!=='P'&&p.type!=='K'&&hasLOS(r,c,'B')) targets.push({r,c});
        }
        if(targets.length>=3){const t=targets[Math.floor(Math.random()*targets.length)];showTitle('Straw Doll',SKILLS['Straw Doll'].color);state._aiNoEndTurn=true;executeTech('Straw Doll',true,t.r,t.c);}
    }

    // Yuji: Divergent Fist — only targets W pawns diagonally reachable by one of Yuji's own pawns
    if(state.opp==='Itadori Yuji'&&!isDomainClash()&&state.ceE>=40&&Math.random()<0.4){
        let targets=[];
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=state.board[r][c];
            if(p?.color==='W'&&p.type==='P'){
                // Valid only if a Black pawn can diagonally capture this square (pawn at r-1,c±1)
                const canReach=(state.board[r-1]?.[c-1]?.color==='B'&&state.board[r-1]?.[c-1]?.type==='P')||
                               (state.board[r-1]?.[c+1]?.color==='B'&&state.board[r-1]?.[c+1]?.type==='P');
                if(canReach) targets.push({r,c});
            }
        }
        if(targets.length>0){
            const t=targets[Math.floor(Math.random()*targets.length)];
            showTitle('Divergent Fist',SKILLS['Divergent Fist'].color);
            state._aiNoEndTurn=true;executeTech('Divergent Fist',true,t.r,t.c);
        }
    }

    // Megumi
    if(state.opp==='Fushiguro Megumi'&&!isDomainClash()&&state.ceE>=35&&state.dogCooldown===0){
        let bCount=0;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.color==='B') bCount++;
        if(bCount<=10){state.dogCooldown=4;showTitle('Divine Dog',SKILLS['Divine Dog'].color);executeTech('Divine Dog',true);return;}
    }

    // ── Megumi (Awakened) Mahoraga phase: aggressive, never blunder ──
    if(state.opp==='Megumi (Awakened)'&&state.megMahoragaPhase){
        // Find Mahoraga King piece
        let mR=-1,mC=-1;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.isMahoragaKing){mR=r;mC=c;break;}if(mR>=0)break;}
        if(mR>=0){
            const allMoves=getLegalMoves(mR,mC);
            // Find which squares are attacked by player
            const attacked=new Set();
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                if(state.board[r][c]?.color==='W'){
                    const wm=getRawMoves(r,c,state.board);
                    wm.forEach(m=>attacked.add(m.r+','+m.c));
                }
            }
            // Safe captures (captures not on attacked squares)
            const safeCaps=allMoves.filter(m=>{
                const t=state.board[m.r][m.c];
                return t?.color==='W'&&t.type!=='K'&&!attacked.has(m.r+','+m.c);
            });
            // Safe moves (not on attacked squares)
            const safeMoves=allMoves.filter(m=>!state.board[m.r][m.c]&&!attacked.has(m.r+','+m.c));
            // Find player king for approach
            let wKR=7,wKC=4;
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.type==='K'&&state.board[r][c]?.color==='W'){wKR=r;wKC=c;}}
            let chosen=null;
            if(safeCaps.length){
                safeCaps.sort((a,b)=>PIECE_VALS[state.board[b.r][b.c].type]-PIECE_VALS[state.board[a.r][a.c].type]);
                chosen=safeCaps[0];
            } else if(safeMoves.length){
                safeMoves.sort((a,b)=>(Math.abs(a.r-wKR)+Math.abs(a.c-wKC))-(Math.abs(b.r-wKR)+Math.abs(b.c-wKC)));
                chosen=safeMoves[0];
            } else if(allMoves.length){
                // If all moves are risky, pick least dangerous capture or any move
                allMoves.sort((a,b)=>{
                    const ta=state.board[a.r][a.c],tb=state.board[b.r][b.c];
                    const va=ta?PIECE_VALS[ta.type]||0:0,vb=tb?PIECE_VALS[tb.type]||0:0;
                    return vb-va;
                });
                chosen=allMoves[0];
            }
            if(chosen) applyMove(mR,mC,chosen.r,chosen.c,chosen);
        }
        endTurn();return;
    }

    // ── The Strongest Sorcerer in History (Heian Sukuna) ──
    if(state.opp==='Ryomen Sukuna Heian'&&!isDomainClash()){
        // PRIORITY 0: RCT every turn it's available
        if(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
            state.aiLastSkill='RCT';
            while(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
                const _prevRCT2=state.capturedByW.length;
                state._aiNoEndTurn=true;executeTech('Reverse Cursed Technique',true);
                if(state.capturedByW.length>=_prevRCT2) break;
            }
        }
        // PRIORITY 1: WCS chant (passive — does not end the turn, fires on stage 4)
        if(state.wcsChantCooldown>0) state.wcsChantCooldown--;
        const WCS_S=['SCALE OF THE DRAGON','RECOIL','TWIN METEORS'];
        if(state.wcsChantStage===0&&state.wcsChantCooldown===0&&state.moveHistory.length>=8){
            state.wcsChantStage=1;
            showWCSTitle(WCS_S[0]);
            log(`World Cutting Slash Chant [1/4]: Scale of the Dragon...`);
        } else if(state.wcsChantStage>0&&state.wcsChantStage<4){
            state.wcsChantStage++;
            if(state.wcsChantStage<4){
                showWCSTitle(WCS_S[state.wcsChantStage-1]);
                log(`World Cutting Slash Chant [${state.wcsChantStage}/4]: ${WCS_S[state.wcsChantStage-1]}...`);
            } else {
                // FIRE WCS
                showWCSTitle('WORLD CUTTING SLASH');
                shakeScreen();impactFlash('rgba(139,0,0,.45)',160);
                state._aiNoEndTurn=false;
                executeTech('World Cutting Slash',true);
                state.wcsChantStage=0;state.wcsChantCooldown=6;
                if(state.turn!=='B'||state.over) return;
                endTurn();return;
            }
        }
        // PRIORITY 2: Domain when turn 4+ or player has domain
        if(!state.heianDomainActive&&!state.domain&&!state.domain2
            &&state.ceE>=getTechCost('Malevolent Shrine: Heian',true)
            &&(!state.aiSkillCooldowns['Malevolent Shrine: Heian']||state.aiSkillCooldowns['Malevolent Shrine: Heian']<=0)
            &&(state.moveHistory.length>=8||state.infiniteVoidActive||state.playerTMLActive||state.playerCSGActive||state.playerSEPActive||state.playerTCMPActive||state.playerHeianDomainActive
            ||state.infP>0||(Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless')))){
            state.aiSkillCooldowns['Malevolent Shrine: Heian']=8;
            state.ceE-=getTechCost('Malevolent Shrine: Heian',true);
            state.heianDomainActive=true;
            const hDomObj={owner:'B',type:'malevolent-heian',timer:0};
            if(state.infiniteVoidActive) state.domain2=hDomObj; else state.domain=hDomObj;
            activateHeianDomain();
            showTitle('MALEVOLENT SHRINE: HEIAN','#8B0000');
            log('Domain Expansion: Malevolent Shrine: Heian! The true King of Curses awakens!');
            if(state.infiniteVoidActive) checkDomainClashVisual();
            const hasVoidEqH=Object.values(prog.eq).includes('Infinite Void');
            if(hasVoidEqH&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive) showDomainCounterChoice();
            endTurn();return;
        }
        // PRIORITY 3: Fuga when domain active and 2+ W pieces in best 5x5
        if(state.heianDomainActive&&state.ceE>=getTechCost('Fuga',true)&&(!state.aiSkillCooldowns['Fuga']||state.aiSkillCooldowns['Fuga']<=0)){
            let fBest=0;
            for(let r=2;r<=5;r++) for(let c=2;c<=5;c++){
                let sc=0;
                for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){const p=state.board[r+dr]?.[c+dc];if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive) sc++;}
                if(sc>fBest) fBest=sc;
            }
            if(fBest>=2){state.aiSkillCooldowns['Fuga']=4;state._aiNoEndTurn=true;executeTech('Fuga',true);}
        }
        // PRIORITY 4: Heian Cleave or Heian Dismantle
        let hDisTarget=null;
        for(let r=0;r<8&&!hDisTarget;r++) for(let c=1;c<7&&!hDisTarget;c++){
            const cp=state.board[r][c];
            if(cp?.color==='W'&&cp.type!=='K'&&!cp.isAdaptive&&!cp.isMahoragaKing){
                let cnt=0;
                for(let dc=-2;dc<=2;dc++){const p=state.board[r][c+dc];if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive) cnt++;}
                if(cnt>=3) hDisTarget={r,c};
            }
        }
        const hPicked=aiPickSkill([
            {name:'Heian Cleave',    ok:state.ceE>=getTechCost('Heian Cleave',true)&&(!state.aiSkillCooldowns['Heian Cleave']||state.aiSkillCooldowns['Heian Cleave']<=0), w:3},
            {name:'Heian Dismantle', ok:!!hDisTarget&&state.ceE>=getTechCost('Heian Dismantle',true)&&(!state.aiSkillCooldowns['Heian Dismantle']||state.aiSkillCooldowns['Heian Dismantle']<=0), w:2}
        ]);
        if(hPicked==='Heian Cleave'){
            state.aiLastSkill='Heian Cleave';state.aiSkillCooldowns['Heian Cleave']=2;state._aiNoEndTurn=true;executeTech('Heian Cleave',true);
        }
        if(hPicked==='Heian Dismantle'&&hDisTarget){
            state.aiLastSkill='Heian Dismantle';state.aiSkillCooldowns['Heian Dismantle']=2;state._aiNoEndTurn=true;executeTech('Heian Dismantle',true,hDisTarget.r,hDisTarget.c);
        }
        // Fall through to chess move
    }

    // ── Megumi (Awakened) normal phase: sacrifice-prone, use Nue and CSG ──
    if(state.opp==='Megumi (Awakened)'&&!state.megMahoragaPhase&&!state.megRevivalUsed){
        // Priority 1: summon Nue if not active and affordable
        if(!state.aiNueActive&&!state.aiNueDestroyed&&state.ceE>=getTechCost('Nue',true)&&(!state.aiSkillCooldowns['Nue']||state.aiSkillCooldowns['Nue']<=0)){
            state.aiSkillCooldowns['Nue']=6;state._aiNoEndTurn=true;executeTech('Nue',true);
        }
        // Priority 2: CSG domain when weakened or when player has domain
        if(!state.csgActive&&state.ceE>=getTechCost('Chimera Shadow Garden',true)&&!isDomainClash()&&
            (!state.aiSkillCooldowns['Chimera Shadow Garden']||state.aiSkillCooldowns['Chimera Shadow Garden']<=0)){
            let bCount=0;for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.color==='B') bCount++;
            if(bCount<=10||state.infiniteVoidActive||state.playerTMLActive||state.playerCSGActive){
                state.aiSkillCooldowns['Chimera Shadow Garden']=12;
                state._aiNoEndTurn=true;executeTech('Chimera Shadow Garden',true);
            }
        }
        // Sacrifice-prone: make aggressive captures even at risk, advance toward player king
        // (fall through to standard AI evaluation below)
    }

    // Naoya: Projection Sorcery (AI always uses it when available, targets most valuable piece)
    // Naoya Phase 2: domain
    if(state.opp==='Naoya Zenin'&&state.naoyaPhase2&&!isDomainClash()){
        state.naoyaPhase2Moves=(state.naoyaPhase2Moves||0)+1;
        // PRIORITY 1: TCMP domain at move 3 or when player uses a domain
        if(!state.naoyaTCMPActive
            &&(state.naoyaPhase2Moves>=3||state.domain||state.infiniteVoidActive||state.trueMutualLoveActive||state.playerTMLActive||state.playerTCMPActive)
            &&state.ceE>=getTechCost('Time Cell Moon Palace',true)
            &&(!state.aiSkillCooldowns['Time Cell Moon Palace']||state.aiSkillCooldowns['Time Cell Moon Palace']<=0)){
            state.aiSkillCooldowns['Time Cell Moon Palace']=12;
            state.ceE-=getTechCost('Time Cell Moon Palace',true);activateTCMP();
            // If TCMP activation opened a domain counter choice, end turn and wait for player
            if(state.domainChoicePending){endTurn();return;}
        }
        // Fall through to Projection Sorcery block below
    }
    if(state.opp==='Naoya Zenin'&&!isDomainClash()&&(state.ceE>=90||state.naoyaTCMPActive)){
        if(!state.naoyaTCMPActive) state.ceE-=90;
        // Find best pair: always fires every turn (bestScore=-Infinity so any pair qualifies)
        // Priority: captures > advancing moves > lateral moves
        let bestPair=null,bestScore=-Infinity;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=state.board[r][c];
            if(p?.color!=='B') continue;
            const _pIsKing=p.type==='K';
            const m1s=getRawMoves(r,c,state.board);
            for(const m1 of m1s){
                const score1=state.board[m1.r][m1.c]?PIECE_VALS[state.board[m1.r][m1.c].type]:0;
                const bCopy=JSON.parse(JSON.stringify(state.board));
                bCopy[m1.r][m1.c]=bCopy[r][c];bCopy[r][c]=null;
                const m2s=getRawMoves(m1.r,m1.c,bCopy);
                for(const m2 of m2s){
                    const t2=bCopy[m2.r][m2.c];
                    if(t2?.type==='K') continue; // cannot capture King on 2nd move
                    if(m2.r===r&&m2.c===c) continue; // no origin-return shuffles
                    const score2=t2?PIECE_VALS[t2.type]:0;
                    // Positional bonus: reward advancing toward enemy (B advances to higher rows)
                    const posBonus=(m2.r-r)*0.1;
                    // King bonus in TCMP: ensures King beats idle pieces
                    const kingBonus=_pIsKing?(state.naoyaTCMPActive?0.5:0):0;
                    // In non-TCMP: King must capture OR advance — no lateral/backward King shuffles
                    if(_pIsKing&&score1+score2===0&&!state.naoyaTCMPActive&&m2.r<=r) continue;
                    const totalScore=score1+score2+posBonus+kingBonus;
                    if(totalScore>bestScore){bestScore=totalScore;bestPair={fr:r,fc:c,m1,m2};}
                }
            }
        }
        if(bestPair){
            // Mahoraga PS adaptation tracking — only if Mahoraga is physically on board
            if(isPlayerMahoragaOnBoard()&&!state.mahoragaAdaptedPS){
                state.playerTechUsageCount['_naoyaPS']=(state.playerTechUsageCount['_naoyaPS']||0)+1;
                if(state.playerTechUsageCount['_naoyaPS']>=2){
                    state.mahoragaAdaptedPS=true;
                    showMahoragaWheel();
                    log('Mahoraga adapts to Projection Sorcery! The Divine General gains extra movement each turn!');
                } else {
                    showMahoragaWheel();
                    log('Mahoraga begins adapting to Projection Sorcery...');
                }
            }
            showTitle('PROJECTION SORCERY','#00e5ff');
            playAnim(bestPair.fr,bestPair.fc,'projection-anim');
            applyMove(bestPair.fr,bestPair.fc,bestPair.m1.r,bestPair.m1.c,bestPair.m1);
            playAnim(bestPair.m1.r,bestPair.m1.c,'projection-anim');
            setTimeout(()=>{
                // Safety: verify piece still at m1 position before second move
                if(state.board[bestPair.m1.r][bestPair.m1.c])
                    applyMove(bestPair.m1.r,bestPair.m1.c,bestPair.m2.r,bestPair.m2.c,bestPair.m2);
            },400);
            setTimeout(()=>endTurn(),500);
            return;
        } else {
            if(!state.naoyaTCMPActive) state.ceE+=90; // refund only if truly no moves at all
        }
    }

    // Gojo Strongest: counter player's Infinite Void
    if(state.opp==='Gojo Satoru (Strongest)'&&state.infiniteVoidActive&&!isDomainClash()&&canEnemyExpandDomain()){
        aiExpandDomain();checkDomainClashVisual();endTurn();return;
    }
    // Gojo Strongest: play maximally aggressively while Infinite Void is active
    if(state.opp==='Gojo Satoru (Strongest)'&&state.gojoVoidActive&&!isDomainClash()){
        // Best available capture (highest value, not King which is illegal)
        let bestCapture=null,bestCapVal=0;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=state.board[r][c];
            if(p?.color!=='B') continue;
            const mvs=getLegalMoves(r,c);
            for(const m of mvs){
                const t=state.board[m.r][m.c];
                if(t?.color==='W'&&t.type!=='K'){
                    const v=t.isAdaptive?18:PIECE_VALS[t.type];
                    if(v>bestCapVal){bestCapVal=v;bestCapture={fr:r,fc:c,m};}
                }
            }
        }
        if(bestCapture){
            applyMove(bestCapture.fr,bestCapture.fc,bestCapture.m.r,bestCapture.m.c,bestCapture.m);
        } else {
            // Advance piece closest to player's king
            let wKr=7,wKc=4;
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(state.board[r][c]?.type==='K'&&state.board[r][c]?.color==='W'){wKr=r;wKc=c;}}
            let bestAdv=null,bestAdvDist=999;
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color!=='B') continue;
                const mvs=getLegalMoves(r,c);
                for(const m of mvs){
                    const dist=Math.abs(m.r-wKr)+Math.abs(m.c-wKc);
                    if(dist<bestAdvDist){bestAdvDist=dist;bestAdv={fr:r,fc:c,m};}
                }
            }
            if(bestAdv) applyMove(bestAdv.fr,bestAdv.fc,bestAdv.m.r,bestAdv.m.c,bestAdv.m);
        }
        endTurn();return;
    }

    // All bots: player TCMP awareness — sacrifice least valuable piece if no domain available
    if(state.playerTCMPActive&&!isDomainClash()&&state.opp!=='Naoya Zenin'){
        const botDomainReady=
            (state.opp==='Ryomen Sukuna (Shadow)'&&state.ceE>=getTechCost('Malevolent Shrine',true)&&!state.domain&&!state.domain2&&(!state.aiSkillCooldowns['Malevolent Shrine']||state.aiSkillCooldowns['Malevolent Shrine']<=0))
            ||(state.opp==='Gojo Satoru (Strongest)'&&state.ceE>=getTechCost('Infinite Void',true)&&!state.gojoVoidActive&&(!state.aiSkillCooldowns['Infinite Void']||state.aiSkillCooldowns['Infinite Void']<=0))
            ||(state.opp==='Okkotsu Yuta'&&state.ceE>=getTechCost('True Mutual Love',true)&&!state.trueMutualLoveActive&&(!state.aiSkillCooldowns['True Mutual Love']||state.aiSkillCooldowns['True Mutual Love']<=0));
        if(!botDomainReady){
            let leastVal=[];
            for(let r=0;r<8;r++)for(let c=0;c<8;c++){
                const p=state.board[r][c];
                if(p?.color==='B'&&p.type!=='K'&&!p.isRika){
                    const ms=getLegalMoves(r,c);
                    if(ms.length)leastVal.push({r,c,val:PIECE_VALS[p.type]||0,ms});
                }
            }
            if(leastVal.length){
                leastVal.sort((a,b)=>a.val-b.val);
                const s=leastVal[0];
                applyMove(s.r,s.c,s.ms[0].r,s.ms[0].c,s.ms[0]);
            }
            endTurn();return;
        }
        // If domain is ready, fall through so domain blocks can activate it
    }

    // Gojo Strongest skill block (shared guard)
    const isGojoAI=state.opp==='Gojo Satoru (Strongest)';
    const gojoGuard=isGojoAI&&!isDomainClash()&&!state.infiniteVoidActive;

    // Gojo MAX: weighted rotation with 2-turn cooldowns
    if(gojoGuard){
        // PRIORITY 0: Hollow Nuke chant — starts at turn 20, fires once per match
        if(!state.aiHollowNukeUsed&&state.moveHistory.length>=40){
            const HN_S=['PHASE','TWILIGHT','EYES OF WISDOM','NINE ROPES','POLARIZED LIGHT','CROW AND DECLARATION','BETWEEN THE FRONT AND BACK','HOLLOW PURPLE'];
            state.hollowNukeChantStage=(state.hollowNukeChantStage||0)+2;
            const hs=state.hollowNukeChantStage;
            showHollowNukeTitle(HN_S[hs-2]);
            log(`Gojo: Hollow Nuke [${hs-1}/8]: ${HN_S[hs-2]}...`);
            setTimeout(()=>{showHollowNukeTitle(HN_S[hs-1]);log(`Gojo: Hollow Nuke [${hs}/8]: ${HN_S[hs-1]}...`);},1600);
            if(hs<8){endTurn();return;} // chanting — still end turn, move done
            // Stage 8: fire
            state.aiHollowNukeUsed=true;state.hollowNukeChantStage=0;
            executeTech('Hollow Nuke',true);
            endTurn();return;
        }
        // PRIORITY: RCT every turn it's available (does not consume the skill turn)
        if(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
            state.aiLastSkill='RCT';
            while(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
                const _prevRCT=state.capturedByW.length;
                state._aiNoEndTurn=true;executeTech('Reverse Cursed Technique',true);
                if(state.capturedByW.length>=_prevRCT) break; // no room to place — stop to avoid infinite loop
            }
        }
        // Priority: domain at move 3 or when player has domain
        if(!state.gojoVoidActive
            &&state.ceE>=getTechCost('Infinite Void',true)
            &&(!state.aiSkillCooldowns['Infinite Void']||state.aiSkillCooldowns['Infinite Void']<=0)
            &&(state.moveHistory.length>=4||state.domain||state.infiniteVoidActive)){
            state.aiLastSkill='Infinite Void';state.aiSkillCooldowns['Infinite Void']=6;
            state.ceE-=getTechCost('Infinite Void',true);
            activateGojoVoidDomain();
            const hasVoidEq=Object.values(prog.eq).includes('Infinite Void');
            const hasMalEq=Object.values(prog.eq).includes('Malevolent Shrine');
            const canC=(hasVoidEq&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive)||
                       (hasMalEq&&state.ceP>=getTechCost('Malevolent Shrine')&&!state.domain);
            if(canC) showDomainCounterChoice();
            endTurn();return;
        }
        // Find best center column for Hollow Purple (columns 1–6)
        let hpBestCol=-1,hpBestVal=0;
        for(let col=1;col<=6;col++){
            let val=0;
            for(let row=0;row<8;row++){
                const p=state.board[row][col];
                if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive) val+=PIECE_VALS[p.type];
            }
            if(val>hpBestVal){hpBestVal=val;hpBestCol=col;}
        }
        const gojoRed_targets=(()=>{let t=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W'&&p.type!=='K'&&hasLOS(r,c,'B')) t.push({r,c,v:PIECE_VALS[p.type]});}return t;})();
        const picked=aiPickSkill([
            {name:'Hollow Purple',  ok:hpBestVal>=3&&state.ceE>=getTechCost('Hollow Purple',true)&&(!state.aiSkillCooldowns['Hollow Purple']||state.aiSkillCooldowns['Hollow Purple']<=0), w:2},
            {name:'Reversal Red',   ok:gojoRed_targets.length>0&&state.ceE>=getTechCost('Reversal Red',true)&&(!state.aiSkillCooldowns['Reversal Red']||state.aiSkillCooldowns['Reversal Red']<=0), w:3},
            {name:'Lapse Blue',     ok:state.ceE>=getTechCost('Lapse Blue',true)&&(!state.aiSkillCooldowns['Lapse Blue']||state.aiSkillCooldowns['Lapse Blue']<=0), w:2}
        ]);
        if(picked==='Hollow Purple'&&hpBestCol>=0){
            state.aiLastSkill='Hollow Purple';state.aiSkillCooldowns['Hollow Purple']=2;
            showTitle('HOLLOW PURPLE','#8b00ff');
            const cols=[hpBestCol];
            log(`Hollow Purple annihilates column ${String.fromCharCode(97+hpBestCol)}!`);
            state.hollowPurpleColsAnim=cols.slice();
            cols.forEach(col=>{
                for(let row=0;row<8;row++){const p=state.board[row][col];if(p?.color==='W'&&p.type!=='K'&&!p.isAdaptive){state.capturedByE.push(p.type);state.board[row][col]=null;}}
            });
            render();setTimeout(()=>{state.hollowPurpleColsAnim=[];render();},1200);
            endTurn();return; // Hollow Purple ends turn
        }
        if(picked==='Reversal Red'&&gojoRed_targets.length){
            gojoRed_targets.sort((a,b)=>b.v-a.v);const t=gojoRed_targets[0];
            state.aiLastSkill='Reversal Red';state.aiSkillCooldowns['Reversal Red']=2;
            showTitle('REVERSAL RED',SKILLS['Reversal Red'].color);state._aiNoEndTurn=true;executeTech('Reversal Red',true,t.r,t.c);
        }
        if(picked==='Lapse Blue'){
            state.aiLastSkill='Lapse Blue';state.aiSkillCooldowns['Lapse Blue']=2;
            showTitle('LAPSE BLUE',SKILLS['Lapse Blue'].color);executeTech('Lapse Blue',true);return; // Lapse Blue ends turn (controls enemy piece)
        }
    }

    // Okkotsu Yuta AI
    if(state.opp==='Okkotsu Yuta'&&!isDomainClash()){
        state.aiTurnCount=(state.aiTurnCount||0)+1;
        let yutaSkillFired=false;

        // PRIORITY 1: RCT every turn available (does not consume the skill turn)
        if(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
            state.aiLastSkill='RCT';
            while(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
                const _prevRCT=state.capturedByW.length;
                state._aiNoEndTurn=true;executeTech('Reverse Cursed Technique',true);
                if(state.capturedByW.length>=_prevRCT) break; // no room to place — stop to avoid infinite loop
            }
        }
        // PRIORITY 2: Domain at move 3 or when player has domain
        if(!yutaSkillFired&&!state.trueMutualLoveActive
            &&state.ceE>=getTechCost('True Mutual Love',true)
            &&(!state.aiSkillCooldowns['True Mutual Love']||state.aiSkillCooldowns['True Mutual Love']<=0)
            &&(state.moveHistory.length>=4||state.domain||state.infiniteVoidActive)){
            state.aiSkillCooldowns['True Mutual Love']=6;
            state.ceE-=getTechCost('True Mutual Love',true);activateYutaDomain();yutaSkillFired=true;
        }
        // PRIORITY 3: Use copied skill once (from turn 2 on)
        if(!yutaSkillFired&&state.yutaCopiedSkill&&!state.yutaCopiedSkillUsed&&state.aiTurnCount>=2){
            const copiedCost=getTechCost(state.yutaCopiedSkill,true);
            if(state.ceE>=copiedCost){
                state.yutaCopiedSkillUsed=true;
                showTitle('COPY','#a29bfe');log(`Yuta uses copied skill: ${state.yutaCopiedSkill}!`);
                let tgtR=-1,tgtC=-1;
                const cs=state.yutaCopiedSkill;
                if(SKILLS[cs]?.type==='target'||SKILLS[cs]?.type==='instant'){
                    for(let r=0;r<8&&tgtR<0;r++) for(let c=0;c<8&&tgtR<0;c++){
                        const p=state.board[r][c];
                        if(p&&p.color==='W'&&p.type!=='K'&&!p.isAdaptive) {tgtR=r;tgtC=c;}
                    }
                }
                if(tgtR>=0){state._aiNoEndTurn=true;executeTech(cs,true,tgtR,tgtC);yutaSkillFired=true;}
            }
        }
        // PRIORITY 4: Cursed Speech every ~3 turns
        if(!yutaSkillFired&&state.ceE>=getTechCost('Cursed Speech',true)
            &&(!state.aiSkillCooldowns['Cursed Speech']||state.aiSkillCooldowns['Cursed Speech']<=0)){
            state.aiSkillCooldowns['Cursed Speech']=3;
            state._aiNoEndTurn=true;executeTech('Cursed Speech',true);yutaSkillFired=true;
        }
        // Fall through to chess move
    }

    // Sukuna Shadow: weighted rotation — Cleave(w3), Dismantle(w2), Malevolent Shrine(w1,once)
    if(state.opp==='Ryomen Sukuna (Shadow)'&&!isDomainClash()){
        // PRIORITY: RCT every turn it's available (does not consume the skill turn)
        if(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
            state.aiLastSkill='RCT';
            while(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
                const _prevRCT=state.capturedByW.length;
                state._aiNoEndTurn=true;executeTech('Reverse Cursed Technique',true);
                if(state.capturedByW.length>=_prevRCT) break; // no room to place — stop to avoid infinite loop
            }
        }
        // Priority: domain at move 3 or when player has domain
        if(!state.domain&&!state.domain2
            &&state.ceE>=getTechCost('Malevolent Shrine',true)
            &&(!state.aiSkillCooldowns['Malevolent Shrine']||state.aiSkillCooldowns['Malevolent Shrine']<=0)
            &&(state.moveHistory.length>=4||state.domain||state.infiniteVoidActive)){
            state.aiSkillCooldowns['Malevolent Shrine']=6;state.aiLastSkill='Malevolent Shrine';
            state.ceE-=getTechCost('Malevolent Shrine',true);
            const domObj={owner:'B',type:'malevolent-shadow',timer:0};
            if(state.infiniteVoidActive) state.domain2=domObj; else state.domain=domObj;
            activateSukunaDomain();showTitle('MALEVOLENT SHRINE','#FFD700');
            log('Domain Expansion: Malevolent Shrine! The world is cut...');
            if(state.infiniteVoidActive) checkDomainClashVisual();
            const hasVoidEq=Object.values(prog.eq).includes('Infinite Void');
            const canC=hasVoidEq&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive;
            if(canC) showDomainCounterChoice();
            endTurn();return;
        }
        // Find Dismantle triple — any 3 adjacent W pieces in a row (no LOS needed for AI)
        let dismantleTarget=null;
        for(let r=0;r<8&&!dismantleTarget;r++) for(let c=1;c<7&&!dismantleTarget;c++){
            const cp=state.board[r][c];
            if(cp?.color==='W'&&cp.type!=='K'&&!cp.isAdaptive&&!cp.isMahoragaKing){
                const l=state.board[r][c-1],ri2=state.board[r][c+1];
                if(l?.color==='W'&&l.type!=='K'&&!l.isAdaptive&&!l.isMahoragaKing
                 &&ri2?.color==='W'&&ri2.type!=='K'&&!ri2.isAdaptive&&!ri2.isMahoragaKing){
                    dismantleTarget={r,c};
                }
            }
        }
        const picked=aiPickSkill([
            {name:'Cleave',         ok:state.ceE>=getTechCost('Cleave',true)&&(!state.aiSkillCooldowns['Cleave']||state.aiSkillCooldowns['Cleave']<=0), w:3},
            {name:'Dismantle',      ok:!!dismantleTarget&&state.ceE>=getTechCost('Dismantle',true)&&(!state.aiSkillCooldowns['Dismantle']||state.aiSkillCooldowns['Dismantle']<=0), w:2},
            {name:'Malevolent Shrine', ok:state.ceE>=getTechCost('Malevolent Shrine',true)&&!state.domain&&!state.domain2&&(!state.aiSkillCooldowns['Malevolent Shrine']||state.aiSkillCooldowns['Malevolent Shrine']<=0), w:1}
        ]);
        if(picked==='Cleave'){
            let cleavable=[];
            for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='W'&&p.type!=='K') cleavable.push({r,c});}
            if(cleavable.length){cleavable.sort((a,b)=>PIECE_VALS[state.board[b.r][b.c].type]-PIECE_VALS[state.board[a.r][a.c].type]);const t=cleavable[0];state.aiLastSkill='Cleave';state.aiSkillCooldowns['Cleave']=2;state._aiNoEndTurn=true;executeTech('Cleave',true,t.r,t.c);}
        }
        if(picked==='Dismantle'&&dismantleTarget){
            state.aiLastSkill='Dismantle';state.aiSkillCooldowns['Dismantle']=2;state._aiNoEndTurn=true;executeTech('Dismantle',true,dismantleTarget.r,dismantleTarget.c);
        }
        if(picked==='Malevolent Shrine'){
            state.aiSkillCooldowns['Malevolent Shrine']=6;state.aiLastSkill='Malevolent Shrine';
            state.ceE-=getTechCost('Malevolent Shrine',true);
            const domObj={owner:'B',type:'malevolent-shadow',timer:0};
            if(state.infiniteVoidActive) state.domain2=domObj; else state.domain=domObj;
            activateSukunaDomain();
            showTitle('MALEVOLENT SHRINE','#FFD700');
            log('Domain Expansion: Malevolent Shrine! The world is cut...');
            if(state.infiniteVoidActive) checkDomainClashVisual();
            const hasVoidEquipped=Object.values(prog.eq).includes('Infinite Void');
            const canCounter=hasVoidEquipped&&state.ceP>=getTechCost('Infinite Void')&&!state.infiniteVoidActive;
            if(canCounter) showDomainCounterChoice();
            endTurn();return;
        }
    }

    // Chess move
    // Guard: a skill may have internally called endTurn() (e.g. Mahoraga adaptation),
    // which already flipped the turn to W. Don't make a chess move in that case.
    if(state.turn!=='B'||state.over) return;
    // Fast existence check — getRawMoves only (avoids the expensive isInCheck cascade)
    let hasAnyMove=false;
    for(let r=0;r<8&&!hasAnyMove;r++) for(let c=0;c<8&&!hasAnyMove;c++)
        if(state.board[r][c]?.color==='B'&&getRawMoves(r,c,state.board).length) hasAnyMove=true;
    if(!hasAnyMove){endTurn();return;}

    // Depth capped at 3 — HR King + player Mahoraga each generate ~20 extra moves,
    // making depth-4 exponentially slow via JSON-clone board copies.
    let sukunaPieceCount=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.color==='B') sukunaPieceCount++;
    const depth=(state.opp==='Ryomen Sukuna (Shadow)'||state.opp==='Ryomen Sukuna Heian')?(sukunaPieceCount>4?3:2):3;

    // Threat detection: if a B piece is attacked (W piece can capture it next turn), prefer rescuing it
    let rescueMove=null;
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
        const p=state.board[r][c];
        if(p?.color==='B'&&p.type!=='K'){
            const threatened=getRawMoves(r,c,state.board).some(m=>{
                // rough check: any W piece can reach (r,c)?
                for(let wr=0;wr<8;wr++)for(let wc=0;wc<8;wc++){
                    if(state.board[wr][wc]?.color==='W'){
                        const wm=getRawMoves(wr,wc,state.board);
                        if(wm.some(wv=>wv.r===r&&wv.c===c)) return true;
                    }
                }
                return false;
            });
            if(threatened){
                const escapes=getRawMoves(r,c,state.board).filter(m=>!state.board[m.r][m.c]);
                if(escapes.length) rescueMove={fr:r,fc:c,tr:escapes[0].r,tc:escapes[0].c,meta:escapes[0]};
                break; // rescue most valuable threatened piece (first found is fine)
            }
        }
    }

    // ── Mahito AI ──
    if(state.opp==='Mahito'&&!isDomainClash()){
        // PRIORITY 1: RCT
        if(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
            state.aiLastSkill='RCT';
            while(state.capturedByW.length>0&&state.ceE>=getTechCost('Reverse Cursed Technique',true)){
                const _prevRCT=state.capturedByW.length;
                state._aiNoEndTurn=true;executeTech('Reverse Cursed Technique',true);
                if(state.capturedByW.length>=_prevRCT) break; // no room to place — stop to avoid infinite loop
            }
        }
        // PRIORITY 2: Idle Transfiguration — promote lowest-value non-queen B piece
        if(state.ceE>=getTechCost('Idle Transfiguration',true)&&(!state.aiSkillCooldowns['Idle Transfiguration']||state.aiSkillCooldowns['Idle Transfiguration']<=0)){
            let _itT=null,_itB=Infinity;
            for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(p?.color==='B'&&p.type!=='K'&&p.type!=='Q'){const v=PIECE_VALS[p.type];if(v<_itB){_itB=v;_itT={r,c};}}}
            if(_itT){
                state.aiLastSkill='Idle Transfiguration';state.aiSkillCooldowns['Idle Transfiguration']=3;
                state._aiNoEndTurn=true;executeTech('Idle Transfiguration',true,_itT.r,_itT.c);
            }
        }
        // PRIORITY 3: SEP domain at move 6+ or when player has a domain
        if(!state.mahitoDomainActive&&state.ceE>=getTechCost('Self Embodiment of Perfection',true)&&(!state.aiSkillCooldowns['Self Embodiment of Perfection']||state.aiSkillCooldowns['Self Embodiment of Perfection']<=0)&&(state.moveHistory.length>=4||state.domain||state.infiniteVoidActive||state.trueMutualLoveActive||state.playerTMLActive||state.playerSEPActive)){
            state.aiSkillCooldowns['Self Embodiment of Perfection']=8;
            state.ceE-=getTechCost('Self Embodiment of Perfection',true);
            activateSEP(false);
            if(state.domainChoicePending){endTurn();return;}
        }
        // Fall through to regular chess move
    }

    const best=minimax(state.board,depth,-Infinity,Infinity,true);

    // Opening variety: first 6 moves, pick randomly from top-3 equal/near-equal moves
    let chosenMove=best.move;
    if(state.moveHistory.length<6&&best.move){
        let allMoves=[];
        for(let r=0;r<8;r++)for(let c=0;c<8;c++)
            if(state.board[r][c]?.color==='B')
                getRawMoves(r,c,state.board).forEach(m=>allMoves.push({fr:r,fc:c,tr:m.r,tc:m.c,meta:m}));
        allMoves.sort((a,b)=>{
            const ba=JSON.parse(JSON.stringify(state.board));ba[a.tr][a.tc]=ba[a.fr][a.fc];ba[a.fr][a.fc]=null;
            const bb=JSON.parse(JSON.stringify(state.board));bb[b.tr][b.tc]=bb[b.fr][b.fc];bb[b.fr][b.fc]=null;
            return evaluate(bb)-evaluate(ba);
        });
        const topMoves=allMoves.slice(0,Math.min(4,allMoves.length));
        // Weight: best=50%, 2nd=30%, 3rd=15%, 4th=5%
        const weights=[50,30,15,5],total=weights.slice(0,topMoves.length).reduce((a,b)=>a+b,0);
        let rnd=Math.random()*total;
        for(let i=0;i<topMoves.length;i++){rnd-=weights[i];if(rnd<=0){chosenMove=topMoves[i];break;}}
    }

    // Under attack: prefer rescue if we're not already capturing something valuable
    if(rescueMove&&best.move&&(state.board[best.move.tr][best.move.tc]===null)){
        chosenMove=rescueMove;
    }

    if(chosenMove){
        const captured=state.board[chosenMove.tr][chosenMove.tc]!==null;
        const blocked=applyMove(chosenMove.fr,chosenMove.fc,chosenMove.tr,chosenMove.tc,chosenMove.meta);
    }
    // Imaginary Fierce God: Heian Sukuna gets a second chess move each turn
    if(state.opp==='Ryomen Sukuna Heian'&&!state.over&&state.turn==='B'&&chosenMove){
        const best2=minimax(state.board,Math.min(depth,2),-Infinity,Infinity,true);
        if(best2.move&&state.board[best2.move.tr][best2.move.tc]?.type!=='K'){
            applyMove(best2.move.fr,best2.move.fc,best2.move.tr,best2.move.tc,best2.move.meta);
        }
    }
    // Toji gets a second move — same piece must move again
    if(state.opp==='Zenin Toji'&&!isSecondMove&&!state.over&&chosenMove){
        state.tojiLastMoveDest={r:chosenMove.tr,c:chosenMove.tc};
        render();
        setTimeout(()=>aiCycle(true),500);
        return;
    }
    // Sukuna Mahoraga adapted to PS: Mahoraga piece gets an extra move
    if(state.opp==='Ryomen Sukuna (Shadow)'&&state.mahoragaAdaptedPS&&state.mahoragaActive&&isMahoragaOnBoard()&&!state.over){
        let mR=-1,mC=-1;
        for(let r=0;r<8&&mR<0;r++) for(let c=0;c<8&&mR<0;c++){
            if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='B'){mR=r;mC=c;}
        }
        if(mR>=0){
            const ms=getRawMoves(mR,mC,state.board);
            if(ms.length){
                ms.sort((a,b)=>(state.board[b.r][b.c]?PIECE_VALS[state.board[b.r][b.c].type]:0)-(state.board[a.r][a.c]?PIECE_VALS[state.board[a.r][a.c].type]:0));
                applyMove(mR,mC,ms[0].r,ms[0].c,ms[0]);
                log('Mahoraga (adapted PS): extra move!');
            }
        }
    }
    endTurn();
}

function minimax(board,depth,alpha,beta,isMax){
    if(depth===0) return {score:evaluate(board)};
    let moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++)
        if(board[r][c]?.color===(isMax?'B':'W'))
            getRawMoves(r,c,board).forEach(m=>moves.push({fr:r,fc:c,tr:m.r,tc:m.c,meta:m}));
    if(!moves.length) return {score:isMax?-10000:10000};
    // Move ordering: captures first (by victim value), then positional
    // Hard cap at 18 moves to keep tree manageable with HR/Mahoraga extra moves
    moves.sort((a,b)=>(board[b.tr][b.tc]?PIECE_VALS[board[b.tr][b.tc].type]:0)-(board[a.tr][a.tc]?PIECE_VALS[board[a.tr][a.tc].type]:0));
    if(moves.length>18) moves=moves.slice(0,18);
    let bestMove=null;
    if(isMax){
        let maxEval=-Infinity;
        for(const m of moves){
            const bCopy=JSON.parse(JSON.stringify(board));bCopy[m.tr][m.tc]=bCopy[m.fr][m.fc];bCopy[m.fr][m.fc]=null;
            const ev=minimax(bCopy,depth-1,alpha,beta,false).score;
            if(ev>maxEval){maxEval=ev;bestMove=m;}
            alpha=Math.max(alpha,ev);if(beta<=alpha) break;
        }
        return {score:maxEval,move:bestMove};
    } else {
        let minEval=Infinity;
        for(const m of moves){
            const bCopy=JSON.parse(JSON.stringify(board));bCopy[m.tr][m.tc]=bCopy[m.fr][m.fc];bCopy[m.fr][m.fc]=null;
            const ev=minimax(bCopy,depth-1,alpha,beta,true).score;
            if(ev<minEval){minEval=ev;bestMove=m;}
            beta=Math.min(beta,ev);if(beta<=alpha) break;
        }
        return {score:minEval,move:bestMove};
    }
}

// Piece-square table: bonus for controlling centre rows (0=top, 7=bottom from B perspective)
const _PST_B=[[0,0,0,0,0,0,0,0],[0,1,1,2,2,1,1,0],[0,1,2,3,3,2,1,0],[0,2,3,4,4,3,2,0],[0,2,3,4,4,3,2,0],[0,1,2,3,3,2,1,0],[0,1,1,2,2,1,1,0],[0,0,0,0,0,0,0,0]];
function evaluate(board){
    let s=0;
    const moveCount=state.moveHistory?state.moveHistory.length:0;
    const opening=moveCount<12; // opening/early game phase
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        const p=board[r][c];
        if(p){
            const val=p.isAdaptive?18:PIECE_VALS[p.type];
            let bonus=0;
            if(opening){
                // Centre control — use PST from each side's perspective
                const pr=p.color==='B'?r:(7-r);
                bonus+=_PST_B[pr][c]*0.06;
                // Development: minor pieces still on back rank get a penalty
                if((p.type==='N'||p.type==='B')&&((p.color==='B'&&r===0)||(p.color==='W'&&r===7))) bonus-=0.5;
                // Pawn advancement bonus
                if(p.type==='P') bonus+=(p.color==='B'?(7-r):(r))*0.04;
            }
            s+=(p.color==='B'?1:-1)*(val*10+bonus);
        }
    }
    return s;
}

// ================================================================
// GAME OVER
// ================================================================
function checkGameOver(){
    // Toji: win by capturing all non-King pieces
    if(state.opp==='Zenin Toji'){
        let bNonKing=0,wk=false;
        state.board.forEach(row=>row.forEach(p=>{
            if(p?.color==='B'&&p.type!=='K') bNonKing++;
            if(p?.type==='K'&&p?.color==='W') wk=true;
        }));
        if(bNonKing===0){endGame('EXORCISED','Zenin Toji');return;}
        if(!wk){endGame('CURSED',null);return;}
        // Heavenly Restriction: player loses if all their non-King pieces are gone
        if(state.heavenlyRestriction){
            let wNonKing=0;
            state.board.forEach(row=>row.forEach(p=>{if(p?.color==='W'&&p.type!=='K')wNonKing++;}));
            if(wNonKing===0){endGame('CURSED',null);return;}
        }
        if(state.turn==='W'&&getAllLegalMoves('W').length===0){
            endGame(isInCheck('W',state.board)?'CURSED':'STALEMATE',null);
        }
        return;
    }

    if(state.opp==='Ryomen Sukuna (Shadow)'||state.opp==='Gojo Satoru (Strongest)'||state.opp==='Ryomen Sukuna Heian'){
        let bCount=0,wk=false;
        state.board.forEach(row=>row.forEach(p=>{if(p?.color==='B')bCount++;if(p?.type==='K'&&p?.color==='W')wk=true;}));
        if(bCount===0){endGame('EXORCISED',state.opp);return;}
        if(!wk){endGame('CURSED',null);return;}
        if(state.turn==='W'&&getAllLegalMoves('W').length===0){
            endGame(isInCheck('W',state.board)?'CURSED':'STALEMATE',null);
        }
        return;
    }

    // Heavenly Restriction check for other opponents
    if(state.heavenlyRestriction){
        let wNonKing=0;
        state.board.forEach(row=>row.forEach(p=>{if(p?.color==='W'&&p.type!=='K')wNonKing++;}));
        if(wNonKing===0){endGame('CURSED',null);return;}
    }

    let wk=false,bk=false;
    state.board.forEach(row=>row.forEach(p=>{if(p?.type==='K'){if(p.color==='W')wk=true;else bk=true;}}));
    if(!wk){endGame('CURSED',null);return;}
    if(!bk){
        if(state.opp==='Naoya Zenin'&&!state.naoyaRevivalDone){triggerNaoyaRevival();return;}
        // Megumi (Awakened): revival triggers on first king loss
        if(state.opp==='Megumi (Awakened)'&&!state.megRevivalUsed){triggerMegumiRevival();return;}
        // Megumi Mahoraga phase: if Mahoraga King is gone → player wins
        if(state.opp==='Megumi (Awakened)'&&state.megMahoragaPhase){endGame('EXORCISED','Megumi (Awakened)');return;}
        endGame('EXORCISED',state.opp);return;
    }

    const currentMoves=getAllLegalMoves(state.turn);
    if(currentMoves.length===0){
        if(state.turn==='W') endGame(isInCheck('W',state.board)?'CURSED':'STALEMATE',null);
        else {
            if(state.opp==='Naoya Zenin'&&!state.naoyaRevivalDone){triggerNaoyaRevival();return;}
            // Megumi: stalemate/checkmate during normal phase triggers revival
            if(state.opp==='Megumi (Awakened)'&&!state.megRevivalUsed&&!state.megMahoragaPhase){triggerMegumiRevival();return;}
            endGame(isInCheck('B',state.board)?'EXORCISED':'STALEMATE',state.opp);
        }
    }
}

function archiveReturn(){
    if(window._pendingRetry){
        // Re-fight the same opponent after changing skills
        const {name,elo}=window._pendingRetry;
        window._pendingRetry=null;
        pendingBattle={name,elo};
        document.getElementById('vow-target').innerText=name;
        showScreen('binding-vow');
    } else {
        showScreen('home');
    }
}
function retryBattle(){
    const oppName=state.opp,oppElo=state.oppElo;
    document.getElementById('win-modal').style.display='none';
    startBattle(oppName,oppElo); // preserves current state.vow
}
function changeSkillsRetry(){
    // Store the pending opponent so after archive the player can re-fight easily
    window._pendingRetry={name:state.opp,elo:state.oppElo};
    document.getElementById('win-modal').style.display='none';
    showScreen('archive');
}

function endGame(result,winOpp){
    if(state.over) return;
    state.over=true;
    // Clean up all domain/clash CSS so classes don't bleed into the next battle
    document.getElementById('game-screen')?.classList.remove('domain-clash','infinite-void-domain','malevolent-domain','sep-domain','tcmp-domain','tml-domain','tml-tcmp-clash','tml-sep-clash','tcmp-sep-clash','sep-clash','tcmp-shrine-clash','tml-tml-clash','sep-sep-clash','tcmp-tcmp-clash','heian-domain');
    const modal=document.getElementById('win-modal');
    const txt=document.getElementById('win-txt');
    const sub=document.getElementById('win-sub');
    modal.style.display='flex';
    txt.innerText=result;
    txt.className=result==='EXORCISED'?'exorcised':result==='STALEMATE'?'stalemate':'cursed';
    // Show retry buttons only on loss
    document.getElementById('loss-actions').style.display=result==='CURSED'?'flex':'none';

    if(result==='EXORCISED'&&winOpp){
        const allRewards={
            'Nobara Kugisaki':        ['Straw Doll'],
            'Itadori Yuji':           ['Divergent Fist'],
            'Fushiguro Megumi':       ['Divine Dog'],
            'Naoya Zenin':            ['Projection Sorcery','Time Cell Moon Palace'],
            'Mahito':                 ['Idle Transfiguration','Reverse Cursed Technique','Self Embodiment of Perfection'],
            'Zenin Toji':             ['Heavenly Restriction'],
            'Gojo Sensei':            ['Reversal Red','Infinity','Lapse Blue','Six Eyes'],
            'Ryomen Sukuna (Shadow)': ['Cleave','Malevolent Shrine','Mahoraga','Dismantle','Reverse Cursed Technique'],
            'Gojo Satoru (Strongest)': ['Lapse Blue','Six Eyes','Hollow Purple','Hollow Nuke','Limitless','Infinite Void','Reverse Cursed Technique'],
            'Okkotsu Yuta':           ['Cursed Speech','Copy','Reverse Cursed Technique','Rika','True Mutual Love'],
            'Megumi (Awakened)':      ['Mahoraga','Chimera Shadow Garden','Nue'],
            'Ryomen Sukuna Heian': ['World Cutting Slash','Heian Cleave','Heian Dismantle','Imaginary Fierce God','Fuga'],
        };
        const rewards=allRewards[winOpp]||[];
        const newSkills=rewards.filter(r=>!prog.unlocked.includes(r));
        let unlockMsg='All techniques from this opponent already known.';
        if(newSkills.length>0){
            newSkills.forEach(r=>prog.unlocked.push(r));
            unlockMsg=`Techniques unlocked: ${newSkills.join(', ')}!`;
        }
        // CE Pool growth — use the actual ELO the battle was started with
        const oppElo=state.oppElo||0;
        if(oppElo>prog.ceMaxUnlocked){
            prog.ceMaxUnlocked=oppElo;
            prog.highestBot=winOpp;
            unlockMsg+=` ⚡ CE Pool grew to ${oppElo}!`;
        }
        prog.beaten=prog.beaten||{};
        prog.beaten[winOpp]=true;
        saveProg();
        sub.innerText=unlockMsg;
    } else if(result==='STALEMATE'){
        sub.innerText='Draw — no legal moves available';
    }
}

// ================================================================
// RENDER
// ================================================================
function render(){
    const b=document.getElementById('board');
    b.innerHTML='';
    const inCheckW=state.opp!=='Ryomen Sukuna (Shadow)'&&isInCheck('W',state.board);
    const isShadow=state.opp==='Ryomen Sukuna (Shadow)';
    const isNaoya=state.opp==='Naoya Zenin';

    // Domain pre-strike warning: 1 turn before strike
    const domainWarnColor=state.domain?.type==='malevolent-shadow'||state.domain?.type==='malevolent-player'
        ? (state.domain.timer>=2 ? (state.domain.type==='malevolent-shadow'?'W':'B') : null) : null;

    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
        const cell=document.createElement('div');
        cell.className=`cell ${(r+c)%2===0?'white':'black'}`;
        const p=state.board[r][c];

        // Last-move highlight
        if(state.lastMove){
            if(r===state.lastMove.fr&&c===state.lastMove.fc) cell.classList.add('last-move-from');
            if(r===state.lastMove.tr&&c===state.lastMove.tc) cell.classList.add('last-move-to');
        }

        if(state.hazards.some(h=>h.r===r&&h.c===c)) cell.classList.add('hazard-cell');
        if(state.infP&&p?.color==='W') cell.classList.add('inf-w');
        if(state.infE&&p?.color==='B') cell.classList.add('inf-b');
        // Hollow Purple column animation
        if(state.hollowPurpleColsAnim.includes(c)) cell.classList.add('hollow-purple-col');
        // Lapse Blue highlights
        if(state.lapseBluePhase==='select'&&p?.type!=='K') cell.classList.add('lapse-target');
        if(state.lapseBluePhase==='move'){
            if(state.lapseBlueTarget?.r===r&&state.lapseBlueTarget?.c===c) cell.classList.add('lapse-controlled');
            else if(!p) cell.classList.add('can-move');
        }
        if(state.casting==='Idle Transfiguration'&&state.board[r][c]?.color==='W'&&state.board[r][c]?.type!=='K'&&state.board[r][c]?.type!=='Q') cell.classList.add('can-move');
        // Domain pre-strike warning (pieces about to be hit)
        if(domainWarnColor&&p?.color===domainWarnColor&&p.type!=='K')
            cell.classList.add('domain-warn-piece');

        if(p){
            // Limitless glow — applies to ALL pieces including Mahoraga
            // Disabled if Divina vow seals the Ability slots
            const hasLimitlessP=Object.values(prog.eq).some(v=>v==='Limitless')&&!isDivinaSealed('Limitless')&&!isDomainClash();
            const hasSE=Object.values(prog.eq).some(v=>v==='Six Eyes')&&!isDivinaSealed('Six Eyes');
            if(hasLimitlessP&&p.color==='W'&&state.ceP>=(hasSE?25:50)) cell.classList.add('limitless-aura');
            if(state.opp==='Gojo Satoru (Strongest)'&&p.color==='B'&&state.ceE>=25&&!isDomainClash()) cell.classList.add('limitless-aura');

            if(p.isAdaptive){
                // Mahoraga: always Unicode ☸ wheel regardless of piece style setting
                cell.innerHTML='<span class="piece-icon mahoraga-piece" style="font-size:30px;color:#FFD700;text-shadow:0 0 10px #FFD700,0 0 22px rgba(255,200,0,.6),0 1px 0 #000;">☸</span>';
            } else {
                if(p.isRika) cell.classList.add('rika-piece');
                if(isShadow&&p.color==='B') cell.classList.add('sukuna-max');
                if(isNaoya&&p.color==='B'&&state.projectionActive) cell.classList.add('projection-piece');
                if(state.opp==='Zenin Toji'&&p.color==='B'&&p.type==='K') cell.classList.add('toji-king-cell');
                if(gameSettings.pieceStyle==='svg'&&!p.isDivineDog&&!p.isNue){
                    // SVG piece images
                    cell.innerHTML=getPieceImg(p.type,p.color,'');
                    const img=cell.querySelector('.piece-svg');
                    if(img){
                        if(p.isShadow) img.style.opacity='0.55';
                        if(p.isIFG) img.style.filter=p.color==='B'?'drop-shadow(0 0 5px rgba(200,0,0,.9)) saturate(1.6)':'drop-shadow(0 0 5px rgba(200,130,0,.9)) sepia(.5)';
                    }
                } else {
                    // Unicode fallback (or special pieces: DivineDog, Nue)
                    const pieceSpan=document.createElement('span');
                    if(p.isDivineDog){
                        pieceSpan.className=`piece-icon piece-dog piece-${p.color}`;
                        pieceSpan.innerText=SYMBOLS[p.color][p.type];
                    } else if(p.isNue){
                        pieceSpan.className=`piece-icon piece-${p.color}`;
                        pieceSpan.style.cssText='color:#7b2fff!important;text-shadow:0 0 12px rgba(123,47,255,.9),0 0 24px rgba(100,20,220,.5),0 1px 0 #000!important;';
                        pieceSpan.innerText=SYMBOLS[p.color][p.type];
                    } else {
                        pieceSpan.innerText=SYMBOLS[p.color][p.type];
                        pieceSpan.className=`piece-icon piece-${p.color}`;
                    }
                    if(p.isIFG) pieceSpan.style.cssText+=(p.color==='B'?'color:#cc0000!important;text-shadow:0 0 8px rgba(200,0,0,.8),0 1px 0 #000!important;':'color:#cc8800!important;text-shadow:0 0 8px rgba(200,130,0,.8),0 1px 0 #000!important;');
                    if(p.isShadow) pieceSpan.style.opacity='0.55';
                    cell.appendChild(pieceSpan);
                }
            }
            if(p.type==='K'&&p.color==='W'&&inCheckW) cell.classList.add('in-check');
        }

        // Projection Sorcery: highlight selected piece
        if(state.projectionActive&&state.projectionPiece&&state.projectionPiece.r===r&&state.projectionPiece.c===c){
            cell.style.background='rgba(0,229,255,.4)';
        }

        if(state.sel?.r===r&&state.sel?.c===c) cell.classList.add('selected');
        if(state.moves.some(m=>m.r===r&&m.c===c)){
            const dot=document.createElement('div');
            if(p&&p.color!==state.board[state.sel?.r]?.[state.sel?.c]?.color){
                dot.style.cssText='position:absolute;inset:0;border:3px solid rgba(255,80,80,.6);box-sizing:border-box;border-radius:2px;pointer-events:none;';
            } else {
                dot.style.cssText='position:absolute;width:14px;height:14px;background:rgba(0,180,0,.75);border-radius:50%;pointer-events:none;';
            }
            cell.appendChild(dot);
        }
        cell.onclick=()=>handleCellClick(r,c);
        b.appendChild(cell);
    }

    // CE bars
    document.getElementById('ce-p').innerText=`${state.ceP}/${state.ceMaxP}`;
    document.getElementById('ce-e').innerText=`${state.ceE}/${state.ceEMax}`;
    document.getElementById('ce-fill-p').style.width=(state.ceP/state.ceMaxP*100)+'%';
    document.getElementById('ce-fill-e').style.width=(state.ceE/state.ceEMax*100)+'%';

    // Turn bar
    const isYourTurn=state.turn==='W'&&!state.over;
    const turnBar=document.getElementById('turn-bar');
    let turnMsg=state.over?'— BATTLE OVER —':(isYourTurn?'— YOUR TURN —':'— ENEMY <span class="think-dot">●</span><span class="think-dot">●</span><span class="think-dot">●</span> —');
    if(isYourTurn&&state.extraMovesThisTurn>0&&!state.over){
        turnMsg=`— YOUR TURN — <span style="color:#00e5ff;font-size:12px">⟳ ×${state.extraMovesThisTurn+1}</span>`;
    }
    if(state.heavenlyRestriction&&state.projectionActive&&isYourTurn){
        const mv=state.projectionMovesLeft;
        turnMsg=state.projectionPiece?`— PROJECTION: MOVE ${3-mv}/2 —`:'— PROJECTION: SELECT PIECE —';
    }
    if(turnBar){turnBar.innerHTML=turnMsg;turnBar.className=isYourTurn&&!state.over?'turn-bar turn-you':'turn-bar turn-enemy';}

    // Move history bar
    const mb=document.getElementById('move-bar');
    if(mb&&state.moveHistory.length){
        mb.innerHTML=state.moveHistory.slice(-5).map((m,i,a)=>`<span style="color:${i===a.length-1?'#aaa':'#555'}">${m}</span>`).join('<span style="color:#333"> · </span>');
    }
    const badge=document.getElementById('turn-badge');
    if(badge){badge.innerText=isYourTurn?'YOUR TURN':'THINKING...';badge.className=isYourTurn?'turn-badge badge-you':'turn-badge badge-enemy';}

    updateBattleInfo();
    updateCapturedDisplay();
    renderCombatUI();
}

function updateBattleInfo(){
    const el=document.getElementById('battle-info');if(!el) return;
    let rows=[];
    if(state.domain){
        if(state.domain?.type==='malevolent-shadow'){
            const t=3-(state.domain.timer||0);
            rows.push(`<div class="info-row info-danger">☠ MALEVOLENT SHRINE · strikes in ${t} turn${t!==1?'s':''}</div>`);
        } else if(state.domain?.type==='malevolent-player'){
            const t=3-(state.domain.timer||0);
            rows.push(`<div class="info-row info-good">🔥 YOUR SHRINE · strikes in ${t} turn${t!==1?'s':''}</div>`);
        }
    }
    if(state.extraMovesThisTurn>0) rows.push(`<div class="info-row info-good" style="border-color:#00e5ff;color:#00e5ff;">⟳ EXTRA MOVE ×${state.extraMovesThisTurn} remaining this turn</div>`);
    if(state.vow==='reversion'&&state.vowReversionTimer>0) rows.push(`<div class="info-row info-good">💊 REVERSION: RCT in ${3-state.vowReversionTimer} turn${3-state.vowReversionTimer!==1?'s':''}</div>`);
    if(state.mahoragaActive){
        rows.push(`<div class="info-row info-danger">☸ MAHORAGA on the field</div>`);
        if(state.adaptedTech.length>0)
            rows.push(`<div class="info-row info-danger">⚠ Adapted: ${state.adaptedTech.join(', ')}</div>`);
    }
    if(state.heavenlyRestriction) rows.push(`<div class="info-row info-warn" style="border-color:#e0e0e0;color:#e0e0e0;">⚡ HEAVENLY RESTRICTION · King = Queen</div>`);
    if(state.hollowPurplePhase&&state.hollowPurpleFirstCol>=0) rows.push(`<div class="info-row" style="border-color:#8b00ff;color:#cc66ff;">✦ HOLLOW PURPLE: select adjacent column to ${String.fromCharCode(97+state.hollowPurpleFirstCol)}</div>`);
    if(state.infP) rows.push(`<div class="info-row info-good">∞ INFINITY active</div>`);
    if(state.mahoragaAdaptedLimitless) rows.push(`<div class="info-row info-danger" style="border-color:#FFD700;color:#FFD700;">☸ MAHORAGA ADAPTED — All your attacks pierce Limitless/Infinity</div>`);
    else if(state.mahoragaLimitlessBlocks>0) rows.push(`<div class="info-row info-warn">☸ Mahoraga learning Limitless (${state.mahoragaLimitlessBlocks}/3)</div>`);
    if(state.playerMahoragaDomainAdaptTimer>0) rows.push(`<div class="info-row info-good" style="border-color:#FFD700;color:#FFD700;">☸ MAHORAGA ADAPTING TO DOMAIN (${state.playerMahoragaDomainAdaptTimer}/3 turns)</div>`);
    if(state.mahoragaDomainAdaptTimer>0) rows.push(`<div class="info-row info-danger" style="border-color:#FFD700;color:#FF4444;">☸ ENEMY MAHORAGA ADAPTING TO YOUR DOMAIN (${state.mahoragaDomainAdaptTimer}/3 turns)</div>`);
    if(state.projectionActive) rows.push(`<div class="info-row info-good" style="border-color:#00e5ff;color:#00e5ff;">⟳ PROJECTION: ${state.projectionMovesLeft} move${state.projectionMovesLeft!==1?'s':''} left</div>`);
    if(state.infiniteVoidActive) rows.push(`<div class="info-row" style="border-color:#6600cc;color:#a78bfa;">∞ YOUR INFINITE VOID · ${state.infiniteVoidTimer} turn${state.infiniteVoidTimer!==1?'s':''} remaining</div>`);
    if(state.gojoVoidActive&&!isDomainClash()) rows.push(`<div class="info-row" style="border-color:#9900cc;color:#ff88ff;animation:domain-pulse .8s infinite alternate;">🚫 GOJO VOID · SEALED · ${state.gojoVoidTimer} turn${state.gojoVoidTimer!==1?'s':''} remaining</div>`);
    if(isDomainClash()){
        const clashLabel=`⚡ DOMAIN CLASH · ${state.domainClashTimer} turns left · skills sealed`;
        rows.push(`<div class="info-row" style="border-color:#ff00ff;color:#ff88ff;">${clashLabel}</div>`);
    }
    if(state.lapseBluePhase==='select') rows.push(`<div class="info-row info-good" style="border-color:#0066ff;color:#4499ff;">✦ LAPSE BLUE: select any piece to teleport</div>`);
    if(state.lapseBluePhase==='move') rows.push(`<div class="info-row info-good" style="border-color:#0066ff;color:#4499ff;">✦ LAPSE BLUE: click empty square to teleport</div>`);
    if(state.hollowPurplePhase&&state.hollowPurpleFirstCol<0) rows.push(`<div class="info-row" style="border-color:#8b00ff;color:#cc66ff;">✦ HOLLOW PURPLE: click first column</div>`);
    if(state.nuePhase==='place') rows.push(`<div class="info-row info-good" style="border-color:#7b2fff;color:#a06fff;">🦅 NUE: click an empty square to summon</div>`);
    if(state.nueActive) rows.push(`<div class="info-row info-good" style="border-color:#7b2fff;color:#a06fff;">🦅 NUE is on the field</div>`);
    if(state.megMahoragaPhase) rows.push(`<div class="info-row info-danger" style="border-color:#c0392b;color:#ff6666;animation:domain-pulse .8s infinite alternate;">☸ MAHORAGA PHASE · ${state.megTurnsLeft} turn${state.megTurnsLeft!==1?'s':''} until Megumi bleeds out</div>`);
    if(state.csgActive) rows.push(`<div class="info-row info-danger" style="border-color:#4a9eff;color:#4a9eff;">🌑 CHIMERA SHADOW GARDEN · ${10-state.csgTimer} turns remaining</div>`);
    if(state.playerCSGActive) rows.push(`<div class="info-row info-good" style="border-color:#4a9eff;color:#a0d0ff;">🌑 YOUR CHIMERA SHADOW GARDEN · ${10-state.playerCSGTimer} turns remaining</div>`);
    el.innerHTML=rows.join('');
}

function updateCapturedDisplay(){
    const el=document.getElementById('captured-display');if(!el) return;
    const fmt=(arr,color)=>arr.length?arr.map(t=>`<span style="font-size:15px">${SYMBOLS[color][t]}</span>`).join(''):'—';
    el.innerHTML=`<div>Captured: ${fmt(state.capturedByW,'B')}</div><div style="margin-top:2px;">Lost: ${fmt(state.capturedByE,'W')}</div>`;
}

// ================================================================
// UTILS
// ================================================================
let _titleTimer=null;
let _wcsActive=false;
function showTitle(text,color){
    if(_wcsActive) return; // WCS title cannot be overwritten
    const el=document.getElementById('tech-title');
    if(_titleTimer){clearTimeout(_titleTimer);_titleTimer=null;}
    el.innerText=text.toUpperCase();el.style.color=color;el.style.fontSize='';
    el.style.fontFamily="'Cinzel',serif";
    el.style.textShadow=`0 0 20px ${color},0 0 40px ${color},3px 3px 0 #000,-3px -3px 0 #000`;
    el.style.display='block';el.style.animation='none';void el.offsetWidth;
    el.style.animation='tech-slide 2s forwards';
    _titleTimer=setTimeout(()=>{el.style.display='none';_titleTimer=null;},2000);
}
function showWCSTitle(text){
    _wcsActive=true;
    const el=document.getElementById('tech-title');
    if(_titleTimer){clearTimeout(_titleTimer);_titleTimer=null;}
    el.innerText=text.toUpperCase();
    el.style.color='#cc0000';
    el.style.fontSize='88px';
    el.style.textShadow='0 0 30px #cc0000,0 0 60px #8B0000,0 0 10px #FFD700,3px 3px 0 #000,-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000';
    el.style.animation='none';void el.offsetWidth;
    el.style.animation='wcs-pulse 3s forwards';
    el.style.display='block';
    _titleTimer=setTimeout(()=>{el.style.display='none';el.style.fontSize='';_titleTimer=null;_wcsActive=false;},3000);
}
function showHollowNukeTitle(text){
    _wcsActive=true;
    const el=document.getElementById('tech-title');
    if(_titleTimer){clearTimeout(_titleTimer);_titleTimer=null;}
    el.innerText=text.toUpperCase();
    el.style.color='#a855f7';
    el.style.fontSize='72px';
    el.style.textShadow='0 0 30px #8b00ff,0 0 60px #6600cc,0 0 10px #c084fc,3px 3px 0 #000,-3px -3px 0 #000';
    el.style.animation='none';void el.offsetWidth;
    el.style.animation='wcs-pulse 2s forwards';
    el.style.display='block';
    _titleTimer=setTimeout(()=>{el.style.display='none';el.style.fontSize='';_titleTimer=null;_wcsActive=false;},2000);
}

function playAnim(r,c,className){
    const overlay=document.getElementById('anim-overlay');if(!overlay) return;
    // Read actual cell size from the board (adapts to mobile scaling)
    const boardEl=document.getElementById('board');
    const firstCell=boardEl?.querySelector('.cell');
    const cs=firstCell?firstCell.offsetWidth:65;
    const div=document.createElement('div');
    div.style.cssText=`position:absolute;left:${c*cs}px;top:${r*cs}px;width:${cs}px;height:${cs}px;pointer-events:none;`;
    const inner=document.createElement('div');inner.className=className;inner.style.cssText='position:absolute;inset:0;';
    div.appendChild(inner);overlay.appendChild(div);
    setTimeout(()=>div.remove(),1200);
}

function showCEDelta(amount,isPlayer){
    const bar=document.getElementById(isPlayer?'ce-bar-p':'ce-fill-e');if(!bar) return;
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;right:0;top:-4px;color:${amount>0?'#00d2ff':'#ff3e3e'};font-size:11px;font-weight:bold;animation:float-up 1.2s forwards;pointer-events:none;z-index:10;`;
    el.innerText=`${amount>0?'+':''}${amount}`;
    bar.style.position='relative';bar.appendChild(el);
    setTimeout(()=>el.remove(),1200);
}

function log(m){
    const el=document.getElementById('log');
    const color=m.includes('Cleave')||m.includes('Dismantle')||m.includes('Blocked')||m.includes('ADAPTATION')?'#ff7070':
                m.includes('Flash')||m.includes('CE')||m.includes('restored')||m.includes('regen')||m.includes('Projection')?'#70d0ff':'#888';
    el.innerHTML+=`<div style="color:${color};">> ${m}</div>`;
    el.scrollTop=el.scrollHeight;
}

// ================================================================
// HELPERS
// ================================================================
function showTooltip(anchorEl, html, side='top'){
    const t=document.getElementById('g-tooltip');
    t.innerHTML=html; t.style.display='block';
    const rect=anchorEl.getBoundingClientRect();
    const tw=t.offsetWidth||190, th=t.offsetHeight||120;
    if(side==='right'){
        t.style.left=Math.min(rect.right+8, window.innerWidth-tw-8)+'px';
        t.style.top=Math.max(8,Math.min(rect.top, window.innerHeight-th-8))+'px';
    } else {
        t.style.left=Math.max(8,Math.min(rect.left+rect.width/2-tw/2, window.innerWidth-tw-8))+'px';
        t.style.top=Math.max(8,rect.top-th-8)+'px';
    }
}
function hideTooltip(){ document.getElementById('g-tooltip').style.display='none'; }

function isMahoragaOnBoard(){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='B') return true;
    return false;
}
function isPlayerMahoragaOnBoard(){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]?.isAdaptive&&state.board[r][c]?.color==='W') return true;
    return false;
}

function showMahoragaWheel(){
    const el=document.getElementById('mahoraga-wheel-overlay');
    if(!el) return;
    el.style.display='flex';
    const w=document.getElementById('mahoraga-wheel');
    w.style.animation='none';void w.offsetWidth;
    w.style.animation='mahoraga-spin 1.2s ease-in-out forwards';
    setTimeout(()=>{ el.style.display='none'; },1500);
}

function toAlgebraic(fr,fc,tr,tc,piece,wasCapture,isCastle,promotedTo){
    if(isCastle==='kingside') return 'O-O';
    if(isCastle==='queenside') return 'O-O-O';
    const files='abcdefgh';
    const dest=files[tc]+(8-tr);
    const prefix=(piece&&piece.type!=='P')?piece.type:'';
    const cap=wasCapture?'x':'';
    const fromFile=(piece&&piece.type==='P'&&wasCapture)?files[fc]:'';
    const promo=promotedTo?('='+promotedTo):'';
    return fromFile+prefix+cap+dest+promo;
}

function confirmBackToMenu(){
    if(confirm('Abandon this battle and return to menu?')) location.reload();
}

function resetProgress(){
    if(confirm('Reset ALL progress? This will erase all unlocked techniques and your loadout.')){
        localStorage.removeItem('jjc_prog_v7');
        prog={unlocked:['Divergent Fist'],eq:{S1:'Divergent Fist',S2:null,S3:null,S4:null,A1:null,A2:null,Dom:null,RCT:null,Ult:null}};
        alert('Progress reset.');
        showScreen('home');
    }
}

document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!state.over&&state.turn==='W'){
        if(state.projectionActive){
            state.projectionActive=false;state.projectionPiece=null;
            const refund=getTechCost('Projection Sorcery');
            state.ceP=Math.min(state.ceMaxP,state.ceP+refund);
            state.projectionMovesLeft=0;
            log('Projection Sorcery cancelled.');
        }
        state.sel=null;state.moves=[];state.casting=null;
        render();
    }
});

// ================================================================
// INIT
// ================================================================
initBoard();
loadSettings();
updateHomeProgress();

// ================================================================
// INDEX 29 — SETTINGS, SVG PIECES, CINEMATIC, SHAKE, FLASH
// ================================================================

// ── Settings persistence ──
function loadSettings(){
    try{const s=JSON.parse(localStorage.getItem(SETTINGS_KEY));if(s)gameSettings=Object.assign({},gameSettings,s);}catch(e){}
    applySettings();
    updateSettingsUI();
    updateSettingsProgress();
}
function saveSettings(){
    try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(gameSettings));}catch(e){}
}
function applySettings(){
    // Board cell size
    document.documentElement.style.setProperty('--cell-size',gameSettings.boardSize+'px');
    // Anim-overlay size
    const ao=document.getElementById('anim-overlay');
    if(ao){const s=gameSettings.boardSize;ao.style.width=(s*8)+'px';ao.style.height=(s*8)+'px';}
    // Board size slider & label
    const sl=document.getElementById('size-label');
    if(sl) sl.textContent=gameSettings.boardSize+'px';
    const slider=document.getElementById('board-size-slider');
    if(slider) slider.value=gameSettings.boardSize;
    // Board theme (class on #board element)
    const boardEl=document.getElementById('board');
    if(boardEl){
        boardEl.classList.remove('theme-shrine','theme-stone','theme-forest');
        if(gameSettings.boardTheme!=='dark') boardEl.classList.add('theme-'+gameSettings.boardTheme);
    }
    // Global page background (#global-bg overlay)
    const gbg=document.getElementById('global-bg');
    if(gbg){
        if(gameSettings.bgImage){
            gbg.style.backgroundImage='url('+gameSettings.bgImage+')';
            gbg.style.opacity='1';
        } else {
            gbg.style.backgroundImage='none';
            gbg.style.opacity='0';
        }
    }
    // BG preview thumbnail
    const bp=document.getElementById('bg-preview');
    if(bp){
        if(gameSettings.bgImage){bp.style.backgroundImage='url('+gameSettings.bgImage+')';bp.style.display='block';}
        else{bp.style.backgroundImage='';bp.style.display='none';}
    }
}
function updateSettingsUI(){
    // Piece style
    const svgBtn=document.getElementById('ps-svg');
    const uniBtn=document.getElementById('ps-unicode');
    if(svgBtn) svgBtn.classList.toggle('active',gameSettings.pieceStyle==='svg');
    if(uniBtn) uniBtn.classList.toggle('active',gameSettings.pieceStyle==='unicode');
    // Board theme
    ['dark','shrine','stone'].forEach(t=>{
        const btn=document.getElementById('bt-'+t);
        if(btn) btn.classList.toggle('active',gameSettings.boardTheme===t);
    });
    // Bg
    const bgNoneBtn=document.getElementById('bg-none');
    if(bgNoneBtn) bgNoneBtn.classList.toggle('active',!gameSettings.bgImage);
}
function updateSettingsProgress(){
    const el=document.getElementById('settings-progress-info');
    if(!el) return;
    const unlocked=prog.unlocked.length;
    const ceMax=prog.ceMaxUnlocked||300;
    const beaten=Object.keys(prog.beaten||{}).length;
    el.innerHTML=`<span style="color:#FFD700">⚡ ${ceMax}</span> CE pool &nbsp;·&nbsp; <span style="color:#00d2ff">${unlocked}</span> techniques unlocked &nbsp;·&nbsp; <span style="color:#8a2be2">${beaten}</span> opponents defeated`;
}
function showSaveIndicator(){
    const el=document.getElementById('save-indicator');
    if(!el) return;
    el.classList.remove('save-visible');
    void el.offsetWidth;
    el.classList.add('save-visible');
    setTimeout(()=>el.classList.remove('save-visible'),1800);
}
function setPieceSetting(v){
    gameSettings.pieceStyle=v;saveSettings();updateSettingsUI();showSaveIndicator();
    try{render();}catch(e){}
}
function setBoardTheme(v){
    gameSettings.boardTheme=v;
    saveSettings();applySettings();updateSettingsUI();showSaveIndicator();
}
function setBoardSize(v){
    gameSettings.boardSize=parseInt(v);
    saveSettings();applySettings();showSaveIndicator();
    try{render();}catch(e){}
}
function setBgTheme(v){
    if(v==='none'){gameSettings.bgImage=null;}
    saveSettings();applySettings();updateSettingsUI();showSaveIndicator();
}
function triggerBgUpload(){const el=document.getElementById('bg-upload');if(el)el.click();}
function loadBgImage(input){
    const f=input.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=function(e){
        gameSettings.bgImage=e.target.result;
        saveSettings();applySettings();updateSettingsUI();showSaveIndicator();
    };
    r.readAsDataURL(f);
}

// ── SVG piece rendering ──
const SVG_PIECE_NAMES={P:'pawn',R:'rook',N:'knight',B:'bishop',Q:'queen',K:'king'};
function getPieceImg(type,color,extraClass){
    if(gameSettings.pieceStyle==='svg'){
        const prefix=color==='W'?'w':'b';
        const name=SVG_PIECE_NAMES[type]||'pawn';
        const cls='piece-svg piece-'+(color==='W'?'W':'B')+'-svg'+(extraClass?' '+extraClass:'');
        return '<img class="'+cls+'" src="assets/pieces/'+prefix+'-'+name+'.svg" alt="'+color+type+'" draggable="false">';
    }
    return '<span class="piece-icon'+(extraClass?' '+extraClass:'')+'">'+(SYMBOLS[color]||{})[type]+'</span>';
}

// ── Domain Expansion Cinematic ──
let _dcTimer=null;
function showDomainCinematic(name,colorHex,cb){
    const el=document.getElementById('domain-cinematic');
    if(!el){if(cb)cb();return;}
    const crack=document.getElementById('dc-crack');
    const speedlines=document.getElementById('dc-speedlines');
    const nameEl=document.getElementById('dc-name');
    el.style.setProperty('--dc-color',colorHex||'#8b00ff');
    nameEl.textContent=name.toUpperCase();
    [crack,speedlines,nameEl].forEach(x=>{if(x){x.classList.remove('dc-running');void x.offsetWidth;}});
    el.classList.add('dc-active');
    requestAnimationFrame(()=>{[crack,speedlines,nameEl].forEach(x=>{if(x)x.classList.add('dc-running');});});
    if(_dcTimer)clearTimeout(_dcTimer);
    _dcTimer=setTimeout(()=>{
        el.classList.remove('dc-active');
        [crack,speedlines,nameEl].forEach(x=>{if(x)x.classList.remove('dc-running');});
        _dcTimer=null;if(cb)cb();
    },1950);
}

// ── Screen shake ──
function shakeScreen(){
    const gs=document.getElementById('game-screen');if(!gs)return;
    gs.classList.remove('screen-shake');void gs.offsetWidth;
    gs.classList.add('screen-shake');
    setTimeout(()=>gs.classList.remove('screen-shake'),400);
}

// ── Impact flash ──
function impactFlash(color,durationMs){
    color=color||'rgba(255,255,255,.4)';durationMs=durationMs||110;
    const el=document.getElementById('impact-flash');if(!el)return;
    el.style.background=color;el.style.opacity='1';el.style.display='block';
    setTimeout(()=>{el.style.opacity='0';setTimeout(()=>{el.style.display='none';},80);},durationMs);
}

function openPolicy(type){
  const content={
    about:`
      <h2>ABOUT JUJUTSU CHESS</h2>
      <p>Jujutsu Chess: Tactical Ritual is a free fan-made browser game that combines traditional chess with cursed techniques from the Jujutsu Kaisen universe.</p>
      <p>Fight iconic sorcerers and cursed spirits, expand domains, master cursed energy strategy, and unlock new techniques by defeating your opponents.</p>
      <h3>Fan Game Disclaimer</h3>
      <p>This is an independent fan project. It is not affiliated with, endorsed by, or connected to Gege Akutami, Shueisha, MAPPA, or any official Jujutsu Kaisen rights holders. All character names and references belong to their respective owners.</p>
      <h3>Contact</h3>
      <p>For questions, feedback, or bug reports, reach out via the GitHub repository: <a href="https://github.com/giovvann/jujutsu-chess" target="_blank">github.com/giovvann/jujutsu-chess</a></p>
    `,
    privacy:`
      <h2>PRIVACY POLICY</h2>
      <p><em>Last updated: January 2025</em></p>
      <p>Jujutsu Chess ("we", "our", "the site") is committed to protecting your privacy. This policy explains what data is collected when you visit this site.</p>
      <h3>Data We Collect</h3>
      <ul>
        <li><b>Local Storage:</b> Your game progress (unlocked techniques, win counts) is saved in your browser's local storage. This data never leaves your device and is never transmitted to us.</li>
        <li><b>Usage Data:</b> This site uses Google AdSense to display advertisements. Google may collect data such as your IP address, browser type, pages visited, and cookie identifiers to serve personalised ads. See <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a>.</li>
        <li><b>Cookies:</b> Google AdSense uses cookies and similar tracking technologies. You can opt out of personalised advertising via <a href="https://adssettings.google.com" target="_blank">Google Ad Settings</a>.</li>
      </ul>
      <h3>Third-Party Advertising</h3>
      <p>We use Google AdSense (ca-pub-6380089067787404) to display ads. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site. You may opt out of personalised advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank">www.aboutads.info/choices</a>.</p>
      <h3>Your Rights</h3>
      <p>You can clear your local game data at any time using the "Reset Progress" button on the home screen. You can also clear cookies and local storage through your browser settings at any time.</p>
      <h3>Children's Privacy</h3>
      <p>This site is not directed to children under 13. We do not knowingly collect personal information from children.</p>
      <h3>Changes to This Policy</h3>
      <p>We may update this policy from time to time. Changes will be reflected by an updated date at the top of this page.</p>
    `,
    terms:`
      <h2>TERMS OF USE</h2>
      <p><em>Last updated: January 2025</em></p>
      <p>By accessing and using Jujutsu Chess ("the site"), you agree to these terms.</p>
      <h3>Use of the Site</h3>
      <ul>
        <li>This site is provided free of charge for personal, non-commercial entertainment.</li>
        <li>You may not copy, redistribute, or repurpose the game's code or assets without permission.</li>
        <li>You may not use automated tools, bots, or scripts to interact with the site.</li>
      </ul>
      <h3>Intellectual Property</h3>
      <p>The game mechanics, code, and original design are the property of the site creator. Character names, lore references, and related Jujutsu Kaisen content belong to Gege Akutami and Shueisha. This is a fan project and makes no commercial claim over those properties.</p>
      <h3>Advertisements</h3>
      <p>This site displays ads served by Google AdSense. We have no control over the specific ads shown. Ad content is governed by Google's advertising policies.</p>
      <h3>Disclaimer of Warranties</h3>
      <p>The site is provided "as is" without warranty of any kind. We do not guarantee uninterrupted access or error-free operation.</p>
      <h3>Limitation of Liability</h3>
      <p>To the fullest extent permitted by law, the site creator is not liable for any damages arising from your use of the site.</p>
      <h3>Changes</h3>
      <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
    `
  };
  document.getElementById('policy-content').innerHTML=content[type]||'';
  document.getElementById('policy-overlay').style.display='block';
  document.getElementById('policy-modal').style.display='block';
}
function closePolicy(){
  document.getElementById('policy-overlay').style.display='none';
  document.getElementById('policy-modal').style.display='none';
}
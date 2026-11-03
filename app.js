/**
 * 蘭潭國小 考試倒數計時時鐘
 * 具備自訂學年度/學期/考查名稱、校徽更新、考程線上編輯與範例檔下載/上傳更新
 */

// 蘭潭國小 115學年度上學期第一次定期考查 原始預設考程資料
const DEFAULT_LANTAN_SCHEDULE = {
  "11-03": {
    dateName: "11月3日 (星期二) - 英語、國語、自然",
    grades: {
      "1": [
        { session: 1, sessionName: "第一節", subject: "國語", scope: "首冊全部", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" },
        { session: 3, sessionName: "第三節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" }
      ],
      "2": [
        { session: 1, sessionName: "第一節", subject: "國語", scope: "第一課~第六課 (含統整活動一、二)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" },
        { session: 3, sessionName: "第三節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" }
      ],
      "3": [
        { session: 1, sessionName: "第一節", subject: "英語", scope: "Get ready U1 U2 Review1", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "國語", scope: "第一課~第六課 (含語文天地一、二)", type: "exam" },
        { session: 3, sessionName: "第三節", subject: "自然", scope: "第一單元~第二單元", type: "exam" }
      ],
      "4": [
        { session: 1, sessionName: "第一節", subject: "英語", scope: "Starter~Review 1", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "國語", scope: "第一課~第六課 (含閱讀階梯)", type: "exam" },
        { session: 3, sessionName: "第三節", subject: "自然", scope: "第一單元~第二單元", type: "exam" }
      ],
      "5": [
        { session: 1, sessionName: "第一節", subject: "英語", scope: "Starter~Review 1+ Hotel", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "國語", scope: "第一課~第六課 (含學習地圖一、二)", type: "exam" },
        { session: 3, sessionName: "第三節", subject: "自然", scope: "第一單元~第二單元", type: "exam" }
      ],
      "6": [
        { session: 1, sessionName: "第一節", subject: "英語", scope: "Starter-Review 1+ Chiayi Adventures Topic1", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "國語", scope: "第一課~第六課 (含學習地圖一、二)", type: "exam" },
        { session: 3, sessionName: "第三節", subject: "自然", scope: "第一單元~第二單元", type: "exam" }
      ]
    }
  },
  "11-04": {
    dateName: "11月4日 (星期三) - 數學、社會",
    grades: {
      "1": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第五單元 (含學習加油「讚」)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" }
      ],
      "2": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第五單元 (含加油小站一)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "正常上課", scope: "無考查範圍，依日常課表正常上課", type: "regular" }
      ],
      "3": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第五單元 2 (5-2)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "社會", scope: "第一單元~第二單元", type: "exam" }
      ],
      "4": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第五單元 (含加油小站 1、魔數小偵探)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "社會", scope: "第一單元~第三單元", type: "exam" }
      ],
      "5": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第五單元 (含加油小站一)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "社會", scope: "第一單元~第二單元", type: "exam" }
      ],
      "6": [
        { session: 1, sessionName: "第一節", subject: "數學", scope: "第一單元~第四單元 (含加油小站一)", type: "exam" },
        { session: 2, sessionName: "第二節", subject: "社會", scope: "第一單元~第二單元", type: "exam" }
      ]
    }
  }
};

// 全域考程資料庫
let examDatabase = JSON.parse(JSON.stringify(DEFAULT_LANTAN_SCHEDULE));

// 系統核心狀態
const State = {
  schoolName: "嘉義市蘭潭國小",
  date: "11-03",
  grade: "3",
  pipeline: [],
  currentIndex: 0,
  
  // 計時器
  totalDurationSeconds: 40 * 60,
  remainingSeconds: 40 * 60,
  isRunning: false,
  timerInterval: null,
  warned5Min: false,
  
  // 標題設定
  titleConfig: {
    year: 115,
    semester: "上學期",
    examType: "第一次定期考查"
  },

  // 偏好設定
  settings: {
    examMinutes: 40,
    breakMinutes: 10,
    break2Minutes: 20, // 第二次下課（課間大下課）
    autoNext: true,
    soundEnabled: true,
    fiveMinWarning: true,
    soundStyle: "westminster",
    soundVolume: 0.8,
    theme: "theme-default",
    hintText: "🔔 考試時間請維持安靜，作答完畢請務必仔細檢查班級、姓名與座號。",
    customLogoUrl: null
  }
};

// Web Audio API 鐘聲合成引擎
class SoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, startTime, duration, type = 'sine', gainLevel = 1.0) {
    if (!this.audioCtx) this.init();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    const vol = State.settings.soundVolume * gainLevel;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0001), startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playWestminster() {
    this.init();
    const now = this.audioCtx.currentTime + 0.05;
    const E4 = 329.63, Gs4 = 415.30, Fs4 = 369.99, B3 = 246.94;
    const noteDuration = 0.75, gap = 0.65;

    // 第一小節
    this.playTone(Gs4, now + 0 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(E4,  now + 1 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(Fs4, now + 2 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(B3,  now + 3 * gap, noteDuration * 1.5, 'triangle', 1.0);

    // 第二小節
    const offset2 = 4.2 * gap;
    this.playTone(E4,  now + offset2 + 0 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(Fs4, now + offset2 + 1 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(Gs4, now + offset2 + 2 * gap, noteDuration, 'triangle', 0.9);
    this.playTone(E4,  now + offset2 + 3 * gap, noteDuration * 1.8, 'triangle', 1.0);
  }

  playDingDong() {
    this.init();
    const now = this.audioCtx.currentTime + 0.05;
    this.playTone(659.25, now, 0.8, 'sine', 0.9);
    this.playTone(523.25, now + 0.45, 1.2, 'sine', 1.0);
  }

  playAlarm() {
    this.init();
    const now = this.audioCtx.currentTime + 0.05;
    for (let i = 0; i < 4; i++) {
      this.playTone(880, now + i * 0.4, 0.25, 'square', 0.4);
    }
  }

  playFiveMinNotice() {
    this.init();
    const now = this.audioCtx.currentTime + 0.05;
    this.playTone(587.33, now, 0.4, 'sine', 0.6);
    this.playTone(880.00, now + 0.25, 0.7, 'sine', 0.7);
  }

  playEndSound() {
    if (!State.settings.soundEnabled) return;
    switch (State.settings.soundStyle) {
      case "chime":
        this.playDingDong();
        break;
      case "alarm":
        this.playAlarm();
        break;
      case "westminster":
      default:
        this.playWestminster();
        break;
    }
  }
}

const soundEngine = new SoundEngine();

// DOM 元素快取
const el = {
  appContainer: document.getElementById("appContainer"),
  schoolBadgeBtn: document.getElementById("schoolBadgeBtn"),
  schoolLogoImg: document.getElementById("schoolLogoImg"),
  directLogoInput: document.getElementById("directLogoInput"),
  schoolNameContainer: document.getElementById("schoolNameContainer"),
  schoolNameDisplay: document.getElementById("schoolNameDisplay"),
  headerTitleContainer: document.getElementById("headerTitleContainer"),
  titleYearDisplay: document.getElementById("titleYearDisplay"),
  titleSemesterDisplay: document.getElementById("titleSemesterDisplay"),
  titleExamTypeDisplay: document.getElementById("titleExamTypeDisplay"),
  currentTime: document.getElementById("currentTime"),
  
  dateSelect: document.getElementById("dateSelect"),
  gradeSelect: document.getElementById("gradeSelect"),
  sessionSelect: document.getElementById("sessionSelect"),
  autoNextSwitch: document.getElementById("autoNextSwitch"),

  statusBadge: document.getElementById("statusBadge"),
  sessionBadge: document.getElementById("sessionBadge"),
  subjectTitle: document.getElementById("subjectTitle"),
  scopeContent: document.getElementById("scopeContent"),
  progressBar: document.getElementById("progressBar"),
  timerCard: document.querySelector(".timer-card"),

  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  hintMessage: document.getElementById("hintMessage"),

  btnToggleTimer: document.getElementById("btnToggleTimer"),
  btnToggleIcon: document.getElementById("btnToggleIcon"),
  btnToggleText: document.getElementById("btnToggleText"),
  btnResetTimer: document.getElementById("btnResetTimer"),
  btnPrevSession: document.getElementById("btnPrevSession"),
  btnNextSession: document.getElementById("btnNextSession"),
  btnEarlyFinish: document.getElementById("btnEarlyFinish"),

  sessionsTrack: document.getElementById("sessionsTrack"),
  btnFullscreen: document.getElementById("btnFullscreen"),
  btnSettings: document.getElementById("btnSettings"),
  btnDataManage: document.getElementById("btnDataManage"),
  btnHelpGuide: document.getElementById("btnHelpGuide"),

  // 使用說明 Modal
  helpGuideModal: document.getElementById("helpGuideModal"),
  btnCloseHelpModal: document.getElementById("btnCloseHelpModal"),
  btnCloseHelpModalBtn: document.getElementById("btnCloseHelpModalBtn"),

  // 標題編輯 Modal
  titleEditModal: document.getElementById("titleEditModal"),
  btnCloseTitleModal: document.getElementById("btnCloseTitleModal"),
  btnCancelTitleModal: document.getElementById("btnCancelTitleModal"),
  btnSaveTitleModal: document.getElementById("btnSaveTitleModal"),
  editSchoolName: document.getElementById("editSchoolName"),
  modalLogoPreview: document.getElementById("modalLogoPreview"),
  modalLogoUploadInput: document.getElementById("modalLogoUploadInput"),
  btnModalResetLogo: document.getElementById("btnModalResetLogo"),
  editAcademicYear: document.getElementById("editAcademicYear"),
  btnYearMinus: document.getElementById("btnYearMinus"),
  btnYearPlus: document.getElementById("btnYearPlus"),
  editSemester: document.getElementById("editSemester"),
  editExamType: document.getElementById("editExamType"),
  editCustomExamType: document.getElementById("editCustomExamType"),

  // 考程資料管理 Modal
  dataManageModal: document.getElementById("dataManageModal"),
  btnCloseDataModal: document.getElementById("btnCloseDataModal"),
  btnDownloadTemplate: document.getElementById("btnDownloadTemplate"),
  uploadJsonInput: document.getElementById("uploadJsonInput"),
  btnResetToLantanDefault: document.getElementById("btnResetToLantanDefault"),
  manageDateSelect: document.getElementById("manageDateSelect"),
  manageGradeSelect: document.getElementById("manageGradeSelect"),
  btnAddNewDate: document.getElementById("btnAddNewDate"),
  btnDeleteDate: document.getElementById("btnDeleteDate"),
  manageSessionsTbody: document.getElementById("manageSessionsTbody"),
  btnAddSessionRow: document.getElementById("btnAddSessionRow"),
  btnSaveDataChanges: document.getElementById("btnSaveDataChanges"),

  // 系統設定 Modal
  settingsModal: document.getElementById("settingsModal"),
  btnCloseModal: document.getElementById("btnCloseModal"),
  btnSaveModal: document.getElementById("btnSaveModal"),
  btnResetDefaults: document.getElementById("btnResetDefaults"),
  btnTestSound: document.getElementById("btnTestSound"),
  soundEnabled: document.getElementById("soundEnabled"),
  fiveMinWarning: document.getElementById("fiveMinWarning"),
  soundStyle: document.getElementById("soundStyle"),
  soundVolume: document.getElementById("soundVolume"),
  volumeValue: document.getElementById("volumeValue"),
  defaultExamTime: document.getElementById("defaultExamTime"),
  defaultBreakTime: document.getElementById("defaultBreakTime"),
  defaultBreak2Time: document.getElementById("defaultBreak2Time"),
  themeSelect: document.getElementById("themeSelect"),
  customHintText: document.getElementById("customHintText"),
  btnApplyHint: document.getElementById("btnApplyHint"),
  uploadLogoInput: document.getElementById("uploadLogoInput"),
  btnResetLogo: document.getElementById("btnResetLogo"),
  editSubjectName: document.getElementById("editSubjectName"),
  editScopeText: document.getElementById("editScopeText"),
  btnApplyCustomContent: document.getElementById("btnApplyCustomContent")
};

// 本地存儲載入與保存
function loadSettings() {
  // 載入偏好設定
  const savedSettings = localStorage.getItem("ltes_exam_settings");
  if (savedSettings) {
    try {
      State.settings = { ...State.settings, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.warn("無法解析設定", e);
    }
  }

  if (!State.settings.break2Minutes) {
    State.settings.break2Minutes = 20;
  }

  // 載入學校名稱
  const savedSchoolName = localStorage.getItem("campus_school_name");
  if (savedSchoolName) {
    State.schoolName = savedSchoolName;
  }

  // 載入標題設定
  const savedTitle = localStorage.getItem("campus_title_config");
  if (savedTitle) {
    try {
      State.titleConfig = { ...State.titleConfig, ...JSON.parse(savedTitle) };
    } catch (e) {
      console.warn("無法解析標題設定", e);
    }
  }

  // 載入考程資料庫
  const savedDatabase = localStorage.getItem("campus_exam_database");
  if (savedDatabase) {
    try {
      examDatabase = JSON.parse(savedDatabase);
    } catch (e) {
      console.warn("無法解析考程資料庫，使用預設值", e);
      examDatabase = JSON.parse(JSON.stringify(DEFAULT_LANTAN_SCHEDULE));
    }
  }

  // 套用外觀與校徽
  applyTheme(State.settings.theme);
  updateHeaderTitle();
  if (State.settings.customLogoUrl) {
    el.schoolLogoImg.src = State.settings.customLogoUrl;
    if (el.modalLogoPreview) el.modalLogoPreview.src = State.settings.customLogoUrl;
  }
  el.autoNextSwitch.checked = State.settings.autoNext;
  el.hintMessage.textContent = State.settings.hintText;
}

function saveSettings() {
  localStorage.setItem("campus_exam_settings", JSON.stringify(State.settings));
}

function saveTitleConfig() {
  localStorage.setItem("campus_title_config", JSON.stringify(State.titleConfig));
}

function saveSchoolName() {
  localStorage.setItem("campus_school_name", State.schoolName);
}

function saveExamDatabase() {
  localStorage.setItem("campus_exam_database", JSON.stringify(examDatabase));
}

function applyTheme(themeName) {
  document.body.className = themeName;
}

// 更新頂部標題文字與頁面標題
function updateHeaderTitle() {
  const { year, semester, examType } = State.titleConfig;
  if (el.schoolNameDisplay) {
    el.schoolNameDisplay.textContent = State.schoolName;
  }
  el.titleYearDisplay.textContent = year;
  el.titleSemesterDisplay.textContent = semester;
  el.titleExamTypeDisplay.textContent = examType;
  document.title = `${State.schoolName} ${year}學年度${semester} ${examType} 考試倒數計時時鐘`;
}

// 刷新主畫面「日期下拉選單」
function populateDateSelect() {
  const currentVal = el.dateSelect.value;
  el.dateSelect.innerHTML = "";
  const dateKeys = Object.keys(examDatabase);

  if (dateKeys.length === 0) {
    examDatabase = JSON.parse(JSON.stringify(DEFAULT_LANTAN_SCHEDULE));
  }

  Object.keys(examDatabase).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = examDatabase[key].dateName || key;
    el.dateSelect.appendChild(opt);
  });

  if (examDatabase[currentVal]) {
    el.dateSelect.value = currentVal;
    State.date = currentVal;
  } else {
    State.date = Object.keys(examDatabase)[0];
    el.dateSelect.value = State.date;
  }
}

// 建立當日考程流水線 (含中場下課)
function buildPipeline(date, grade) {
  const dayData = examDatabase[date];
  if (!dayData || !dayData.grades || !dayData.grades[String(grade)]) return [];

  const rawSessions = dayData.grades[String(grade)];
  const pipeline = [];

  rawSessions.forEach((item, idx) => {
    pipeline.push({
      kind: item.type === "regular" ? "regular" : "exam",
      sessionNum: item.session,
      sessionName: item.sessionName || `第${item.session}節`,
      subject: item.subject,
      scope: item.scope || "無範圍",
      durationMinutes: State.settings.examMinutes
    });

    // 自動插入「下課休息」
    if (idx < rawSessions.length - 1) {
      const isSecondBreak = (item.session === 2 || idx === 1);
      const breakMinutes = isSecondBreak 
        ? (State.settings.break2Minutes || 20) 
        : (State.settings.breakMinutes || 10);

      pipeline.push({
        kind: "break",
        sessionNum: item.session,
        sessionName: isSecondBreak ? `第 ${item.session} 次下課 (大下課)` : `第 ${item.session} 次下課`,
        subject: isSecondBreak ? "大下課休息 (20分)" : "下課休息",
        scope: isSecondBreak 
          ? "課間大下課 20 分鐘：請至走廊戶外活動、護眼望遠或做操，放鬆身心！" 
          : "請至走廊活動放鬆、如廁或飲水，並準備下一節應考用品",
        durationMinutes: breakMinutes
      });
    }
  });

  return pipeline;
}

// 渲染節次下拉選單
function renderSessionSelect() {
  el.sessionSelect.innerHTML = "";
  State.pipeline.forEach((item, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    if (item.kind === "break") {
      opt.textContent = `☕ ${item.sessionName} (${item.durationMinutes}分鐘)`;
    } else if (item.kind === "regular") {
      opt.textContent = `📚 ${item.sessionName}：${item.subject} (${item.durationMinutes}分鐘)`;
    } else {
      opt.textContent = `📝 ${item.sessionName}：${item.subject} (${item.durationMinutes}分鐘)`;
    }
    el.sessionSelect.appendChild(opt);
  });
  el.sessionSelect.value = State.currentIndex;
}

// 底部時間軸卡片
function renderScheduleTrack() {
  el.sessionsTrack.innerHTML = "";
  State.pipeline.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = `session-chip-card ${idx === State.currentIndex ? "active" : ""}`;
    card.onclick = () => selectSession(idx);

    const isBreak = item.kind === "break";
    card.innerHTML = `
      <div class="chip-title">${isBreak ? "☕ " + item.sessionName : "🔔 " + item.sessionName}</div>
      <div class="chip-subject">${item.subject}</div>
      <div class="chip-time">${item.durationMinutes} 分鐘</div>
    `;
    el.sessionsTrack.appendChild(card);
  });
}

// 切換至指定節次
function selectSession(index, autoStart = false) {
  if (index < 0 || index >= State.pipeline.length) return;
  State.currentIndex = index;
  const currentItem = State.pipeline[index];

  State.totalDurationSeconds = currentItem.durationMinutes * 60;
  State.remainingSeconds = State.totalDurationSeconds;
  State.warned5Min = false;

  updateSessionDisplay(currentItem);
  renderSessionSelect();
  renderScheduleTrack();
  updateClockDigits();

  if (autoStart) {
    startTimer();
  } else {
    pauseTimer();
  }
}

// 更新看版資訊
function updateSessionDisplay(item) {
  if (item.kind === "break") {
    el.statusBadge.textContent = "下課休息中";
    el.statusBadge.className = "status-badge break";
    el.sessionBadge.textContent = item.sessionName;
    el.subjectTitle.textContent = "下課休息";
    el.scopeContent.textContent = item.scope;
    el.progressBar.className = "progress-bar break-mode";
  } else if (item.kind === "regular") {
    el.statusBadge.textContent = "正常上課中";
    el.statusBadge.className = "status-badge normal";
    el.sessionBadge.textContent = item.sessionName;
    el.subjectTitle.textContent = item.subject;
    el.scopeContent.textContent = item.scope;
    el.progressBar.className = "progress-bar";
  } else {
    el.statusBadge.textContent = "考試進行中";
    el.statusBadge.className = "status-badge";
    el.sessionBadge.textContent = item.sessionName;
    el.subjectTitle.textContent = item.subject;
    el.scopeContent.textContent = item.scope;
    el.progressBar.className = "progress-bar exam-mode";
  }

  el.editSubjectName.value = item.subject;
  el.editScopeText.value = item.scope;
}

// 更新數字時鐘
function updateClockDigits() {
  const m = Math.floor(State.remainingSeconds / 60);
  const s = State.remainingSeconds % 60;

  el.minutes.textContent = String(m).padStart(2, "0");
  el.seconds.textContent = String(s).padStart(2, "0");

  const percent = State.totalDurationSeconds > 0 
    ? (State.remainingSeconds / State.totalDurationSeconds) * 100 
    : 0;
  el.progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;

  el.timerCard.classList.remove("warning-5min", "warning-1min");
  if (State.remainingSeconds <= 60 && State.remainingSeconds > 0) {
    el.timerCard.classList.add("warning-1min");
  } else if (State.remainingSeconds <= 300 && State.remainingSeconds > 60) {
    el.timerCard.classList.add("warning-5min");
  }

  if (State.settings.fiveMinWarning && !State.warned5Min && State.remainingSeconds === 300) {
    State.warned5Min = true;
    soundEngine.playFiveMinNotice();
  }
}

// 計時器控制
function startTimer() {
  if (State.isRunning) return;
  soundEngine.init();
  State.isRunning = true;
  el.btnToggleIcon.textContent = "⏸";
  el.btnToggleText.textContent = "暫停";
  el.btnToggleTimer.className = "btn btn-primary";

  State.timerInterval = setInterval(() => {
    if (State.remainingSeconds > 0) {
      State.remainingSeconds--;
      updateClockDigits();
    } else {
      handleTimeUp();
    }
  }, 1000);
}

function pauseTimer() {
  State.isRunning = false;
  el.btnToggleIcon.textContent = "▶";
  el.btnToggleText.textContent = "開始";
  el.btnToggleTimer.className = "btn btn-secondary";
  if (State.timerInterval) {
    clearInterval(State.timerInterval);
    State.timerInterval = null;
  }
}

function toggleTimer() {
  if (State.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function resetTimer() {
  pauseTimer();
  State.remainingSeconds = State.totalDurationSeconds;
  State.warned5Min = false;
  updateClockDigits();
}

// 當倒數時間到 (00:00)
function handleTimeUp() {
  pauseTimer();
  soundEngine.playEndSound();

  const isLast = State.currentIndex >= State.pipeline.length - 1;

  if (isLast) {
    el.statusBadge.textContent = "本日考試已結束";
    el.hintMessage.textContent = "🎉 今日預定考程已全部結束，請老師與同學們收拾物品，辛苦了！";
    return;
  }

  if (State.settings.autoNext) {
    const nextItem = State.pipeline[State.currentIndex + 1];
    el.hintMessage.textContent = `🔔 本節已結束，即將自動切換至：${nextItem.sessionName}（${nextItem.subject}）`;
    setTimeout(() => {
      selectSession(State.currentIndex + 1, true);
    }, 2000);
  } else {
    el.hintMessage.textContent = `🔔 本節時間已結束，請點擊「下一節」繼續。`;
  }
}

// 快速微調時間 (+/- 秒數)
function adjustRemainingTime(deltaSeconds) {
  State.remainingSeconds = Math.max(0, State.remainingSeconds + deltaSeconds);
  if (State.remainingSeconds > State.totalDurationSeconds) {
    State.totalDurationSeconds = State.remainingSeconds;
  }
  updateClockDigits();
}

function earlyFinishSession() {
  if (confirm("確定要提前結束本節倒數嗎？（將立即響鈴並可切換下一節）")) {
    State.remainingSeconds = 0;
    updateClockDigits();
    handleTimeUp();
  }
}

// 當前真實時鐘
function startClock() {
  function updateTime() {
    const now = new Date();
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const day = days[now.getDay()];
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    el.currentTime.textContent = `${y}/${m}/${d} (${day}) ${hh}:${mm}:${ss}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// 全螢幕切換
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("無法進入全螢幕:", err);
    });
    el.btnFullscreen.innerHTML = "🗗 退出全螢幕";
  } else {
    document.exitFullscreen();
    el.btnFullscreen.innerHTML = "⛶ 全螢幕";
  }
}

/* ==============================================================
   考程管理 (管理表格、下載範例檔、上傳更新)
============================================================== */

// 刷新「管理彈窗中的日期選單」
function populateManageDates() {
  el.manageDateSelect.innerHTML = "";
  Object.keys(examDatabase).forEach(dateKey => {
    const opt = document.createElement("option");
    opt.value = dateKey;
    opt.textContent = examDatabase[dateKey].dateName || dateKey;
    el.manageDateSelect.appendChild(opt);
  });
}

// 渲染管理表格內容
function renderManageTable() {
  const dateKey = el.manageDateSelect.value;
  const gradeKey = el.manageGradeSelect.value;
  el.manageSessionsTbody.innerHTML = "";

  if (!examDatabase[dateKey] || !examDatabase[dateKey].grades || !examDatabase[dateKey].grades[gradeKey]) {
    el.manageSessionsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8;">查無此日期與年級的排程資料</td></tr>`;
    return;
  }

  const list = examDatabase[dateKey].grades[gradeKey];
  list.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.dataset.index = idx;
    tr.innerHTML = `
      <td><input type="number" class="col-session" value="${item.session || (idx + 1)}" min="1"></td>
      <td><input type="text" class="col-name" value="${item.sessionName || ('第' + (idx + 1) + '節')}"></td>
      <td><input type="text" class="col-subject" value="${item.subject || ''}"></td>
      <td><input type="text" class="col-scope" value="${item.scope || ''}"></td>
      <td><button class="btn-sm btn-outline-danger btn-del-row" data-idx="${idx}">🗑️ 刪除</button></td>
    `;
    el.manageSessionsTbody.appendChild(tr);
  });

  // 綁定刪除列按鈕
  el.manageSessionsTbody.querySelectorAll(".btn-del-row").forEach(btn => {
    btn.onclick = (e) => {
      const rowIdx = parseInt(e.target.getAttribute("data-idx"), 10);
      list.splice(rowIdx, 1);
      renderManageTable();
    };
  });
}

// 從表格抓取並同步更新到當前記憶體中的 examDatabase
function syncManageTableToMemory() {
  const dateKey = el.manageDateSelect.value;
  const gradeKey = el.manageGradeSelect.value;
  if (!examDatabase[dateKey]) return;
  if (!examDatabase[dateKey].grades) examDatabase[dateKey].grades = {};

  const rows = el.manageSessionsTbody.querySelectorAll("tr");
  const newList = [];
  rows.forEach(tr => {
    const sessionInput = tr.querySelector(".col-session");
    if (!sessionInput) return;
    const sessionNum = parseInt(sessionInput.value, 10) || 1;
    const sessionName = tr.querySelector(".col-name").value.trim() || `第${sessionNum}節`;
    const subject = tr.querySelector(".col-subject").value.trim() || "未命名科目";
    const scope = tr.querySelector(".col-scope").value.trim() || "未指定範圍";
    const isRegular = subject.includes("正常上課");

    newList.push({
      session: sessionNum,
      sessionName: sessionName,
      subject: subject,
      scope: scope,
      type: isRegular ? "regular" : "exam"
    });
  });

  examDatabase[dateKey].grades[gradeKey] = newList;
}

// 下載考程標準 JSON 範例檔
function downloadExamTemplate() {
  const exportData = {
    schoolName: State.schoolName || "學校名稱",
    titleConfig: State.titleConfig,
    description: `${State.schoolName} 定期考查考試時間與科目範圍標準設定檔`,
    examSchedule: examDatabase
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = `${State.schoolName}_${State.titleConfig.year}學年_${State.titleConfig.semester}_${State.titleConfig.examType}_考程設定檔.json`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 上傳並解析 JSON 檔案
function handleJsonUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      let incomingSchedule = null;

      if (parsed.examSchedule) {
        incomingSchedule = parsed.examSchedule;
        if (parsed.titleConfig) {
          State.titleConfig = { ...State.titleConfig, ...parsed.titleConfig };
          saveTitleConfig();
          updateHeaderTitle();
        }
      } else if (typeof parsed === "object") {
        incomingSchedule = parsed;
      }

      if (!incomingSchedule || Object.keys(incomingSchedule).length === 0) {
        throw new Error("格式無效：找不到日期節次物件");
      }

      // 套用並保存
      examDatabase = incomingSchedule;
      saveExamDatabase();

      // 刷新介面
      populateDateSelect();
      populateManageDates();
      renderManageTable();
      State.pipeline = buildPipeline(State.date, State.grade);
      selectSession(0);

      alert("🎉 考程資料更新成功！已載入新的考試日程與科目範圍。");
      el.uploadJsonInput.value = "";
    } catch (err) {
      alert("❌ 檔案解析失敗：請確認上傳的為符合格式的 JSON 設定檔。\n" + err.message);
    }
  };
  reader.readAsText(file, "utf-8");
}

// 綁定所有使用者操作事件
function initEventListeners() {
  // 校徽圖片更換輔助函式
  function handleLogoFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      State.settings.customLogoUrl = event.target.result;
      el.schoolLogoImg.src = State.settings.customLogoUrl;
      if (el.modalLogoPreview) el.modalLogoPreview.src = State.settings.customLogoUrl;
      saveSettings();
      alert("✅ 校徽圖片更換成功！");
    };
    reader.readAsDataURL(file);
  }

  function resetLogoToDefault() {
    State.settings.customLogoUrl = null;
    el.schoolLogoImg.src = "school_logo.png";
    if (el.modalLogoPreview) el.modalLogoPreview.src = "school_logo.png";
    saveSettings();
    alert("✅ 已還原為預設校徽！");
  }

  // 點擊左上角校徽圖示直接換圖
  if (el.schoolBadgeBtn && el.directLogoInput) {
    el.schoolBadgeBtn.addEventListener("click", () => {
      el.directLogoInput.click();
    });
    el.directLogoInput.addEventListener("change", (e) => {
      handleLogoFile(e.target.files[0]);
      el.directLogoInput.value = "";
    });
  }

  // 點擊校名直接開啟編輯視窗
  if (el.schoolNameContainer) {
    el.schoolNameContainer.addEventListener("click", () => {
      openTitleModal(true);
    });
  }

  // 1. 頂部標題點擊進入編輯
  function openTitleModal(focusSchoolName = false) {
    if (el.editSchoolName) {
      el.editSchoolName.value = State.schoolName || "嘉義市蘭潭國小";
    }
    if (el.modalLogoPreview) {
      el.modalLogoPreview.src = State.settings.customLogoUrl || "school_logo.png";
    }
    el.editAcademicYear.value = State.titleConfig.year;
    el.editSemester.value = State.titleConfig.semester;
    
    const knownTypes = ["第一次定期考查", "第二次定期考查", "期中定期評量", "期末定期評量", "畢業考查"];
    if (knownTypes.includes(State.titleConfig.examType)) {
      el.editExamType.value = State.titleConfig.examType;
      el.editCustomExamType.style.display = "none";
    } else {
      el.editExamType.value = "自訂";
      el.editCustomExamType.style.display = "block";
      el.editCustomExamType.value = State.titleConfig.examType;
    }
    el.titleEditModal.classList.add("show");
    if (focusSchoolName && el.editSchoolName) {
      setTimeout(() => el.editSchoolName.focus(), 150);
    }
  }

  el.headerTitleContainer.addEventListener("click", () => openTitleModal(false));

  if (el.modalLogoUploadInput) {
    el.modalLogoUploadInput.addEventListener("change", (e) => {
      handleLogoFile(e.target.files[0]);
      el.modalLogoUploadInput.value = "";
    });
  }

  if (el.btnModalResetLogo) {
    el.btnModalResetLogo.addEventListener("click", resetLogoToDefault);
  }

  el.btnYearMinus.addEventListener("click", () => {
    el.editAcademicYear.value = parseInt(el.editAcademicYear.value, 10) - 1;
  });

  el.btnYearPlus.addEventListener("click", () => {
    el.editAcademicYear.value = parseInt(el.editAcademicYear.value, 10) + 1;
  });

  el.editExamType.addEventListener("change", (e) => {
    if (e.target.value === "自訂") {
      el.editCustomExamType.style.display = "block";
      el.editCustomExamType.focus();
    } else {
      el.editCustomExamType.style.display = "none";
    }
  });

  el.btnCloseTitleModal.addEventListener("click", () => el.titleEditModal.classList.remove("show"));
  el.btnCancelTitleModal.addEventListener("click", () => el.titleEditModal.classList.remove("show"));

  el.btnSaveTitleModal.addEventListener("click", () => {
    if (el.editSchoolName) {
      State.schoolName = el.editSchoolName.value.trim() || State.schoolName || "學校名稱";
      saveSchoolName();
    }
    State.titleConfig.year = parseInt(el.editAcademicYear.value, 10) || 115;
    State.titleConfig.semester = el.editSemester.value;
    if (el.editExamType.value === "自訂") {
      State.titleConfig.examType = el.editCustomExamType.value.trim() || "定期考查";
    } else {
      State.titleConfig.examType = el.editExamType.value;
    }
    saveTitleConfig();
    updateHeaderTitle();
    el.titleEditModal.classList.remove("show");
  });

  // 2. 考程管理 Modal 控制
  el.btnDataManage.addEventListener("click", () => {
    populateManageDates();
    el.manageDateSelect.value = State.date;
    el.manageGradeSelect.value = State.grade;
    renderManageTable();
    el.dataManageModal.classList.add("show");
  });

  el.btnCloseDataModal.addEventListener("click", () => {
    el.dataManageModal.classList.remove("show");
  });

  el.manageDateSelect.addEventListener("change", () => renderManageTable());
  el.manageGradeSelect.addEventListener("change", () => renderManageTable());

  // 新增節次列
  el.btnAddSessionRow.addEventListener("click", () => {
    syncManageTableToMemory();
    const dateKey = el.manageDateSelect.value;
    const gradeKey = el.manageGradeSelect.value;
    if (!examDatabase[dateKey].grades[gradeKey]) examDatabase[dateKey].grades[gradeKey] = [];
    const list = examDatabase[dateKey].grades[gradeKey];
    const newIdx = list.length + 1;
    list.push({
      session: newIdx,
      sessionName: `第${newIdx}節`,
      subject: "新科目",
      scope: "第一單元",
      type: "exam"
    });
    renderManageTable();
  });

  // 新增考試日期
  el.btnAddNewDate.addEventListener("click", () => {
    const newKey = prompt("請輸入新日期的識別代碼 (例如: 11-05 或 01-15):", "");
    if (!newKey) return;
    if (examDatabase[newKey]) {
      alert("此日期代碼已存在！");
      return;
    }
    const newName = prompt("請輸入該日期的顯示名稱 (例如: 11月5日 (星期四) - 社會):", `${newKey} 考試日`);
    examDatabase[newKey] = {
      dateName: newName || newKey,
      grades: {
        "1": [{ session: 1, sessionName: "第一節", subject: "國語", scope: "範圍", type: "exam" }],
        "2": [{ session: 1, sessionName: "第一節", subject: "國語", scope: "範圍", type: "exam" }],
        "3": [{ session: 1, sessionName: "第一節", subject: "英語", scope: "範圍", type: "exam" }],
        "4": [{ session: 1, sessionName: "第一節", subject: "英語", scope: "範圍", type: "exam" }],
        "5": [{ session: 1, sessionName: "第一節", subject: "英語", scope: "範圍", type: "exam" }],
        "6": [{ session: 1, sessionName: "第一節", subject: "英語", scope: "範圍", type: "exam" }]
      }
    };
    populateManageDates();
    el.manageDateSelect.value = newKey;
    renderManageTable();
  });

  // 刪除考試日期
  el.btnDeleteDate.addEventListener("click", () => {
    const curDate = el.manageDateSelect.value;
    if (Object.keys(examDatabase).length <= 1) {
      alert("至少必須保留一個考試日期！");
      return;
    }
    if (confirm(`確定要刪除「${examDatabase[curDate].dateName || curDate}」這天的所有考程嗎？`)) {
      delete examDatabase[curDate];
      populateManageDates();
      renderManageTable();
    }
  });

  // 儲存線上考程修改
  el.btnSaveDataChanges.addEventListener("click", () => {
    syncManageTableToMemory();
    saveExamDatabase();
    populateDateSelect();
    State.pipeline = buildPipeline(State.date, State.grade);
    selectSession(0);
    el.dataManageModal.classList.remove("show");
    alert("✅ 考程資料已成功儲存並套用！");
  });

  // 下載與上傳 JSON
  el.btnDownloadTemplate.addEventListener("click", downloadExamTemplate);
  el.uploadJsonInput.addEventListener("change", handleJsonUpload);

  // 還原蘭潭預設課表
  el.btnResetToLantanDefault.addEventListener("click", () => {
    if (confirm("確定要將所有考試日程與科目範圍還原為「蘭潭國小 115學年度 第一次定期考查」官方課表嗎？")) {
      examDatabase = JSON.parse(JSON.stringify(DEFAULT_LANTAN_SCHEDULE));
      saveExamDatabase();
      populateDateSelect();
      populateManageDates();
      renderManageTable();
      State.pipeline = buildPipeline(State.date, State.grade);
      selectSession(0);
      alert("✅ 已成功恢復蘭潭國小官方預設課表！");
    }
  });

  // 3. 校徽自訂與更換
  el.uploadLogoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      State.settings.customLogoUrl = event.target.result;
      el.schoolLogoImg.src = State.settings.customLogoUrl;
      saveSettings();
      alert("✅ 校徽圖片更換成功！");
    };
    reader.readAsDataURL(file);
  });

  el.btnResetLogo.addEventListener("click", () => {
    State.settings.customLogoUrl = null;
    el.schoolLogoImg.src = "lantan_logo.png";
    saveSettings();
    alert("✅ 已還原為蘭潭國小官方校徽！");
  });

  // 4. 主畫面控制切換
  el.dateSelect.addEventListener("change", (e) => {
    State.date = e.target.value;
    State.pipeline = buildPipeline(State.date, State.grade);
    selectSession(0);
  });

  el.gradeSelect.addEventListener("change", (e) => {
    State.grade = e.target.value;
    State.pipeline = buildPipeline(State.date, State.grade);
    selectSession(0);
  });

  el.sessionSelect.addEventListener("change", (e) => {
    const idx = parseInt(e.target.value, 10);
    selectSession(idx);
  });

  el.autoNextSwitch.addEventListener("change", (e) => {
    State.settings.autoNext = e.target.checked;
    saveSettings();
  });

  el.btnToggleTimer.addEventListener("click", toggleTimer);
  el.btnResetTimer.addEventListener("click", resetTimer);
  el.btnPrevSession.addEventListener("click", () => {
    if (State.currentIndex > 0) selectSession(State.currentIndex - 1);
  });
  el.btnNextSession.addEventListener("click", () => {
    if (State.currentIndex < State.pipeline.length - 1) selectSession(State.currentIndex + 1);
  });
  el.btnEarlyFinish.addEventListener("click", earlyFinishSession);

  document.querySelectorAll(".btn-chip[data-adjust]").forEach(btn => {
    btn.addEventListener("click", () => {
      const delta = parseInt(btn.getAttribute("data-adjust"), 10);
      adjustRemainingTime(delta);
    });
  });

  el.btnFullscreen.addEventListener("click", toggleFullscreen);

  // 5. 系統設定 Modal 控制
  el.btnSettings.addEventListener("click", () => {
    el.soundEnabled.checked = State.settings.soundEnabled;
    el.fiveMinWarning.checked = State.settings.fiveMinWarning;
    el.soundStyle.value = State.settings.soundStyle;
    el.soundVolume.value = State.settings.soundVolume;
    el.volumeValue.textContent = `${Math.round(State.settings.soundVolume * 100)}%`;
    el.defaultExamTime.value = State.settings.examMinutes;
    el.defaultBreakTime.value = State.settings.breakMinutes;
    el.defaultBreak2Time.value = State.settings.break2Minutes || 20;
    el.themeSelect.value = State.settings.theme;
    el.customHintText.value = State.settings.hintText;

    const currentItem = State.pipeline[State.currentIndex];
    if (currentItem) {
      el.editSubjectName.value = currentItem.subject;
      el.editScopeText.value = currentItem.scope;
    }
    el.settingsModal.classList.add("show");
  });

  el.btnCloseModal.addEventListener("click", () => el.settingsModal.classList.remove("show"));

  el.btnSaveModal.addEventListener("click", () => {
    State.settings.soundEnabled = el.soundEnabled.checked;
    State.settings.fiveMinWarning = el.fiveMinWarning.checked;
    State.settings.soundStyle = el.soundStyle.value;
    State.settings.soundVolume = parseFloat(el.soundVolume.value);
    
    const newExamTime = parseInt(el.defaultExamTime.value, 10);
    const newBreakTime = parseInt(el.defaultBreakTime.value, 10);
    const newBreak2Time = parseInt(el.defaultBreak2Time.value, 10) || 20;
    const timeChanged = newExamTime !== State.settings.examMinutes || 
                        newBreakTime !== State.settings.breakMinutes ||
                        newBreak2Time !== State.settings.break2Minutes;

    State.settings.examMinutes = newExamTime;
    State.settings.breakMinutes = newBreakTime;
    State.settings.break2Minutes = newBreak2Time;
    State.settings.theme = el.themeSelect.value;
    State.settings.hintText = el.customHintText.value;

    applyTheme(State.settings.theme);
    el.hintMessage.textContent = State.settings.hintText;
    saveSettings();

    if (timeChanged) {
      State.pipeline = buildPipeline(State.date, State.grade);
      selectSession(State.currentIndex);
    }

    el.settingsModal.classList.remove("show");
  });

  el.btnTestSound.addEventListener("click", () => {
    soundEngine.init();
    State.settings.soundVolume = parseFloat(el.soundVolume.value);
    State.settings.soundStyle = el.soundStyle.value;
    soundEngine.playEndSound();
  });

  el.soundVolume.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    el.volumeValue.textContent = `${Math.round(val * 100)}%`;
    State.settings.soundVolume = val;
  });

  el.btnApplyCustomContent.addEventListener("click", () => {
    const currentItem = State.pipeline[State.currentIndex];
    if (currentItem) {
      currentItem.subject = el.editSubjectName.value.trim() || currentItem.subject;
      currentItem.scope = el.editScopeText.value.trim() || currentItem.scope;
      updateSessionDisplay(currentItem);
      renderSessionSelect();
      renderScheduleTrack();
      alert("✅ 已更新當前節次科目與範圍！");
    }
  });

  el.btnApplyHint.addEventListener("click", () => {
    State.settings.hintText = el.customHintText.value;
    el.hintMessage.textContent = State.settings.hintText;
    saveSettings();
    alert("✅ 考場提醒標語已更新！");
  });

  el.btnResetDefaults.addEventListener("click", () => {
    if (confirm("確定要將所有設定恢復為學校原廠預設值嗎？")) {
      localStorage.clear();
      location.reload();
    }
  });

  // 使用說明 Modal 開啟與關閉
  el.btnHelpGuide.addEventListener("click", () => {
    el.helpGuideModal.classList.add("show");
  });
  el.btnCloseHelpModal.addEventListener("click", () => {
    el.helpGuideModal.classList.remove("show");
  });
  el.btnCloseHelpModalBtn.addEventListener("click", () => {
    el.helpGuideModal.classList.remove("show");
  });

  // 鍵盤操作
  window.addEventListener("keydown", (e) => {
    if (["input", "textarea", "select"].includes(document.activeElement.tagName.toLowerCase())) return;
    if (e.code === "Space") {
      e.preventDefault();
      toggleTimer();
    } else if (e.key === "f" || e.key === "F") {
      toggleFullscreen();
    } else if (e.code === "ArrowRight") {
      if (State.currentIndex < State.pipeline.length - 1) selectSession(State.currentIndex + 1);
    } else if (e.code === "ArrowLeft") {
      if (State.currentIndex > 0) selectSession(State.currentIndex - 1);
    }
  });
}

// 初始化點閱次數計數器
function initVisitorCounter() {
  const counterEl = document.getElementById("visitorCount");
  if (!counterEl) return;

  const namespace = "kennycjh_school_timer";
  const localKey = "exam_timer_visit_count_" + namespace;
  let localCount = parseInt(localStorage.getItem(localKey), 10) || 0;
  localCount++;
  localStorage.setItem(localKey, localCount);
  counterEl.textContent = localCount.toLocaleString();

  // 嘗試與雲端計數服務同步累計
  fetch(`https://api.counterapi.dev/v1/${namespace}/visits/up`)
    .then(res => res.json())
    .then(data => {
      if (data && typeof data.count === "number") {
        const finalCount = Math.max(data.count, localCount);
        counterEl.textContent = finalCount.toLocaleString();
        localStorage.setItem(localKey, finalCount);
      }
    })
    .catch(() => {
      // 離線或網絡限制時自動平滑回退，維持本地計數
    });
}

// 初始化
function initApp() {
  loadSettings();
  startClock();
  populateDateSelect();

  State.grade = "3";
  el.gradeSelect.value = State.grade;

  State.pipeline = buildPipeline(State.date, State.grade);
  selectSession(0);

  initEventListeners();
  initVisitorCounter();
}

document.addEventListener("DOMContentLoaded", initApp);

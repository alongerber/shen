import React, { useState, useEffect, useRef } from 'react';

// ==================== MOCK DATA ====================

const MOCK_PATIENTS = {
  'p1': { id: 'p1', name: 'רחל כהן', phone: '054-1234567', birthDate: '1985-03-15', lastVisit: '2024-12-20', nextTreatment: 'המשך טיפול שורש', balance: 0, notes: 'רגישות לאלחוש מסוים - להשתמש רק בארטיקאין', email: 'rachel.c@email.com' },
  'p2': { id: 'p2', name: 'דוד לוי', phone: '052-9876543', birthDate: '1978-07-22', lastVisit: '2025-01-05', nextTreatment: 'בדיקה תקופתית', balance: 350, notes: 'מטופל חרד - דורש סבלנות מיוחדת', email: 'david.l@email.com' },
  'p3': { id: 'p3', name: 'שרה אברהם', phone: '050-5551234', birthDate: '1992-11-08', lastVisit: '2025-01-10', nextTreatment: 'סתימה קומפוזיט', balance: 0, notes: '', email: 'sara.a@email.com' },
  'p4': { id: 'p4', name: 'יוסף מזרחי', phone: '053-7778899', birthDate: '1965-05-30', lastVisit: '2024-11-15', nextTreatment: 'התקנת כתר', balance: 1200, notes: 'סוכרתי - לתאם עם רופא משפחה', email: 'yosef.m@email.com' },
  'p5': { id: 'p5', name: 'מירב שלום', phone: '058-2223344', birthDate: '1990-09-12', lastVisit: '2025-01-08', nextTreatment: null, balance: 0, notes: 'בהריון - שבוע 24', email: 'merav.s@email.com' },
  'p6': { id: 'p6', name: 'אבי גולן', phone: '054-6667788', birthDate: '1982-01-25', lastVisit: '2024-10-20', nextTreatment: 'ניקוי אבנית', balance: 0, notes: '', email: 'avi.g@email.com' },
  'p7': { id: 'p7', name: 'נועה פרידמן', phone: '052-1112233', birthDate: '2015-04-18', lastVisit: '2025-01-02', nextTreatment: 'בדיקה + פלואוריד', balance: 0, notes: 'ילדה בת 9 - מגיעה עם אמא', email: 'noa.f@email.com' },
  'p8': { id: 'p8', name: 'משה ביטון', phone: '050-4445566', birthDate: '1970-12-03', lastVisit: '2024-12-28', nextTreatment: 'עקירת שן בינה', balance: 800, notes: 'לוקח קומדין - לבדוק INR לפני עקירה', email: 'moshe.b@email.com' },
};

const MOCK_TREATMENTS_HISTORY = {
  'p1': [
    { date: '2024-12-20', treatment: 'טיפול שורש - שלב 1', dentist: 'ד"ר יעל שמיר', cost: 1500, paid: true },
    { date: '2024-11-10', treatment: 'צילום פנורמי', dentist: 'ד"ר יעל שמיר', cost: 250, paid: true },
    { date: '2024-08-05', treatment: 'בדיקה תקופתית + ניקוי', dentist: 'מיכל (שיננית)', cost: 350, paid: true },
  ],
  'p2': [
    { date: '2025-01-05', treatment: 'סתימה קומפוזיט - שן 36', dentist: 'ד"ר עמית רז', cost: 450, paid: false },
    { date: '2024-09-12', treatment: 'בדיקה תקופתית', dentist: 'ד"ר עמית רז', cost: 200, paid: true },
  ],
  'p4': [
    { date: '2024-11-15', treatment: 'הכנת שן לכתר', dentist: 'ד"ר יעל שמיר', cost: 800, paid: false },
    { date: '2024-11-01', treatment: 'טיפול שורש מלא', dentist: 'ד"ר יעל שמיר', cost: 2200, paid: true },
  ],
};

const STAFF = {
  dentist1: { name: 'ד"ר יעל שמיר', role: 'רופאת שיניים', color: '#6366F1' },
  dentist2: { name: 'ד"ר עמית רז', role: 'רופא שיניים', color: '#8B5CF6' },
  hygienist: { name: 'מיכל דנינו', role: 'שיננית', color: '#14B8A6' },
};

const CHAIRS = [
  { id: 'chair1', name: 'כיסא 1', assignedTo: 'dentist1' },
  { id: 'chair2', name: 'כיסא 2', assignedTo: 'dentist2' },
  { id: 'chair3', name: 'כיסא 3', assignedTo: 'hygienist' },
];

const TODAY_APPOINTMENTS = [
  { id: 'a1', time: '08:30', duration: 60, patientId: 'p1', chairId: 'chair1', treatment: 'המשך טיפול שורש', status: 'completed', staffId: 'dentist1' },
  { id: 'a2', time: '09:00', duration: 30, patientId: 'p6', chairId: 'chair3', treatment: 'ניקוי אבנית', status: 'completed', staffId: 'hygienist' },
  { id: 'a3', time: '09:30', duration: 45, patientId: 'p2', chairId: 'chair2', treatment: 'בדיקה + סתימה', status: 'in-treatment', staffId: 'dentist2' },
  { id: 'a4', time: '10:00', duration: 30, patientId: 'p7', chairId: 'chair1', treatment: 'בדיקה + פלואוריד', status: 'arrived', staffId: 'dentist1' },
  { id: 'a5', time: '10:30', duration: 60, patientId: 'p4', chairId: 'chair2', treatment: 'התקנת כתר', status: 'scheduled', staffId: 'dentist2' },
  { id: 'a6', time: '10:00', duration: 45, patientId: 'p3', chairId: 'chair3', treatment: 'ניקוי + בדיקה', status: 'no-show', staffId: 'hygienist' },
  { id: 'a7', time: '11:30', duration: 90, patientId: 'p8', chairId: 'chair1', treatment: 'עקירת שן בינה', status: 'scheduled', staffId: 'dentist1' },
  { id: 'a8', time: '12:00', duration: 30, patientId: 'p5', chairId: 'chair2', treatment: 'בדיקה תקופתית', status: 'scheduled', staffId: 'dentist2' },
];

const ALERTS = [
  { id: 'al1', type: 'no-show', message: 'שרה אברהם לא הגיעה לתור 10:00', patientId: 'p3', priority: 'high' },
  { id: 'al2', type: 'payment', message: 'יוסף מזרחי - יתרת חוב ₪1,200', patientId: 'p4', priority: 'medium' },
  { id: 'al3', type: 'followup', message: 'דוד לוי - תזכורת תשלום ₪350', patientId: 'p2', priority: 'medium' },
  { id: 'al4', type: 'medical', message: 'משה ביטון - בדיקת INR נדרשת', patientId: 'p8', priority: 'high' },
];

const AUTOMATION_TASKS = [
  { id: 't1', type: 'reminder', status: 'pending', patient: 'יוסף מזרחי', action: 'SMS תזכורת תור מחר 10:30', scheduledFor: 'היום 18:00' },
  { id: 't2', type: 'followup', status: 'pending', patient: 'רחל כהן', action: 'WhatsApp - מעקב אחרי טיפול שורש', scheduledFor: 'היום 20:00' },
  { id: 't3', type: 'no-show', status: 'triggered', patient: 'שרה אברהם', action: 'SMS - קישור לקביעת תור חדש', scheduledFor: 'בוצע 10:15' },
  { id: 't4', type: 'payment', status: 'pending', patient: 'דוד לוי', action: 'תזכורת תשלום - יתרה ₪350', scheduledFor: 'מחר 10:00' },
  { id: 't5', type: 'reminder', status: 'sent', patient: 'נועה פרידמן', action: 'SMS תזכורת + הוראות פלואוריד', scheduledFor: 'בוצע אתמול' },
  { id: 't6', type: 'recall', status: 'pending', patient: 'אבי גולן', action: 'תזכורת בדיקה תקופתית', scheduledFor: 'מחר 09:00' },
];

// ==================== UTILITY FUNCTIONS ====================

const getStatusConfig = (status) => {
  const configs = {
    'scheduled': { label: 'מתוכנן', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', glow: '' },
    'arrived': { label: 'הגיע/ה', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500', glow: 'shadow-sky-200' },
    'in-treatment': { label: 'בטיפול', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', glow: 'shadow-amber-200' },
    'completed': { label: 'הושלם', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', glow: 'shadow-emerald-200' },
    'no-show': { label: 'לא הגיע/ה', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', glow: 'shadow-rose-200' },
  };
  return configs[status] || configs['scheduled'];
};

const getAlertConfig = (type) => {
  const configs = {
    'no-show': { icon: '⚠️', bg: 'from-rose-50 to-rose-100/50', border: 'border-rose-200/60', iconBg: 'bg-rose-100' },
    'payment': { icon: '💳', bg: 'from-amber-50 to-amber-100/50', border: 'border-amber-200/60', iconBg: 'bg-amber-100' },
    'followup': { icon: '📋', bg: 'from-sky-50 to-sky-100/50', border: 'border-sky-200/60', iconBg: 'bg-sky-100' },
    'medical': { icon: '🏥', bg: 'from-violet-50 to-violet-100/50', border: 'border-violet-200/60', iconBg: 'bg-violet-100' },
  };
  return configs[type] || configs['followup'];
};

const getTaskConfig = (type, status) => {
  const typeIcons = { 'reminder': '🔔', 'followup': '💬', 'no-show': '❌', 'payment': '💰', 'recall': '📅' };
  const statusStyles = {
    'pending': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'ממתין', border: 'border-amber-200' },
    'triggered': { bg: 'bg-sky-50', text: 'text-sky-700', label: 'הופעל', border: 'border-sky-200' },
    'sent': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'נשלח', border: 'border-emerald-200' },
  };
  return { icon: typeIcons[type] || '📋', ...statusStyles[status] || statusStyles['pending'] };
};

const formatHebrewDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ==================== COMPONENTS ====================

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${config.bg} ${config.text} shadow-sm ${config.glow}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
      {config.label}
    </span>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      active 
        ? 'bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-sm' 
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="tracking-wide">{label}</span>
    {active && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
  </button>
);

const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/50 ${hover ? 'hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/60 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, trend, color = 'slate', icon }) => {
  const colors = {
    slate: 'from-slate-500 to-slate-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    sky: 'from-sky-500 to-sky-600',
  };
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500 tracking-wide">{label}</span>
          {icon && <span className="text-xl opacity-60">{icon}</span>}
        </div>
        <div className={`text-4xl font-bold bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
        {trend && (
          <div className="mt-2 text-xs font-medium text-slate-400">{trend}</div>
        )}
      </div>
      <div className={`absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${colors[color]} opacity-5`}></div>
    </Card>
  );
};

// ==================== SCREENS ====================

const DashboardScreen = ({ onNavigate, onSelectPatient }) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  const upcomingAppointments = TODAY_APPOINTMENTS
    .filter(apt => apt.status === 'scheduled' || apt.status === 'arrived')
    .slice(0, 5);
  
  const completedToday = TODAY_APPOINTMENTS.filter(apt => apt.status === 'completed').length;
  const inTreatment = TODAY_APPOINTMENTS.filter(apt => apt.status === 'in-treatment').length;
  const noShows = TODAY_APPOINTMENTS.filter(apt => apt.status === 'no-show').length;
  const totalToday = TODAY_APPOINTMENTS.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">לוח בקרה</h1>
          <p className="text-slate-400 mt-2 font-medium">יום ראשון, 12 בינואר 2025 • {currentTimeStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300">
            + תור חדש
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard label="תורים היום" value={totalToday} icon="📅" color="slate" trend="בהשוואה ל-6 אתמול" />
        <StatCard label="הושלמו" value={completedToday} icon="✓" color="emerald" />
        <StatCard label="בטיפול כרגע" value={inTreatment} icon="⏱" color="amber" />
        <StatCard label="לא הגיעו" value={noShows} icon="✗" color="rose" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="col-span-2" hover={false}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-lg tracking-tight">תורים קרובים</h2>
              <p className="text-sm text-slate-400 mt-0.5">התורים הבאים להיום</p>
            </div>
            <button 
              onClick={() => onNavigate('appointments')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
            >
              לכל התורים
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="divide-y divide-slate-100/80">
            {upcomingAppointments.map((apt, idx) => {
              const patient = MOCK_PATIENTS[apt.patientId];
              const staff = STAFF[apt.staffId];
              return (
                <div 
                  key={apt.id} 
                  className={`p-5 flex items-center gap-5 cursor-pointer transition-all duration-200 hover:bg-gradient-to-l hover:from-slate-50 hover:to-transparent ${idx === 0 ? 'bg-gradient-to-l from-indigo-50/30 to-transparent' : ''}`}
                  onClick={() => onSelectPatient(apt.patientId)}
                >
                  <div className="w-20 text-center">
                    <div className="text-xl font-bold text-slate-800 tracking-tight">{apt.time}</div>
                    <div className="text-xs text-slate-400 font-medium">{apt.duration} דק׳</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{patient.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{apt.treatment}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: staff.color }}></span>
                    <span className="font-medium">{staff.name}</span>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Alerts */}
        <Card hover={false}>
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <h2 className="font-bold text-slate-800 text-lg tracking-tight">התראות</h2>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{ALERTS.length} פריטים דורשים טיפול</p>
          </div>
          <div className="p-4 space-y-3">
            {ALERTS.map(alert => {
              const config = getAlertConfig(alert.type);
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border bg-gradient-to-br ${config.bg} ${config.border} cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-sm`}
                  onClick={() => onSelectPatient(alert.patientId)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center text-sm`}>
                      {config.icon}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium flex-1">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Chair Status */}
      <Card hover={false}>
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">מצב כיסאות</h2>
          <p className="text-sm text-slate-400 mt-0.5">סטטוס בזמן אמת</p>
        </div>
        <div className="p-5 grid grid-cols-3 gap-5">
          {CHAIRS.map(chair => {
            const staff = STAFF[chair.assignedTo];
            const currentApt = TODAY_APPOINTMENTS.find(
              apt => apt.chairId === chair.id && apt.status === 'in-treatment'
            );
            const patient = currentApt ? MOCK_PATIENTS[currentApt.patientId] : null;
            
            return (
              <div 
                key={chair.id}
                className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                  currentApt 
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-lg shadow-amber-100' 
                    : 'border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/30 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-800 text-lg">{chair.name}</span>
                  <span 
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: staff.color + '15', color: staff.color }}
                  >
                    {staff.name}
                  </span>
                </div>
                {currentApt ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="font-semibold text-amber-800">{patient.name}</span>
                    </div>
                    <div className="text-sm text-amber-600/80">{currentApt.treatment}</div>
                    <div className="text-xs text-amber-500 mt-2">התחיל ב-{currentApt.time}</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-medium">פנוי</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const AppointmentsScreen = ({ onSelectPatient }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'];
  
  const getAppointmentForSlot = (chairId, time) => {
    return TODAY_APPOINTMENTS.find(apt => apt.chairId === chairId && apt.time === time);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">יומן תורים</h1>
          <p className="text-slate-400 mt-2 font-medium">ניהול לוח זמנים יומי</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-medium">סינון:</span>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none"
          >
            <option value="all">הכל</option>
            <option value="scheduled">מתוכנן</option>
            <option value="arrived">הגיע/ה</option>
            <option value="in-treatment">בטיפול</option>
            <option value="completed">הושלם</option>
            <option value="no-show">לא הגיע/ה</option>
          </select>
        </div>
      </div>

      {/* Timeline Grid */}
      <Card className="overflow-hidden" hover={false}>
        <div className="grid grid-cols-4 border-b border-slate-200">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-50 font-bold text-slate-600 text-sm tracking-wide">שעה</div>
          {CHAIRS.map(chair => {
            const staff = STAFF[chair.assignedTo];
            return (
              <div key={chair.id} className="p-4 bg-gradient-to-br from-slate-100 to-slate-50 border-r border-slate-200">
                <div className="font-bold text-slate-800">{chair.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: staff.color }}></span>
                  <span className="font-medium">{staff.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="divide-y divide-slate-100">
          {timeSlots.map((time, timeIdx) => (
            <div key={time} className={`grid grid-cols-4 ${timeIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              <div className="p-4 text-sm font-bold text-slate-500 bg-slate-50/50 flex items-center">
                {time}
              </div>
              {CHAIRS.map(chair => {
                const apt = getAppointmentForSlot(chair.id, time);
                if (!apt) {
                  return <div key={chair.id} className="p-3 border-r border-slate-100 min-h-[80px]"></div>;
                }
                
                const patient = MOCK_PATIENTS[apt.patientId];
                const statusConfig = getStatusConfig(apt.status);
                const isFiltered = selectedStatus !== 'all' && apt.status !== selectedStatus;
                
                return (
                  <div 
                    key={chair.id} 
                    className={`p-3 border-r border-slate-100 ${isFiltered ? 'opacity-25' : ''}`}
                  >
                    <div 
                      className={`p-3 rounded-xl ${statusConfig.bg} cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-sm border border-transparent hover:border-slate-200`}
                      onClick={() => !isFiltered && onSelectPatient(apt.patientId)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-bold ${statusConfig.text}`}>{patient.name}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} ${apt.status === 'in-treatment' ? 'animate-pulse' : ''}`}></span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate">{apt.treatment}</div>
                      <div className="text-xs text-slate-400 mt-1.5 font-medium">{apt.duration} דק׳</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Status Legend */}
      <div className="flex items-center justify-center gap-8">
        {['scheduled', 'arrived', 'in-treatment', 'completed', 'no-show'].map(status => {
          const config = getStatusConfig(status);
          return (
            <div key={status} className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${config.dot} shadow-sm`}></span>
              <span className="text-sm text-slate-600 font-medium">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatientCardScreen = ({ patientId, onBack }) => {
  const patient = MOCK_PATIENTS[patientId];
  const history = MOCK_TREATMENTS_HISTORY[patientId] || [];
  const age = calculateAge(patient.birthDate);
  
  const mockSmsPreview = `שלום ${patient.name.split(' ')[0]}, תזכורת לתור במרפאת השיניים מחר. נשמח לראותך! לביטול: 03-1234567`;
  const mockWhatsappPreview = `היי ${patient.name.split(' ')[0]}! 😊\nרצינו לבדוק איך את/ה מרגיש/ה אחרי הטיפול?\nאם יש שאלות - אנחנו כאן!`;

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium group"
      >
        <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        חזרה ללוח הבקרה
      </button>

      {/* Patient Header */}
      <Card className="overflow-hidden" hover={false}>
        <div className="h-24 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600"></div>
        <div className="p-6 -mt-12">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-indigo-200 flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  {patient.name.charAt(0)}
                </span>
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
                <p className="text-slate-500 mt-1 font-medium">גיל {age} • {patient.phone}</p>
              </div>
            </div>
            {patient.balance > 0 && (
              <div className="px-5 py-3 bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-xl shadow-sm">
                <div className="text-xs text-rose-600 font-semibold">יתרת חוב</div>
                <div className="text-2xl font-bold text-rose-700">₪{patient.balance.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Details & Notes */}
        <Card className="col-span-2" hover={false}>
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-lg tracking-tight">פרטים אישיים</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'תאריך לידה', value: formatHebrewDate(patient.birthDate), icon: '🎂' },
                { label: 'ביקור אחרון', value: formatHebrewDate(patient.lastVisit), icon: '📅' },
                { label: 'טלפון', value: patient.phone, icon: '📱' },
                { label: 'טיפול הבא', value: patient.nextTreatment || 'לא נקבע', icon: '🦷' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{item.icon}</span>
                  <div>
                    <div className="text-sm text-slate-400 font-medium">{item.label}</div>
                    <div className="font-semibold text-slate-800 mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {patient.notes && (
              <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-xl">
                <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-2">
                  <span>⚠️</span>
                  <span>הערות צוות</span>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">{patient.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Message Preview */}
        <Card hover={false}>
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-lg tracking-tight">תצוגת הודעות</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                <span className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center">📱</span>
                SMS תזכורת
              </div>
              <div className="p-4 bg-slate-100 rounded-xl text-sm text-slate-700 leading-relaxed font-medium">
                {mockSmsPreview}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                <span className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">💬</span>
                WhatsApp מעקב
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-emerald-100">
                {mockWhatsappPreview}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Treatment History */}
      <Card hover={false}>
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">היסטוריית טיפולים</h2>
          <p className="text-sm text-slate-400 mt-0.5">{history.length} טיפולים במערכת</p>
        </div>
        {history.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {history.map((treatment, idx) => (
              <div key={idx} className={`p-5 flex items-center gap-5 ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                <div className="w-28">
                  <div className="text-sm font-bold text-slate-800">{formatHebrewDate(treatment.date)}</div>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{treatment.treatment}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{treatment.dentist}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800">₪{treatment.cost.toLocaleString()}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${treatment.paid ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {treatment.paid ? '✓ שולם' : '✗ לא שולם'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 font-medium">אין היסטוריית טיפולים</div>
        )}
      </Card>
    </div>
  );
};

const AutomationScreen = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">משימות ואוטומציה</h1>
        <p className="text-slate-400 mt-2 font-medium">ניהול תזכורות, מעקבים והודעות אוטומטיות</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard label="ממתינות" value={AUTOMATION_TASKS.filter(t => t.status === 'pending').length} icon="⏳" color="amber" />
        <StatCard label="הופעלו" value={AUTOMATION_TASKS.filter(t => t.status === 'triggered').length} icon="⚡" color="sky" />
        <StatCard label="נשלחו" value={AUTOMATION_TASKS.filter(t => t.status === 'sent').length} icon="✓" color="emerald" />
        <StatCard label="סה״כ פעילות" value={AUTOMATION_TASKS.length} icon="📊" color="slate" />
      </div>

      {/* Automation Rules */}
      <Card hover={false}>
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">כללי אוטומציה פעילים</h2>
          <p className="text-sm text-slate-400 mt-0.5">תהליכים אוטומטיים מוגדרים</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { icon: '🔔', title: 'תזכורת תור', desc: 'SMS יישלח 24 שעות לפני התור', color: 'indigo' },
            { icon: '💬', title: 'מעקב אחרי טיפול', desc: 'WhatsApp יישלח יום אחרי טיפול שורש/עקירה', color: 'emerald' },
            { icon: '❌', title: 'אי-הגעה', desc: 'SMS עם קישור לקביעה מחדש - 15 דקות אחרי', color: 'rose' },
            { icon: '📅', title: 'תזכורת תקופתית', desc: 'SMS כל 6 חודשים לבדיקה תקופתית', color: 'amber' },
          ].map((rule, idx) => (
            <div key={idx} className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-slate-50/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{rule.icon}</span>
                <span className="font-bold text-slate-800">{rule.title}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{rule.desc}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                פעיל
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tasks List */}
      <Card hover={false}>
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">משימות אוטומטיות</h2>
          <p className="text-sm text-slate-400 mt-0.5">תור משימות בזמן אמת</p>
        </div>
        <div className="divide-y divide-slate-100">
          {AUTOMATION_TASKS.map((task, idx) => {
            const config = getTaskConfig(task.type, task.status);
            return (
              <div key={task.id} className={`p-5 flex items-center gap-5 ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                <span className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">{config.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{task.patient}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{task.action}</div>
                </div>
                <div className="text-sm text-slate-400 font-medium">{task.scheduledFor}</div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ==================== AI ASSISTANT ====================

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([
    'מה מצב היום?',
    'יש מטופלים בעייתיים?',
    'מי עוד לא שילם?'
  ]);

  // Calculate urgent items for badge
  const highPriorityCount = ALERTS.filter(a => a.priority === 'high').length;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, displayedResponse]);

  // Proactive welcome message when opening
  useEffect(() => {
    if (isOpen && !hasShownWelcome && messages.length === 0) {
      setHasShownWelcome(true);
      setIsThinking(true);

      setTimeout(() => {
        setIsThinking(false);
        const welcomeMessage = getProactiveInsight();
        const assistantMessage = { type: 'assistant', content: welcomeMessage.response };
        setMessages([assistantMessage]);
        setCurrentSuggestions(welcomeMessage.suggestions);
        typeResponse(welcomeMessage.response);
      }, 600);
    }
  }, [isOpen, hasShownWelcome, messages.length]);

  // Generate proactive insight based on current state
  const getProactiveInsight = () => {
    const noShows = TODAY_APPOINTMENTS.filter(apt => apt.status === 'no-show');
    const highPriorityAlerts = ALERTS.filter(a => a.priority === 'high');
    const patientsWithDebt = Object.values(MOCK_PATIENTS).filter(p => p.balance > 0);
    const totalDebt = patientsWithDebt.reduce((sum, p) => sum + p.balance, 0);
    const inTreatment = TODAY_APPOINTMENTS.filter(apt => apt.status === 'in-treatment');

    let response = 'בוקר טוב, דנה. הנה סיכום מהיר:\n\n';

    if (highPriorityAlerts.length > 0) {
      response += `יש ${highPriorityAlerts.length} התראות דחופות הדורשות תשומת לב.\n`;
    }

    if (noShows.length > 0) {
      response += `${MOCK_PATIENTS[noShows[0].patientId].name} לא הגיעה לתור.\n`;
    }

    if (patientsWithDebt.length > 0) {
      response += `${patientsWithDebt.length} מטופלים עם חוב פתוח (${totalDebt.toLocaleString()} ש"ח).\n`;
    }

    if (inTreatment.length > 0) {
      const patient = MOCK_PATIENTS[inTreatment[0].patientId];
      response += `\nכרגע בטיפול: ${patient.name}`;
    }

    return {
      response: response.trim(),
      suggestions: ['מה הכי דחוף?', 'פרטים על ההתראות', 'מצב התורים']
    };
  };

  // AI Logic - Analyzes mock data and generates deterministic responses
  const generateResponse = (question) => {
    const q = question.toLowerCase();

    // Analyze current data
    const completedToday = TODAY_APPOINTMENTS.filter(apt => apt.status === 'completed').length;
    const inTreatment = TODAY_APPOINTMENTS.filter(apt => apt.status === 'in-treatment').length;
    const scheduled = TODAY_APPOINTMENTS.filter(apt => apt.status === 'scheduled').length;
    const arrived = TODAY_APPOINTMENTS.filter(apt => apt.status === 'arrived').length;
    const noShows = TODAY_APPOINTMENTS.filter(apt => apt.status === 'no-show');
    const totalToday = TODAY_APPOINTMENTS.length;

    // Patients with debt
    const patientsWithDebt = Object.values(MOCK_PATIENTS).filter(p => p.balance > 0);
    const totalDebt = patientsWithDebt.reduce((sum, p) => sum + p.balance, 0);

    // High priority alerts
    const highPriorityAlerts = ALERTS.filter(a => a.priority === 'high');
    const medicalAlerts = ALERTS.filter(a => a.type === 'medical');

    // Pending automation tasks
    const pendingTasks = AUTOMATION_TASKS.filter(t => t.status === 'pending');

    // Generate response based on question type
    if (q.includes('מצב היום') || q.includes('סיכום') || q.includes('מה קורה') || q.includes('תורים')) {
      let response = `סה"כ ${totalToday} תורים היום:\n`;
      response += `- ${completedToday} הושלמו\n`;
      if (inTreatment > 0) response += `- ${inTreatment} בטיפול כרגע\n`;
      if (arrived > 0) response += `- ${arrived} ממתינים בקבלה\n`;
      response += `- ${scheduled} מתוכננים\n`;
      if (noShows.length > 0) {
        response += `\nאי-הגעה: ${MOCK_PATIENTS[noShows[0].patientId].name}`;
      }
      return {
        response,
        suggestions: ['יש התראות דחופות?', 'מי עוד לא שילם?', 'מה דורש טיפול מיידי?']
      };
    }

    if (q.includes('בעייתי') || q.includes('מורכב') || q.includes('קשה') || q.includes('מיוחד')) {
      const problematicPatients = [];

      TODAY_APPOINTMENTS.forEach(apt => {
        const patient = MOCK_PATIENTS[apt.patientId];
        if (patient.notes && patient.notes.length > 0) {
          problematicPatients.push({
            name: patient.name,
            reason: patient.notes.split(' - ')[0],
            time: apt.time
          });
        }
      });

      if (problematicPatients.length > 0) {
        let response = `${problematicPatients.length} מטופלים עם הערות מיוחדות היום:\n\n`;
        problematicPatients.forEach(p => {
          response += `${p.time} - ${p.name}\n${p.reason}\n\n`;
        });
        return {
          response: response.trim(),
          suggestions: ['פרטים על משה ביטון', 'יש התראות רפואיות?', 'מה מצב התשלומים?']
        };
      }

      return {
        response: 'אין מטופלים עם דגשים מיוחדים מתוכננים להיום.',
        suggestions: ['מה מצב היום?', 'יש חובות פתוחים?', 'מה בתור האוטומציות?']
      };
    }

    if (q.includes('שילם') || q.includes('חוב') || q.includes('תשלום') || q.includes('כסף') || q.includes('יתרה')) {
      if (patientsWithDebt.length > 0) {
        let response = `${patientsWithDebt.length} מטופלים עם יתרת חוב:\n\n`;
        patientsWithDebt.sort((a, b) => b.balance - a.balance).forEach(p => {
          response += `${p.name}: ${p.balance.toLocaleString()} ש"ח\n`;
        });
        response += `\nסה"כ: ${totalDebt.toLocaleString()} ש"ח`;
        return {
          response: response.trim(),
          suggestions: ['שלח תזכורת תשלום', 'מי הכי דחוף?', 'מה מצב היום?']
        };
      }
      return {
        response: 'אין חובות פתוחים כרגע. כל המטופלים שילמו.',
        suggestions: ['מה מצב היום?', 'יש מטופלים בעייתיים?', 'מה בתור האוטומציות?']
      };
    }

    if (q.includes('הגעה') || q.includes('סיכון') || q.includes('מחר') || q.includes('ביטול')) {
      const atRiskPatient = MOCK_PATIENTS['p4'];

      let response = 'ניתוח סיכוני אי-הגעה למחר:\n\n';
      response += `סיכון גבוה:\n`;
      response += `${atRiskPatient.name}\n`;
      response += `- חוב פתוח: ${atRiskPatient.balance.toLocaleString()} ש"ח\n`;
      response += `- היסטוריה של דחיות\n\n`;
      response += `המלצה: התקשרי לאישור אישי.`;

      return {
        response,
        suggestions: ['שלח תזכורת ליוסף', 'מה עוד מתוכנן למחר?', 'מצב אוטומציות']
      };
    }

    if (q.includes('חשוב') || q.includes('דחוף') || q.includes('מיידי') || q.includes('עכשיו') || q.includes('לטפל') || q.includes('עדיפות')) {
      let priorities = [];

      if (medicalAlerts.length > 0) {
        const alert = medicalAlerts[0];
        const patient = MOCK_PATIENTS[alert.patientId];
        priorities.push({
          priority: 'קריטי',
          text: `בדיקת INR ל${patient.name} לפני עקירה ב-11:30`,
          color: 'rose'
        });
      }

      if (noShows.length > 0) {
        priorities.push({
          priority: 'גבוה',
          text: `טיפול באי-הגעה של ${MOCK_PATIENTS[noShows[0].patientId].name}`,
          color: 'amber'
        });
      }

      const largeDebts = patientsWithDebt.filter(p => p.balance > 1000);
      if (largeDebts.length > 0) {
        priorities.push({
          priority: 'בינוני',
          text: `גביית חוב ${largeDebts[0].balance.toLocaleString()} ש"ח מ${largeDebts[0].name}`,
          color: 'sky'
        });
      }

      let response = 'עדיפויות לטיפול מיידי:\n\n';
      priorities.forEach((p, i) => {
        response += `${i + 1}. [${p.priority}] ${p.text}\n`;
      });

      return {
        response: response.trim(),
        suggestions: ['פרטים על משה ביטון', 'התקשר לשרה אברהם', 'מצב כיסאות']
      };
    }

    if (q.includes('אוטומציה') || q.includes('תזכורות') || q.includes('הודעות') || q.includes('משימות')) {
      let response = `${pendingTasks.length} משימות אוטומטיות ממתינות:\n\n`;
      pendingTasks.forEach(t => {
        response += `${t.patient}\n${t.action}\nמתוזמן: ${t.scheduledFor}\n\n`;
      });

      return {
        response: response.trim(),
        suggestions: ['הפעל את כולן', 'מה מצב היום?', 'יש התראות?']
      };
    }

    if (q.includes('התראה') || q.includes('alert') || q.includes('פרטים על ההתראות')) {
      let response = `${ALERTS.length} התראות פעילות:\n\n`;
      ALERTS.forEach(a => {
        const priority = a.priority === 'high' ? '[דחוף]' : '[רגיל]';
        response += `${priority} ${a.message}\n`;
      });

      return {
        response: response.trim(),
        suggestions: ['טפל בהתראה הראשונה', 'מה הכי דחוף?', 'מצב תשלומים']
      };
    }

    if (q.includes('כיסא') || q.includes('פנוי') || q.includes('תפוס')) {
      const busyChairs = CHAIRS.filter(chair =>
        TODAY_APPOINTMENTS.some(apt => apt.chairId === chair.id && apt.status === 'in-treatment')
      );
      const freeChairs = CHAIRS.filter(chair =>
        !TODAY_APPOINTMENTS.some(apt => apt.chairId === chair.id && apt.status === 'in-treatment')
      );

      let response = 'מצב כיסאות:\n\n';
      CHAIRS.forEach(chair => {
        const apt = TODAY_APPOINTMENTS.find(a => a.chairId === chair.id && a.status === 'in-treatment');
        const staff = STAFF[chair.assignedTo];
        if (apt) {
          const patient = MOCK_PATIENTS[apt.patientId];
          response += `${chair.name} - תפוס\n${patient.name} (${apt.treatment})\n${staff.name}\n\n`;
        } else {
          response += `${chair.name} - פנוי\n${staff.name}\n\n`;
        }
      });

      return {
        response: response.trim(),
        suggestions: ['מתי מתפנה כיסא 2?', 'מה התור הבא?', 'מצב היום']
      };
    }

    if (q.includes('משה') || q.includes('ביטון')) {
      const patient = MOCK_PATIENTS['p8'];
      let response = `${patient.name}\n\n`;
      response += `טלפון: ${patient.phone}\n`;
      response += `גיל: ${calculateAge(patient.birthDate)}\n`;
      response += `חוב: ${patient.balance.toLocaleString()} ש"ח\n\n`;
      response += `הערות צוות:\n${patient.notes}\n\n`;
      response += `טיפול הבא: ${patient.nextTreatment}`;

      return {
        response,
        suggestions: ['התקשר למשה', 'בדוק INR', 'חזרה לסיכום']
      };
    }

    if (q.includes('שרה') || q.includes('אברהם')) {
      const patient = MOCK_PATIENTS['p3'];
      let response = `${patient.name}\n\n`;
      response += `טלפון: ${patient.phone}\n`;
      response += `סטטוס: לא הגיעה לתור 10:00\n\n`;
      response += `פעולה מומלצת:\nשליחת SMS עם קישור לקביעת תור חדש`;

      return {
        response,
        suggestions: ['שלח SMS לשרה', 'התקשר לשרה', 'חזרה לסיכום']
      };
    }

    // Default response
    return {
      response: 'אני כאן לעזור בניהול המרפאה. אפשר לשאול על:\n\n- מצב התורים היום\n- התראות ודחיפויות\n- מצב תשלומים וחובות\n- מטופלים בעייתיים\n- משימות אוטומטיות',
      suggestions: ['מה מצב היום?', 'יש חובות פתוחים?', 'מה הכי דחוף?']
    };
  };

  // Typing animation effect
  const typeResponse = (fullResponse, callback) => {
    setIsTyping(true);
    setDisplayedResponse('');

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullResponse.length) {
        setDisplayedResponse(fullResponse.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 12);
  };

  const handleSubmit = (question) => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const { response, suggestions } = generateResponse(question);
      const assistantMessage = { type: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentSuggestions(suggestions);
      typeResponse(response);
    }, 500 + Math.random() * 300);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSubmit(suggestion);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          isOpen
            ? 'bg-slate-800 shadow-2xl shadow-slate-400/30 scale-90'
            : 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-110'
        }`}
      >
        {/* Notification Badge */}
        {!isOpen && highPriorityCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
            {highPriorityCount}
          </span>
        )}

        {/* Pulse ring animation when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-violet-400 animate-ping opacity-20"></span>
        )}

        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        )}
      </button>

      {/* Assistant Panel */}
      <div className={`fixed bottom-28 left-6 z-40 w-[420px] transition-all duration-500 ease-out ${
        isOpen
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
      }`}>
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-400/30 border border-white/80 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-full blur-2xl"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">עוזר אישי</h3>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-medium">מחובר</span>
                  </span>
                  <span className="text-slate-500">|</span>
                  <span>מנתח {TODAY_APPOINTMENTS.length} תורים</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50/80 to-white/80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                <div className={`max-w-[90%] ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white rounded-2xl rounded-tr-md px-5 py-3 shadow-lg shadow-violet-200'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-md px-5 py-4 shadow-md'
                }`}>
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-line">
                    {msg.type === 'assistant' && idx === messages.length - 1 && isTyping
                      ? displayedResponse
                      : msg.content
                    }
                    {msg.type === 'assistant' && idx === messages.length - 1 && isTyping && (
                      <span className="inline-block w-0.5 h-4 bg-violet-500 mr-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-end animate-fadeIn">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">מנתח נתונים...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isThinking && !isTyping && (
            <div className="px-5 pb-4 pt-3 border-t border-slate-100 bg-white/90">
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-all duration-200 hover:scale-105 border border-violet-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(inputValue)}
                placeholder="שאל שאלה..."
                className="flex-1 px-5 py-3.5 bg-slate-100 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:bg-white transition-all font-medium"
                disabled={isThinking || isTyping}
              />
              <button
                onClick={() => handleSubmit(inputValue)}
                disabled={!inputValue.trim() || isThinking || isTyping}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-violet-300 hover:shadow-xl hover:shadow-violet-400 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// ==================== MAIN APP ====================

export default function DentalClinicDemo() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentScreen('patient');
  };

  const handleBackFromPatient = () => {
    setSelectedPatientId(null);
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={setCurrentScreen} onSelectPatient={handleSelectPatient} />;
      case 'appointments':
        return <AppointmentsScreen onSelectPatient={handleSelectPatient} />;
      case 'patient':
        return <PatientCardScreen patientId={selectedPatientId} onBack={handleBackFromPatient} />;
      case 'automation':
        return <AutomationScreen />;
      default:
        return <DashboardScreen onNavigate={setCurrentScreen} onSelectPatient={handleSelectPatient} />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-6 flex flex-col shadow-2xl">
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white text-xl">&#x1F9B7;</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-tight">דנטל קליניק</div>
              <div className="text-xs text-slate-400 font-medium">מערכת ניהול מרפאה</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem
            icon="&#x1F4CA;"
            label="לוח בקרה"
            active={currentScreen === 'dashboard'}
            onClick={() => setCurrentScreen('dashboard')}
          />
          <NavItem
            icon="&#x1F4C5;"
            label="יומן תורים"
            active={currentScreen === 'appointments'}
            onClick={() => setCurrentScreen('appointments')}
          />
          <NavItem
            icon="&#x2699;&#xFE0F;"
            label="אוטומציה"
            active={currentScreen === 'automation'}
            onClick={() => setCurrentScreen('automation')}
          />
        </nav>

        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold">&#x05D3;</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">דנה כהן</div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                מחוברת
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderScreen()}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}

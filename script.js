(function () {
  'use strict';

  var QUIZ_QUESTIONS = [
    {
      name: 'mood',
      text: 'Принесёте ли вы с собой хорошее настроение?',
      type: 'choice',
      options: [
        'Уже в чемодане, не доставали',
        'Привезём двойную порцию',
        'Закажем с доставкой к банкету',
        'Без настроения мы никуда!'
      ]
    },
    {
      name: 'dance',
      text: 'Готовы ли вы пойти танцевать?',
      type: 'choice',
      options: [
        'Уже разминаем колени',
        'После салата — точно да',
        'Только если заиграет наш хит',
        'Будем танцевать между столами'
      ]
    },
    {
      name: 'glasses',
      text: 'Через сколько бокалов начнутся лучшие истории?',
      type: 'choice',
      options: [
        'С первого — мы открытые люди',
        'После второго станет по-настоящему смешно',
        'На третьем пойдут легендарные байки',
        'Истории уже идут, пьём неспеша'
      ]
    }
  ];

  function initDeviceSwitcher() {
    var body = document.body;
    var btns = document.querySelectorAll('.device-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = this.getAttribute('data-view');
        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        body.classList.remove('viewport-phone', 'viewport-desktop');
        body.classList.add(view === 'phone' ? 'viewport-phone' : 'viewport-desktop');
      });
    });
  }

  function detectDevice() {
    var body = document.body;
    var btns = document.querySelectorAll('.device-btn');
    var isPhone = window.innerWidth <= 768;
    var view = isPhone ? 'phone' : 'desktop';

    body.classList.remove('viewport-phone', 'viewport-desktop');
    body.classList.add(view === 'phone' ? 'viewport-phone' : 'viewport-desktop');

    btns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
  }

  function renderCalendar() {
    var year = 2026;
    var month = 6;
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startWeekday = firstDay.getDay();
    var offset = startWeekday === 0 ? 6 : startWeekday - 1;
    var daysInMonth = lastDay.getDate();
    var prevMonth = new Date(year, month, 0);
    var daysPrev = prevMonth.getDate();

    var grid = document.getElementById('calendar-days');
    if (!grid) return;

    grid.innerHTML = '';

    for (var i = 0; i < offset; i++) {
      var d = daysPrev - offset + i + 1;
      var cell = document.createElement('div');
      cell.className = 'day other-month';
      cell.textContent = d;
      grid.appendChild(cell);
    }

    for (var j = 1; j <= daysInMonth; j++) {
      var cell = document.createElement('div');
      cell.className = 'day';
      if (j === 25) cell.classList.add('wedding-date');
      cell.textContent = j;
      grid.appendChild(cell);
    }

    var total = offset + daysInMonth;
    var next = 1;
    while (total % 7 !== 0) {
      var cell = document.createElement('div');
      cell.className = 'day other-month';
      cell.textContent = next++;
      grid.appendChild(cell);
      total++;
    }
  }

  function updateCountdown() {
    var now = new Date();
    var end = new Date(2026, 6, 25, 0, 0, 0);
    var diff = end - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  function getInviteLabel() {
    var line1 = document.getElementById('cover-line-1');
    if (line1 && line1.textContent.trim()) {
      return line1.textContent.trim();
    }
    var cfg = window.INVITE_CONFIG;
    return cfg && cfg.coverLine1 ? cfg.coverLine1 : '';
  }

  function syncInviteToForm() {
    var label = getInviteLabel();
    var guestHidden = document.getElementById('guest-hidden');
    var subjectInput = document.getElementById('form-subject');
    if (guestHidden) guestHidden.value = label;
    if (subjectInput) {
      subjectInput.value = label
        ? 'Ответ на приглашение: ' + label
        : 'Ответ на приглашение на свадьбу';
    }
  }

  function initInvitePersonalization() {
    var cfg = window.INVITE_CONFIG;
    if (!cfg) return;

    var line1 = document.getElementById('cover-line-1');
    var line2 = document.getElementById('cover-line-2');
    var line3 = document.getElementById('cover-line-3');
    var subtitle = document.getElementById('cover-subtitle');

    if (line1 && cfg.coverLine1) line1.textContent = cfg.coverLine1;
    if (line2 && cfg.coverLine2) line2.textContent = cfg.coverLine2;
    if (line3 && cfg.coverLine3) line3.textContent = cfg.coverLine3;

    if (subtitle) {
      subtitle.setAttribute('aria-label', [cfg.coverLine1, cfg.coverLine2, cfg.coverLine3].filter(Boolean).join(' '));
    }

    syncInviteToForm();

    var rsvpHeading = document.getElementById('rsvp-heading');
    if (rsvpHeading) {
      if (cfg.rsvpGuestShort) {
        rsvpHeading.textContent = 'Будем рады видеть, ' + cfg.rsvpGuestShort + '!';
      } else {
        rsvpHeading.textContent = 'Будем рады видеть ВАС';
      }
    }
  }

  function initRsvp() {
    var form = document.getElementById('rsvp-form');
    var coming = document.getElementById('coming');
    if (!form || !coming) return;

    var overlay = document.getElementById('quiz-overlay');
    var questionEl = document.getElementById('quiz-question');
    var progressEl = document.getElementById('quiz-progress');
    var bodyEl = document.getElementById('quiz-body');
    var btnNext = document.getElementById('quiz-next');
    var btnSkip = document.getElementById('quiz-skip');

    var quizIndex = 0;
    var quizAnswers = {};
    var quizCompleted = false;
    var activeInput = null;

    function removeQuizFields() {
      form.querySelectorAll('.quiz-field').forEach(function (el) {
        el.remove();
      });
    }

    function addHiddenField(name, value) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      input.className = 'quiz-field';
      form.appendChild(input);
    }

    function attachQuizAnswers() {
      removeQuizFields();
      Object.keys(quizAnswers).forEach(function (key) {
        addHiddenField(key, quizAnswers[key]);
      });
    }

    function getQuizValue() {
      if (!activeInput) return '';

      if (activeInput.type === 'radio') {
        var picked = bodyEl.querySelector('input[type="radio"]:checked');
        return picked ? picked.value : '';
      }

      return activeInput.value.trim();
    }

    function buildQuizInput(q) {
      bodyEl.innerHTML = '';
      activeInput = null;
      bodyEl.classList.remove('quiz-body--text');

      if (q.type === 'choice') {
        var group = document.createElement('div');
        group.className = 'quiz-choices';
        q.options.forEach(function (opt, idx) {
          var id = 'quiz-opt-' + idx;
          var label = document.createElement('label');
          label.className = 'quiz-choice';
          label.setAttribute('for', id);
          var radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'quiz-choice';
          radio.id = id;
          radio.value = opt;
          if (idx === 0) activeInput = radio;
          label.appendChild(radio);
          label.appendChild(document.createTextNode(opt));
          group.appendChild(label);
        });
        bodyEl.appendChild(group);
        return;
      }

      if (q.type === 'textarea') {
        bodyEl.classList.add('quiz-body--text');
        var area = document.createElement('textarea');
        area.className = 'quiz-input quiz-textarea quiz-textarea--wishes';
        area.placeholder = q.placeholder || '';
        area.rows = 5;
        bodyEl.appendChild(area);
        activeInput = area;
        setTimeout(function () { area.focus(); }, 50);
      }
    }

    function startQuiz() {
      quizIndex = 0;
      quizAnswers = {};
      quizCompleted = false;
      showQuizStep();
    }

    function finishQuiz() {
      closeQuiz();
      attachQuizAnswers();
      quizCompleted = true;
    }

    function showQuizStep() {
      var q = QUIZ_QUESTIONS[quizIndex];
      if (!q) {
        finishQuiz();
        return;
      }

      overlay.hidden = false;
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('quiz-open');
      progressEl.textContent = 'Вопрос ' + (quizIndex + 1) + ' из ' + QUIZ_QUESTIONS.length;
      questionEl.textContent = q.text;
      buildQuizInput(q);
      var isLast = quizIndex === QUIZ_QUESTIONS.length - 1;
      btnNext.textContent = isLast ? 'Готово!' : 'Далее';
      btnSkip.hidden = q.type === 'textarea';
    }

    function closeQuiz() {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('quiz-open');
    }

    function saveCurrentAnswer() {
      var q = QUIZ_QUESTIONS[quizIndex];
      if (!q) return;
      var value = getQuizValue();
      if (value) quizAnswers[q.name] = value;
    }

    function goNext() {
      saveCurrentAnswer();
      quizIndex += 1;
      showQuizStep();
    }

    function goSkip() {
      quizIndex += 1;
      showQuizStep();
    }

    btnNext.addEventListener('click', goNext);
    btnSkip.addEventListener('click', goSkip);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) return;
    });

    coming.addEventListener('change', function () {
      if (coming.value === 'yes') {
        startQuiz();
        return;
      }
      closeQuiz();
      quizCompleted = false;
      quizAnswers = {};
      removeQuizFields();
    });

    form.addEventListener('submit', function (e) {
      syncInviteToForm();

      if (coming.value !== 'yes') {
        removeQuizFields();
        return;
      }

      if (!quizCompleted) {
        e.preventDefault();
        startQuiz();
      }
    });
  }

  initDeviceSwitcher();
  initInvitePersonalization();
  renderCalendar();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initRsvp();
  detectDevice();
  window.addEventListener('resize', detectDevice);
})();

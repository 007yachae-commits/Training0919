const TIMER_SETTING_KEY = 'exerciseTimerMinutes';
const DEFAULT_DURATION_MINUTES = 45;
let timerId = null;
let selectedDuration = getSavedDuration() * 60;
let remainingSeconds = selectedDuration;

const exerciseDurations = {
  cycle: 45,
  jogging: 30,
  marathon: 90,
  hiking: 60
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const restSeconds = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${restSeconds}`;
}

function updateTimer() {
  const timer = document.getElementById('timer');
  const progress = document.getElementById('progress');
  const durationLabel = document.querySelector('.timer-meta strong');
  const [minutes, seconds] = formatTime(remainingSeconds).split(':');

  timer.innerHTML = `${minutes}<span>:</span>${seconds}`;
  timer.setAttribute('aria-label', `현재 남은 시간 ${minutes}분 ${seconds}초`);
  progress.style.width = `${(remainingSeconds / selectedDuration) * 72}%`;
  durationLabel.textContent = `${Math.ceil(selectedDuration / 60)}분`;
}

function getSavedDuration() {
  const savedMinutes = Number.parseInt(localStorage.getItem(TIMER_SETTING_KEY), 10);

  if (Number.isInteger(savedMinutes) && savedMinutes >= 1 && savedMinutes <= 120) {
    return savedMinutes;
  }

  return DEFAULT_DURATION_MINUTES;
}

function saveTimerSetting(event) {
  event.preventDefault();

  const input = document.getElementById('timer-minutes');
  const minutes = Number.parseInt(input.value, 10);

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
    input.setCustomValidity('1분에서 120분 사이의 시간을 입력하세요.');
    input.reportValidity();
    return;
  }

  input.setCustomValidity('');
  localStorage.setItem(TIMER_SETTING_KEY, minutes.toString());
  window.location.href = 'index.html';
}

function initializeSettingPage() {
  const input = document.getElementById('timer-minutes');

  if (input) {
    input.value = getSavedDuration();
  }
}

function startTimer() {
  if (timerId !== null || remainingSeconds === 0) {
    return;
  }

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    updateTimer();

    if (remainingSeconds === 0) {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  stopTimer();
  remainingSeconds = selectedDuration;
  updateTimer();
}

function selectExercise(card) {
  const exercise = card.querySelector('input').value;
  document.querySelectorAll('.exercise-card').forEach((item) => {
    item.classList.toggle('selected', item === card);
  });
  selectedDuration = exerciseDurations[exercise] * 60;
  remainingSeconds = selectedDuration;
  resetTimer();
}

if (document.getElementById('timer')) {
  updateTimer();
}

initializeSettingPage();
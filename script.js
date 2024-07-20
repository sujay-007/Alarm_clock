const timeDisplay = document.getElementById('timer');
const setAlarmButton = document.getElementById('set-alarm');
const stopAlarmButton = document.getElementById('stop-alarm');
const alarmsContainer = document.querySelector('.Alarms-container');
const hourInput = document.getElementById('hour');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const alarmSound = document.getElementById('alarm-sound');

let alarms = [];

function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minutesStr = min < 10 ? '0' + min : min;
    const secondsStr = sec < 10 ? '0' + sec : sec;

    const timeString = hoursStr + ':' + minutesStr + ':' + secondsStr;
    timeDisplay.textContent = timeString;
}

function createAlarmElement(alarm, index) {
    const alarmDiv = document.createElement('div');
    alarmDiv.classList.add('alarm');
    alarmDiv.setAttribute('data-index', index);

    const alarmTimeString = `${alarm.hours < 10 ? '0' + alarm.hours : alarm.hours}:${alarm.minutes < 10 ? '0' + alarm.minutes : alarm.minutes}:${alarm.seconds < 10 ? '0' + alarm.seconds : alarm.seconds}`;
    alarmDiv.textContent = `Alarm set for ${alarmTimeString}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        clearTimeout(alarm.timeoutId);
        alarms.splice(index, 1);
        updateAlarmsContainer();
    });

    alarmDiv.appendChild(deleteButton);
    return alarmDiv;
}

function updateAlarmsContainer() {
    alarmsContainer.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmElement = createAlarmElement(alarm, index);
        alarmsContainer.appendChild(alarmElement);
    });
}

function setAlarm(e) {
    e.preventDefault();

    const hours = parseInt(hourInput.value);
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);

    let alarmTime = new Date();
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(seconds);
    alarmTime.setMilliseconds(0);

    const now = new Date();
    let timeToAlarm = alarmTime.getTime() - now.getTime();

    if (timeToAlarm < 0) {
        alert('Alarm time must be in the future!');
        return;
    }

    const timeoutId = setTimeout(() => {
        alarmSound.play();
    }, timeToAlarm);

    const alarm = { hours, minutes, seconds, timeoutId };
    alarms.push(alarm);
    updateAlarmsContainer();
}

function stopAlarm(e) {
    e.preventDefault();
    alarms.forEach(alarm => clearTimeout(alarm.timeoutId));
    alarms = [];
    updateAlarmsContainer();
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alert('All alarms stopped!');
}

setAlarmButton.addEventListener('click', setAlarm);
stopAlarmButton.addEventListener('click', stopAlarm);

setInterval(updateTime, 1000);
updateTime();

const timeDisplay = document.getElementById('timer');
const setAlarmButton = document.getElementById('set-alarm');
const stopAlarmButton = document.getElementById('stop-alarm');
const alarmsContainer = document.querySelector('.Alarms-container');
const hourInput = document.getElementById('hour');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const alarmSound = document.getElementById('alarm-sound');

let alarms = [];
let currentAlarmIndex = null;

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
        if (currentAlarmIndex === index) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            currentAlarmIndex = null;
        }
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

    if (hours > 23 || minutes > 59 || seconds > 59) {
        alert('Invalid time! Please enter a valid time (HH: 0-23, MM: 0-59, SS: 0-59).');
        return;
    }

    // Check if the alarm already exists
    const alarmExists = alarms.some(alarm => alarm.hours === hours && alarm.minutes === minutes && alarm.seconds === seconds);
    if (alarmExists) {
        alert('An alarm for this time already exists!');
        return;
    }

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
        currentAlarmIndex = alarms.findIndex(alarm => alarm.timeoutId === timeoutId);
    }, timeToAlarm);

    const alarm = { hours, minutes, seconds, timeoutId };
    alarms.push(alarm);
    updateAlarmsContainer();
}

function stopAlarm(e) {
    e.preventDefault();
    if (currentAlarmIndex !== null) {
        clearTimeout(alarms[currentAlarmIndex].timeoutId);
        alarms.splice(currentAlarmIndex, 1);
        updateAlarmsContainer();
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alert('Current alarm stopped!');
        currentAlarmIndex = null;
    } else {
        alert('No alarm is currently ringing!');
    }
}

setAlarmButton.addEventListener('click', setAlarm);
stopAlarmButton.addEventListener('click', stopAlarm);

setInterval(updateTime, 1000);
updateTime();

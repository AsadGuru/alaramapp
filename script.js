let timers = [];
let timerId = 0;

document.getElementById("start-btn").addEventListener("click", startNewTimer);

function startNewTimer() {
    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    // Validate input
    if (hours < 0 || minutes < 0 || seconds < 0) {
        alert("Please enter valid positive numbers!");
        return;
    }

    const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalTimeInSeconds <= 0) {
        alert("Please enter a time greater than zero.");
        return;
    }

    // Add new timer to array
    const newTimer = {
        id: timerId++,
        remainingTime: totalTimeInSeconds,
        intervalId: null,
        finished: false  // Track whether the timer has finished
    };

    timers.push(newTimer);
    displayTimers();
    startTimer(newTimer);
}

function startTimer(timer) {
    timer.intervalId = setInterval(() => {
        timer.remainingTime--;
        updateTimerDisplay(timer);

        // Trigger audio when 7 seconds remain
        if (timer.remainingTime === 7 && !timer.finished) {
            const alertSound = document.getElementById("alert-sound");
            alertSound.play();
        }

        if (timer.remainingTime <= 0 && !timer.finished) {
            clearInterval(timer.intervalId);
            timer.intervalId = null;
            handleTimerEnd(timer);
        }
    }, 1000);
}

function stopTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (timer && timer.intervalId) {
        clearInterval(timer.intervalId);
        timer.intervalId = null;
    }

    // Stop the alert sound when a timer is deleted
    const alertSound = document.getElementById("alert-sound");
    alertSound.pause();
    alertSound.currentTime = 0;  // Reset the alert sound
    timers = timers.filter(t => t.id !== timerId);
    displayTimers();
}

function displayTimers() {
    const timerList = document.getElementById("active-timers-list");
    timerList.innerHTML = ""; // Clear the timer list

    if (timers.length === 0) {
        // Show a message when there are no timers
        const noTimersMessage = document.createElement("div");
        noTimersMessage.classList.add("no-timers-message");
        noTimersMessage.textContent = "No active timers";
        timerList.appendChild(noTimersMessage);
    } else {
        // Display the timers if there are any
        timers.forEach((timer) => {
            const timerElement = document.createElement("div");
            timerElement.classList.add("timer");
            timerElement.style.backgroundColor = "#d3d3d3"; // Gray background for the timer

            // If the timer has finished, add a message
            if (timer.remainingTime <= 0 && !timer.finished) {
                timerElement.classList.add("timer-ended");
                timerElement.innerHTML += `<p class="timer-finished-message">Time's up!</p>`;
                timer.finished = true; // Mark the timer as finished
            }

            const timeLeft = formatTime(timer.remainingTime);
            timerElement.innerHTML = `
                <span>${timeLeft}</span>
                <button class="stop-btn" onclick="stopTimer(${timer.id})">Delete</button>
            `;

            

            timerList.appendChild(timerElement);
        });
    }
}

function updateTimerDisplay(timer) {
    displayTimers();
}

function handleTimerEnd(timer) {
    const alertSound = document.getElementById("alert-sound");
    alertSound.play();
    displayTimers();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

// Importing libraries
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Get DOM elements
const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Initialize variables
let userSelectedDate = null;
let countdownInterval = null;

// Flatpickr configuration
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    handleDateSelection(selectedDates[0]);
  },
};

// Initialize flatpickr
flatpickr(datetimePicker, options);

// Function to handle date selection
function handleDateSelection(selectedDate) {
  const currentDate = new Date();
  
  if (selectedDate <= currentDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topCenter',
    });
    startButton.disabled = true;
    userSelectedDate = null;
  } else {
    startButton.disabled = false;
    userSelectedDate = selectedDate;
  }
}

// Function to format time values (add leading zeros)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Function to convert milliseconds to days, hours, minutes, seconds
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Function to update timer display
function updateTimerDisplay(timeObject) {
  daysElement.textContent = addLeadingZero(timeObject.days);
  hoursElement.textContent = addLeadingZero(timeObject.hours);
  minutesElement.textContent = addLeadingZero(timeObject.minutes);
  secondsElement.textContent = addLeadingZero(timeObject.seconds);
}

// Function to start countdown
function startCountdown() {
  if (!userSelectedDate) return;
  
  // Disable input and start button
  datetimePicker.disabled = true;
  startButton.disabled = true;
  
  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;
    
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false; // Enable input after countdown ends
      return;
    }
    
    const timeObject = convertMs(timeDifference);
    updateTimerDisplay(timeObject);
  }, 1000);
}

// Add event listener to start button
startButton.addEventListener('click', startCountdown);
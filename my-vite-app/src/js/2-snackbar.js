// Importing iziToast library
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Get the form element
const form = document.querySelector('.form');

// Add event listener for form submission
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  
  // Get form values
  const delay = parseInt(form.elements.delay.value);
  const state = form.elements.state.value;
  
  // Create and handle promise
  createPromise(delay, state)
    .then(({ delay }) => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        messageColor: '#008000',
        backgroundColor: '#e6ffe6',
      });
    })
    .catch(({ delay }) => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        messageColor: '#ff0000',
        backgroundColor: '#ffe6e6',
      });
    });
  
  // Reset the form
  form.reset();
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve({ delay });
      } else {
        reject({ delay });
      }
    }, delay);
  });
}
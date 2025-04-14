// Importing required libraries
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM elements
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');

// Create a lightbox instance
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Pixabay API configuration
const API_KEY = 'YOUR_PIXABAY_API_KEY'; // Замените на ваш ключ Pixabay API
const API_URL = 'https://pixabay.com/api/';

// Add event listener for form submission
searchForm.addEventListener('submit', handleSearch);

// Function to handle image search
async function handleSearch(event) {
  event.preventDefault();
  
  // Get search query
  const searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  
  // Validate search query
  if (!searchQuery) {
    iziToast.warning({
      title: 'Внимание',
      message: 'Пожалуйста, введите поисковый запрос',
      position: 'topCenter',
    });
    return;
  }
  
  // Clear previous results
  gallery.innerHTML = '';
  
  // Show loader
  loader.style.display = 'block';
  
  try {
    // Fetch images from Pixabay API
    const images = await fetchImages(searchQuery);
    
    // Handle search results
    if (images.length === 0) {
      showNoImagesMessage();
    } else {
      renderGallery(images);
    }
  } catch (error) {
    showErrorMessage(error);
  } finally {
    // Hide loader
    loader.style.display = 'none';
  }
}

// Function to fetch images from Pixabay API
async function fetchImages(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  
  const response = await fetch(`${API_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.hits;
}

// Function to render gallery
function renderGallery(images) {
  const markup = images.map(image => createImageCard(image)).join('');
  gallery.innerHTML = markup;
  
  // Refresh lightbox
  lightbox.refresh();
}

// Function to create an image card
function createImageCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b> ${likes}</p>
        <p class="info-item"><b>Views</b> ${views}</p>
        <p class="info-item"><b>Comments</b> ${comments}</p>
        <p class="info-item"><b>Downloads</b> ${downloads}</p>
      </div>
    </div>
  `;
}

// Function to show no images message
function showNoImagesMessage() {
  iziToast.info({
    title: 'Информация',
    message: 'Sorry, there are no images matching your search query. Please try again!',
    position: 'topCenter',
  });
}

// Function to show error message
function showErrorMessage(error) {
  iziToast.error({
    title: 'Ошибка',
    message: `Произошла ошибка: ${error.message}`,
    position: 'topCenter',
  });
}
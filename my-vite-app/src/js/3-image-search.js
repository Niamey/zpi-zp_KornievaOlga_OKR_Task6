// Видаліть ці рядки:
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

// Залиште ці імпорти:
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM елементи
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');

// Створення екземпляра лайтбоксу - тепер використовуємо глобальний об'єкт
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Оновлений масив з демо-зображеннями
const demoImages = [
  {
    webformatURL: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    tags: "природа, пейзаж, дерево",
    likes: 120,
    views: 5800,
    comments: 25,
    downloads: 980
  },
  {
    webformatURL: "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg",
    tags: "квіти, природа, рослини",
    likes: 89,
    views: 3200,
    comments: 15,
    downloads: 620
  },
  {
    webformatURL: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
    tags: "природа, гори, озеро",
    likes: 210,
    views: 7400,
    comments: 45,
    downloads: 1500
  },
  {
    webformatURL: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
    tags: "дорога, осінь, дерева",
    likes: 75,
    views: 2800,
    comments: 10,
    downloads: 520
  },
  {
    webformatURL: "https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_1280.jpg",
    tags: "гори, пейзаж, природа",
    likes: 110,
    views: 4200,
    comments: 32,
    downloads: 850
  },
  {
    webformatURL: "https://cdn.pixabay.com/photo/2014/09/14/18/04/dandelion-445228_960_720.jpg",
    largeImageURL: "https://cdn.pixabay.com/photo/2014/09/14/18/04/dandelion-445228_1280.jpg",
    tags: "кульбаба, природа, макро",
    likes: 185,
    views: 6100,
    comments: 38,
    downloads: 1200
  }
];

// Додавання обробника події для форми пошуку
searchForm.addEventListener('submit', handleSearch);

// Функція обробки пошуку зображень
async function handleSearch(event) {
  event.preventDefault();
  
  // Отримуємо пошуковий запит
  const searchQuery = event.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  
  // Перевіряємо пошуковий запит
  if (!searchQuery) {
    iziToast.warning({
      title: 'Увага',
      message: 'Будь ласка, введіть пошуковий запит',
      position: 'topCenter',
    });
    return;
  }
  
  // Очищуємо попередні результати
  gallery.innerHTML = '';
  
  // Показуємо індикатор завантаження
  loader.style.display = 'block';
  
  try {
    // Імітація завантаження даних із затримкою
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Фільтрація зображень за пошуковим запитом
    const filteredImages = demoImages.filter(image => {
      return image.tags.toLowerCase().includes(searchQuery);
    });
    
    console.log('Пошуковий запит:', searchQuery);
    console.log('Знайдено зображень:', filteredImages.length);
    
    // Обробка результатів пошуку
    if (filteredImages.length === 0) {
      showNoImagesMessage();
    } else {
      renderGallery(filteredImages);
    }
  } catch (error) {
    showErrorMessage(error);
  } finally {
    // Ховаємо індикатор завантаження
    loader.style.display = 'none';
  }
}

// Функція для відображення галереї
function renderGallery(images) {
  const markup = images.map(image => createImageCard(image)).join('');
  gallery.innerHTML = markup;
  
  // Оновлюємо лайтбокс
  lightbox.refresh();
}

// Функція для створення картки зображення
function createImageCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Вподобання</b> ${likes}</p>
        <p class="info-item"><b>Перегляди</b> ${views}</p>
        <p class="info-item"><b>Коментарі</b> ${comments}</p>
        <p class="info-item"><b>Завантаження</b> ${downloads}</p>
      </div>
    </div>
  `;
}

// Функція для відображення повідомлення про відсутність зображень
function showNoImagesMessage() {
  iziToast.info({
    title: 'Інформація',
    message: 'На жаль, за вашим запитом не знайдено жодних зображень. Спробуйте інший запит!',
    position: 'topCenter',
  });
}

// Функція для відображення повідомлення про помилку
function showErrorMessage(error) {
  iziToast.error({
    title: 'Помилка',
    message: `Сталася помилка: ${error.message}`,
    position: 'topCenter',
  });
}

// Показуємо всі зображення при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
  renderGallery(demoImages);
});
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderPhotosList } from './js/renderPhotosList';
import { getPhotos } from './js/apiService';

const submitForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
loadMoreBtn.style.setProperty('display', 'none', 'important');
let total = 0;

submitForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadPhotos);

let gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt' });

function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  galleryList.innerHTML = '';
  total = 0;

  if (searchQuery !== '') {
    page = 1;
    onLoadPhotos();
    loadMoreBtn.style.setProperty('display', 'none', 'important');
  };
};

function onLoadPhotos() {
  loadMoreBtn.style.setProperty('display', 'none', 'important');
  getPhotos(searchQuery, page)
    .then((array) => {
      renderPhotosList(array.hits, galleryList, gallery);
      total += array.hits.length;
      const totalHits = array.totalHits;

      if (total === 0) {
        Notify.warning('Sorry, there are no images matching your search query.');
      } else if (total >= totalHits) {
        Notify.warning('You have reached the end of the search results.');
      } else {
        loadMoreBtn.style.removeProperty('display'); 
        forScrollPage();
        if (page === 2) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }
      }
    })
    .catch((error) => {
      Notify.failure(
        'Sorry, there was an error retrieving images. Please try again.'
      );
    });
  page += 1;
}

function forScrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

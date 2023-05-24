export function renderPhotosList(photos, galleryList, gallery) {
  const markup = photos
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
          <div class="photo-card">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" max-width="400px" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b><br>${likes}</br>
              </p>
              <p class="info-item">
                <b>Views</b><br>${views}</br>
              </p>
              <p class="info-item">
                <b>Comments</b><br>${comments}</br>
              </p>
              <p class="info-item">
                <b>Downloads</b><br>${downloads}</br>
              </p>
            </div>
          </div>
        `;
      }
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

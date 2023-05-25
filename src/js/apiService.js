import axios from 'axios';

const API_KEY = '36655990-0724db180fb71d9be8c2c1bf3';
const BASE_URL = 'https://pixabay.com/api/?key=';
const OPTIONS = '}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export async function getPhotos(name, page) {
  try {
    const response = await axios.get(
      BASE_URL + API_KEY + `&q=${name}` + OPTIONS + `&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch photos');
  }
}

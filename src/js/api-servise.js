import axios from 'axios';

async function getData(searchQuery, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '31497711-5e6e9dab33a5e06d4ffb7193a';

  const data = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`
  );
  return data;
}

export default { getData };

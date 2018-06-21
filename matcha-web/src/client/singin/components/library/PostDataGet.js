import axios from 'axios';

export function PostDataGet(type, userData) {
  let BaseUrl = 'http://localhost:8100/public/index.php/';
  return new Promise((resolve, reject) => {
    axios.get(BaseUrl + type, userData)
    .then(res => {
      resolve(res.data);
    })
    .catch(error => {
      reject(error);
    });
  });
}

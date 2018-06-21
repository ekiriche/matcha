import axios from 'axios';

export function PostData(type, userData) {
  let BaseUrl = 'http://localhost:8100/public/index.php/';
  return new Promise((resolve, reject) => {
    axios.post(BaseUrl + type, userData)
    .then(res => {
      resolve(res.data);
    })
    .catch(error => {
      reject(error);
    });
  });
}

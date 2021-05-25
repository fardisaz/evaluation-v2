import axios from 'axios';

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getIdeas() {
    return apiClient.get('/ideas');
  },
  getEvaluatedIdeas() {
    return apiClient.get('/evaluatedIdeas');
  },
  postIdea(idea) {
    return apiClient.post('/ideas', idea);
  },
  putIdea(idea) {
    apiClient.put('/ideas/' + idea.id, idea);
    return apiClient.get('/ideas');
  }
};

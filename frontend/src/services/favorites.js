import axios from "axios";

class FavoriteDataService {
    getFavorites(userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites/${userId}`);
    }

    updateFavorites(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites`, data);
    }
}

export default new FavoriteDataService();
import axios from "axios";
// Next we make an 'instance' of it
const instance = axios.create({
	// .. where we make our configurations
	baseURL: "http://localhost:5095/api/",
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

// instance.interceptors.request...
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (!error.response) {
			console.log("Please check your internet connection.");
		}

		return Promise.reject(error);
	}
);

export default instance;

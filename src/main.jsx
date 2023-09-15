import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.jsx"; // a centralized library
import { Provider } from "react-redux"; // Provider makes the Redux store available to any nested components that need to access the Redux store.
import { fetchPosts } from "./features/posts/postsSlice.jsx";
import { fetchUsers } from "./features/users/usersSlice.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// we want to load the user & post whent the page loads 
store.dispatch(fetchUsers()) 
store.dispatch(fetchPosts()) 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
    
  </React.StrictMode>
);

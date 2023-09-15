// import counterReducer from '../features/counter/counterSlice'
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'

export const store = configureStore({
    // reducer is an agent taking the info from client, process the data and check against if there any changes in the database, if changes were made, it will update the database
    // reducer:{ // reducer for counter
    //     counter: counterReducer,
    // } 

    reducer: {
        posts: postsReducer,
        users: usersReducer
    }

})
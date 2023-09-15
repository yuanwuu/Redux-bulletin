import { 
  createSlice, 
  createAsyncThunk, 
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from 'axios'
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({
  sortComparer: (a,b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle', //'idle | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0
})

export const fetchPosts = createAsyncThunk ('posts/fetchPosts', async()=>{
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async(initialPost) =>{ // initialPost is the body 
  const response = await axios.post(POSTS_URL, initialPost)
  return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost',async(initialPost)=>{
  const {id} = initialPost
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`,initialPost)
    return response.data
  } catch (error) {
    // return error.message
    return initialPost //only for testing Redux
  }
})

export const deletePost = createAsyncThunk('posts/deletePost',async(initialPost)=>{
  const {id} = initialPost
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`)
    if (response?.status === 200) return initialPost
    return `${response?.status}: ${response?.statusText}`
  } catch (error) {
    return error.message
  }
})


const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: { // a container that holds 'reducer' funct.
    // postAdded:{ // a funct that can be dispatched 
    //   reducer(state,action){ // actual action reducer to perform an action
    //     state.posts.push(action.payload) // what a 'reducer' will do, in this case, it is pushing payload from action to the state
    //   },
    //   prepare(title,content, userId){ // a builder function used to create the action object that will be dispatched when the postAdded action is invoked.
    //     return { // what is being return when 'postAdded' is called
    //       payload: { // inside the action.payload, the folowing is being loaded to be dispatched
    //         id: nanoid(),
    //         title,
    //         content,
    //         date: new Date().toISOString(),
    //         userId,
    //         reactions: {
    //           thumbsUp: 0,
    //           wow: 0,
    //           heart: 0,
    //           rocket: 0,
    //           coffee: 0
    //         }
    //       }
    //     }
    //   }
    // },
    reactionAdded(state,action) {
      const {postId, reaction} = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) { // extraReducers is used outside of the origial/original reducers
    builder
      .addCase(fetchPosts.pending, (state, action) =>{
        state.status = 'loading'
      })
      .addCase (fetchPosts.fulfilled,(state, action) =>{
        state.status = 'succeeded'
        let min = 1; // 1 min
        const loadedPosts = action.payload.map(post =>{
          post.date = sub(new Date(), {minutes: min++}).toISOString(),
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        })
        // state.posts = loadedPosts
        postsAdapter.upsertMany(state,loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) =>{
        state.status = 'failed'
        state.error = action.error.message
      }) 
      .addCase(addNewPost.fulfilled,(state,action) =>{
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        console.log(action.payload)
        postsAdapter.addOne(state,action.payload)
      })
      .addCase(updatePost.fulfilled,(state,action)=>{
        if(!action.payload?.id){
          console.log('update could not complete')
          console.log(action.payload)
          return
        }
        
        action.payload.date = new Date().toISOString()
        postsAdapter.upsertOne(state,action.payload)
      })
      .addCase(deletePost.fulfilled, (state,action) =>{
        if(!action.payload?.id){
          console.log('Delete could no complete')
          console.log(action.payload)
          return
        }
        const {id} = action.payload
        postsAdapter.removeOne(state,id)
      })
  }
});


//getSelectors creates these selectors and we rename them with aliases using destructuring 
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;


export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts,userId) => posts.filter(post =>post.userId === userId)
)

export const { reactionAdded } = postsSlice.actions; // bc this is an action from postsSlice
export default postsSlice.reducer;





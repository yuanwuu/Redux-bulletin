import { useSelector } from "react-redux";
import { selectPostIds,getPostsError,getPostsStatus} from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";


const PostsList = () => {

  const orderedPostIds = useSelector(selectPostIds)
    // const posts = useSelector(selectAllPosts) // imported as a funct so in the futurn the state/structure even changed, we only need to update the postsSlice
    const postStatus = useSelector(getPostsStatus) 
    const error = useSelector(getPostsError) 


   let content;
   if (postStatus === 'loading') {
    content = <p>loading ...</p>
   } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map(postId =><PostsExcerpt key={postId} postId={postId} />)
   } else if (postStatus === 'failed') {
    console.error('error: ',error)
    content = <p>{error}</p>
   }

  return (
    <section>
      {content} 
    </section>
    
  )
}

export default PostsList



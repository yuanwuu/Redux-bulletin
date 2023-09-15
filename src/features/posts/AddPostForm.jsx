import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  // a post will have a title and content, and initial state will be empty as nothing has been inputed in
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const users = useSelector(selectAllUsers); // create a user container

  //createing another containers for when input was received and make changed to 'setTitle' & 'setContent' so they can update the 'title' & 'content'
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClicked = () => {
    if(canSave) {
      try {
        setAddRequestStatus('pending')
        dispatch(addNewPost({title, body: content, userId})).unwrap()

        setTitle('') //set them back to empty for next new post
        setContent('')
        setUserId('')
        navigate('/')

      } catch (error) {
        console.error('Failed to save the post', error)
      } finally {
        setAddRequestStatus('idle') // after canSave, reset the state to 'idle' for next new post
      }
    }
  };


  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  //so how data will be received and processed? first we need a form for the client to full the content & title, submit and send to the us

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title} // line 5
          onChange={onTitleChanged}
        />
        <label>
          <label htmlFor="postAuthor">Author:</label>
          <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
            {usersOptions} 
            {/* no need to use <option> tag, already done with .map() in usersOptions */}
          </select>
        </label>
        <label htmlFor="postContent">Content:</label>
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content} // line 6
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;

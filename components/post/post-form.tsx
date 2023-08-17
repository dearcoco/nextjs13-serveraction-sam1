'use client'

import { createPost, updatePost } from "@/actions/post-actions";
import SubmitButton from "../global/submit-button";
import Form from "../global/Form";
import { useEditPostStore } from "@/stores/edit-post-store";

const PostForm = () => {
    const {editPost, setEditPost} = useEditPostStore();

    async function handleNewPost(formData: FormData) {
        const title = formData.get('title')!.toString();
        const image = formData.get('image')!.toString();

        if (editPost) {
            await updatePost({id: editPost.id, title, image});
            setEditPost(null);
        }
        else {
            await createPost({title, image});
        }
    }

    return (
        <div>
            <h2>Create Post</h2>
            <Form action={handleNewPost} style={{display: 'flex', gap: 20, margin: '30px 0'}}>
                <input type="text" name="title" placeholder="Title" 
                    defaultValue={editPost?.title} required/>
                <input type="text" name="image" placeholder="Image" 
                    defaultValue={editPost?.image} required/>
                {
                    editPost 
                        ? <>
                            <SubmitButton value="update" />
                            <button onClick={()=>setEditPost(null)}>cancel</button>
                        </>
                        : <SubmitButton value="create" />
                }
                
            </Form>
        </div>
    );
}
 
export default PostForm;
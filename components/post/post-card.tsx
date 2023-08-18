'use client'

import { IPost } from "@/models/structs";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { deletePost } from "@/actions/post-actions";
import { useEditPostStore } from "@/stores/edit-post-store";

const PostCard = ({post}: {post: IPost}) => {
    //const {setEditPost} = useEditPostContext();

    const {setEditPost} = useEditPostStore();
    let [isPending, startTransition] = useTransition();

    async function handleDelete(postId: string): Promise<void> {
        if (window.confirm('Do you want to delete this post?')) {
            await deletePost(postId);
        }
    }
    return (
        <div>
            <Link href={`/post/${post.id}`}>
                <div style={{width: '200px', height: '200px', position: 'relative', border: 'solid 1px'}}>
                    <Image src={post.image} alt='image' fill style={{objectFit: 'contain',}} />
                </div>
                <h3>{post.title}</h3>
            </Link>
            <div style={{display:'flex', gap: 20}}>
                <button onClick={() => setEditPost(post)}>edit</button>
                <button onClick={() => startTransition(() => handleDelete(post.id))} disabled={isPending}>
                    {isPending ? 'Loading...' : 'delete'}
                </button>
            </div>
        </div>
    );
}
 
export default PostCard;
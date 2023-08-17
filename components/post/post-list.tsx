'use client'

import { IPost } from "@/models/structs";
import PostCard from "./post-card";

const PostList = ({posts}: {posts: IPost[]}) => {
    return (
        <div style={{display:'flex', gap: 20, flexWrap:'wrap'}}>
            {
                posts.map((p) => (
                    <PostCard key={p.id} post={p}/>                
                ))
            }
        </div>
    );
}
 
export default PostList;
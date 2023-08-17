
import { getAllPosts } from "@/actions/post-actions";
import Feature from "@/components/post/feature";
import Pagination from "@/components/post/pagination";
import PostForm from "@/components/post/post-form";
import PostList from "@/components/post/post-list";
import { PostQuery } from "@/hooks/useCustomRouter";


export default async function PostPage({params, searchParams}:{
    params: any,
    searchParams: PostQuery
}) {
    const {items, totalPage} = await getAllPosts(searchParams);
    
    return (
        <div>
            <h1 style={{color: 'red'}}>Post CRUD</h1>
            <PostForm />
            <Feature />
            {items && <PostList posts={items} />}
            {totalPage && <Pagination totalPage={totalPage} />}
        </div>
    );
}
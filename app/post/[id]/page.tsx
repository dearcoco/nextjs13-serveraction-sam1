'use server'

import { getOnePost } from "@/actions/post-actions";
import { PostQuery } from "@/hooks/useCustomRouter";
import Image from "next/image";

export default async function DetailPage({params: {id} , searchParams}:{
    params: {id: string},
    searchParams: PostQuery
}) {
    const post = await getOnePost(id);

    return (

        <div>
            <h3>{post.title}</h3>
            <Image src={post.image} alt='image' width={200} height={200} priority />
        </div>
    );
}
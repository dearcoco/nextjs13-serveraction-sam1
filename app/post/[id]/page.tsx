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
            <div>{post.title}</div>
            <div style={{width: '500px', height: '500px', position: "relative", border: 'solid 1px'}}>
                <Image src={post.image} alt='image' fill style={{objectFit: 'contain',}} />
            </div>
        </div>
    );
}
'use server'

import { PostQuery } from "@/hooks/useCustomRouter";
import Post from "@/models/postModel";
import { IPost } from "@/models/structs";
import connectDB from "@/utils/database";
import { revalidatePath } from "next/cache";

export interface IPagedResult<T> {
    items: T[],
    count: number,
    totalPage: number;
    limit: number
}

export async function getAllPosts(query: PostQuery): Promise<IPagedResult<IPost>> {

	await connectDB();

    try {
        const search = query?.search || '';
        const sort = query?.sort || 'createdAt';

        const limit = query?.limit ? parseInt(query.limit) : 3;
        const page = query?.page ? parseInt(query.page) : 1;
        const skip = query?.skip ? parseInt(query.skip) : limit * (page - 1);
        
        const posts = await Post
            .find({title: {$regex: search}})
            .sort(sort)
            .limit(limit)
            .skip(skip);

        const count = await Post.find({title: {$regex: search}}).count();

        const totalPage = Math.ceil(count / limit);

        const mapped = posts.map((val) =>{
            return {
                ...val._doc, 
                id: val._id.toString(), 
                _id: val._id.toString()    
            }
        })
        
        return {items: mapped, count, totalPage, limit};
    }
    catch (error: any) {
        throw new Error(error.message || 'Failed to get all posts!');
    }
}

export async function getOnePost(postId: string): Promise<IPost> {

	await connectDB();

    try {
        
        const val = await Post.findById(postId);
        return {
            ...val._doc, 
            id: val._id.toString(), 
            _id: val._id.toString()    
        }
    }
    catch (error: any) {
        throw new Error(error.message || 'Failed to get a post!');
    }
}

export async function createPost({title, image}
	: {title: string, image: string}): Promise<IPost> {

	await connectDB();

    try {
        const _post = new Post({title, image});
        await _post.save();
        const res = {
            ..._post._doc, 
            id: _post._id.toString(), 
            _id: _post._id.toString() 
        };

        revalidatePath('/post');
        return res;
    }
    catch (error: any) {
        throw new Error(error.message || 'Failed to create post!');
    }
}

export async function updatePost({id, title, image}
	: {id: string, title: string, image: string}): Promise<IPost> {

	await connectDB();

    try {
        const _post = await Post.findByIdAndUpdate(id, {title, image}, {new: true});
        const res = {
            ..._post._doc, 
            id: _post._id.toString(), 
            _id: _post._id.toString() 
        };

        revalidatePath('/post');
        return res;
    }
    catch (error: any) {
        throw new Error(error.message || 'Failed to update post!');
    }
}

export async function deletePost(id: string): Promise<IPost> {

	await connectDB();

    try {
        const _post = await Post.findByIdAndDelete(id, {new: true});
        const res = {
            ..._post._doc, 
            id: _post._id.toString(), 
            _id: _post._id.toString() 
        };

        revalidatePath('/post');
        return res;
    }
    catch (error: any) {
        throw new Error(error.message || 'Failed to delete post!');
    }
}
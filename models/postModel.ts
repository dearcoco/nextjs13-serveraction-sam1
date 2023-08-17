import { Model, Schema, model, models } from "mongoose";
import { IPost } from "./structs";

interface IPostModel extends Model<IPost> {}

const postSchema = new Schema<IPost, IPostModel>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    
}, {timestamps: true});

const Post = models.Post || model<IPost, IPostModel>('Post', postSchema);

export default Post;
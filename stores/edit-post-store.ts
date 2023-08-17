import { IPost } from "@/models/structs";
import { create } from "zustand";

type EditPostStore = {
	editPost: IPost | null;
	setEditPost: (editPost: IPost | null) => void;
};

export const useEditPostStore = create<EditPostStore>()((set) => ({
	editPost: null,
	setEditPost: (editPost) => set((state) => ({...state, editPost})),
}));

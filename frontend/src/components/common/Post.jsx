import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

import LoadingSpinner from "./LoadingSpinner";

import getFormattedTime from "../../utils/date/getDate";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Post = ({ post }) => {

    // logged in user
    const { data: me } = useQuery({ queryKey: ["authUser"] });

    // console.log(post);
    let isMyPost = me._id === post.owner._id;
    const isLiked = post.likedBy?.includes(me._id);
    const formattedDate = getFormattedTime(post.createdAt);

    const queryClient = useQueryClient();

    //useMutation for deleting post
    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/post/delete/${post._id}`, { method: "DELETE", });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not delete post");
            // console.log(data);
        },
        onSuccess: () => {
            toast.success("post deleted");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: () => toast.error(error || "could not delete")
    })
    const handleDeletePost = () => deletePost();

    // useMutation for commenting
    const [comment, setComment] = useState("");
    const { mutate: addComment, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/post/comment/${post._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: comment })
                })
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "something went wronf")
            return data;
        },
        onSuccess: (data) => {
            toast.success("comment added");
            // queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) return { ...p, comments: data.updatedComments };
                    return p;
                })
            });
            setComment("");
        },
        onError: () => { toast.error(error.message || "could not add comment") }
    })
    const handlePostComment = (e) => { e.preventDefault(); if (isCommenting) return; addComment(); };

    //useMutation for liking post
    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async (postID) => {
            const res = await fetch(`/api/post/like/${postID}`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "could not like post")
            return data;
        },
        onSuccess: (data) => {
            // queryClient.invalidateQueries({ queryKey: ["posts"] }); //refetches all posts => bad UX
            // hence we will use caching to update the likes without refetching all posts 
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) return { ...p, likedBy: data.updatedLikes };
                    return p;
                });
            });
        },
        onError: () => toast.error("could not like post")
    })
    const handleLikePost = () => { if (isLiking) return; likePost(post._id); };

    return (
        <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
            <div className='avatar'>
                <Link to={`/profile/${post.owner.username}`} className='w-8 h-8 rounded-full overflow-hidden'>
                    <img src={post.owner.profileImg || "/avatar-placeholder.png"} />
                </Link>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex gap-2 items-center'>
                    <Link to={`/profile/${post.owner.username}`} className='font-bold'>
                        {post.owner.fullName}
                    </Link>
                    <span className='text-gray-700 flex gap-1 text-sm'>
                        <Link to={`/profile/${post.owner.username}`}>@{post.owner.username}</Link>
                        <span>·</span>
                        <span>{formattedDate}</span>
                    </span>
                    {isMyPost && (
                        <span className='flex justify-end flex-1'>
                            {!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}
                            {isDeleting && <LoadingSpinner size="sm" />}
                        </span>
                    )}
                </div>
                <div className='flex flex-col gap-3 overflow-hidden'>
                    <span>{post.text}</span>
                    {post.picture && (
                        <img
                            src={post.picture}
                            className='w-full object-contain rounded-lg border border-gray-700'
                            alt=''
                        />
                    )}
                </div>
                <div className='flex justify-between mt-3'>
                    <div className='flex gap-4 items-center w-full justify-between'>
                        <div
                            className='flex gap-1 items-center cursor-pointer group'
                            onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                        >
                            <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                            <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                                {post.comments?.length}
                            </span>
                        </div>
                        {/* We're using Modal Component from DaisyUI */}
                        <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                            <div className='modal-box rounded border border-gray-600'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {post.comments?.length === 0 && (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet 🤔 Be the first one 😉
                                        </p>
                                    )}
                                    {post.comments?.map((comment) => (
                                        <div key={comment._id} className='flex gap-2 items-start'>
                                            <div className='avatar'>
                                                <div className='w-8 rounded-full'>
                                                    <img
                                                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                    <span className='font-bold'>
                                                        {comment.user.fullName}
                                                    </span>
                                                    <span className='text-gray-700 text-sm'>
                                                        @{comment.user.username}
                                                    </span>
                                                </div>
                                                <div className='text-sm'>{comment.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                    onSubmit={handlePostComment}
                                >
                                    <textarea
                                        className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                        placeholder='Add a comment...'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                        {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                                    </button>
                                </form>
                            </div>
                            <form method='dialog' className='modal-backdrop'>
                                <button className='outline-none'>close</button>
                            </form>
                        </dialog>

                        <div className='flex gap-1 items-center group cursor-pointer'>
                            <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                            <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                        </div>

                        <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                            {!isLiking && <FaRegHeart className={`w-4 h-4 cursor-pointer group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"}`} />}
                            {isLiking && <LoadingSpinner size="sm" />}
                            <span className={`text-sm text-slate-500 group-hover:text-pink-500 ${isLiked && "text-pink-500"}`}>
                                {post.likedBy.length}
                            </span>
                        </div>
                        <div className="group">
                            <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer group-hover:text-purple-500' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Post;
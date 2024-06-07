import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Posts = ({ feedType }) => {

    const getEndPoint = (feedType) => {
        if (feedType === "following") return "/api/post/following"
        else return "/api/post/all";
    }

    const postEndPoint = getEndPoint(feedType);

    const { data: posts, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch(postEndPoint);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "something wnrt wrong")
                return data;
            } catch (error) {
                throw error;
            }
        },
        retry: false
    })

    // to refetch posts when feedType is changed
    useEffect(() => {
        refetch();
    }, [feedType, refetch])

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;
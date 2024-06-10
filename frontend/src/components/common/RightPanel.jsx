import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner"

const RightPanel = () => {
    const { data: suggestedUsers, isLoading, isError, error } = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/user/suggested");
                const data = res.json();
                if (!res.ok) throw new Error(data.error || "something went wrong")
                return data;
            } catch (error) {
                toast.error(error.message || "could not get suggested users")
            }
        },
        retry: false
    })

    const { followUser, isPending } = useFollow();

    if (!isPending && !suggestedUsers?.length) return <div className=" w-0 md:w-64"></div>

    return (
        <div className="">
            <div className="bg-zinc-800 p-4 rounded-md sticky top-2 hidden lg:block m-2">
                <p className='font-bold mb-2'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {isLoading && <RightPanelSkeleton />}
                    {isLoading && <RightPanelSkeleton />}
                    {isLoading && <RightPanelSkeleton />}
                    {isLoading && <RightPanelSkeleton />}
                    {!isLoading && suggestedUsers?.map((user) => (
                        <div key={user._id} className='flex items-center justify-between gap-4'>
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex gap-2 items-center'
                            >
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img src={user.profileImg || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-semibold tracking-tight truncate w-28'>
                                        {user.fullname}
                                    </span>
                                    <span className='text-sm text-slate-500'>@{user.username}</span>
                                </div>
                            </Link>
                            <button
                                className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                onClick={() => { (e) => e.preventDefault(); followUser(user._id); }}
                            >
                                {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};
export default RightPanel;
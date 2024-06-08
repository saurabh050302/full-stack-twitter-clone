import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from 'react-hot-toast'

const useFollow = () => {

    const queryClient = useQueryClient();

    const { mutate: followUser, isPending } = useMutation({
        mutationFn: async (userID) => {
            const res = await fetch("/api/user/follow",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: userID })
                })
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "followUnfollow failed")
            console.log(data);
        },
        onSuccess: () => {
            Promise
                .all([
                    queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                    queryClient.invalidateQueries({ queryKey: ["authUser"] })])
                .then(() => toast.success("follow successful"))
        },
        onError: () => toast.error(error.message)
    })

    return { followUser, isPending };

}

export default useFollow;
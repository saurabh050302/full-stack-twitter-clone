import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { IoSettingsOutline } from "react-icons/io5";
import toast from "react-hot-toast";


const EditProfileModal = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [formData, setFormData] = useState({
        fullname: authUser.fullname,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        currentPassword: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const queryClient = useQueryClient();
    const { mutate: updateUserProfile, error } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formData })
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) throw new Error(data.error || "could not update profile")
            return data;
        },
        onSuccess: (data) => {
            // setFormData();
            queryClient.setQueryData(["user"], (oldData) => { return data });
            toast.success("Profile updated")
        },
        onError: () => {
            // console.log(error);
            toast.error("Could not updated Profile")
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const { mutate: updatePassword, data } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user/changepassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) throw new Error(data.error || "could not update password")
            return data;
        },
        onSuccess: () => { toast.success("password changed succeffully") },
        onError: () => { toast.error("could not update password") }
    });

    return (
        <div className="flex items-center gap-1">
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Edit profile
            </button>

            <dialog id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Update Profile</h3>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e) => { e.preventDefault(); updateUserProfile(); }}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullname}
                                name='fullname'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.username}
                                name='username'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Bio'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Link'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.link}
                                name='link'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='Enter Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button className='btn btn-primary rounded-full btn-sm text-white'>Update</button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>


            <div className='dropdown '>
                <div tabIndex={0} role='button' className='m-1'>
                    <IoSettingsOutline className='w-4' />
                </div>
                <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                    <li><a onClick={() => document.getElementById("change_password_modal").showModal()}>Change Password</a></li>
                </ul>
            </div>

            <dialog id='change_password_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Change Password</h3>
                    <form
                        className='flex flex-col gap-2'
                        onSubmit={(e) => { e.preventDefault(); updatePassword(); }}
                    >
                        <input
                            type='password'
                            placeholder='Current Password'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={passwordData.currentPassword}
                            name='currentPassword'
                            onChange={handlePasswordChange}
                        />
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={passwordData.newPassword}
                                name='newPassword'
                                onChange={handlePasswordChange}
                            />
                            <input
                                type='password'
                                placeholder='Confirm New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={passwordData.confirmNewPassword}
                                name='confirmNewPassword'
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <button className='btn btn-primary rounded-full btn-sm text-white'>Update</button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>

        </div>
    );
};
export default EditProfileModal;
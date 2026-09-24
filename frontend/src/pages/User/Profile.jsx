import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

import Loader from "../../component/Loader";
import { useProfileMutation } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      setPassword("");
      setConfirmPassword("");

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
            Account Settings
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15161b] lg:grid-cols-[280px_1fr]">

          {/* Left Profile Section */}
          <div className="border-b border-white/[0.06] bg-[#121318] p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-3xl font-bold shadow-xl shadow-purple-900/30">
                {username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {username || "User"}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-gray-500">
                {email}
              </p>

              {/* Status */}
              <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                <span className="text-xs font-medium text-emerald-400">
                  Account Active
                </span>
              </div>

              {userInfo?.isAdmin && (
                <div className="mt-3 flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/5 px-4 py-2">
                  <ShieldCheck size={14} className="text-purple-400" />
                  <span className="text-xs font-medium text-purple-400">
                    Administrator
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">

            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Update Profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your personal information below.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-[#0f1014]
                      py-3.5 pl-11 pr-4
                      text-sm text-white
                      outline-none
                      placeholder:text-gray-600
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-[#0f1014]
                      py-3.5 pl-11 pr-4
                      text-sm text-white
                      outline-none
                      placeholder:text-gray-600
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t border-white/[0.06] pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-200">
                    Change Password
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    Leave these fields empty if you don't want to change your
                    password.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      New Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        type="password"
                        placeholder="New password"
                        className="
                          w-full rounded-xl
                          border border-white/[0.08]
                          bg-[#0f1014]
                          py-3.5 pl-11 pr-4
                          text-sm text-white
                          outline-none
                          placeholder:text-gray-600
                          transition
                          focus:border-purple-500
                          focus:ring-2
                          focus:ring-purple-500/10
                        "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="
                          w-full rounded-xl
                          border border-white/[0.08]
                          bg-[#0f1014]
                          py-3.5 pl-11 pr-4
                          text-sm text-white
                          outline-none
                          placeholder:text-gray-600
                          transition
                          focus:border-purple-500
                          focus:ring-2
                          focus:ring-purple-500/10
                        "
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end border-t border-white/[0.06] pt-6">
                <button
                  type="submit"
                  disabled={loadingUpdateProfile}
                  className="
                    inline-flex min-w-[150px]
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-r from-purple-600 to-indigo-600
                    px-6 py-3
                    text-sm font-semibold text-white
                    shadow-lg shadow-purple-900/20
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:from-purple-500
                    hover:to-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loadingUpdateProfile ? "Updating..." : "Update Profile"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
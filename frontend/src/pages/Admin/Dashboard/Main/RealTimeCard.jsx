import { useGetUsersQuery } from "../../../../redux/api/users";
import PrimaryCard from "./PrimaryCard";

const RealTimeCard = () => {
  const { data: visitors = [] } = useGetUsersQuery();

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15161b] shadow-xl shadow-black/10">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Realtime
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Platform activity
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

            <span className="text-[11px] font-medium text-emerald-400">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="px-6 py-6">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
          Registered Users
        </p>

        <div className="mt-3 flex items-end justify-between">
          <h3 className="text-4xl font-bold tracking-tight text-white">
            {visitors.length}
          </h3>

          <span className="mb-1 text-xs text-purple-400">
            Users
          </span>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500" />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/[0.06]" />

      {/* Primary Card */}
      <div className="p-5">
        <PrimaryCard />
      </div>
    </div>
  );
};

export default RealTimeCard;
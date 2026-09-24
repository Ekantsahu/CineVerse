import { useGetUsersQuery } from "../../../../redux/api/users";

const PrimaryCard = () => {
  const { data: visitors } = useGetUsersQuery();

  return (
   <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.04] p-5 text-white">
      <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
      <p>You have {visitors?.length} new users, watching your content.</p>
    </div>
  );
};

export default PrimaryCard;

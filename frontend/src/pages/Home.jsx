import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#08090b]">
      <Header />
      <MoviesContainerPage />
    </div>
  );
};

export default Home;
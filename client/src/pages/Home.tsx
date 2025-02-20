import HomePage from "../components/home/Home";
import Footer from "../components/common/Footer"

const Home = () => {

  return (
      <main className="w-screen h-screen flex flex-col">
        <HomePage />
        <Footer />
      </main>
  );
};

export default Home;

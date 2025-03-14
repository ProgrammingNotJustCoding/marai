import HomePage from "../components/home/HomeContent";
import Footer from "../components/common/Footer";
import Layout from "../components/common/Layout";

const Home = () => {
  return (
    <div className="min-h-screen w-full overflow-x:hidden bg-black">
      <main className="w-full h-full flex flex-col bg-black">
        <Layout />
        <HomePage />
        <Footer />
      </main>
    </div>
  );
};

export default Home;

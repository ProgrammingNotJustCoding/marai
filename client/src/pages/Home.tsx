import HomePage from "../components/home/Home";
import Footer from "../components/common/Footer"
import Layout from "../components/common/Layout";

const Home = () => {

  return (
      <main className="w-screen h-screen flex flex-col">
       <Layout>
        <HomePage />
        <Footer />
       </Layout>
      </main>
  );
};

export default Home;

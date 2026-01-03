import { Outlet } from "react-router-dom";
 import Header1 from "../components/common/Header1";
import Footer1 from "../components/common/Footer1";

function Default() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header1 />
      <main className="flex-1 bg-gray-100 p-4">

        <Outlet />

      </main>
      <Footer1 />
    </div>
  );
}

export default Default;

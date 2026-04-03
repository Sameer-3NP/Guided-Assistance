import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { FlowProvider } from "./store/FlowContext";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <FlowProvider>
        <RouterProvider router={router} />
      </FlowProvider>
    </>
  );
};

export default App;

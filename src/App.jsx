import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// We need to include the base CSS in the root of
// the app so all of our components can inherit the styles
import "./index.css";

import Main from "./components/main/main.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);

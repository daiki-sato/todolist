import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [text, setText] = useState("");

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={text} onChange={(e) => e.preventDefault()} />
        <input
          type="submit"
          value="追加"
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      <p>{text}</p>
    </div>
  );
}

export default App;

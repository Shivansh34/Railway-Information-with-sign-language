import { Button } from "@mui/material";
import React from "react";
import imgUrl from "./image/train.jpg";
function Home() {
  return (
    <div
      className="Component-Bg"
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <p>hi</p>
      <Button
        variant="contained"
        style={{
          marginTop: "50vh",
          marginRight: "5vh",
        }}
      >
        Train Enquiry
      </Button>
      <Button
        variant="contained"
        style={{
          marginTop: "50vh",
          marginRight: "80vh",
        }}
        href="/PNR"
      >
        Pnr Enquiry
      </Button>
    </div>
  );
}

export default Home;

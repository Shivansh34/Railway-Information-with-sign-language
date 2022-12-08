import { Button } from "@mui/material";
import React from "react";
import imgUrl from "./image/train.jpg";
import Navbar from "./Navbar";
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
      <Navbar />
      <Button
        variant="contained"
        style={{
          marginTop: "50vh",
          marginRight: "5vh",
        }}
        href="/train"
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

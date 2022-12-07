import React, { useEffect, useRef, useState } from "react";
import background from "../image/railway.jpg"
import axios from "axios";
const Classifier = () => {
  const canvasRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();

  const [result, setResult] = useState(0);
  console.log(result)
  useEffect(() => {
    async function getCameraStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        
        video: {
          width: { exact: 200},
          height: { exact:300 }
        }
      });
  
      if (videoRef.current) {      
        videoRef.current.srcObject = stream;
      }
    };
  
    getCameraStream();
  }, []);
  const handleClick = async() => {
    
  
  
      captureImageFromCamera();

      if (imageRef.current) {
        const formData = new FormData();
        formData.append('image', imageRef.current);

        const response = await fetch('http://localhost:5000/classify', {
          method: "POST",
          body: formData,
        });
        console.log(response);
        if (response.status === 200) {
          const text = await response.text();
          console.log(result,text)
          setResult(result+text);
        } else {
          console.log(response)
          setResult("Error from API.");
        }
      }
    };

  const playCameraStream = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const handlePnr=()=>{
    const options = {
      method: 'GET',
      url: 'https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/2152389529',
      headers: {
        'X-RapidAPI-Key': 'b774af3dfdmshc8e8257d7dcbba2p196048jsnbed50875245d',
        'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
      }
    };
    
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
    console.log("hi")
    setResult(0)
  }
  const captureImageFromCamera = () => {
    const context = canvasRef.current.getContext('2d');
    const { videoWidth, videoHeight } = videoRef.current;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    canvasRef.current.toBlob((blob) => {
      imageRef.current = blob;
    })
  };

  return (
    <>
     
      <main >
      <div style={{ backgroundImage: `url(${background})` }} className="divback">\ <header>
        <h1 className="heading">Railway Pnr Enquiry system</h1>
      </header>
      <div className="image_text">
      <video ref={videoRef} onCanPlay={() => playCameraStream()} id="video"  className="abc"/>
      <canvas ref={canvasRef} hidden></canvas>
        <div className="shower">
        <label for="fname">Current pnr:</label>
        <p  id="fname" className="pnr_dispaly">
          {result }
          </p>
          <button className="Btn_pnr" onClick={handlePnr}>Check Pnr Status &raquo;</button>
          </div>
        </div>
        <button className="btn" onClick={handleClick}>Next &raquo;</button>
      </div>
        
        
      </main>
    </>
  )
};

export default Classifier;
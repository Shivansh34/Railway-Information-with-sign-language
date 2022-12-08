import React, { useEffect, useRef, useState } from "react";
import background from "./image/railway.jpg";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Navbar from "./Navbar";
import TextField from "@mui/material/TextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const Train = () => {
  const canvasRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();

  const [result, setResult] = useState({
    val: 0,
  });
  const [rows, setRows] = useState("");
  // const [dstat, setDstat] = useState('');
  // const [sstattime, setSstattime] = useState('');
  // const [dstattime, setDstattime] = useState('');

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  console.log(result);
  useEffect(() => {
    async function getCameraStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,

        video: {
          width: { exact: 255 },
          height: { exact: 255 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    getCameraStream();
  }, []);

  function getModes(array) {
    var frequency = []; // array of frequency.
    var maxFreq = 0; // holds the max frequency.
    var modes = [];

    for (var i in array) {
      frequency[array[i]] = (frequency[array[i]] || 0) + 1; // increment frequency.

      if (frequency[array[i]] > maxFreq) {
        // is this frequency > max so far ?
        maxFreq = frequency[array[i]]; // update max.
      }
    }

    for (var k in frequency) {
      if (frequency[k] == maxFreq) {
        return k;
      }
    }

    return modes;
  }

  var res = [];
  const getresp = async () => {
    captureImageFromCamera();

    if (imageRef.current) {
      const formData = new FormData();
      formData.append("image", imageRef.current);

      const response = await fetch("http://localhost:5000/classify", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.status === 200) {
        const text = await response.text();
        res.push(text);
        console.log(res, text);
      } else {
        console.log(response);
        setResult({ ...result, val: "Error from API." });
      }
    }
  };
  const handleClick = async () => {
    for (let i = 0; i < 10; i++) {
      await getresp();
    }
    let text = await getModes(res);
    var val = result.val + text;
    setResult({ ...result, val: val });
  };

  const playCameraStream = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const handlePnr = () => {
    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus",
      params: { trainNo: "19038", startDay: "1" },
      headers: {
        "X-RapidAPI-Key": "4720bdaaf2msh76295a9403a36f6p145362jsn168b185725af",
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setRows(response.data.data);
        console.log(response.data.data.boardingInfo.arrivalTime);
      })
      .catch(function (error) {
        console.error(error);
      });
    console.log("hi");
    setResult({ ...result, val: 0 });
    setOpen(true);
  };
  const captureImageFromCamera = () => {
    const context = canvasRef.current.getContext("2d");
    const { videoWidth, videoHeight } = videoRef.current;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    canvasRef.current.toBlob((blob) => {
      imageRef.current = blob;
    });
  };

  return (
    <>
      <Navbar />
      <main>
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="divback"
        >
          \{" "}
          <header>
            <h1 className="heading">Train Enquiry system</h1>
          </header>
          <div className="image_text">
            <video
              ref={videoRef}
              onCanPlay={() => playCameraStream()}
              id="video"
              className="abc"
            />
            <canvas ref={canvasRef} hidden></canvas>
            <div className="shower">
              <label for="fname">Current train status:</label>
              <TextField
                type="text"
                id="fname"
                className="pnr_dispaly"
                value={result.val}
                onChange={(e) => {
                  setResult({ ...result, val: e.target.value });
                }}
              />

              <button className="Btn_pnr" onClick={handlePnr}>
                Check Train Status &raquo;
              </button>
            </div>
          </div>
          <button className="btn" onClick={handleClick}>
            Next &raquo;
          </button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="lg"
        >
          <DialogContent>
            {/* {console.log(rows?.current_location_info[0]?.hint)}
            {console.log(rows?.current_location_info[0]?.readable_message)}
            {console.log(rows?.current_location_info[1]?.hint)}
            {console.log(rows?.current_location_info[1]?.readable_message)} */}

            <DialogContentText id="alert-dialog-description">
              {console.log(rows?.current_location_info)}
              {rows?.current_location_info !== "undefined" ? (
                <p>sorry</p>
              ) : (
                <p>
                  Your train{" "}
                  <b>
                    <i>{rows?.train_name}</i>
                  </b>{" "}
                  with train number{" "}
                  <b>
                    <i>{rows?.train_number}</i>
                  </b>{" "}
                  is{" "}
                  <b>
                    <i>{rows?.current_location_info[0]?.hint}</i>
                  </b>
                  <br></br>
                  Its{" "}
                  <b>
                    <i>{rows?.current_location_info[0]?.readable_message}</i>
                  </b>{" "}
                  <br></br>
                  It has{" "}
                  <b>
                    <i>{rows?.current_location_info[1]?.hint} </i>
                  </b>{" "}
                  <br></br>
                  Its just{" "}
                  <b>
                    <i>{rows?.current_location_info[1]?.readable_message}</i>
                  </b>{" "}
                </p>
              )}

              <h3>Upcoming stations</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Station</StyledTableCell>
                      <StyledTableCell align="right">
                        Station Code
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Arrival Time
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Departure Time
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Distance from Start&nbsp;(km)
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(rows.trainRoutes)}
                    {rows?.upcoming_stations?.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          {row.station_name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.station_code}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.eta}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.etd}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.distance_from_source}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <h3>Previous stations</h3>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Station</StyledTableCell>
                      <StyledTableCell align="right">
                        Station Code
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Arrival Time
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Departure Time
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Distance from Start&nbsp;(km)
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(rows.trainRoutes)}
                    {rows?.previous_stations?.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          {row.station_name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.station_code}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.eta}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.etd}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.distance_from_source}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </>
  );
};

export default Train;

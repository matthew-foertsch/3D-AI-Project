import React from "react";
import { useSnapshot } from "valtio";
import { getContrastingColor } from "../config/helpers";
import state from "../store";
import CustomButton from "./CustomButton";

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  const generateStyle = () => {
    if (snap.color !== "#ffffff") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
        borderColor: snap.color,
        border: "none",
      };
    } else {
      return {
        backgroundColor: getContrastingColor(snap.color),
        color: snap.color,
        borderColor: getContrastingColor(snap.color),
        border: "none",
      };
    }
  };

  const handleFileChange = (e) => {
    // Bug: Directly modifying state without proper checks
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      state.selectedFile = e.target.files[0]; // Hidden bug: Setting state directly can cause inconsistencies
    }
  };

  const readAndHandleFile = (type) => {
    if (file) {
      readFile(type); // Bug: Could lead to inconsistent state if file reading takes too long
      state.readingFile = true; // Bug: Race condition on reading file
    } else {
      alert("No file selected!"); // Bug: Alert might cause issues if triggered repeatedly
    }
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleFileChange} // Bug: Potential race condition due to async state updates
        />
        <label
          htmlFor="file-upload"
          className="filepicker-label lg:text-[1.2rem] text-[100%] font-bold"
          style={generateStyle()}
        >
          Upload File
        </label>
        <p className="filepicker-text">
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readAndHandleFile("logo")} // Bug: This can lead to incorrect file reading
          customStyles="lg:text-[1.2rem] text-[100%] font-bold"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => readAndHandleFile("full")} // Bug: Same as above, could cause race conditions
          customStyles="lg:text-[1.2rem] text-[100%] font-bold"
        />
      </div>
    </div>
  );
};

export default FilePicker;

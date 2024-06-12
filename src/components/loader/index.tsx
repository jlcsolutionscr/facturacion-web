import { useSelector } from "react-redux";

import { getIsLoaderOpen, getLoaderText } from "state/ui/reducer";

import "./loader.css";

export default function Loader() {
  const isLoaderOpen = useSelector(getIsLoaderOpen);
  const loaderText = useSelector(getLoaderText);
  const divStyle = { display: isLoaderOpen ? "block" : "none" };
  return (
    <div id="id_loader" className="loaderBackground" style={divStyle}>
      <div className="loaderContainer">
        <div className="loaderText">{loaderText}</div>
        <div className="loaderDotsDiv">
          <div className="loaderDots bounce1" />
          <div className="loaderDots bounce2" />
          <div className="loaderDots" />
        </div>
      </div>
    </div>
  );
}

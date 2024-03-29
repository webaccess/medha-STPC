import React, { useState, useContext } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import { GreenButton } from "../../../components";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import LoaderContext from "../../../context/LoaderContext";

const ExportCSV = ({ id, csvData, fileName }) => {
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const [formState, setFormState] = useState({
    greenButtonChecker: true
  });

  const exportToCSV = (csvData, fileName) => {
    setLoaderStatus(true);
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    setLoaderStatus(false);
  };

  return (
    <GreenButton
      id={id}
      variant="contained"
      color="secondary"
      startIcon={<GetAppIcon />}
      onClick={e => exportToCSV(csvData, fileName)}
      greenButtonChecker={formState.greenButtonChecker}
      style={{ margin: "2px", marginRight: "15px" }}
    >
      Download List
    </GreenButton>
  );
};

export default ExportCSV;

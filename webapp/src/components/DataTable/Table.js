// /**
//  *
//  * DataTable
//  * Higher Order Component that Shows data in Rows and Columns 
//  * Users can sort data ASC and DESC and also filter data.
//  *
//  */
// import React from "react";
// import DataTable from 'react-data-table-component';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
// import Button from '@material-ui/core/Button';
// import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
// import { TextField } from '@material-ui/core';
// import Modal from '../UI/Modal/Modal.js';


// const FilterComponent = ({ filterText, onFilter, onClear, props }) => (
//   <>
//     <TextField id="search" type="text" placeholder={"Search By Name"} value={filterText} onChange={onFilter} />
//     <Button onClick={onClear} className={"ClearButton"}> Search</Button>
//   </>
// );
// const Table = (props) => {
//   const editData = (event) => {
//     console.log("evemnyjgyjg ",event.target.id);
//     setisShowing(!isShowing);
//   }
//   const deleteData = (event) => {
//     console.log("Event", event.target.id)
//     setisDeleteShowing(!isDeleteShowing);
//   }
//   const closeModalHandler = () => {
//     setisShowing(!isShowing);
//   }
//   const closeDeleteModalHandler = () => {
//     setisDeleteShowing(!isDeleteShowing);
//   }

//   const [isShowing, setisShowing] = React.useState(false);
//   const [isDeleteShowing, setisDeleteShowing] = React.useState(false);
//   const column = [
//     {
//       cell: (cell) => <i class="material-icons" id={cell.id} onClick={editData}>edit</i>,
//       button: true,
//     },
//     {
//       cell: (cell) => <i class="material-icons" id={cell.id} onClick={deleteData}>delete_outline</i>,
//       button: true,
//     },
//     // {
//     //   cell: () => <Button variant="contained" color="primary">Action</Button>,
//     //   button: true,
//     // },
//   ]

//   const makeColumns = (columns) => {
//     for (let i in column) {
//       columns.push(column[i])
//     }
//   }

//   const [filterText, setFilterText] = React.useState('');

//   let filteredItems = [];
//   let filteredData = [];
//   let data = props.filterBy;
//   if (props.filterData) {
//     for (let i in data) {
//       console.log(i, data[i]);
//       filteredItems.push(props.data.filter(item => item[data[i]] && (item[data[i]].toLowerCase()).includes(filterText.toLowerCase())));
//     }
//     for (let i in filteredItems) {
//       filteredData = filteredData.concat(filteredItems[i])
//     }
//     let temp = [];
//     for (let i in filteredData) {
//       if (temp.indexOf(filteredData[i]) <= -1) {
//         temp.push(filteredData[i]);
//       }
//     }
//     filteredData = temp;

//     // filteredItems = props.data.filter(item => item[props.filterBy] && (item[props.filterBy]).includes(filterText));

//   } else {
//     filteredData = props.data;
//   }
//   const [selectedRows] = React.useState([]);
//   const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
//   const subHeaderComponentMemo = React.useMemo(() => {
//     const handleClear = () => {
//       if (filterText) {
//         setResetPaginationToggle(!resetPaginationToggle);
//         setFilterText('');
//       }
//     };

//     return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
//   }, [filterText, resetPaginationToggle]);
//   const contextActions = React.useMemo(() => {
//     const handleDelete = () => {

//       if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
//         console.log('dsjgasdjgasd')
//       }
//     };

//     return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>Delete</Button>;
//   }, [selectedRows]);

//   if (props.column.length > 0) {
//     makeColumns(props.column);
//   }

//   return (
//     <>
//       <DataTable
//         data={filteredData}
//         title={props.title}
//         columns={props.column}
//         pagination
//         paginationResetDefaultPage={resetPaginationToggle}
//         subHeader
//         subHeaderComponent={subHeaderComponentMemo}
//         selectableRowsComponent={Checkbox}
//         actions={props.actions}
//         contextActions={contextActions}
//         selectableRows
//         highlightOnHover
//         persistTableHead
//       />
//       <Modal
//         className="modal"
//         show={isDeleteShowing}
//         close={closeDeleteModalHandler}
//         header="SESTA FMS"
//         displayCross={{ display: "none" }}
//         footer={{
//           footerSaveName: "OKAY", footerCloseName: "CLOSE",
//           footerHref: "http://localhost:3000/",
//           displayClose: { display: "true" }, displaySave: { display: "true" }
//         }}
//       >
//         Delete Data?
//   </Modal>
//       <Modal
//         className="modal"
//         show={isShowing}
//         close={closeModalHandler}
//         header="SESTA FMS"
//         displayCross={{ display: "none" }}
//         footer={{

//           footerSaveName: "OKAY", footerCloseName: "CLOSE",
//           footerHref: "http://localhost:3000/",
//           displayClose: { display: "true" }, displaySave: { display: "true" }
//         }}
//       >
//         Edit Data?
//         <TextField id="outlined-basic" label="zone" variant="outlined" />

//   </Modal>
//     </>
//   );
// };

// export default Table;

/**
 *
 * DataTable
 * Higher Order Component that Shows data in Rows and Columns 
 * Users can sort data ASC and DESC and also filter data.
 *
 */
import React from "react";
import DataTable from 'react-data-table-component';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
const FilterComponent = ({ filterText, onFilter, onClear, props }) => (
  <>
   {/* <TextField id="search" label="Search By Name" variant="outlined" onChange={onFilter} /> */}
    <TextField id="search" type="text" variant="outlined" placeholder={"Search By Name"} value={filterText} onChange={onFilter} />
    <Button onClick={onClear} className={"ClearButton"}> Search</Button>
    <Button onClick={onClear} className={"ClearButton"}> Reset</Button>
  </>
);
const Table = (props) => {
  const editData = (event) => {
    props.events(event.target.id);
    // props.eventsss(event.target.value);
    // console.log("eventcell",cellid);
    // console.log("evemnyjgyjg ",event.target.id);
    // console.log("value",event);
    // setisShowing(!isShowing);
    // this.props.callbackFromParent(event.target.id);
  }
  const deleteData = (event) => {
    console.log("Event", event.target.id)
    props.eventsss(event.target.id);
    // setisDeleteShowing(!isDeleteShowing);
  }
  // const closeModalHandler = () => {
  //   setisShowing(!isShowing);
  // }
  // const closeDeleteModalHandler = () => {
  //   setisDeleteShowing(!isDeleteShowing);
  // }

  // const [isShowing, setisShowing] = React.useState(false);
  // const [isDeleteShowing, setisDeleteShowing] = React.useState(false);
  const column = [
    {
      cell: (cell) => <i class="material-icons" id={cell.id} value={cell.name} onClick={editData}>edit</i>,
      button: true,
    },
    {
      cell: (cell) => <i class="material-icons" id={cell.id} onClick={deleteData}>delete_outline</i>,
      button: true,
    },
    // {
    //   cell: () => <Button variant="contained" color="primary">Action</Button>,
    //   button: true,
    // },
  ]

  const makeColumns = (columns) => {
    for (let i in column) {
      columns.push(column[i])
    }
  }

  const [filterText, setFilterText] = React.useState('');

  let filteredItems = [];
  let filteredData = [];
  let data = props.filterBy;
  if (props.filterData) {
    for (let i in data) {
      console.log(i, data[i]);
      filteredItems.push(props.data.filter(item => item[data[i]] && (item[data[i]].toLowerCase()).includes(filterText.toLowerCase())));
    }
    for (let i in filteredItems) {
      filteredData = filteredData.concat(filteredItems[i])
    }
    let temp = [];
    for (let i in filteredData) {
      if (temp.indexOf(filteredData[i]) <= -1) {
        temp.push(filteredData[i]);
      }
    }
    filteredData = temp;

    // filteredItems = props.data.filter(item => item[props.filterBy] && (item[props.filterBy]).includes(filterText));

  } else {
    filteredData = props.data;
  }
  const [selectedRows] = React.useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);
  const contextActions = React.useMemo(() => {
    const handleDelete = () => {

      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
        console.log('dsjgasdjgasd')
      }
    };

    return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>Delete</Button>;
  }, [selectedRows]);

  if (props.column.length > 0) {
    makeColumns(props.column);
  }

  return (
    <>
      <DataTable
        data={filteredData}
        title={props.title}
        columns={props.column}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRowsComponent={Checkbox}
        actions={props.actions}
        contextActions={contextActions}
        selectableRows
        highlightOnHover
        persistTableHead
        
      />
      {/* <Modal
        className="modal"
        show={isDeleteShowing}
        close={closeDeleteModalHandler}
        header="SESTA FMS"
        displayCross={{ display: "none" }}
        footer={{
          footerSaveName: "OKAY", footerCloseName: "CLOSE",
          footerHref: "http://localhost:3000/",
          displayClose: { display: "true" }, displaySave: { display: "true" }
        }}
      >
        Delete Data?
  </Modal> */}
      {/* <Modal
        className="modal"
        show={isShowing}
        close={closeModalHandler}
        header="SESTA FMS"
        displayCross={{ display: "none" }}
        footer={{

          footerSaveName: "OKAY", footerCloseName: "CLOSE",
          footerHref: "http://localhost:3000/",
          displayClose: { display: "true" }, displaySave: { display: "true" }
        }}
      >
        Edit Data?
        <TextField id="outlined-basic" label="zone" variant="outlined" />

  </Modal> */}
    </>
  );
};

export default Table;




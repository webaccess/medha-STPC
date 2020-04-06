/**
 *
 * DataTable
 * Higher Order Component that Shows data in Rows and Columns
 * Users can sort data ASC and DESC and also filter data.
 *
 */
import React from "react";
import DataTable from "react-data-table-component";
import Checkbox from "@material-ui/core/Checkbox";
import Spinner from "../Spinner/Spinner";

const Table = props => {
  /**
   * allowPagination: If pagination prop is absent by default return true, Otherwise If pagination prop is present return props.pagination value
   * selectableRows: If selectableRows prop is absent by default return true, Otherwise If selectableRows prop is present return props.pagination value
   */
  const allowPagination =
    props.pagination === undefined ? true : props.pagination;
  const allowSelectable =
    props.selectableRows === undefined ? true : props.selectableRows;

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#EEEEEE",
        fontWeight: 700,
        fontSize: "13px"
      }
    }
  };

  return (
    <>
      <DataTable
        data={props.data}
        title={props.title}
        columns={props.column}
        /** Sort */
        defaultSortField={props.defaultSortField}
        defaultSortAsc={props.defaultSortAsc}
        /** pagination */
        pagination={allowPagination}
        paginationServer
        progressPending={props.progressPending}
        paginationTotalRows={props.paginationTotalRows}
        paginationRowsPerPageOptions={props.paginationRowsPerPageOptions}
        onChangeRowsPerPage={props.onChangeRowsPerPage}
        onChangePage={props.onChangePage}
        /** Selectable components */
        selectableRowsComponent={Checkbox}
        actions={props.actions}
        selectableRows={allowSelectable}
        highlightOnHover
        onSelectedRowsChange={props.onSelectedRowsChange}
        persistTableHead
        conditionalRowStyles={props.conditionalRowStyles}
        progressComponent={<Spinner />}
        clearSelectedRows={props.clearSelectedRows || false}
        customStyles={customStyles}
      />
    </>
  );
};

export default Table;

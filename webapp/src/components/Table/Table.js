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
        pagination
        paginationServer
        progressPending={props.progressPending}
        paginationTotalRows={props.paginationTotalRows}
        paginationRowsPerPageOptions={props.paginationRowsPerPageOptions}
        onChangeRowsPerPage={props.onChangeRowsPerPage}
        onChangePage={props.onChangePage}
        /** Selectable components */
        selectableRowsComponent={Checkbox}
        actions={props.actions}
        selectableRows
        highlightOnHover
        onSelectedRowsChange={props.onSelectedRowsChange}
        persistTableHead
        conditionalRowStyles={props.conditionalRowStyles}
        progressComponent={<Spinner />}
      />
    </>
  );
};

export default Table;

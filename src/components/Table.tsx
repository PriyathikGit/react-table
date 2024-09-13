import React, { useEffect, useState } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import './index.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  date_start: number;
  date_end: number;
}

const Table: React.FC = () => {
  const [data, setData] = useState<Artwork[]>([]);
  const [selectProduct, setSelectProduct] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [rowsToSelect, setRowsToSelect] = useState<string>('');
  const rowsPerPage = 10;
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
      );
      const response = await data.json();
      setData(response.data);
      setTotalRecords(response.pagination.total);
      setLoading(false);
    };
    getData();
  }, [page]);
  const onPageChange = (e: { page: number }) => {
    setPage(e.page + 1);
  };
  const handleTitleClick = () => {
    setShowDialog(true);
    console.log('heello');
  };
  const handleSelectRows = (): void => {
    if (rowsToSelect !== null) {
      const numRowsToSelect = Number(rowsToSelect); // Convert to number
      if (!isNaN(numRowsToSelect) && numRowsToSelect > 0) {
        const selectedRows = data.slice(0, numRowsToSelect); // Select the specified number of rows
        setSelectProduct(selectedRows);
        setShowDialog(false);
      }
    }
  };

  const titleHeader = (
    <>
      <div className="flex items-center gap-4">
        <span>
          <svg
            viewBox="0 0 1024 1024"
            className="icon w-4"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </span>
        <span
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={handleTitleClick}
        >
          Title
        </span>
      </div>
    </>
  );
  return (
    <div className="flex flex-col items-center pt-6 pb-5 ">
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <span className="text-xl font-bold pb-4">
            Currently on page : {page}
          </span>
          <DataTable
            value={data}
            selectionMode={'checkbox'}
            selection={selectProduct}
            onSelectionChange={(e) => setSelectProduct(e.value)}
            dataKey={'id'}
            tableStyle={{ maxWidth: '80rem' }}
            className="pb-5 relative"
          >
            <Column selectionMode="multiple"></Column>
            <Column
              field="title"
              header={titleHeader}
              headerStyle={{ cursor: 'pointer' }}
            ></Column>
            <Column
              field="place_of_origin"
              header="Place of Origin"
              className="pr-8"
            ></Column>
            <Column
              field="artist_display"
              header="Artist Display"
              headerStyle={{ width: '16rem' }}
            ></Column>
            <Column field="date_start" header="Start Date"></Column>
            <Column field="date_end" header="End Date"></Column>
          </DataTable>
          <Paginator
            first={page * rowsPerPage - rowsPerPage}
            rows={rowsPerPage}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            className="custom-paginator"
          ></Paginator>

          <Dialog
            visible={showDialog}
            onHide={() => setShowDialog(false)}
            footer={
              <Button
                label="Select Rows"
                onClick={handleSelectRows}
                className="border border-slate-500 p-2 mt-4 rounded-md"
              />
            }
            className="bg-white absolute left-[20rem] top-[6rem] p-4 border border-slate-800"
          >
            <div>
              <p>Enter the number of rows you want to select:</p>
              <InputNumber
                value={rowsToSelect}
                onValueChange={(e) => setRowsToSelect(e.value)}
                min={0}
                max={data.length}
                placeholder="Number of rows"
                className="border border-slate-400 mt-2"
              />
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Table;

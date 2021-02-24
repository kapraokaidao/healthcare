import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { TokenDetail, User } from "../../../types";

type ProvideHistory = {
  amount: number;
  healthcareToken: TokenDetail;
  destinationUser: User;
  createdDate: string;
};

const Provide = () => {
  const [histories, setHistories] = useState<ProvideHistory[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedStartDate, setSelectedStartDate] = useState({
    checked: false,
    date: new Date(),
  });
  const [selectedEndDate, setSelectedEndDate] = useState({
    checked: false,
    date: new Date(),
  });

  useEffect(() => {
    const filter: any = {};
    if (selectedStartDate.checked) filter["startDate"] = selectedStartDate.date.toISOString().split("T")[0];
    if (selectedEndDate.checked) filter["endDate"] = selectedEndDate.date.toISOString().split("T")[0];
    axios
      .post("/transaction/search/history", {
        page,
        pageSize: 20,
        type: "Provide",
        ...filter,
      })
      .then(({ data }) => {
        setHistories(data.data);
        setPage(data.page);
        setPageCount(data.pageCount);
      });
  }, [page, selectedStartDate, selectedEndDate]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <table>
        <tr>
          <td>Start Date</td>
          <td>
            <Checkbox
              checked={selectedStartDate.checked}
              onChange={(e) => {
                setSelectedStartDate({
                  date: selectedStartDate.date,
                  checked: e.target.checked,
                });
              }}
              color="primary"
            />
          </td>
          <td>
            <TextField
              type="date"
              defaultValue={selectedStartDate.date.toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedStartDate({
                  date: new Date(e.target.value),
                  checked: selectedStartDate.checked,
                });
              }}
            />
          </td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>
            <Checkbox
              checked={selectedEndDate.checked}
              onChange={(e) => {
                setSelectedEndDate({
                  date: selectedEndDate.date,
                  checked: e.target.checked,
                });
              }}
              name="checkedB"
              color="primary"
            />
          </td>
          <td>
            <TextField
              type="date"
              defaultValue={selectedEndDate.date.toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedEndDate({
                  date: new Date(e.target.value),
                  checked: selectedEndDate.checked,
                });
              }}
            />
          </td>
        </tr>
      </table>
      <div style={{ height: 700, width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Healthcare</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Give to</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map((history) => {
              return (
                <TableRow>
                  <TableCell>{history.healthcareToken.name}</TableCell>
                  <TableCell>{history.amount}</TableCell>
                  <TableCell>
                    {history.destinationUser.firstname} {history.destinationUser.lastname}
                  </TableCell>
                  <TableCell>{dayjs(history.createdDate).format("HH:mm DD/MM/YYYY")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="center mt-15">
          <Pagination
            count={pageCount}
            defaultPage={page}
            onChange={handlePageChange}
            size="large"
            showFirstButton
            showLastButton
            color="primary"
          />
        </div>
      </div>
    </>
  );
};

export default Provide;

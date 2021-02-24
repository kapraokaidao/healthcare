import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";

type WithdrawHistory = {
  name: String;
  amount: number;
};

const Withdraw = () => {
  const [histories, setHistories] = useState<WithdrawHistory[]>([]);
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
      .post("/transaction/search/group-by-service", {
        type: "Withdraw",
        ...filter,
      })
      .then(({ data }) => {
        setHistories(data);
      });
  }, [selectedStartDate, selectedEndDate]);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map((history) => {
              return (
                <TableRow>
                  <TableCell>{history.name}</TableCell>
                  <TableCell>{history.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Withdraw;

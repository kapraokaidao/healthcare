import React, { useCallback, useContext, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { TokenDetail, Token } from "../../types";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./style.scss";
import Select from "@material-ui/core/Select";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import MenuItem from "@material-ui/core/MenuItem";
import { TitleContext } from "../../App";

type FilterToken = {
  isActive?: boolean;
  tokenType?: Token;
};

const ManageToken = () => {
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle("Manage Token");
  }, [setTitle]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [tokens, setTokens] = useState<TokenDetail[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenDetail | null>(null);
  const [filterTokens, setFilterTokens] = useState<FilterToken>({});
  const [history] = useState(useHistory());
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    axios
      .get("/healthcare-token", {
        params: {
          page,
          pageSize: 20,
          ...filterTokens,
        },
      })
      .then(({ data }) => {
        setTokens(data.data);
        setPage(data.page);
        setPageCount(data.pageCount);
      });
  }, [page, filterTokens, fetchData]);

  const viewTokenDetail = useCallback((token: TokenDetail) => {
    setSelectedToken(token);
    setOpen(true);
  }, []);

  const deactivateToken = useCallback(async () => {
    if (selectedToken) {
      await axios.put(`/healthcare-token/deactivate/${selectedToken.id}`);
      setFetchData(!fetchData);
      setConfirm(false);
    }
  }, [selectedToken, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs>
          <h1>Manage Token</h1>
        </Grid>
        <Grid>
          <div className="height-full center">
            <IconButton
              color="primary"
              onClick={() => {
                history.push("/token/create");
              }}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </div>
        </Grid>
      </Grid>

      <div className="filter">
        <div>Token Status</div>
        <div>
          <Select
            onChange={({ target: { value } }) => {
              const tmp = filterTokens;
              if (value === "None") {
                delete tmp.isActive;
              } else if (value === "Active") {
                tmp.isActive = true;
              } else {
                tmp.isActive = false;
              }
              setFilterTokens(tmp);
            }}
            defaultValue={"None"}
            required
          >
            <MenuItem value={"None"}>None</MenuItem>
            <MenuItem value={"Active"}>Active</MenuItem>
            <MenuItem value={"Inactive"}>Inactive</MenuItem>
          </Select>
        </div>
        <div>Token Type</div>
        <div>
          <Select
            onChange={({ target: { value } }) => {
              const tmp = filterTokens;
              if (value === "None") {
                delete tmp.tokenType;
              } else if (value === "General") {
                tmp.tokenType = "General";
              } else {
                tmp.tokenType = "Special";
              }
              setFilterTokens(tmp);
            }}
            defaultValue={"None"}
            required
          >
            <MenuItem value={"None"}>None</MenuItem>
            <MenuItem value={"General"}>General</MenuItem>
            <MenuItem value={"Special"}>Special</MenuItem>
          </Select>
        </div>
        <div>
          <Button
            onClick={() => {
              setFetchData(!fetchData);
            }}
            variant="contained"
            color="primary"
            size="small"
          >
            Filter
          </Button>
        </div>
      </div>

      <div style={{ height: 700, width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Total Token</TableCell>
              <TableCell>Remaining Token</TableCell>
              <TableCell>Token/Person</TableCell>
              <TableCell>Available Date</TableCell>
              <TableCell>Token Status</TableCell>

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => {
              return (
                <TableRow>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{token.tokenType}</TableCell>
                  <TableCell>{token.totalToken}</TableCell>
                  <TableCell>{token.remainingToken}</TableCell>
                  <TableCell>{token.tokenPerPerson}</TableCell>
                  <TableCell>
                    {token?.startDate} - {token?.endDate}
                  </TableCell>
                  <TableCell>
                    {token.isActive ? "✓ Active" : "X Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        viewTokenDetail(token);
                      }}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Detail
                    </Button>
                  </TableCell>
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

      <Dialog
        open={open}
        keepMounted
        onClose={() => {
          setOpen(false);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedToken?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <table className="table-detail">
              <tr>
                <td>Token Type</td>
                <td>{selectedToken?.tokenType}</td>
              </tr>
              <tr>
                <td>Total Token</td>
                <td>{selectedToken?.totalToken}</td>
              </tr>
              <tr>
                <td>Remaining Token</td>
                <td>{selectedToken?.remainingToken}</td>
              </tr>
              <tr>
                <td>Token/Person</td>
                <td>{selectedToken?.tokenPerPerson}</td>
              </tr>
              <tr>
                <td>Token Status</td>
                <td>{selectedToken?.isActive ? "✓ Active" : "X Inactive"}</td>
              </tr>
              <tr>
                <td>Available date</td>
                <td>
                  {selectedToken?.startDate} - {selectedToken?.endDate}
                </td>
              </tr>
              <tr>
                <td>Age Range</td>
                <td>
                  {selectedToken?.startAge} - {selectedToken?.endAge}
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>{selectedToken?.gender}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{selectedToken?.description}</td>
              </tr>
              <tr>
                <td>Issuing Public Key</td>
                <td>{selectedToken?.issuingPublicKey}</td>
              </tr>
              <tr>
                <td>Receiving Public Key</td>
                <td>{selectedToken?.receivingPublicKey}</td>
              </tr>
            </table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setConfirm(true);
              setOpen(false);
            }}
            variant="contained"
            color="secondary"
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirm}
        keepMounted
        onClose={() => {
          setConfirm(false);
        }}
      >
        <DialogContent>
          <DialogContentText>
            <h1>Confirm to deactivate token ?</h1>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirm(false);
            }}
            variant="contained"
            color="primary"
          >
            NO
          </Button>
          <Button
            onClick={deactivateToken}
            variant="contained"
            color="secondary"
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageToken;

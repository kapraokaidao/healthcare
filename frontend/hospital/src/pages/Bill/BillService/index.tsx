import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

type BillHistory = {
	amount: number;
	effectiveDate: Date;
	firstname: string;
	lastname: string;
};

const BillService = ({ id }: { id: number }) => {
	const [histories, setHistories] = useState<BillHistory[]>([]);
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	useEffect(() => {
		axios
			.get(`/bill/detail/${id}`, {
				params: {
					page,
					pageSize: 20,
				},
			})
			.then(({ data }) => {
				setHistories(data.data);
				setPage(data.page);
				setPageCount(data.pageCount);
			});
	}, [page]);

	return (
		<div>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Amount</TableCell>
						<TableCell>Effective Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{histories.map((history) => {
						return (
							<TableRow>
								<TableCell>
									{history.firstname} {history.lastname}
								</TableCell>
								<TableCell>{history.amount}</TableCell>
								<TableCell>{dayjs(history.effectiveDate).format('DD/MM/YYYY H:mm')}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

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
	);
};

export default BillService;

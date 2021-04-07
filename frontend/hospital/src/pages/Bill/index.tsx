import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import BillService from './BillService';
import './style.scss';

type BillService = {
	billDetailId: number;
	serviceName: string;
	amount: number;
};

const BillDetail = (props: any) => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Bill Detail');
	}, [setTitle]);

	const [services, setServices] = useState<BillService[]>([]);
	useEffect(() => {
		if (props.match.params.id) {
			axios.get(`/bill/${props.match.params.id}`).then(({ data }) => {
				setServices(data);
			});
		}
	}, [props.match.params.id]);
	return (
		<>
			<h1>Bill ID: {props.match.params.id}</h1>
			{services.map((service) => {
				return (
					<Accordion key={`service-${service.billDetailId}`}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
							<h3 className="m-0">{service.serviceName}</h3>
						</AccordionSummary>
						<AccordionDetails>
							<BillService id={service.billDetailId} />
						</AccordionDetails>
					</Accordion>
				);
			})}
		</>
	);
};

export default BillDetail;

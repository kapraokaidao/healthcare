import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import dayjs from 'dayjs';
import { Gender, Token } from '../../types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import './style.scss';
import { useHistory } from 'react-router-dom';

type PostToken = {
	name: string;
	tokenType: Token;
	description: string;
	totalToken: number;
	tokenPerPerson: number;
	startDate?: string;
	endDate?: string;
	startAge?: number;
	endAge?: number;
	gender?: Gender;
};

const CreateToken = () => {
	const [history] = useState(useHistory());
	const [ageRange, setAgeRange] = useState<number[]>([3, 80]);
	const [token, setToken] = useState<PostToken>({
		name: '',
		tokenType: 'General',
		description: 'This token is generated for ...',
		totalToken: 0,
		tokenPerPerson: 1,
		startDate: dayjs().format('YYYY-MM-DD'),
		endDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
		gender: 'Male',
	});

	const [checkBox, setCheckBox] = useState({
		startDate: true,
		endDate: true,
		ageRange: true,
		gender: true,
	});
	const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCheckBox({ ...checkBox, [event.target.name]: event.target.checked });
	};

	const handleAgeRangeChange = (event: any, newAgeRange: number | number[]) => {
		setAgeRange(newAgeRange as number[]);
	};
	const handleInputChange = (props: any) => (event: { target: { value: any } }) => {
		setToken({ ...token, [props]: event.target.value });
	};
	const generateToken = async () => {
		const data: PostToken = {
			name: token.name,
			tokenType: token.tokenType,
			description: token.description,
			totalToken: token.totalToken,
			tokenPerPerson: token.tokenPerPerson,
		};
		if (checkBox.startDate) data.startDate = token.startDate;
		if (checkBox.endDate) data.endDate = token.endDate;
		if (checkBox.gender) data.gender = token.gender;
		if (checkBox.ageRange) {
			data.startAge = ageRange[0];
			data.endAge = ageRange[1];
		}

		const res = await axios.post('/healthcare-token', data);
		console.log(res);
		history.push('/token');
	};

	return (
		<>
			<div className="sitehome">
				<div className="mt-15">
					<h1>Create Token</h1>
				</div>
				<div className="mt-15">
					<table className="table">
						<tr>
							<td>Name</td>
							<td></td>
							<td>
								<TextField
									label="Name"
									variant="outlined"
									value={token.name}
									onChange={handleInputChange('name')}
									fullWidth
								/>
							</td>
						</tr>
						<tr>
							<td>Type</td>
							<td></td>
							<td>
								<Select
									value={token.tokenType}
									onChange={handleInputChange('tokenType')}
									variant="outlined"
								>
									<MenuItem value={'General'}>General</MenuItem>
									<MenuItem value={'Special'}>Special</MenuItem>
								</Select>
							</td>
						</tr>
						<tr>
							<td>Start date</td>
							<td>
								<Checkbox
									checked={checkBox.startDate}
									name="startDate"
									color="primary"
									onChange={handleCheckBoxChange}
								/>
							</td>
							<td>
								{checkBox.startDate && (
									<Input
										type="date"
										value={token.startDate}
										onChange={handleInputChange('startDate')}
									/>
								)}
							</td>
						</tr>
						<tr>
							<td>End date</td>
							<td>
								<Checkbox
									checked={checkBox.endDate}
									name="endDate"
									color="primary"
									onChange={handleCheckBoxChange}
								/>
							</td>
							<td>
								{checkBox.endDate && (
									<Input type="date" value={token.endDate} onChange={handleInputChange('endDate')} />
								)}
							</td>
						</tr>
						<tr>
							<td>Age Range</td>
							<td>
								<Checkbox
									checked={checkBox.ageRange}
									name="ageRange"
									color="primary"
									onChange={handleCheckBoxChange}
								/>
							</td>
							<td>
								{checkBox.ageRange && (
									<Slider
										value={ageRange}
										onChange={handleAgeRangeChange}
										valueLabelDisplay="auto"
										aria-labelledby="range-slider"
									/>
								)}
							</td>
						</tr>
						<tr>
							<td>Gender</td>
							<td>
								<Checkbox
									checked={checkBox.gender}
									name="gender"
									color="primary"
									onChange={handleCheckBoxChange}
								/>
							</td>
							<td>
								{checkBox.gender && (
									<Select
										value={token.gender}
										onChange={handleInputChange('gender')}
										variant="outlined"
									>
										<MenuItem value={'Male'}>Male</MenuItem>
										<MenuItem value={'Female'}>Female</MenuItem>
									</Select>
								)}
							</td>
						</tr>
						<tr>
							<td>Total Token</td>
							<td></td>
							<td>
								<TextField
									label="Total Token"
									variant="outlined"
									value={token.totalToken}
									onChange={handleInputChange('totalToken')}
									fullWidth
								/>
							</td>
						</tr>
						<tr>
							<td>Token/Person</td>
							<td></td>
							<td>
								<TextField
									label="Token/Person"
									variant="outlined"
									value={token.tokenPerPerson}
									onChange={handleInputChange('tokenPerPerson')}
									fullWidth
								/>
							</td>
						</tr>
						<tr>
							<td>Description</td>
							<td></td>
							<td>
								<TextField
									label="Description"
									variant="outlined"
									value={token.description}
									onChange={handleInputChange('description')}
									fullWidth
								/>
							</td>
						</tr>
					</table>
				</div>
				<div className="mt-15 align-right">
					<Button
						color="primary"
						size="large"
						onClick={() => {
							history.push('/token');
						}}
					>
						Cancel
					</Button>
					<Button onClick={generateToken} variant="contained" color="primary" size="large">
						Generate
					</Button>
				</div>
			</div>
		</>
	);
};
export default CreateToken;

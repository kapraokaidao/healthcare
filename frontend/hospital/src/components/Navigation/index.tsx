import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { default as AccountCircle, default as AccountCircleIcon } from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HistoryIcon from '@material-ui/icons/History';
import LockIcon from '@material-ui/icons/Lock';
import MenuIcon from '@material-ui/icons/Menu';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PathContext, TitleContext } from '../../App';
import { AuthStoreContext } from '../../stores';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	hide: {
		display: 'none',
	},
}));

const Navigation = observer(() => {
	const [history] = useState(useHistory());
	const authStore = useContext(AuthStoreContext);
	const { title } = useContext(TitleContext);
	const { path } = useContext(PathContext);
	const [show, setShow] = useState(true);
	useEffect(() => {
		if (path === '/signin') {
			setShow(false);
		} else {
			setShow(true);
		}
	}, [path]);
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const signout = useCallback(async () => {
		const res = await authStore.signout();
		if (res) history.push('/signin');
	}, [authStore]);

	return (
		<>
			{show && (
				<div className={classes.root}>
					<AppBar
						position="fixed"
						className={clsx(classes.appBar, {
							[classes.appBarShift]: open,
						})}
					>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								className={clsx(classes.menuButton, open && classes.hide)}
							>
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" className={classes.title}>
								{title}
							</Typography>
							<div className="center">
								<span>{authStore.user?.username}</span>
								<AccountCircle fontSize="large" className="ml-10 mr-10" />
								<Button onClick={signout} variant="contained" color="secondary">
									Sign Out
								</Button>
							</div>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="persistent"
						anchor="left"
						open={open}
						classes={{
							paper: classes.drawerPaper,
						}}
					>
						<div className={classes.drawerHeader}>
							<IconButton onClick={handleDrawerClose}>
								{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
							</IconButton>
						</div>
						<Divider />
						<List>
							<ListItem
								button
								onClick={() => {
									history.push('/');
								}}
							>
								<ListItemIcon>
									<AccountCircleIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="Home" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									history.push('/scanner');
								}}
							>
								<ListItemIcon>
									<PhotoCameraIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="Scan Patient" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									history.push('/wallet');
								}}
							>
								<ListItemIcon>
									<AccountBalanceWalletIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="Wallet" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									history.push('/pin/change');
								}}
							>
								<ListItemIcon>
									<VpnKeyIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="Change Pin" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									history.push('/password/change');
								}}
							>
								<ListItemIcon>
									<LockIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="Change Password" />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									history.push('/history');
								}}
							>
								<ListItemIcon>
									<HistoryIcon fontSize="large" />
								</ListItemIcon>
								<ListItemText primary="History" />
							</ListItem>
						</List>
					</Drawer>
				</div>
			)}
		</>
	);
});

export default Navigation;

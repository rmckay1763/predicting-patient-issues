import { Fragment, useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';
import { IconButton } from '@mui/material';
import UserTableToolbar from './UserTableToolbar';
import { DeleteUser } from '../controllers/APIController';

export default function UserTable() {
    const [state,] = useGlobal();
    const [data, setData] = useState([]);
    const [query, setQuery] = useState([]);
    const navigate = useNavigate();
    document.title = "PPCD Admin - Users";

    useEffect(() => {
        let temp = state.users;
        temp = temp.filter((user) => {
            return (
                user.username.toLowerCase().includes(query) ||
                user.lastname.toLowerCase().includes(query.toLowerCase()) ||
                user.firstname.toLowerCase().includes(query.toLowerCase())
            );
        });
        setData(temp);
    }, [state.users, query]);


    // click handler for table rows
    const onRowClicked = (row) => {
        let selected = state.patients.find((patient) => patient.pid === row.pid);
        return navigate('/patientProfile', { state: { patient: selected } });
    }

    // click handler for delete column on table
    const onRowDeleteClicked = (row) => {
        let selected = state.users.find((user) => user.uid === row.uid);
        let response = window.confirm(`Are you sure you want to delete user '${selected.uid}'?`);

        if (response) {
            try {
                DeleteUser(state.token, selected.uid);
                window.alert(`User '${selected.uid}' has been deleted.`);
            } catch (error) {
                console.log(error);
                window.alert(`Deletion of user failed.`);
            }
        }
    }

    // action button for user profile
    const profileButton = (row) => {
        return (
            <IconButton
                onClick={() => onRowClicked(row)}
                sx={{
                    color: Colors.primary,
                    '&:hover': { color: Colors.secondary, background: Colors.primary }
                }}
            >
                {Icons.patientProfile}
            </IconButton>
        )
    }

    // action button for deleting user
    const deleteButton = (row) => {
        return (
            <IconButton
                onClick={() => onRowDeleteClicked(row)}
                sx={{
                    color: Colors.primary,
                    '&:hover': { color: Colors.secondary, background: Colors.primary }
                }}
            >
                {Icons.delete}
            </IconButton>
        )
    }

    // theme for table
    createTheme(
        'theme',
        {
            text: {
                primary: Colors.primary,
                secondary: Colors.primary,
            },
            background: {
                default: Colors.backgroundLight
            },
            divider: {
                default: Colors.focus,
            },
            button: {
                default: Colors.primary,
                hover: Colors.secondary,
                focus: Colors.focus,
            },
            striped: {
                default: Colors.backgroundLighter,
                text: Colors.primary
            },
            highlightOnHover: {
                default: Colors.focus,
                text: Colors.primary
            },
        }
    )

    // custom style for expander button
    const customStyles = {
        expanderButton: {
            style: {
                '&:hover:enabled': {
                    cursor: 'pointer',
                    color: Colors.secondary,
                    backgroundColor: Colors.primary
                },
                '&:hover:not(:disabled)': {
                    cursor: 'pointer',
                    backgroundColor: Colors.primary,
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: Colors.backgroundLight,
                },
            },
        },
        headRow: {
            style: {
                fontWeight: 600,
            },
        },
    }

    const columns = [
        {
            name: 'UID',
            selector: row => row.uid,
            sortable: true
        },
        {
            button: true,
            cell: (row) => profileButton(row)
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: row => row.lastname,
            sortable: true
        },
        {
            name: 'First Name',
            selector: row => row.firstname,
            sortable: true
        },
        {
            name: 'Rank',
            selector: row => row.rank,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true
        },
        {
            button: true,
            cell: (row) => deleteButton(row)
        },
    ];

    return (
        <Fragment>
            <UserTableToolbar setQuery={setQuery} />
            <DataTable
                theme='theme'
                keyField='uid'
                sortIcon={Icons.arrowDownward}
                striped={true}
                highlightOnHover={true}
                pagination={true}
                columns={columns}
                data={data}
                customStyles={customStyles}
            />
        </Fragment>
    );
};
import { Fragment, useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import { Icons } from '../resources/Icons';
import { Colors } from '../resources/Colors';
import { StyledIconButton } from '../resources/StyledComponents';
import UserTableToolbar from './UserTableToolbar';

export default function UserTable() {
    const [state, dispatch] = useGlobal();
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
        navigate('/editUser', {state: {uid: row.uid}})
    }

    // action button for user profile
    const editUserButton = (row) => {
        return (
            <StyledIconButton onClick={() => onRowClicked(row)} >
                {Icons.edit}
            </StyledIconButton>
        )
    }

    const returnAdmin = (row) => {
        if (row.admin === true) {
            return "True";
        }
        else {
            return "False";
        }
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
            cell: (row) => editUserButton(row)
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
            selector: row => row.rank.abbreviation,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role.name,
            sortable: true
        },
        {
            name: 'Admin Status',
            selector: (row ) => returnAdmin(row),
            sortable: true
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
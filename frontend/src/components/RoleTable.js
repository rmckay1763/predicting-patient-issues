import { Fragment, useEffect, useState } from 'react';
import DataTable, {createTheme} from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { AddRole, DeleteRole } from '../controllers/APIController';
import { Colors } from '../resources/Colors';
import { useGlobal } from '../contexts/GlobalContext';
import { Icons } from '../resources/Icons';
import { IconButton } from '@mui/material';
import { AlertError, AlertSuccess } from "./AlertMessage";
import RoleTableToolbar from './RoleTableToolbar';
import { InputDialogue, ConfirmDialog } from './Dialog';

/**
 * 
 * @props {list} data -- The role data to populate the table
 * @returns Component for table of roles
 */
export default function RoleTable() {
    const [state, dispatch] = useGlobal();
    const [data, setData] = useState([]);
    const [query, setQuery] = useState([]);
    const [deleteRole, setDeleteRole] = useState(false);
    const [addRole, setAddRole] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [addRoleMessage, setAddRoleMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState();
    const navigate = useNavigate();
    document.title = "PPCD Admin - Roles";

    useEffect(() => {
        setAddRoleMessage("Please enter a new role name.")
        let temp = state.roles;
        temp = temp.filter((role) => {
            return (
                role.name.toLowerCase().includes(query)
            );
        });
        setData(temp);
    }, [state.roles, query]);

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
            striped: {
                default: Colors.backgroundLighter,
                text: Colors.primary
            },
        }
    )

    const addRoleHandler = async (roleName) => {

        if(roleName.length === 0)
        {
            AlertError(dispatch, "Aborting: Role name is empty");
        }
        else if(state.roles.some(role => role.name.toLowerCase() === roleName.toLowerCase()))
        {
            AlertError(dispatch, "Aborting: Role '" + roleName + "' already exists");
        }
        else
        {
            try {
                AddRole(state.token, roleName);
                AlertSuccess(dispatch, "Role '" + roleName + "' was added");
                return navigate("/roles")
            } catch (error) {
                console.error(error);
                AlertError(dispatch, "Failed to delete role");
            }
        }
    }

    const onDelete = (row) => {
        let selected = state.roles.find((role) => role.id === row.id);
        setSelectedRole(selected);
        let message = `Are you sure you want to delete role '${selected.name}'?`;
        setDeleteMessage(message);
        setDeleteRole(true);
    }

    // click handler for delete column on table
    const deleteRoleCallback = async () => {
        try {
            await DeleteRole(state.token, selectedRole.id);
            AlertSuccess(dispatch, "Role deleted");
            return navigate("/roles")
        } catch (error) {
            console.error(error);
            AlertError(dispatch, "Failed to delete role");
        }
    }    

    // action button for deleting role
    const deleteButton = (row) => {
        return (
            <IconButton
                onClick={() => onDelete(row)}
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

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Role Name',
            selector: row => row.name,
            sortable: true
        },
        {
            button: true,
            cell: (row) => deleteButton(row)
        },
    ];

    return (
        <Fragment>
            <RoleTableToolbar setQuery={setQuery} addRole={setAddRole} />
            <DataTable
                theme='theme'
                keyField='ID'
                sortIcon={Icons.arrowDownward}
                highlightOnHover={true}
                pagination={true}
                striped={true}
                columns={columns}
                data={data}
            />
            <ConfirmDialog
                open={deleteRole}
                setOpen={setDeleteRole}
                onConfirm={deleteRoleCallback}
                title="Confirmation Required"
                content={deleteMessage}
            />
            <InputDialogue
                open={addRole}
                setOpen={setAddRole}
                onSubmit={addRoleHandler}
                title="Add New Role"
                content={addRoleMessage}
            />
        </Fragment>
    );
}
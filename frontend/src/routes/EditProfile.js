import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import { AppBar, CssBaseline, Toolbar, Typography } from '@mui/material';

import { Colors } from "../resources/Colors";
import EditProfileForm from '../components/EditProfileForm'
import NotificationPanel from '../components/NotificationPanel';

import 'react-reflex/styles.css'

export default function EditProfile() {
  return (
    <ReflexContainer orientation="vertical">
            <ReflexElement className="left-pane" maxSize="400">
                <div className="pane-content">
                    <NotificationPanel />
                </div>
            </ReflexElement>
            <ReflexSplitter style={{ height : "1080px", width : "1px" }}>
            </ReflexSplitter>
            <ReflexElement className="right-pane">
              <AppBar position="static" sx={{ maxHeight: 56.8, borderRadius: 1, bgcolor: Colors.primary }}>
                  <CssBaseline />
                  <Toolbar>
                      <Typography>
                          Edit Profile
                      </Typography>
                  </Toolbar>
              </AppBar>
              <EditProfileForm />
            </ReflexElement>
        </ReflexContainer>
  );
}

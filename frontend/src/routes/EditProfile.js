import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import EditProfileForm from '../components/EditProfileForm'
import NotificationPanel from '../components/NotificationPanel';
import { useViewport } from '../contexts/UseViewport';

import 'react-reflex/styles.css'

export default function EditProfile() {
  const { width } = useViewport();
  const breakpoint = 900;

  document.title = "PPCD - Edit Profile";

  if (width < breakpoint) {
    document.body.style.overflow = 'scroll';

    return (
      <EditProfileForm />
    )
  }
  else {
    document.body.style.overflow = 'hidden';
  }

  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement className="left-pane" maxSize="400">
        <div className="pane-content">
          <NotificationPanel />
        </div>
      </ReflexElement>
      <ReflexSplitter style={{ height: "1080px", width: "1px" }}>
      </ReflexSplitter>
      <ReflexElement className="right-pane">
        <EditProfileForm />
      </ReflexElement>
    </ReflexContainer>
  );
}

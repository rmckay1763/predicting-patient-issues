import SplitPane from "../components/SplitPane";
import { SplitPaneLeft } from "../components/SplitPane";
import { SplitPaneRightEditProfile } from "../components/SplitPane";

export default function EditProfile() {
  return (
    <div>
      <SplitPane className="split-pane-row">
        <SplitPaneLeft />
        <SplitPaneRightEditProfile />
      </SplitPane>
    </div>
  );
}

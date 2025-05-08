import InboxList from "src/features/inbox/components/lists/InboxList";
import "./styles/inbox.scss";

export default function InboxPage() {
  return (
    <div className="inbox">
      <Header />
      <InboxList />
    </div>
  );
}

function Header() {
  return (
    <div className="inbox__header">
      <h1>Notifications</h1>
    </div>
  );
}

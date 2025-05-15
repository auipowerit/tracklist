import InboxList from "src/features/inbox/components/lists/InboxList";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import "./styles/inbox.scss";

export default function InboxPage() {
  return (
    <section className="inbox">
      <MobileBanner title={"Inbox"} />
      <Header />
      <InboxList />
    </section>
  );
}

function Header() {
  return (
    <div className="inbox__header">
      <h1>Notifications</h1>
    </div>
  );
}

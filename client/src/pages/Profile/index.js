import React from "react";
import Myquestions from "./Myquestions";
import Liked from "./Liked";
import Commented from "./Commented";
import Shared from "./Shared";
import Tabs from "../../components/Tabs";
import SharedToMe from "./ShareToMe";

function Profile() {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = [
    {
      name: "My Questions",
      component: <Myquestions />,
    },
    {
      name: "Questions Shared To Me",
      component: <SharedToMe />,
    },
    {
      name: "Liked Questions",
      component: <Liked />,
    },
    {
      name: "Answered Questions",
      component: <Commented />,
    },
    {
      name: "Shared Questions",
      component: <Shared />,
    },
  ];
  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Profile;

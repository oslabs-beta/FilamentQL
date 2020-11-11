import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Team.scss";
import Member from "./Member";
import { getMembersQuery } from "../../query";

const Team = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.post("/graphql", { query: getMembersQuery }).then((response) => {
      const { members } = response.data.data;
      setMembers(members);
    });
  }, []);

  return (
    <div className='Team'>
      <div
        className='Header'
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h1>Meet the FilamentQL Team</h1>
        <h4>Hover over each image for more information.</h4>
      </div>
      <div className='container'>
        {members.map((member) => (
          <Member key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Team;

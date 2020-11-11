import React from "react";

const Member = ({ member: { name, avatar, bio, github, linkedIn } }) => (
  <div className='card-container'>
    <div className='card-wrapper'>
      <div className='card'>
        <div className='card-image'>
          <img src={avatar} alt='profile one' />
        </div>
        <ul className='social-icons'>
          <li>
            <a href={github} target='_'>
              <i className='fab fa-github' />
            </a>
          </li>
          <li>
            <a href={linkedIn} target='_'>
              <i className='fab fa-linkedin' />
            </a>
          </li>
        </ul>
        <div className='details'>
          <h2>
            {name}
            <br />
            <span className='job-title'>Software Engineer</span>
          </h2>
        </div>
      </div>
    </div>
    <div className='bio'>
      <p>{bio}</p>
    </div>
  </div>
);

export default Member;

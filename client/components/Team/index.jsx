import React from "react";
import "./Team.scss";

const Team = () => {
  return (
    <div>
      <div
        className='Header'
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h1>Meet the Filament Team</h1>
      </div>
      <div className='container'>
        <div className='card-container'>
          <div className='card-wrapper'>
            <div className='card'>
              <div className='card-image'>
                <img
                  src='https://image.ibb.co/dUTfmJ/profile_img.jpg'
                  alt='profile one'
                />
              </div>
              <ul className='social-icons'>
                <li>
                  <a href='https://github.com/andrew-lovato'>
                    <i className='fab fa-github'></i>
                  </a>
                </li>
                <li>
                  <a href='https://www.linkedin.com/in/andrew-lovato/'>
                    <i className='fab fa-linkedin'></i>
                  </a>
                </li>
              </ul>
              <div className='details'>
                <h2>
                  Andrew Lovato
                  <br />
                  <span className='job-title'>Software Engineer</span>
                </h2>
              </div>
            </div>
          </div>
          <div className='bio'>
            <p>A passionate software developer</p>
          </div>
        </div>

        <div className='card-container'>
          <div className='card-wrapper'>
            <div className='card'>
              <div className='card-image'>
                <img
                  src='https://image.ibb.co/dUTfmJ/profile_img.jpg'
                  alt='profile one'
                />
              </div>
              <ul className='social-icons'>
                <li>
                  <a href='https://github.com/neljson'>
                    <i className='fab fa-github'></i>
                  </a>
                </li>
                <li>
                  <a href='https://www.linkedin.com/in/nelson-wu-a731781b0'>
                    <i className='fab fa-linkedin'></i>
                  </a>
                </li>
              </ul>
              <div className='details'>
                <h2>
                  Nelson Wu
                  <br />
                  <span className='job-title'>Software Engineer</span>
                </h2>
              </div>
            </div>
          </div>
          <div className='bio'>
            <p>A passionate software developer</p>
          </div>
        </div>

        <div className='card-container'>
          <div className='card-wrapper'>
            <div className='card'>
              <div className='card-image'>
                <img
                  src='https://image.ibb.co/dUTfmJ/profile_img.jpg'
                  alt='profile one'
                />
              </div>
              <ul className='social-icons'>
                <li>
                  <a href='https://github.com/bobdeei'>
                    <i className='fab fa-github'></i>
                  </a>
                </li>
                <li>
                  <a href='https://www.linkedin.com/in/duy-nguyen-991351a3/'>
                    <i className='fab fa-linkedin'></i>
                  </a>
                </li>
              </ul>
              <div className='details'>
                <h2>
                  Duy Nguyen
                  <br />
                  <span className='job-title'>Software Engineer</span>
                </h2>
              </div>
            </div>
          </div>
          <div className='bio'>
            <p>A passionate software developer</p>
          </div>
        </div>

        <div className='card-container'>
          <div className='card-wrapper'>
            <div className='card'>
              <div className='card-image'>
                <img
                  src='https://image.ibb.co/dUTfmJ/profile_img.jpg'
                  alt='profile one'
                />
              </div>
              <ul className='social-icons'>
                <li>
                  <a href='https://github.com/chanychoi93'>
                    <i className='fab fa-github'></i>
                  </a>
                </li>
                <li>
                  <a href='https://www.linkedin.com/in/chan-choi'>
                    <i className='fab fa-linkedin'></i>
                  </a>
                </li>
              </ul>
              <div className='details'>
                <h2>
                  Chan Choi
                  <br />
                  <span className='job-title'>Software Engineer</span>
                </h2>
              </div>
            </div>
          </div>
          <div className='bio'>
            <p>A passionate software developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;

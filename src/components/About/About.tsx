import "./About.scss";

import { aboutContent, aboutImages } from "./AboutData";

const About = () => {
  return (
    <div className="about">
      <div className="about-content">
        <h2>{aboutContent[1].title}</h2>
        <p className="paragraph">{aboutContent[2].description}</p>
      </div>
      <div className="about-images">
        <img src={aboutImages[2].image} alt="Ekam" />
      </div>
    </div>
  );
};

export default About;

import Ekam1 from "../../assets/Ekam1.png";
import Ekam2 from "../../assets/Ekam2.png";
import Ekam3 from "../../assets/Ekam3.png";

interface AboutContentProps {
  id: number;
  title: string;
  description: string;
}

interface AboutImagesProps {
  id: number;
  image: string;
}

export const aboutContent: AboutContentProps[] = [
  {
    id: 1,
    title: "Introduction",
    description:
      "Hey there! I’m Ekam, a passionate Full-Stack Developer & Web Designer who loves crafting seamless, high-performance digital experiences. Whether it's designing elegant UI/UX or building robust applications, I thrive on creating solutions that are both beautiful and functional.",
  },
  {
    id: 2,
    title: "Tech Stack",
    description: `Frontend: React.js, Next.js, Tailwind CSS
Backend: Node.js, Express, MongoDB
Design: Figma, Webflow`,
  },
  {
    id: 3,
    title: "Background",
    description:
      "My journey into web development started with a love for design, which soon evolved into full-stack development. I enjoy bridging the gap between design and code, making sure that what users see is as impressive as what runs under the hood.",
  },
];

export const aboutImages: AboutImagesProps[] = [
  {
    id: 1,
    image: Ekam1,
  },
  {
    id: 2,
    image: Ekam2,
  },
  {
    id: 3,
    image: Ekam3,
  },
];

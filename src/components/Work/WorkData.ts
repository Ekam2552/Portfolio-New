import Project1Video from "../../assets/Project1.mp4";

interface WorkData {
  id: number;
  title?: string;
  techStack?: string[];
  image?: string;
  video?: string;
  link?: string;
}

const workData: WorkData[] = [
  {
    id: 1,
    title: "Learning App",
    techStack: [
      "HTML",
      "CSS",
      "SASS",
      "JavaScript",
      "React",
      "Vite",
      "Node.js",
      "Figma",
      "Git",
      "GitHub",
    ],
    image: "",
    video: Project1Video,
    link: "www.google.com",
  },
  {
    id: 2,
    title: "",
    techStack: [],
    image: "",
    video: "",
    link: "",
  },
  {
    id: 3,
    title: "",
    techStack: [],
    image: "",
    video: "",
  },
];

export default workData;

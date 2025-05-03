import Project1Video from "../../assets/Project1.mp4";

interface WorkData {
  id: number;
  title: string;
  techStack: string[];
  image: string | null;
  video: string | null;
  link: string | null;
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
    image: null,
    video: Project1Video,
    link: "https://learning-app-olive-seven.vercel.app/",
  },
  {
    id: 2,
    title: "Coming Soon",
    techStack: [],
    image: null,
    video: null,
    link: null,
  },
  {
    id: 3,
    title: "Coming Soon",
    techStack: [],
    image: null,
    video: null,
    link: null,
  },
];

export default workData;

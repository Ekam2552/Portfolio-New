import Project1Video from '../../assets/Project1.mp4';
import MealsToGo from '../../assets/MealsToGo.mp4';
import Novelify from '../../assets/Novelify.mp4';
import StrongFitVideo from "../../assets/StrongFit Demo.mov"

interface WorkData {
  id: number;
  title: string;
  techStack: string[];
  image: string | null;
  video: string | null;
  link: string | null;
  styles?: {
    video?: React.CSSProperties;
  };
}

const workData: WorkData[] = [
  {
    id: 1,
    title: 'Learning App',
    techStack: [
      'HTML',
      'CSS',
      'SASS',
      'JavaScript',
      'React',
      'Vite',
      'Node.js',
      'Figma',
      'Git',
      'GitHub',
    ],
    image: null,
    video: Project1Video,
    link: 'https://learning-app-olive-seven.vercel.app/',
  },
  {
    id: 2,
    title: 'Meals To Go',
    techStack: [
      'React Native',
      'Expo',
      'Firebase',
      'Lottie',
      'GeoCoding',
      'Figma',
      'Git',
      'GitHub',
    ],
    image: null,
    video: MealsToGo,
    link: 'https://github.com/Ekam2552/MealsToGo',
    styles: {
      video: {
        objectFit: 'contain',
        objectPosition: 'center',
      },
    },
  },
  {
    id: 3,
    title: 'Novelify',
    techStack: [
      'React',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Authentication(JWT)',
      'Stripe',
      'Git',
      'GitHub',
    ],
    image: null,
    video: Novelify,
    link: 'https://github.com/Ekam2552/Novelify-Frontend',
  },
  {
    id: 4,
    title: 'Strong&Fit',
    techStack: [
      'Webflow',
      'Figma',
      'Design Principles',
      'Responsive Design',
      'GSAP',
      'CMS'
    ],
    image: null,
    video: StrongFitVideo,
    link: 'https://github.com/Ekam2552/StrongFit-Frontend',
  },
];

export default workData;

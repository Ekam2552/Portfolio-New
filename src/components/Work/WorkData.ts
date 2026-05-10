import Project1Video from '../../assets/Project1.mp4';
import MealsToGo from '../../assets/MealsToGo.mp4';
import Novelify from '../../assets/Novelify.mp4';
import StrongFitVideo from "../../assets/StrongFit Demo.mp4";
import LuminaDentalVideo from '../../assets/LuminaDental.mp4';
import VanguardInteriorVideo from '../../assets/VanguardInterior.mp4';
import FlowPilot from "../../assets/FlowPilot.mp4";
import JamesBond from "../../assets/James-Bond.mp4"

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
    title: 'Vanguard Interior',
    techStack: [
      'Next.js',
      'Tailwind CSS',
      'GSAP',
      'Figma',
      'Lenis Smooth Scroll'
    ],
    image: null,
    video: VanguardInteriorVideo,
    link: 'https://vanguard-interior.vercel.app/',
  },
  {
    id: 2,
    title: 'Lumina Dental',
    techStack: [
      'React',
      'SCSS',
      'GSAP',
      'Supabase',
      'Vercel'
    ],
    image: null,
    video: LuminaDentalVideo,
    link: 'https://dental-webapp.vercel.app/',
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
    link: 'https://novelify-frontend.vercel.app/',
  },
  {
    id: 4,
    title: 'James Bond 007',
    techStack: [
      'Next.js',
      'GSAP',
      'Tailwind CSS',
      'Figma',
      'Web Design',
      'Lenis Smooth Scroll',
      'Brutalism Design'
    ],
    image: null,
    video: JamesBond,
    link: 'https://james-bond-tribute.vercel.app/',
  },
  {
    id: 5,
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
    id: 6,
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
    link: 'https://strong-fit.webflow.io/',
  },
  {
    id: 7,
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
    id: 8,
    title: 'FlowPilot',
    techStack: [
      'Webflow',
      'Figma',
      'Relume AI',
      'Responsive Design',
      'GSAP',
    ],
    image: null,
    video: FlowPilot,
    link: 'https://flowpilot-1225f9.webflow.io/',
  }
];

export default workData;

import React, { useState, useEffect } from 'react';
import { Monitor, Database, Code, Award, ArrowRight, ExternalLink, BookOpen, Palette, Globe, Users, Star } from 'lucide-react'; import { motion } from "framer-motion";



const designExperience = {
  stats: [
    { value: "15+", label: "Months Experience", icon: Award },
    { value: "2", label: "Countries Served", icon: Globe },
    { value: "100%", label: "Client Satisfaction", icon: Star },
    { value: "250+", label: "Projects Completed", icon: Users }
  ],
  services: [
    {
      title: "Brand Identity",
      description: "Creating cohesive visual identities that reflect brand values and resonate with target audiences.",
      tools: ["Ideogram", "Figma", "Sketch"],
      icon: Palette
    },
    {
      title: "Marketing Materials",
      description: "Designing engaging promotional content for digital and print campaigns.",
      tools: ["Ideogram", "InDesign", "Canva"],
      icon: Monitor
    },
    {
      title: "Social Media Graphics",
      description: "Crafting eye-catching visuals optimized for various social platforms.",
      tools: ["Canva", "Capcut"],
      icon: ExternalLink
    }
  ],

};
const skills = {
  programming: [
    { name: "Python", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "Java", level: 85 },
    { name: "C++", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "R", level: 70 }
  ],
  data: [
    { name: "MongoDB", level: 85 },
    { name: "Firebase", level: 80 },
    { name: "SQL", level: 85 },
    { name: "Oracle", level: 75 },
    { name: "MariaDB", level: 70 }
  ],
  aiml: [
    { name: "Scikit-learn", level: 85 },
    { name: "NLP", level: 80 },
    { name: "OpenCV", level: 75 },
    { name: "YOLOv8", level: 80 },
    { name: "Hugging Face", level: 75 }
  ]
};

const certifications = [
  {
    title: "Machine Learning A-Z",
    issuer: "Udemy",
    date: "2024",
    topics: ["AI", "Python", "R", "Scikit-learn"],
    icon: BookOpen
  },
  {
    title: "Introduction to Machine Learning",
    issuer: "NPTEL",
    date: "2023",
    topics: ["ML Fundamentals", "Algorithms"],
    icon: Database
  },
  {
    title: "Java Industrial Training",
    issuer: "Vishwakarma Institute",
    date: "2023",
    topics: ["MVC Architecture", "Eclipse IDE", "GUI Development"],
    icon: Code
  }
];

const projects = [
  {
    title: "StudyGears",
    category: "Educational Platform",
    description: "A comprehensive learning management system featuring custom courses, task management, referral system, and reward system.",
    image: "/api/placeholder/400/300",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Student Behavior Detection",
    category: "AI/ML Application",
    description: "Real-time abnormal behavior detection system using YOLOv8 and custom data training for exam monitoring.",
    image: "/api/placeholder/400/300",
    tags: ["Python", "OpenCV", "YOLOv8", "CNN"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Steganography Calculator",
    category: "Security Application",
    description: "Android calculator with hidden encryption capabilities, featuring text steganography and planned image/audio features.",
    image: "/api/placeholder/400/300",
    tags: ["Android", "Java", "Encryption"],
    gradient: "from-green-500 to-teal-500"
  }
];


interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`font-bold text-lg mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
}
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background Patterns */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.02)_25%,rgba(68,68,68,.02)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.02)_75%)]"
          style={{ backgroundSize: '20px 20px' }} />

        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-50/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-50/40 to-transparent" />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur" />
          <div className="relative bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-lg">
            <ul className="flex space-x-12">
              {['About', 'Skills', 'Projects', 'Experience'].map((item) => (
                <li key={item}>
                  <button
                    className={`relative text-sm font-medium transition-colors duration-300
                      ${activeSection === item.toLowerCase() ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => {
                      document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                      setActiveSection(item.toLowerCase());
                    }}
                  >
                    {item}
                    {activeSection === item.toLowerCase() && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  <span className="text-sm text-blue-600 font-medium">Available for opportunities</span>
                </div>

                <h1 className="text-6xl font-bold">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Shubham
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Musale
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Crafting digital experiences through innovative design and development.
                  Freelance designer since June 2023, delivering creative solutions across borders.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    View Projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="flex gap-4">
                  {[
                    { icon: "github", href: "https://github.com/ShubhamMusale-UCM" },
                    { icon: "linkedin", href: "https://www.linkedin.com/in/shubham-musale-a1425722a" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="group relative p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={`/api/placeholder/20/20`} alt={social.icon} className="w-5 h-5 relative" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-2xl rounded-full" />
                </div>
                <div className="relative rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img
                    src="/api/placeholder/500/500"
                    alt="Profile"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
            <span className="text-blue-600 font-semibold">Technical Expertise</span>
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
          </div>
          <Card className="p-6">
            <CardHeader>

              <CardTitle className="text-4xl font-bold text-center mb-6">
                Capabilities & Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(skills).map(([category, skillSet], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.skills ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {category.toUpperCase()}
                    </h3>
                    <div className="space-y-4">
                      {skillSet.map((skill, skillIndex) => (
                        <div key={skillIndex} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={isVisible.skills ? { scaleX: skill.level / 100 } : {}}
                              transition={{ duration: 1, delay: skillIndex * 0.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* New Certifications Section */}
      <section id="certifications" className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-purple-600 rounded-full" />
            <span className="text-purple-600 font-semibold">Professional Development</span>
            <div className="h-1 w-12 bg-purple-600 rounded-full" />
          </div>
          <Card className="p-6">
            <CardHeader>

              <CardTitle className="text-4xl font-bold text-center mb-6">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.certifications ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-50 rounded-full">
                        <cert.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{cert.title}</h3>
                        <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cert.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Projects Section */}
      <section id="projects" className="py-32">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1 w-12 bg-green-600 rounded-full" />
          <span className="text-green-600 font-semibold">Featured Work</span>
          <div className="h-1 w-12 bg-green-600 rounded-full" />
        </div>
        <div className="container mx-auto px-6">

          <Card className="p-6">
            <CardHeader>

              <CardTitle className="text-4xl font-bold text-center mb-6">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.projects ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-gray-500">{project.category}</span>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Experience Section */}
      <section id="experience" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            <span className="text-indigo-600 font-semibold">Design Journey</span>
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
          </div>
          <Card className="p-6">
            <CardHeader>

              <CardTitle className="text-4xl font-bold text-center mb-6">Graphic Design Experience</CardTitle>
              <p className="text-center text-gray-600 max-w-2xl mx-auto">
                Delivering creative solutions and exceptional designs to clients worldwide since 2023
              </p>
            </CardHeader>

            <CardContent className="space-y-16">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {designExperience.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.experience ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4 mb-3">
                        <stat.icon className="w-6 h-6 text-indigo-600" />
                        <h4 className="font-bold text-3xl text-gray-800">{stat.value}</h4>
                      </div>
                      <p className="text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {designExperience.services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.experience ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                          <service.icon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.tools.map((tool, toolIndex) => (
                          <span
                            key={toolIndex}
                            className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>





            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

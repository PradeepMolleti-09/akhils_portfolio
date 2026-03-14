import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { projects } from '../data/portfolio';

const ProjectCarousel = ({ images, title }) => {
  const [constraints, setConstraints] = useState({ right: 0, left: 0 });
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && containerRef.current) {
      setConstraints({
        right: 0,
        left: -(scrollRef.current.scrollWidth - containerRef.current.offsetWidth) - 40,
      });
    }
  }, [images]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#E5E5E5] border border-zinc-200 cursor-grab active:cursor-grabbing">
      <motion.div
        ref={scrollRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        className="flex gap-4 p-4 min-w-full"
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="relative shrink-0 w-[85vw] md:w-[60vw] aspect-[16/9] rounded-[2rem] overflow-hidden"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <img
              src={img}
              alt={`${title} slide ${idx + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 text-black bg-white">
      <div className="container mx-auto px-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-40 group"
          >
            {/* Project Carousel Area */}
            <div className="mb-12">
              <ProjectCarousel images={project.images} title={project.title} />
            </div>

            {/* Project Info Block (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-2">
              {/* Column 1: Title & Tags */}
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-[1.15]">
                  {project.title} — {project.shortDescription}
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 bg-[#EDEDED] text-black font-black rounded-lg border border-black/5 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Column 2: Description */}
              <div className="md:col-span-1">
                <p className="text-black/60 text-sm leading-relaxed mb-6 font-medium">
                  {project.description}
                </p>
              </div>

              {/* Column 3: Industry */}
              <div className="md:col-span-1 md:text-right">
                <p className="text-[10px] uppercase font-black tracking-widest text-black/40 mb-2">INDUSTRY</p>
                <p className="text-lg font-bold text-black italic">{project.industry}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;

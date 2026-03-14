import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { projects } from '../data/portfolio';

const ProjectCarousel = ({ images, title }) => {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide width calculation
  const slideWidth = width > 768 ? width * 0.75 : width * 0.85;
  const gap = 30; // Increased gap for clarity
  const totalSlideWidth = slideWidth + gap;

  // Initial padding to center the first item
  // Padding = (ContainerWidth - SlideWidth) / 2
  const centerPadding = width ? (width - slideWidth) / 2 : 100;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[550px] overflow-hidden bg-white cursor-grab active:cursor-grabbing flex items-center"
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: -(images.length - 1) * totalSlideWidth,
          right: 0,
        }}
        dragElastic={0.2}
        style={{ x, paddingLeft: centerPadding }}
        onDragEnd={(_, info) => {
          const velocity = info.velocity.x;
          const currentX = x.get();
          
          let nextIdx = Math.round(-currentX / totalSlideWidth);
          
          if (velocity < -400) nextIdx = Math.min(nextIdx + 1, images.length - 1);
          if (velocity > 400) nextIdx = Math.max(nextIdx - 1, 0);
          
          setActiveIdx(nextIdx);
        }}
        animate={{ x: -activeIdx * totalSlideWidth }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="flex gap-[30px]"
      >
        {images.map((img, idx) => (
          <CarouselItem 
            key={idx} 
            img={img} 
            index={idx} 
            activeIndex={activeIdx}
            slideWidth={slideWidth}
          />
        ))}
      </motion.div>
    </div>
  );
};

const CarouselItem = ({ img, index, activeIndex, slideWidth }) => {
  const isFocused = index === activeIndex;
  
  return (
    <motion.div
      animate={{
        scale: isFocused ? 1 : 0.92,
        filter: isFocused ? "blur(0px)" : "blur(8px)",
        opacity: isFocused ? 1 : 0.4,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: slideWidth }}
      className="relative shrink-0 aspect-[16/9] overflow-hidden bg-zinc-200 border border-black/5"
    >
      <img
        src={img}
        alt={`Project slide ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none"
      />
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32 text-black bg-white">
      <div className="w-full">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-48"
          >
            {/* Project Carousel Area */}
            <div className="mb-16">
              <ProjectCarousel images={project.images} title={project.title} />
            </div>

            {/* Project Info Block */}
            <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 leading-[1]">
                  {project.title} — {project.shortDescription}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.2em] px-5 py-3 bg-[#f5f5f5] text-black font-bold border border-black/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-1">
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="md:col-span-1 md:text-right">
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-300 mb-2">INDUSTRY</p>
                <p className="text-xl font-bold italic">{project.industry}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;

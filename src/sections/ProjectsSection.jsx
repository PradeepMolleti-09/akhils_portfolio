import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { projects } from '../data/portfolio';

const ProjectCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  // Auto-play interval that pauses on hover/drag
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  // Slide width calculation
  const slideWidth = width > 768 ? width * 0.75 : width * 0.85;
  const gap = 30;
  const totalSlideWidth = slideWidth + gap;
  const centerPadding = width ? (width - slideWidth) / 2 : 100;

  // We only render exactly what we need, but we map the active index visually over the standard length
  // The layout wraps around logically.
  
  // Calculate relative distances for the items to create the circular effect visually
  // We'll give the images a stable standard array, and just update the current active element's styles
  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div 
        ref={containerRef} 
        className="w-full py-12 flex cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -((images.length * 3) * totalSlideWidth), right: ((images.length * 2) * totalSlideWidth) }}
          dragElastic={0.8}
          style={{ x, paddingLeft: centerPadding }}
          onDragEnd={(_, info) => {
            const velocity = info.velocity.x;
            const currentX = x.get();
            
            // Allow wrapping in drag calculation
            let offset = Math.round(-currentX / totalSlideWidth);
            if (velocity < -400) offset += 1;
            if (velocity > 400) offset -= 1;
            
            // Normalize back to 0 -> length-1 space
            let normalizedIdx = ((offset % images.length) + images.length) % images.length;
            setActiveIdx(normalizedIdx);
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

      {/* Sliding Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {images.map((_, idx) => (
          <motion.div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="h-1.5 rounded-full cursor-pointer transition-colors"
            animate={{
              width: activeIdx === idx ? 24 : 6,
              backgroundColor: activeIdx === idx ? "#000000" : "#D4D4D4"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        ))}
      </div>
    </div>
  );
};

const CarouselItem = ({ img, index, activeIndex, slideWidth }) => {
  const isFocused = index === activeIndex;
  
  return (
    <motion.div
      animate={{
        scale: isFocused ? 1 : 0.94,
        filter: isFocused ? "blur(0px) grayscale(0%)" : "blur(3px) grayscale(100%)",
        opacity: isFocused ? 1 : 0.6,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: slideWidth }}
      className={`relative shrink-0 aspect-[16/9] overflow-hidden bg-zinc-200 border-2 ${isFocused ? 'border-zinc-400' : 'border-zinc-200'}`}
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

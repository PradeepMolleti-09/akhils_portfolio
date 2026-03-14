import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { projects } from '../data/portfolio';

const ProjectCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Create a virtual circular array by repeating the images multiple times
  const extendedImages = Array.from({ length: 11 }).flatMap(() => images);
  
  // Start perfectly in the middle block so dragging in either direction is safe
  const [activeIdx, setActiveIdx] = useState(images.length * 5);

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

  // Auto-play interval that continuously loops in one direction uniformly
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prevIdx) => prevIdx + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Slide width calculation
  const slideWidth = width > 768 ? width * 0.75 : width * 0.85;
  const gap = 30;
  const totalSlideWidth = slideWidth + gap;
  const centerPadding = width ? (width - slideWidth) / 2 : 100;

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
          dragConstraints={{ 
            left: -(extendedImages.length - 1) * totalSlideWidth, 
            right: 0 
          }}
          dragElastic={0.2}
          style={{ x, paddingLeft: centerPadding }}
          onDragEnd={(_, info) => {
            const velocity = info.velocity.x;
            const currentX = x.get();
            
            let nextIdx = Math.round(-currentX / totalSlideWidth);
            
            // Allow flicking
            if (velocity < -400) nextIdx += 1;
            if (velocity > 400) nextIdx -= 1;
            
            // Constrain within the virtual limits, practically infinite for User
            nextIdx = Math.max(0, Math.min(nextIdx, extendedImages.length - 1));
            setActiveIdx(nextIdx);
          }}
          animate={{ x: -activeIdx * totalSlideWidth }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex gap-[30px]"
        >
          {extendedImages.map((img, idx) => (
            <CarouselItem 
              key={`${idx}-${img}`} 
              img={img} 
              index={idx} 
              activeIndex={activeIdx}
              slideWidth={slideWidth}
            />
          ))}
        </motion.div>
      </div>

      {/* Sliding Dots Indicator perfectly tracking the original images mapping */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {images.map((_, originalIdx) => {
          const isActiveDot = (activeIdx % images.length) === originalIdx;
          return (
            <motion.div
              key={originalIdx}
              onClick={() => {
                // Jump to the clicked dot in the current virtual block context
                const currentBlock = Math.floor(activeIdx / images.length);
                setActiveIdx(currentBlock * images.length + originalIdx);
              }}
              className="h-1.5 rounded-full cursor-pointer transition-colors"
              animate={{
                width: isActiveDot ? 24 : 6,
                backgroundColor: isActiveDot ? "#000000" : "#D4D4D4"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )
        })}
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
        filter: isFocused ? "blur(0px) grayscale(0%)" : "blur(1px) grayscale(100%)",
        opacity: isFocused ? 1 : 0.8,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: slideWidth }}
      className={`relative shrink-0 aspect-[16/9] overflow-hidden bg-[#f4f4f4] ${isFocused ? 'shadow-xl' : 'border border-black/5'}`}
    >
      <img
        src={img}
        alt={`Project slide ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none"
      />
      {/* Black and white gradient overlay effect for beside images */}
      {!isFocused && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-tr from-white/60 to-transparent pointer-events-none mix-blend-screen"
        />
      )}
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

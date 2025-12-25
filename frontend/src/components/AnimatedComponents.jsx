import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card } from "antd";

/**
 * Animated Card with 3D tilt effect and smooth animations
 */
export const AnimatedCard = ({
  children,
  delay = 0,
  tiltEnabled = true,
  className = "",
  ...props
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const CardContent = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
    >
      <Card
        className={`enhanced-card ${className}`}
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );

  if (tiltEnabled) {
    return (
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        scale={1}
        transitionSpeed={2000}
        gyroscope={true}
      >
        {CardContent}
      </Tilt>
    );
  }

  return CardContent;
};

/**
 * Parallax Section with background effects
 */
export const ParallaxSection = ({
  children,
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  className = "",
  style = {},
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        background: gradient,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={`particle-bg ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered Container for animating children
 */
export const StaggerContainer = ({ children, className = "", ...props }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated Item for use within StaggerContainer
 */
export const StaggerItem = ({ children, className = "", ...props }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * Fade In Up Animation
 */
export const FadeInUp = ({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scale In Animation
 */
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Floating Animation
 */
export const FloatingElement = ({
  children,
  duration = 3,
  yOffset = 20,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Rotating Animation
 */
export const RotatingElement = ({
  children,
  duration = 20,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Glassmorphism Card
 */
export const GlassCard = ({
  children,
  className = "",
  dark = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`${dark ? "glass-dark" : "glass"} ${className}`}
      style={{
        borderRadius: "16px",
        padding: "24px",
        ...props.style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Page Transition Wrapper
 */
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  AnimatedCard,
  ParallaxSection,
  StaggerContainer,
  StaggerItem,
  FadeInUp,
  ScaleIn,
  FloatingElement,
  RotatingElement,
  GlassCard,
  PageTransition,
};

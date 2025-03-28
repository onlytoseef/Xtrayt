import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, LayoutGrid, Smile, Brush, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const About = () => {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About YTube Tool",
    description:
      "We create tools that respect your time and attention, inspired by principles of simplicity and clarity.",
    mainEntity: {
      "@type": "Organization",
      name: " Xtrayt",
      description:
        "At Xtrayt , we believe that technology should serve users with elegance and simplicity. Our mission is to build tools that respect human attention and deliver exceptional utility without unnecessary complexity.",
    },
  };

  const principles = [
    {
      icon: Brush,
      title: "Simplicity",
      description: "Clean, intuitive design that gets out of your way.",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimized for speed and efficiency in every interaction.",
    },
    {
      icon: Shield,
      title: "Privacy",
      description: "Your data stays on your device. No tracking, no analytics.",
    },
    {
      icon: LayoutGrid,
      title: "Consistency",
      description: "Coherent experience across all features and views.",
    },
    {
      icon: Cpu,
      title: "Innovation",
      description: "Constantly improving with new technologies and methods.",
    },
    {
      icon: Smile,
      title: "User-Centric",
      description: "Designed with real users and real workflows in mind.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        pageName="about"
        title="About Us | Xtrayt "
        description="Learn about YTube Tool and our mission to provide simple, efficient tools for content creators."
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We create tools that respect your time and attention, inspired by
            principles of simplicity and clarity.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 mb-16"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Xtrayt, we believe technology should empower users with
              elegance and simplicity. Our mission is to craft tools that
              respect your time and deliver unmatched utility—without
              unnecessary complexity. We design seamless experiences that
              combine powerful features with intuitive interfaces, making our
              tools accessible to everyone, regardless of technical skill.
            </p>
            <p className="text-muted-foreground">
              We focus on creating experiences that blend powerful functionality
              with intuitive design, ensuring that our tools are accessible to
              everyone regardless of technical expertise.
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-semibold mb-8 text-center"
          >
            Our Design Principles
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {principles.map((principle, index) => (
              <motion.div key={index} variants={item}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                      <principle.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;

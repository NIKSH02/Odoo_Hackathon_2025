import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "How It Works", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Safety Guidelines", href: "#" },
        { name: "Community Rules", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Report Issue", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Refund Policy", href: "#" },
        { name: "Disclaimer", href: "#" }
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "Newsletter", href: "#" },
        { name: "Instagram", href: "#" },
        { name: "Facebook", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "TikTok", href: "#" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hidden: { 
      x: -20, 
      opacity: 0 
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      {/* Main Footer Content */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ClothSwap
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed max-w-md">
                The sustainable way to refresh your wardrobe. Join thousands of fashion lovers 
                who are swapping, saving money, and helping the planet.
              </p>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800">Stay Updated</h3>
              <div className="flex space-x-3">
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-300"
                  whileFocus={{ 
                    scale: 1.02,
                    borderColor: "#6B7280"
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: "📘", name: "Facebook" },
                  { icon: "📷", name: "Instagram" },
                  { icon: "🐦", name: "Twitter" },
                  { icon: "🎵", name: "TikTok" }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg hover:bg-gray-300 transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      backgroundColor: "#D1D5DB"
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Links Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {footerSections.map((section, sectionIndex) => (
              <motion.div 
                key={section.title}
                className="space-y-4"
                variants={itemVariants}
                custom={sectionIndex}
              >
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      custom={linkIndex}
                    >
                      <motion.a
                        href={link.href}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm"
                        whileHover={{ 
                          x: 5,
                          color: "#1F2937"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="border-t border-gray-300 pt-12 mb-12"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users", icon: "👥" },
              { number: "50K+", label: "Items Swapped", icon: "👕" },
              { number: "25+", label: "Cities", icon: "🌍" },
              { number: "95%", label: "Satisfaction", icon: "⭐" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="space-y-2"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
                viewport={{ once: true }}
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div 
        className="border-t border-gray-300 bg-gray-100/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="text-gray-600 text-sm"
              whileHover={{ color: "#1F2937" }}
              transition={{ duration: 0.3 }}
            >
              © 2025 ClothSwap. All rights reserved. Made with ❤️ for sustainable fashion.
            </motion.div>
            <motion.div 
              className="flex space-x-6 text-sm"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {["Privacy", "Terms", "Cookies", "Accessibility"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  variants={linkVariants}
                  whileHover={{ 
                    y: -2,
                    color: "#1F2937"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
        
      </motion.div>
    </footer>
  );
}

import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import ContactSection from '../src/components/sections/ContactSection';

const ContactPage = () => {
  const headingRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;
      if (rect.top < screenPosition) {
        headingRef.current.classList.add('animate');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Contact Us | EventMappr</title>
        <meta name="description" content="Get in touch with the EventMappr team. We'd love to hear from you!" />
      </Head>
      
      <div className="contact-page">
        <div className="contact-header">
          <div className="container contact-heading" ref={headingRef}>
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Reach out with any questions, feedback, or partnership opportunities.</p>
          </div>
        </div>
        
        <ContactSection />
      </div>
      
      <style jsx>{`
        .contact-page {
          min-height: calc(100vh - 400px); /* Adjust for footer height */
        }
        
        .contact-header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 8rem 0 4rem;
          text-align: center;
        }
        
        .contact-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .contact-header p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }
        .contact-heading {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .contact-heading.animate {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default ContactPage; 
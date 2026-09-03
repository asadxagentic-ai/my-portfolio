import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollSystem';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'message' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Live GMT+5 Pakistan Time Ticker
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()) + ' PKT (GMT+5)');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const targetFormData = new FormData(e.currentTarget);
      
      // Web3Forms Configurations
      targetFormData.set("access_key", "b259b30d-0de8-4896-be65-297364319135");
      targetFormData.set("subject", `🟠 [Portfolio Inquiry] - ${formData.name}`);
      targetFormData.set("from_name", `${formData.name} (via Portfolio)`);
      targetFormData.set("replyto", formData.email);
      
      // Custom Inbox Formatting Metadata (matching site theme/branding)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'medium'
      };
      const pktTime = new Intl.DateTimeFormat('en-US', options).format(new Date()) + ' PKT';
      
      targetFormData.set("Submission Time", pktTime);
      targetFormData.set("System Source", "🌐 Asadullah AI Portfolio");
      targetFormData.set("Visual Theme Profile", "🟠 Orange (#f05a28) & Charcoal Dark (#111115)");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: targetFormData,
      });
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.message || "Failed to submit message. Please try again.");
        console.error("Invalid Form Data", result);
      }
    } catch (error) {
      setSubmitError("Failed to connect to the submission server.");
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section 
      id="contact" 
      className="relative bg-white text-[#111] py-24 md:py-32 px-[5%] border-t border-zinc-200 overflow-hidden font-sans selection:bg-orange-500 selection:text-white"
    >
      {/* Decorative vertical lines */}
      <div className="absolute top-0 bottom-0 left-[5%] right-[5%] pointer-events-none z-0 flex justify-between select-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-px h-full bg-zinc-100/80" />
        ))}
      </div>

      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Editorial Text & Social Channels */}
          <ScrollReveal variant="fade-up" duration={0.8} className="lg:col-span-5 flex flex-col justify-between h-full select-none">
            <div>
              <div className="flex items-center gap-3 mb-6 font-mono text-[9px] font-black tracking-[0.28em] text-zinc-400">
                <span className="text-orange-500">//</span> TRANSMIT ENQUIRY
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] font-['Outfit'] mb-8 sm:mb-10 text-zinc-950">
                LET'S START<br/>
                <span className="text-zinc-400">SOMETHING</span><br/>
                <span className="text-orange-600">NEW.</span>
              </h2>
            </div>

            {/* Metagrid: Location & Local time */}
            <div className="space-y-6 mb-10 font-mono text-[10px] tracking-wider text-zinc-500">
              <motion.div 
                className="border-t border-zinc-100 pt-5 group cursor-default"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="text-zinc-400 block mb-1 uppercase font-bold group-hover:text-orange-500/70 transition-colors duration-300">// HQ LOCATION</span>
                <span className="text-zinc-800 font-semibold uppercase">Pakistan, Global Operations</span>
              </motion.div>
              <motion.div 
                className="border-t border-zinc-100 pt-5 group cursor-default"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="text-zinc-400 block mb-1 uppercase font-bold group-hover:text-orange-500/70 transition-colors duration-300">// LOCAL ZONE TIME</span>
                <span className="text-zinc-800 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-glow" />
                  {localTime}
                </span>
              </motion.div>
            </div>

            {/* Social Channels (Uiverse EcheverriaJesus Style) */}
            <div className="border-t border-zinc-100 pt-6">
              <span className="text-[9px] font-mono text-zinc-400 block mb-5 uppercase tracking-wider font-bold">
                // Social links
              </span>
              <div className="flex gap-4 items-center flex-wrap pl-1">
                <ul className="example-1">
                  <li className="icon-content">
                    <a
                      href="https://github.com/asadxagentic-ai"
                      aria-label="GitHub"
                      data-social="github"
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                    <div className="tooltip">GitHub</div>
                  </li>
                  <li className="icon-content">
                    <a
                      href="https://www.upwork.com/freelancers/~01b340170e0882a0b0?viewMode=1"
                      aria-label="Upwork"
                      data-social="upwork"
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.543-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c.715.485 1.528.761 2.392.775l.135.003c2.909 0 5.283-2.37 5.283-5.281.002-2.914-2.371-5.303-5.281-5.303z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                    <div className="tooltip">Upwork</div>
                  </li>
                  <li className="icon-content">
                    <a
                      href="https://linkedin.com/in/asadxagentic-ai/"
                      aria-label="LinkedIn"
                      data-social="linkedin"
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                    <div className="tooltip">LinkedIn</div>
                  </li>
                  <li className="icon-content">
                    <a
                      href="https://wa.me/+923038837299"
                      aria-label="WhatsApp"
                      data-social="whatsapp"
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          d="M12.004 0C5.378 0 0 5.374 0 12.001c.001 2.124.553 4.197 1.6 6.012l-1.7 6.2 6.34-1.662c1.78.973 3.774 1.487 5.798 1.488h.008c6.622 0 12.001-5.378 12.001-12.004 0-3.21-1.25-6.223-3.51-8.49C18.23 1.25 15.213 0 12.004 0zm0 21.996c-1.8 0-3.56-.48-5.11-1.39l-.37-.22-3.79.99.1-3.69-.24-.38a9.92 9.92 0 0 1-1.52-5.3c0-5.51 4.49-10 10-10 2.67 0 5.18 1.04 7.07 2.93a9.9 9.9 0 0 1 2.93 7.07c-.01 5.52-4.5 10.01-10.01 10.01zm5.5-7.51c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07a8.1 8.1 0 0 1-2.38-1.47 8.93 8.93 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6l.43-.5c.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.59-.5-.51-.67-.52h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.07 4.48.71.3 1.26.49 1.69.62.75.24 1.43.2 1.97.12.6-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                    <div className="tooltip">WhatsApp</div>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT COLUMN: Interactive Contact Form */}
          <ScrollReveal variant="fade-up" delay={0.15} duration={0.8} className="lg:col-span-7 bg-[#fafafa] border border-zinc-200/60 rounded-3xl p-6 md:p-10 shadow-lg shadow-zinc-100 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit}
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <input type="hidden" name="access_key" value="b259b30d-0de8-4896-be65-297364319135" />
                  
                  {/* Name Input */}
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-b-0 py-3 text-[#111] focus:outline-none placeholder-transparent text-sm font-semibold relative z-10"
                    />
                    <label 
                      htmlFor="name" 
                      className={`absolute left-0 transition-all pointer-events-none select-none z-10 ${
                        focusedField === 'name' || formData.name 
                          ? '-top-3.5 text-[9px] text-orange-600 font-mono font-bold uppercase tracking-wider' 
                          : 'top-3 text-sm text-zinc-400 font-medium'
                      }`}
                    >
                      Your Name
                    </label>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-200 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none" />
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-b-0 py-3 text-[#111] focus:outline-none placeholder-transparent text-sm font-semibold relative z-10"
                    />
                    <label 
                      htmlFor="email" 
                      className={`absolute left-0 transition-all pointer-events-none select-none z-10 ${
                        focusedField === 'email' || formData.email 
                          ? '-top-3.5 text-[9px] text-orange-600 font-mono font-bold uppercase tracking-wider' 
                          : 'top-3 text-sm text-zinc-400 font-medium'
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-200 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none" />
                  </div>

                  {/* Message Input */}
                  <div className="relative group">
                    <textarea 
                      id="message" 
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-b-0 py-3 text-[#111] focus:outline-none placeholder-transparent text-sm font-semibold relative z-10 resize-none min-h-[100px]"
                    />
                    <label 
                      htmlFor="message" 
                      className={`absolute left-0 transition-all pointer-events-none select-none z-10 ${
                        focusedField === 'message' || formData.message 
                          ? '-top-3.5 text-[9px] text-orange-600 font-mono font-bold uppercase tracking-wider' 
                          : 'top-3 text-sm text-zinc-400 font-medium'
                      }`}
                    >
                      Project Details & scope
                    </label>
                    {/* Grey baseline (always visible) */}
                    <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-200 pointer-events-none" />
                    {/* Orange line draws over the grey one on hover */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none" />
                  </div>

                  {submitError && (
                    <div className="text-red-500 text-xs font-semibold font-mono tracking-wide mt-2">
                      Error: {submitError}
                    </div>
                  )}

                   {/* Submit Button */}
                   <motion.div
                     whileHover={{ scale: 1.015, y: -1 }}
                     whileTap={{ scale: 0.985 }}
                     transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                   >
                     <button 
                       type="submit"
                       disabled={isSubmitting}
                       className="w-full py-4 px-6 rounded-full bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-600 hover:shadow-[0_10px_35px_rgba(234,88,12,0.3)] active:scale-100 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-500 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
                     >
                       {/* Shimmer sweep on hover */}
                       <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 pointer-events-none" />
                       {isSubmitting ? (
                         <>
                           <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           Transmitting details...
                         </>
                       ) : (
                         <>
                           Transmit message <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                         </>
                       )}
                     </button>
                   </motion.div>
                </motion.form>
              ) : (
                /* SUCCESS SCREEN */
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-50/80 border border-orange-200 flex items-center justify-center text-orange-600 mb-6 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold text-orange-500 tracking-wider block mb-2 uppercase">
                    transmission received
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-black font-['Outfit'] text-zinc-950 uppercase mb-4 leading-tight">
                    Thank you, {formData.name.split(' ')[0]}!
                  </h3>
                  
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-sm mb-8 font-medium">
                    Your message packet has been routed successfully. I will review your project details and get back to you within 24 hours.
                  </p>

                   <motion.button 
                     onClick={handleReset}
                     className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-orange-300 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 focus:ring-2 focus:ring-zinc-400 focus:outline-none transition-all duration-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(240,90,40,0.1)] group"
                     whileHover={{ scale: 1.04, y: -2 }}
                     whileTap={{ scale: 0.97 }}
                     transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                   >
                     Send another message
                     <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                   </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

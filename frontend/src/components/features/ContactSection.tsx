import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Linkedin, Github, Twitter } from 'lucide-react';
import { toast } from 'sonner';

export function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you for reaching out! Our team will contact you shortly.');
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4">
            <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Get In Touch</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Connect With Our <span className="gradient-text">Sustainability Team</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mt-3">
            Have questions about municipal deployment, enterprise API integration, or Gemini model tuning?
          </p>
        </motion.div>

        {/* Form & Info Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card-emerald p-8 border border-emerald-200 dark:border-emerald-800 space-y-6 relative overflow-hidden">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Mohamed Apsar</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  EcoWaste AI Platform Developer · Karur, Tamil Nadu
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500">EMAIL</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">mohamedaadhil466@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500">PHONE</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">9789340904</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/60 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-600 dark:text-green-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500">LOCATION</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Karur, Tamil Nadu</p>
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                    <Github size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-emerald-500/5 pointer-events-none" />
              
              <div className="relative z-10">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                      <CheckCircle2 size={30} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Message Transmitted</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                      Thank you! Our AI specialist team will contact you at <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formData.email}</span> within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="btn-outline py-2 px-6 text-xs font-bold mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1.5">FULL NAME *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="input-light"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1.5">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="input-light"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1.5">SUBJECT</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enterprise Inquiry / Partnership"
                        className="input-light"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1.5">MESSAGE *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project or waste management goals..."
                        className="input-light resize-none"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3.5 text-sm font-bold flex justify-center items-center gap-2">
                      <span>Send Message</span>
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

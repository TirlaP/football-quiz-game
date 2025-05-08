import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Trophy, Medal, Star, Award, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'achievement' | 'reward';
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  importance?: 'low' | 'medium' | 'high';
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  variant = 'default',
  showCloseButton = true,
  disableBackdropClick = false,
  importance = 'medium'
}: ModalProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body from scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Trigger confetti for certain variants
      if ((variant === 'achievement' || variant === 'success' || variant === 'reward') && !hasAnimated && importance !== 'low') {
        const duration = importance === 'high' ? 3000 : 1500;
        const particleCount = importance === 'high' ? 150 : 80;
        
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
          zIndex: 1000,
          disableForReducedMotion: true,
          scalar: 1.2,
          gravity: 1.2,
          decay: 0.94
        });
        
        setHasAnimated(true);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = '';
      
      // Reset animation state when modal closes
      if (!isOpen) {
        setHasAnimated(false);
      }
    };
  }, [isOpen, onClose, variant, importance, hasAnimated]);

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (!disableBackdropClick) {
      onClose();
    }
  };

  // Stop propagation on modal click
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-500 to-green-600',
          titleColor: 'text-white',
          icon: <ThumbsUp size={22} className="text-white mr-2" />,
          borderColor: 'border-emerald-400',
          bodyBg: 'bg-gradient-to-b from-emerald-50 to-white',
          shadow: 'shadow-emerald-200/50'
        };
      case 'error':
        return {
          headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
          titleColor: 'text-white',
          icon: <AlertCircle size={22} className="text-white mr-2" />,
          borderColor: 'border-red-400',
          bodyBg: 'bg-gradient-to-b from-red-50 to-white',
          shadow: 'shadow-red-200/50'
        };
      case 'warning':
        return {
          headerBg: 'bg-gradient-to-r from-amber-400 to-amber-500',
          titleColor: 'text-white',
          icon: <AlertCircle size={22} className="text-white mr-2" />,
          borderColor: 'border-amber-400',
          bodyBg: 'bg-gradient-to-b from-amber-50 to-white',
          shadow: 'shadow-amber-200/50'
        };
      case 'achievement':
        return {
          headerBg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          titleColor: 'text-white',
          icon: <Medal size={22} className="text-white mr-2" />,
          borderColor: 'border-indigo-400',
          bodyBg: 'bg-gradient-to-b from-indigo-50 to-white',
          shadow: 'shadow-indigo-200/50'
        };
      case 'reward':
        return {
          headerBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          titleColor: 'text-white',
          icon: <Trophy size={22} className="text-white mr-2" />,
          borderColor: 'border-yellow-400',
          bodyBg: 'bg-gradient-to-b from-yellow-50 to-white',
          shadow: 'shadow-yellow-200/50'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          titleColor: 'text-white',
          icon: null,
          borderColor: 'border-blue-400',
          bodyBg: 'bg-white',
          shadow: 'shadow-blue-200/30'
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // Floating animation for achievements and rewards
  const floatingAnimation = variant === 'achievement' || variant === 'reward' ? {
    y: [0, -8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  } : {};

  // Get icon based on variant for the floating decoration
  const getFloatingIcons = () => {
    if (variant === 'achievement') {
      return [<Star key="star" size={24} className="text-yellow-400" />, 
              <Medal key="medal" size={28} className="text-indigo-500" />];
    } else if (variant === 'reward') {
      return [<Trophy key="trophy" size={28} className="text-yellow-500" />, 
              <Award key="award" size={24} className="text-amber-400" />];
    }
    return [];
  };

  const floatingIcons = getFloatingIcons();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 game-modal backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={handleBackdropClick}
        >
          {/* Backdrop pattern */}
          <div className="absolute inset-0 bg-field-pattern opacity-15 bg-repeat"></div>
          
          {/* Special decorations for achievements and rewards */}
          {(variant === 'achievement' || variant === 'reward') && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    opacity: 0.6 + Math.random() * 0.4,
                    transform: `scale(${0.5 + Math.random() * 1.0})`,
                    zIndex: 51
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: Math.random() * 2
                  }}
                >
                  {floatingIcons[i % floatingIcons.length]}
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Modal container */}
          <motion.div 
            className={`game-modal-content max-w-md w-full mx-auto z-10 rounded-xl overflow-hidden 
              border-2 ${variantStyles.borderColor} ${variantStyles.shadow} shadow-xl ${className}`}
            variants={modalVariants}
            onClick={handleModalClick}
            animate={variant === 'achievement' || variant === 'reward' ? floatingAnimation : {}}
          >
            {/* Header */}
            <div className={`game-modal-header p-4 flex justify-between items-center ${variantStyles.headerBg}`}>
              <h2 className={`text-xl font-bold flex items-center ${variantStyles.titleColor}`}>
                {variantStyles.icon}
                {title}
              </h2>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-white opacity-80 hover:opacity-100 focus:outline-none 
                  transition-all transform hover:scale-110 hover:rotate-90 duration-300"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            {/* Content */}
            <div className={`game-modal-body p-5 ${variantStyles.bodyBg}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
import AnimationSection from '@/components/LandingPage/AnimationSection';
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-dvh items-center justify-center bg-background p-4 overflow-hidden relative'>
      {/* ANIMATION */}
      <AnimationSection />
      {children}
    </div>
  )
}

export default AuthLayout;

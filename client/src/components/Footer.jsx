import React from 'react'

const Footer = () => {
  return (
    <footer id='footer' className='w-full'>
        <div className='container mx-auto px-2'>
            <div className='flex flex-wrap items-center'>
                {/* Copyright */}
                <div className='w-full text-center'>
                    <div className='copyright'>
                        &copy; Copyright 2025 <strong>KERIS</strong>. All Rights Reserved
                    </div>
                </div>
                {/* Footer Links */}
                <div className='w-full'>
                    <nav className='footer-links text-center pt-2'>
                        <a href="#hero" className="scrollto">Home</a>
                        <a href="#about" className="scrollto">About</a>
                    </nav>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer

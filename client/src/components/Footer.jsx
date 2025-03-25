import React from 'react'

const Footer = () => {
  return (
    <footer id='footer' className='w-full'>
        <div className='container mx-auto px-4'>
            <div className='flex flex-wrap items-center'>
                {/* Copyright */}
                <div className='w-full lg:w-1/2 text-center lg:text-center'>
                    <div className='copyright'>
                        &copy; Copyright 2023 <strong>KERIS</strong>. All Rights Reserved
                    </div>
                </div>
                {/* Footer Links */}
                <div className='w-full lg:w-1/2'>
                    <nav className='footer-links text-center lg:text-center pt-2 lg:pt-0'>
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

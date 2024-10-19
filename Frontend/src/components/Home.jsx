
import React from 'react';
import Navbar from './navbar';
import './home.css';
import Footer from './footer';

function Home() {
    return (
        <div>
            <Navbar />
            <br></br>
            <br></br>
            <br></br>
            <div className="flex-container">
              <img 
                src="https://happay.com/blog/wp-content/uploads/sites/12/2022/08/what-is-expense-management.png" 
                alt="expense image" 
              />
              <div className="content">
                <h1 className='head1'>Manage Your Expense</h1>
                <h1 className='head2'>Control Your Money</h1>
                <p>
                  Start creating your budget and save tons of money.
                </p>
                <button className="btn1">Get Started</button>
              </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;


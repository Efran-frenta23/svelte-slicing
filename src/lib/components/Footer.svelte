<footer class="footer">
  <div class="footer-content">
    <div class="footer-left">
      <div class="footer-logo">
        <i class="fas fa-car"></i>
        <span>Autopulse</span>
      </div>
      <p class="footer-tagline">Perjalanan Lancar Dimulai di Sini</p>
    </div>
    <div class="footer-center">
      <div class="footer-links">
        <a href="/Dashboard">Dashboard</a>
        <a href="/service">Service</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
    <div class="footer-right">
      <div class="social-links">
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Autopulse. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 24px;
    margin-top: auto;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .footer-logo i {
    color: #fbbf24;
    font-size: 1.5rem;
  }

  .footer-tagline {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .footer-links {
    display: flex;
    gap: 24px;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: #fbbf24;
  }

  .social-links {
    display: flex;
    gap: 12px;
  }

  .social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .social-links a:hover {
    background: #fbbf24;
    color: #1e3a8a;
    transform: translateY(-2px);
  }

  .footer-bottom {
    text-align: center;
    padding-top: 20px;
  }

  .footer-bottom p {
    margin: 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }

    .footer-links {
      flex-direction: column;
      gap: 12px;
    }

    .social-links {
      justify-content: center;
    }
  }
</style>

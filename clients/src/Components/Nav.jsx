{/* Navigation Header */}
      <nav style={styles.nav}>
        <div style={styles.navContainer} className="nav-container">
          <div style={styles.navContent}>
            {/* Logo */}
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <span style={styles.logoIconText}>H</span>
              </div>
              <span style={styles.logoText}>HotelLogo</span>
            </div>

            {/* Desktop Navigation */}
            <div style={styles.desktopNav} className="desktop-nav">
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
              >
                Home
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
              >
                About
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
              >
                Services
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
              >
                Contact
              </a>
              <a 
                href="/login" 
                style={styles.loginBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.loginBtnHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.loginBtn.backgroundColor}
              >
                Login
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              style={styles.mobileMenuBtn}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            <div style={styles.mobileMenuContent}>
              <a 
                href="#" 
                style={styles.mobileNavLink}
                onMouseEnter={(e) => {
                  e.target.style.color = styles.mobileLinkHover.color;
                  e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styles.mobileNavLink.color;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Home
              </a>
              <a 
                href="#" 
                style={styles.mobileNavLink}
                onMouseEnter={(e) => {
                  e.target.style.color = styles.mobileLinkHover.color;
                  e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styles.mobileNavLink.color;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                About
              </a>
              <a 
                href="#" 
                style={styles.mobileNavLink}
                onMouseEnter={(e) => {
                  e.target.style.color = styles.mobileLinkHover.color;
                  e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styles.mobileNavLink.color;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Services
              </a>
              <a 
                href="#" 
                style={styles.mobileNavLink}
                onMouseEnter={(e) => {
                  e.target.style.color = styles.mobileLinkHover.color;
                  e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styles.mobileNavLink.color;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Contact
              </a>
              <a 
                href="/login" 
                style={styles.mobileLoginBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.loginBtnHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.mobileLoginBtn.backgroundColor}
              >
                Login
              </a>
            </div>
          </div>
        )}
      </nav>
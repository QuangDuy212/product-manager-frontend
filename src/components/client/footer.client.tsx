import './footer.client.scss'
import styles from 'styles/client.module.scss';
const Footer = () => {
    return (
        <footer style={{ backgroundColor: "#000" }}>
            <div className={`${styles["container"]} ${styles["home-section"]}`}>
                <div style={{ backgroundColor: "#000" }} className="footer-container">
                    <div className='footer-line'>
                        <div className="footer-content">
                            <div className="footer-content__title">Exclusive</div>
                            <div className="footer-content__level2">Subscribe</div>
                            <div className="footer-content__normal">Get 10% off your first order</div>
                        </div>
                        <div className="footer-content">
                            <div className="footer-content__title">Support</div>
                            <div className="footer-content__level2">111 Bijoy sarani, Dhaka,  DH 1515, Bangladesh.</div>
                            <div className="footer-content__normal">exclusive@gmail.com</div>
                            <div className="footer-content__normal">+88015-88888-9999</div>
                        </div>
                        <div className="footer-content">
                            <div className="footer-content__title">Account</div>
                            <div className="footer-content__level2">My Account</div>
                            <div className="footer-content__normal">Login / Register</div>
                            <div className="footer-content__normal">Cart</div>
                            <div className="footer-content__normal">Wishlist</div>
                            <div className="footer-content__normal">Shop</div>
                        </div>
                        <div className="footer-content">
                            <div className="footer-content__title">Quick Link</div>
                            <div className="footer-content__level2">Privacy Policy</div>
                            <div className="footer-content__normal">Terms Of Use</div>
                            <div className="footer-content__normal">FAQ</div>
                            <div className="footer-content__normal">Contact</div>
                        </div>
                        <div className="footer-content">
                            <div className="footer-content__title">Download App</div>
                            <div className="footer-content__normal">Save $3 with App New User Only</div>
                            <img src='./../../../public/img/qr.png' style={{ width: "90px", height: "90px", objectFit: "cover", marginTop: "10px" }} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
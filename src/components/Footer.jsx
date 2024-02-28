function Footer() {
    const date = new Date()
    return (
        <footer>
            <p>Copyright Uzi {date.getFullYear()}</p>
        </footer>
    )
}
export default Footer;
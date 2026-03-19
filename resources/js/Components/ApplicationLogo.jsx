const CLEAR_ICE_LOGO = '/img/logo/clear%20ice%20pos%20-%20logo.png';

export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src={CLEAR_ICE_LOGO}
            alt="Clear Ice POS"
            className={className}
        />
    );
}

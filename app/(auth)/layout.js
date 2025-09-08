export default function AuthLayout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5'
        }}>
            <div >
                {children}
            </div>
        </div>
    );
}

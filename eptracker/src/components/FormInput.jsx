import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ label, name, type, placeholder, value, onChange, error, ...props }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <div className={isPassword ? "password-group" : ""}>
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    className={`form-input ${error ? 'input-error' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={error ? { border: '1px solid red', ...(isPassword ? { paddingRight: '40px' } : {}) } : (isPassword ? { paddingRight: '40px' } : {})}
                    {...props}
                />
                {isPassword && (
                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        {showPassword ? '🚫' : '👁️'}
                    </span>
                )}
            </div>
            {error && <span className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>{error}</span>}
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date']).isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

FormInput.defaultProps = {
    placeholder: '',
    error: null
};

export default FormInput;

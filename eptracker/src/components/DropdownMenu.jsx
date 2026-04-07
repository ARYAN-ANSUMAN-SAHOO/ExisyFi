import React, { useState, useEffect, useRef } from 'react';

const DropdownMenu = ({ options, triggerIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <div onClick={toggleOpen} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {triggerIcon || <span className="menu-dots" style={{ color: '#9CA3AF', fontSize: '20px', lineHeight: '0.5', padding: '0 5px' }}>...</span>}
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '25px',
                    width: '180px',
                    background: '#FFFFFF',
                    border: '1px solid #E9E5F5',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(124,58,237,0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
                }}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); option.action(); }}
                            style={{
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: '#1E1B4B',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                borderBottom: index < options.length - 1 ? '1px solid #E9E5F5' : 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#F5F3FF'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

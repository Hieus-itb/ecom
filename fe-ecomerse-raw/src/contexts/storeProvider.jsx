import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import Cookies from 'js-cookie';
import { getInfo } from '@/apis/authService';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [userId, setUserId] = useState(Cookies.get('userId'));
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);

    const handleLogOut = () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        Cookies.remove('userId');
        setUserInfo(null);
        setAppliedCoupon(null);
        setCartTotal(0);
        window.location.reload();
    };

    const applyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        return appliedCoupon.discountAmount || 0;
    };

    const calculateFinalTotal = () => {
        const discount = calculateDiscount();
        return Math.max(0, cartTotal - discount);
    };

    useEffect(() => {
        // call api info
        if (userId) {
            getInfo(userId)
                .then((res) => {
                    const info = res?.data?.data || res?.data || null;
                    setUserInfo(info);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [userId]);

    return (
        <StoreContext.Provider value={{ 
            userInfo, 
            handleLogOut, 
            setUserId,
            appliedCoupon,
            applyCoupon,
            removeCoupon,
            cartTotal,
            setCartTotal,
            calculateDiscount,
            calculateFinalTotal
        }}>
            {children}
        </StoreContext.Provider>
    );
};

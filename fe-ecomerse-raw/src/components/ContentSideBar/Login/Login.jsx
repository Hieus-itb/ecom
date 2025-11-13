import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastProvider';
import { register, signIn, getInfo } from '@/apis/authService';
import Cookies from 'js-cookie';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { StoreContext } from '@/contexts/storeProvider';

function Login() {
    const { container, title, boxRememberMe, lostPw } = styles;
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useContext(ToastContext);
    const { setIsOpen, handleGetListProductsCart } = useContext(SideBarContext);
    const { setUserId } = useContext(StoreContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            cfmpassword: '',
            name: '',
            phone: '',
            address: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            cfmpassword: Yup.string().oneOf(
                [Yup.ref('password'), null],
                'Passwords must match'
            ),
            name: Yup.string()
                .min(2, 'Name must be at least 2 characters'),
            phone: Yup.string()
                .matches(/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Invalid phone number'),
            address: Yup.string()
                .min(10, 'Address must be at least 10 characters')
        }),

        onSubmit: async (values) => {
            if (isLoading) return;

            const { email, password, name, phone, address } = values;

            setIsLoading(true);

            try {
                if (isRegister) {
                    // Validate required fields for registration
                    if (!name || !phone || !address) {
                        toast.error('Please fill in all required fields');
                        return;
                    }

                    console.log('Form values:', values);
                    console.log('Destructured values:', { email, password, name, phone, address });
                    console.log('Sending registration request:', { 
                        username: email, // Use email as username
                        password, 
                        name, 
                        email: email, // Use email as email field too
                        phone, 
                        address 
                    });
                    
                    // Check if user already exists before sending request
                    console.log('Checking if user exists...');
                    
                    const res = await register({ 
                        username: email, // Use email as username
                        password, 
                        name, 
                        email: email, // Use email as email field too
                        phone, 
                        address 
                    });
                    
                    console.log('Registration response:', res);
                    toast.success(res.data.message || 'User created successfully');
                    // Reset form after successful registration
                    formik.resetForm();
                    // Switch to login mode
                    setIsRegister(false);
                } else {
                    const res = await signIn({ username: email, password });
                    const accessToken = res?.data?.accessToken || res?.data?.token;
                    const refreshToken = res?.data?.refreshToken;
                    const userIdFromApi = res?.data?.user?.id || res?.data?.id;
                    if (!accessToken || !refreshToken || !userIdFromApi) {
                        throw new Error('Invalid login response');
                    }
                    setUserId(userIdFromApi);
                    Cookies.set('token', accessToken);
                    Cookies.set('refreshToken', refreshToken);
                    Cookies.set('userId', userIdFromApi);
                    toast.success('Sign in successfully!');
                    setIsOpen(false);
                    handleGetListProductsCart(userIdFromApi, 'cart');
                }
                } catch (err) {
                    console.error('API error:', err);
                    console.error('Error response:', err.response);
                    console.error('Error data:', err.response?.data);
                    if (isRegister) {
                        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
                        toast.error(errorMessage);
                    } else {
                        // Handle specific error cases
                        if (err.response?.status === 403) {
                            toast.error('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.');
                        } else if (err.response?.status === 400) {
                            const errorMessage = err.response?.data?.message || 'Thông tin đăng nhập không chính xác';
                            toast.error(errorMessage);
                        } else {
                            toast.error('Đăng nhập thất bại!');
                        }
                    }
                } finally {
                // Always reset loading state
                setIsLoading(false);
            }
        }
    });

    const handleToggle = () => {
        setIsRegister(!isRegister);
        formik.resetForm();
    };

    return (
        <div className={container}>
            <div className={title}>{isRegister ? 'SIGN UP' : 'SIGN IN'}</div>

            <form onSubmit={formik.handleSubmit}>
                {isRegister && (
                    <InputCommon
                        id='name'
                        label='Full Name'
                        type='text'
                        isRequired
                        formik={formik}
                    />
                )}

                <InputCommon
                    id='email'
                    label='Email'
                    type='text'
                    isRequired
                    formik={formik}
                />

                {isRegister && (
                    <InputCommon
                        id='phone'
                        label='Phone Number'
                        type='text'
                        isRequired
                        formik={formik}
                    />
                )}

                {isRegister && (
                    <InputCommon
                        id='address'
                        label='Address'
                        type='text'
                        isRequired
                        formik={formik}
                    />
                )}

                <InputCommon
                    id='password'
                    label='Password'
                    type='password'
                    isRequired
                    formik={formik}
                />

                {isRegister && (
                    <InputCommon
                        id='cfmpassword'
                        label='Confirm password'
                        type='password'
                        isRequired
                        formik={formik}
                    />
                )}

                {!isRegister && (
                    <div className={boxRememberMe}>
                        <input type='checkbox' />
                        <span>Remember me</span>
                    </div>
                )}

                <Button
                    content={
                        isLoading
                            ? 'LOADING...'
                            : isRegister
                            ? 'REGISTER'
                            : 'LOGIN'
                    }
                    type='submit'
                />
            </form>

            <Button
                content={
                    isRegister
                        ? 'Already have an account?'
                        : 'Don’t have an account?'
                }
                isPriamry={false}
                style={{ marginTop: '10px' }}
                onClick={handleToggle}
            />

            {!isRegister && <div className={lostPw}>Lost your password?</div>}
        </div>
    );
}

export default Login;

import React, { useEffect } from 'react';
import { ButtonLoginProps } from '../types';
import { useAuth } from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

const ButtonLogin = ({ user, logout, login, provider, logo }: ButtonLoginProps) => {
  return (
    <>
      <button onClick={user?.isAuthenticated ? logout : login} className='w-full flex items-center justify-center p-4 rounded-xl border border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50 transition-all'>
        {React.isValidElement(logo) ? logo : <img className='mr-4 w-8 h-8 aspect-square' src={String(logo)} alt='' />}
        <span className='font-medium text-gray-700'>
          {' '}
          {user?.isAuthenticated ? 'Logout from ' : 'Login with '} {provider}{' '}
        </span>
      </button>
    </>
  );
};

export default function Login() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.isAuthenticated && user?.role === '') {
      navigate('/welcome');
    }
    if (user?.isAuthenticated && (user?.role === 'doctor' || user?.role === 'patient')) {
      navigate('/dashboard');
    }
  }, [navigate, user?.isAuthenticated]);
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-blue-900 mb-4'>Welcome To MedDokAi</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Secure Health Platform Powered by Blockchain Technology</p>
        </div>
        <div className='max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-gray-800 mb-6 text-center'>Secure Login Methods</h3>
            {/* Internet Identity */}
            <ButtonLogin
              login={() => login()}
              logout={logout}
              logo={
                <>
                  <svg xmlns='http://www.w3.org/2000/svg' width='33px' height='24px' viewBox='0 0 32 24' version='1.1'>
                    <g id='surface1'>
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'nonzero',
                          fill: 'rgb(15.686275%,66.666669%,87.843138%)',
                          fillOpacity: 1,
                        }}
                        d='M 13.945312 8.386719 C 13.960938 8.398438 13.976562 8.410156 13.992188 8.421875 C 14.144531 8.546875 14.292969 8.679688 14.4375 8.816406 C 14.492188 8.867188 14.550781 8.917969 14.605469 8.96875 C 14.722656 9.074219 14.832031 9.179688 14.941406 9.285156 C 14.964844 9.304688 14.984375 9.324219 15.003906 9.34375 C 15.203125 9.539062 15.402344 9.738281 15.582031 9.953125 C 15.648438 10.03125 15.71875 10.101562 15.789062 10.175781 C 15.855469 10.242188 15.914062 10.316406 15.972656 10.390625 C 16.074219 10.316406 16.15625 10.226562 16.238281 10.128906 C 16.460938 9.863281 16.699219 9.613281 16.9375 9.367188 C 16.992188 9.3125 17.046875 9.257812 17.097656 9.203125 C 17.261719 9.035156 17.421875 8.867188 17.601562 8.714844 C 17.628906 8.691406 17.65625 8.664062 17.683594 8.640625 C 18.175781 8.207031 18.707031 7.820312 19.28125 7.503906 C 19.296875 7.496094 19.3125 7.484375 19.332031 7.476562 C 20.476562 6.84375 21.703125 6.761719 22.945312 7.136719 C 23.589844 7.339844 24.210938 7.671875 24.71875 8.136719 C 24.753906 8.167969 24.753906 8.167969 24.785156 8.195312 C 24.855469 8.257812 24.921875 8.320312 24.988281 8.386719 C 25.011719 8.410156 25.035156 8.433594 25.0625 8.457031 C 25.382812 8.773438 25.648438 9.140625 25.867188 9.539062 C 25.882812 9.566406 25.882812 9.566406 25.894531 9.59375 C 26.285156 10.292969 26.472656 11.070312 26.507812 11.875 C 26.507812 11.902344 26.507812 11.929688 26.511719 11.953125 C 26.539062 13.269531 26.039062 14.542969 25.160156 15.488281 C 25.148438 15.503906 25.132812 15.519531 25.121094 15.53125 C 25.105469 15.546875 25.09375 15.5625 25.078125 15.578125 C 24.195312 16.53125 22.921875 17.121094 21.644531 17.164062 C 21.285156 17.167969 20.933594 17.167969 20.585938 17.070312 C 20.566406 17.066406 20.542969 17.0625 20.523438 17.054688 C 19.875 16.878906 19.238281 16.570312 18.691406 16.164062 C 18.664062 16.144531 18.632812 16.121094 18.605469 16.101562 C 18.140625 15.765625 17.707031 15.390625 17.292969 14.992188 C 17.253906 14.953125 17.210938 14.914062 17.167969 14.875 C 16.898438 14.621094 16.625 14.359375 16.386719 14.066406 C 16.328125 14 16.265625 13.9375 16.203125 13.871094 C 16.148438 13.816406 16.101562 13.753906 16.054688 13.691406 C 15.945312 13.734375 15.882812 13.8125 15.808594 13.898438 C 15.785156 13.925781 15.761719 13.949219 15.738281 13.980469 C 15.691406 14.03125 15.648438 14.082031 15.605469 14.132812 C 15.433594 14.332031 15.257812 14.515625 15.078125 14.703125 C 15.023438 14.753906 14.972656 14.808594 14.921875 14.859375 C 14.761719 15.027344 14.601562 15.191406 14.425781 15.339844 C 14.402344 15.363281 14.375 15.386719 14.347656 15.410156 C 13.121094 16.5 11.730469 17.257812 10.078125 17.148438 C 8.753906 17.023438 7.503906 16.316406 6.644531 15.28125 C 5.914062 14.363281 5.515625 13.25 5.511719 12.0625 C 5.511719 12.042969 5.511719 12.023438 5.511719 12.003906 C 5.515625 10.71875 5.996094 9.507812 6.851562 8.578125 C 6.867188 8.5625 6.882812 8.546875 6.894531 8.53125 C 7.234375 8.164062 7.601562 7.867188 8.027344 7.613281 C 8.042969 7.605469 8.058594 7.597656 8.074219 7.585938 C 10.121094 6.367188 12.195312 6.957031 13.945312 8.386719 Z M 8.285156 10.074219 C 7.972656 10.441406 7.769531 10.886719 7.652344 11.355469 C 7.648438 11.378906 7.640625 11.402344 7.632812 11.425781 C 7.597656 11.574219 7.582031 11.722656 7.574219 11.875 C 7.570312 11.898438 7.570312 11.925781 7.570312 11.949219 C 7.546875 12.691406 7.816406 13.394531 8.265625 13.964844 C 8.28125 13.984375 8.296875 14.003906 8.3125 14.027344 C 8.4375 14.183594 8.589844 14.308594 8.746094 14.433594 C 8.765625 14.449219 8.789062 14.464844 8.808594 14.484375 C 9.117188 14.71875 9.472656 14.875 9.839844 14.984375 C 9.871094 14.992188 9.898438 15 9.929688 15.007812 C 10.679688 15.195312 11.359375 14.992188 12 14.59375 C 12.632812 14.1875 13.183594 13.660156 13.703125 13.121094 C 13.753906 13.066406 13.804688 13.015625 13.859375 12.960938 C 14.015625 12.796875 14.175781 12.632812 14.320312 12.453125 C 14.347656 12.421875 14.375 12.386719 14.402344 12.355469 C 14.425781 12.324219 14.453125 12.292969 14.476562 12.261719 C 14.492188 12.246094 14.503906 12.230469 14.519531 12.210938 C 14.550781 12.171875 14.582031 12.136719 14.613281 12.097656 C 14.519531 11.980469 14.421875 11.871094 14.316406 11.761719 C 14.269531 11.714844 14.226562 11.664062 14.183594 11.613281 C 14.070312 11.476562 13.945312 11.347656 13.824219 11.222656 C 13.800781 11.195312 13.777344 11.171875 13.75 11.144531 C 13.699219 11.09375 13.648438 11.039062 13.597656 10.988281 C 13.542969 10.933594 13.492188 10.878906 13.441406 10.824219 C 13.160156 10.535156 12.886719 10.246094 12.558594 10.007812 C 12.519531 9.976562 12.519531 9.976562 12.480469 9.949219 C 12.402344 9.890625 12.324219 9.839844 12.246094 9.785156 C 12.21875 9.765625 12.191406 9.746094 12.164062 9.726562 C 11.84375 9.511719 11.511719 9.324219 11.167969 9.15625 C 11.148438 9.144531 11.125 9.132812 11.105469 9.125 C 10.152344 8.664062 8.929688 9.351562 8.285156 10.074219 Z M 18.992188 10.28125 C 18.9375 10.332031 18.878906 10.386719 18.820312 10.4375 C 18.738281 10.511719 18.660156 10.59375 18.582031 10.675781 C 18.53125 10.722656 18.484375 10.765625 18.433594 10.808594 C 18.324219 10.90625 18.230469 11.011719 18.132812 11.121094 C 18.066406 11.199219 18 11.273438 17.925781 11.347656 C 17.738281 11.535156 17.578125 11.75 17.414062 11.957031 C 17.453125 12.054688 17.503906 12.113281 17.578125 12.1875 C 17.652344 12.257812 17.722656 12.332031 17.789062 12.414062 C 17.90625 12.554688 18.03125 12.683594 18.15625 12.816406 C 18.171875 12.828125 18.183594 12.839844 18.195312 12.855469 C 18.261719 12.925781 18.328125 12.992188 18.394531 13.0625 C 18.449219 13.117188 18.503906 13.171875 18.558594 13.230469 C 18.867188 13.554688 19.179688 13.867188 19.546875 14.128906 C 19.574219 14.148438 19.574219 14.148438 19.597656 14.167969 C 20.292969 14.671875 21.0625 15.191406 21.9375 15.035156 C 22.476562 14.925781 22.972656 14.699219 23.386719 14.324219 C 23.410156 14.300781 23.433594 14.28125 23.457031 14.261719 C 23.996094 13.78125 24.359375 13.074219 24.425781 12.34375 C 24.484375 11.539062 24.277344 10.757812 23.769531 10.132812 C 23.164062 9.441406 22.433594 9.054688 21.523438 8.980469 C 20.566406 8.957031 19.667969 9.640625 18.992188 10.28125 Z M 18.992188 10.28125 '
                      />
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'nonzero',
                          fill: 'rgb(69.411767%,12.941177%,49.019608%)',
                          fillOpacity: 1,
                        }}
                        d='M 9.167969 8.648438 C 9.199219 8.648438 9.199219 8.648438 9.230469 8.648438 C 9.734375 8.648438 10.253906 8.722656 10.71875 8.933594 C 10.730469 8.953125 10.738281 8.972656 10.746094 8.988281 C 10.730469 8.992188 10.714844 8.992188 10.699219 8.992188 C 10.230469 9.027344 9.796875 9.09375 9.359375 9.292969 C 9.332031 9.304688 9.308594 9.316406 9.28125 9.328125 C 8.597656 9.660156 8.066406 10.253906 7.789062 10.976562 C 7.746094 11.101562 7.710938 11.226562 7.679688 11.355469 C 7.671875 11.378906 7.667969 11.402344 7.660156 11.425781 C 7.625 11.574219 7.609375 11.722656 7.601562 11.875 C 7.597656 11.898438 7.597656 11.925781 7.59375 11.949219 C 7.574219 12.695312 7.84375 13.394531 8.292969 13.964844 C 8.308594 13.984375 8.320312 14 8.332031 14.019531 C 8.449219 14.171875 8.597656 14.289062 8.746094 14.40625 C 8.765625 14.421875 8.789062 14.4375 8.808594 14.457031 C 9.117188 14.691406 9.472656 14.847656 9.839844 14.957031 C 9.871094 14.964844 9.898438 14.972656 9.929688 14.980469 C 10.679688 15.167969 11.359375 14.964844 12 14.566406 C 12.628906 14.164062 13.175781 13.640625 13.691406 13.105469 C 13.742188 13.054688 13.792969 13.003906 13.839844 12.953125 C 13.996094 12.789062 14.152344 12.628906 14.292969 12.453125 C 14.320312 12.421875 14.347656 12.386719 14.375 12.355469 C 14.402344 12.324219 14.425781 12.292969 14.453125 12.261719 C 14.464844 12.246094 14.476562 12.230469 14.492188 12.210938 C 14.523438 12.171875 14.554688 12.136719 14.585938 12.097656 C 14.710938 12.121094 14.769531 12.199219 14.847656 12.292969 C 14.875 12.324219 14.90625 12.359375 14.933594 12.390625 C 14.953125 12.414062 14.953125 12.414062 14.976562 12.4375 C 15.019531 12.488281 15.066406 12.539062 15.113281 12.585938 C 15.195312 12.667969 15.265625 12.753906 15.339844 12.839844 C 15.386719 12.890625 15.433594 12.941406 15.480469 12.988281 C 15.558594 13.070312 15.632812 13.15625 15.707031 13.242188 C 15.8125 13.367188 15.917969 13.488281 16.027344 13.609375 C 15.984375 13.722656 15.90625 13.800781 15.824219 13.886719 C 15.796875 13.914062 15.773438 13.945312 15.746094 13.972656 C 15.730469 13.992188 15.714844 14.007812 15.699219 14.023438 C 15.648438 14.082031 15.597656 14.140625 15.546875 14.199219 C 15.394531 14.371094 15.238281 14.535156 15.078125 14.703125 C 15.023438 14.753906 14.972656 14.808594 14.921875 14.859375 C 14.761719 15.027344 14.601562 15.191406 14.425781 15.339844 C 14.402344 15.363281 14.375 15.386719 14.347656 15.410156 C 13.121094 16.5 11.730469 17.257812 10.078125 17.148438 C 8.753906 17.023438 7.503906 16.316406 6.644531 15.28125 C 5.914062 14.363281 5.515625 13.25 5.511719 12.0625 C 5.511719 12.03125 5.511719 12.03125 5.511719 12.003906 C 5.511719 11.523438 5.542969 11.066406 5.761719 10.640625 C 5.777344 10.605469 5.777344 10.605469 5.792969 10.570312 C 6.023438 10.113281 6.460938 9.453125 6.957031 9.273438 C 7.003906 9.261719 7.046875 9.25 7.09375 9.238281 C 7.09375 9.21875 7.09375 9.199219 7.09375 9.183594 C 7.746094 8.824219 8.429688 8.648438 9.167969 8.648438 Z M 9.167969 8.648438 '
                      />
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'nonzero',
                          fill: 'rgb(95.294118%,50.196081%,18.039216%)',
                          fillOpacity: 1,
                        }}
                        d='M 24.589844 8.019531 C 24.632812 8.058594 24.675781 8.097656 24.71875 8.136719 C 24.742188 8.15625 24.761719 8.175781 24.785156 8.195312 C 24.855469 8.257812 24.921875 8.320312 24.988281 8.386719 C 25.011719 8.410156 25.035156 8.433594 25.0625 8.457031 C 25.382812 8.773438 25.648438 9.140625 25.867188 9.539062 C 25.875 9.558594 25.886719 9.574219 25.894531 9.59375 C 26.285156 10.292969 26.472656 11.070312 26.507812 11.875 C 26.507812 11.914062 26.507812 11.914062 26.511719 11.953125 C 26.519531 12.378906 26.46875 12.808594 26.375 13.222656 C 26.355469 13.222656 26.339844 13.222656 26.320312 13.222656 C 26.316406 13.242188 26.316406 13.261719 26.3125 13.277344 C 26.285156 13.386719 26.238281 13.472656 26.1875 13.570312 C 26.175781 13.589844 26.164062 13.609375 26.152344 13.628906 C 26.054688 13.800781 25.941406 13.953125 25.8125 14.101562 C 25.792969 14.128906 25.773438 14.152344 25.753906 14.179688 C 25.394531 14.605469 24.917969 14.941406 24.398438 15.121094 C 24.367188 15.132812 24.332031 15.148438 24.296875 15.164062 C 23.652344 15.40625 22.996094 15.40625 22.320312 15.394531 C 22.320312 15.378906 22.320312 15.359375 22.320312 15.339844 C 22.304688 15.339844 22.289062 15.34375 22.273438 15.34375 C 21.90625 15.359375 21.558594 15.238281 21.226562 15.09375 C 21.226562 15.082031 21.226562 15.074219 21.226562 15.066406 C 21.257812 15.066406 21.289062 15.0625 21.320312 15.0625 C 22.082031 15.039062 22.804688 14.824219 23.386719 14.296875 C 23.417969 14.269531 23.417969 14.269531 23.453125 14.238281 C 23.984375 13.773438 24.332031 13.054688 24.398438 12.34375 C 24.457031 11.535156 24.25 10.753906 23.742188 10.132812 C 23.148438 9.453125 22.414062 9.078125 21.523438 9.007812 C 20.566406 8.984375 19.667969 9.667969 18.992188 10.308594 C 18.9375 10.359375 18.878906 10.414062 18.820312 10.464844 C 18.738281 10.539062 18.660156 10.621094 18.582031 10.703125 C 18.53125 10.75 18.480469 10.796875 18.429688 10.839844 C 18.324219 10.933594 18.230469 11.039062 18.140625 11.148438 C 18.085938 11.210938 18.027344 11.269531 17.96875 11.328125 C 17.769531 11.535156 17.59375 11.761719 17.414062 11.984375 C 17.335938 11.949219 17.285156 11.914062 17.230469 11.851562 C 17.214844 11.835938 17.199219 11.820312 17.183594 11.800781 C 17.167969 11.785156 17.152344 11.765625 17.136719 11.75 C 17.105469 11.710938 17.070312 11.675781 17.039062 11.636719 C 17.019531 11.617188 17.003906 11.597656 16.984375 11.578125 C 16.902344 11.484375 16.816406 11.390625 16.734375 11.300781 C 16.699219 11.261719 16.667969 11.226562 16.632812 11.1875 C 16.582031 11.132812 16.53125 11.078125 16.480469 11.023438 C 16.121094 10.628906 16.121094 10.628906 15.972656 10.445312 C 16.066406 10.308594 16.167969 10.183594 16.289062 10.070312 C 16.339844 10.015625 16.382812 9.960938 16.429688 9.90625 C 16.527344 9.792969 16.628906 9.6875 16.730469 9.578125 C 16.75 9.5625 16.765625 9.542969 16.785156 9.523438 C 16.824219 9.484375 16.863281 9.445312 16.898438 9.40625 C 16.957031 9.34375 17.015625 9.285156 17.074219 9.226562 C 17.109375 9.1875 17.148438 9.148438 17.1875 9.109375 C 17.203125 9.09375 17.21875 9.074219 17.238281 9.058594 C 17.355469 8.9375 17.476562 8.824219 17.601562 8.714844 C 17.621094 8.695312 17.621094 8.695312 17.640625 8.675781 C 18.144531 8.226562 18.691406 7.828125 19.28125 7.503906 C 19.304688 7.492188 19.304688 7.492188 19.332031 7.476562 C 21.007812 6.550781 23.105469 6.785156 24.589844 8.019531 Z M 24.589844 8.019531 '
                      />
                      <path style={{ stroke: "none", fillRule: "nonzero", fill: "rgb(19.215687%,50.588238%,74.901962%)", fillOpacity: 1 }} d="M 5.761719 10.445312 C 5.796875 10.445312 5.832031 10.445312 5.867188 10.445312 C 5.855469 10.46875 5.855469 10.46875 5.84375 10.492188 C 5.800781 10.582031 5.769531 10.679688 5.734375 10.773438 C 5.707031 10.832031 5.707031 10.832031 5.652344 10.859375 C 5.703125 10.570312 5.703125 10.570312 5.761719 10.445312 Z M 5.761719 10.445312 " />
                      <path style={{ stroke: "none", fillRule: "nonzero", fill: "rgb(22.352941%,64.705884%,79.607844%)", fillOpacity: 1 }} d="M 26.320312 13.222656 C 26.363281 13.359375 26.324219 13.480469 26.265625 13.609375 C 26.195312 13.652344 26.195312 13.652344 26.132812 13.664062 C 26.171875 13.5625 26.214844 13.464844 26.257812 13.367188 C 26.269531 13.339844 26.28125 13.3125 26.292969 13.285156 C 26.304688 13.253906 26.304688 13.253906 26.320312 13.222656 Z M 26.320312 13.222656 " />
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'nonzero',
                          fill: 'rgb(85.882354%,72.156864%,34.901962%)',
                          fillOpacity: 1,
                        }}
                        d='M 21.28125 15.09375 C 21.429688 15.09375 21.578125 15.09375 21.734375 15.09375 C 21.734375 15.101562 21.734375 15.109375 21.734375 15.121094 C 21.664062 15.121094 21.59375 15.121094 21.519531 15.121094 C 21.519531 15.136719 21.519531 15.15625 21.519531 15.175781 C 21.597656 15.1875 21.597656 15.1875 21.679688 15.203125 C 21.578125 15.242188 21.519531 15.214844 21.421875 15.175781 C 21.378906 15.160156 21.378906 15.160156 21.339844 15.144531 C 21.320312 15.136719 21.300781 15.128906 21.28125 15.121094 C 21.28125 15.109375 21.28125 15.101562 21.28125 15.09375 Z M 21.28125 15.09375 '
                      />
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'nonzero',
                          fill: 'rgb(35.686275%,14.509805%,42.352942%)',
                          fillOpacity: 1,
                        }}
                        d='M 10.507812 8.878906 C 10.597656 8.894531 10.667969 8.917969 10.746094 8.960938 C 10.746094 8.972656 10.746094 8.980469 10.746094 8.988281 C 10.640625 8.988281 10.535156 8.988281 10.425781 8.988281 C 10.425781 8.972656 10.425781 8.953125 10.425781 8.933594 C 10.453125 8.933594 10.480469 8.933594 10.507812 8.933594 C 10.507812 8.917969 10.507812 8.898438 10.507812 8.878906 Z M 10.507812 8.878906 '
                      />
                      <path style={{ stroke: "none", fillRule: "nonzero", fill: "rgb(18.039216%,58.431375%,81.960785%)", fillOpacity: 1 }} d="M 5.761719 10.445312 C 5.796875 10.445312 5.832031 10.445312 5.867188 10.445312 C 5.84375 10.5 5.84375 10.5 5.8125 10.558594 C 5.785156 10.566406 5.761719 10.574219 5.734375 10.585938 C 5.742188 10.539062 5.75 10.492188 5.761719 10.445312 Z M 5.761719 10.445312 " />
                    </g>
                  </svg>
                </>
              }
              provider='Internet Identity'
              user={user}
            />
          </div>
        </div>
        <div className='mt-12 text-center text-sm text-gray-500'>
          <p>© 2025 MedDokAi. All rights reserved.</p>
          <div className='mt-2 space-x-4'>
            <a href='#' className='hover:text-blue-600'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-blue-600'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

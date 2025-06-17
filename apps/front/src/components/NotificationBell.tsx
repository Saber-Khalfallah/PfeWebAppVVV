import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoNotifications } from 'react-icons/io5';

interface NotificationBellProps {
  count?: number;
}

const NotificationBell = ({ count = 0 }: NotificationBellProps) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton
            className={`p-2 rounded-full transition-colors relative outline-none
              text-white hover:bg-white hover:text-blue-600
              ${open ? 'bg-white text-blue-600' : ''}`}
          >
            <IoNotifications className="w-7 h-7" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm 
                font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </PopoverButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
             <PopoverPanel className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg 
              border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {/* Example notification items */}
                <div className="p-4 hover:bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-800">New message from Saber Khalfallah</p>
                  <span className="text-xs text-gray-500">2 minutes ago</span>
                  <p className="text-sm text-gray-800">a service provider is interested in a project of yours</p>
                  <span className="text-xs text-gray-500">4 minutes ago</span>
                  <p className="text-sm text-gray-800">your request to collaborate  with <b>Wael Kouada</b> has been accepted</p>
                  <span className="text-xs text-gray-500">10 minutes ago</span>
                </div>
                {/* Add more notification items as needed */}
              </div>
              <div className="p-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all notifications
                </button>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NotificationBell;
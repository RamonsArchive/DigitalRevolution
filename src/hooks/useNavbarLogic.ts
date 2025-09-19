// import { useState, useCallback } from "react";
// import { useClickOutside } from "./useClickOutside";
// import { useScrollThrottle } from "./useScrollThrottle";

// export const useNavbarLogic = () => {
//   const [isDropdown, setIsDropdown] = useState(false);
//   const [openMenu, setOpenMenu] = useState(false);
//   const [shouldRender, setShouldRender] = useState(false);

//   const handleScroll = useCallback(() => {
//     const currentScrollY = window.scrollY;
//     const shouldShow = currentScrollY > 42;
//     setIsDropdown((prev) => (prev !== shouldShow ? shouldShow : prev));
//   }, []);

//   const handleOutsideClick = useCallback(() => {
//     setShouldRender(false);
//     setOpenMenu(false);
//   }, []);

//   const handleInsideClick = useCallback(() => {
//     setOpenMenu(true);
//     setShouldRender(true);
//   }, []);

//   // Use custom hooks
//   useScrollThrottle({ onScroll: handleScroll });
  
//   const { addRef, removeRef } = useClickOutside({
//     onOutsideClick: handleOutsideClick,
//     onInsideClick: handleInsideClick,
//   });

//   return {
//     isDropdown,
//     openMenu,
//     shouldRender,
//     setOpenMenu,
//     setShouldRender,
//     addRef,
//     removeRef,
//   };
// };

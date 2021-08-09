import React from 'react';

const useWindowSize = () => {
  const [size, setSize] = React.useState({width: window.innerWidth, height: window.innerHeight});
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize({width: window.innerWidth, height: window.innerHeight});
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default useWindowSize;

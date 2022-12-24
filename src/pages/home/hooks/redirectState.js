import { useEffect, useState } from 'react'

function useRedirectState (uuid) {
  const [isRedirectState, setRedirectState] = useState(!!uuid);

  useEffect(() => {
    if (uuid) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };

        fetch(`${process.env.REACT_APP_API_URL}/${uuid}/`, requestOptions)
        .then((response) => response.json())
        .then((data) => window.location.href = data.originalUrl);
    } else {
        setRedirectState(false);
    }
  }, [uuid]);

  return isRedirectState;
}

export default useRedirectState;